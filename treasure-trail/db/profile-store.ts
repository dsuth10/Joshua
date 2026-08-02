import { getD1 } from "./index";

const PROFILE_SCHEMA_VERSION = 1;

let schemaReady: Promise<void> | undefined;

async function initializeProfileSchema() {
  const d1 = getD1();

  await d1.batch([
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS campaign_profiles (
        profile_id TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL,
        schema_version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare(`
      CREATE INDEX IF NOT EXISTS campaign_profiles_updated_at_idx
      ON campaign_profiles (updated_at)
    `),
  ]);
}

async function ensureProfileSchema() {
  if (!schemaReady) {
    schemaReady = initializeProfileSchema().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }

  await schemaReady;
}

export type StoredProfile = {
  profile: Record<string, unknown>;
  updatedAt: string;
};

export async function readProfile(profileId: string): Promise<StoredProfile | null> {
  await ensureProfileSchema();

  const row = await getD1()
    .prepare(
      `SELECT payload, updated_at AS updatedAt
       FROM campaign_profiles
       WHERE profile_id = ?1`
    )
    .bind(profileId)
    .first<{ payload: string; updatedAt: string }>();

  if (!row) {
    return null;
  }

  const parsed = JSON.parse(row.payload);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Stored profile data is invalid.");
  }

  return {
    profile: parsed as Record<string, unknown>,
    updatedAt: row.updatedAt,
  };
}

export async function writeProfile(
  profileId: string,
  profile: Record<string, unknown>
): Promise<StoredProfile> {
  await ensureProfileSchema();

  const payload = JSON.stringify(profile);
  await getD1()
    .prepare(
      `INSERT INTO campaign_profiles (
         profile_id, payload, schema_version, created_at, updated_at
       )
       VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(profile_id) DO UPDATE SET
         payload = excluded.payload,
         schema_version = excluded.schema_version,
         updated_at = CURRENT_TIMESTAMP`
    )
    .bind(profileId, payload, PROFILE_SCHEMA_VERSION)
    .run();

  const saved = await readProfile(profileId);
  if (!saved) {
    throw new Error("Profile could not be saved.");
  }

  return saved;
}
