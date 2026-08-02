import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const campaignProfiles = sqliteTable(
  "campaign_profiles",
  {
    profileId: text("profile_id").primaryKey(),
    payload: text("payload").notNull(),
    schemaVersion: integer("schema_version").notNull().default(1),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("campaign_profiles_updated_at_idx").on(table.updatedAt),
  ]
);
