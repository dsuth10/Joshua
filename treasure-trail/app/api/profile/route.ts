import { readProfile, writeProfile } from "../../../db/profile-store";

const PROFILE_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;
const MAX_BODY_BYTES = 72 * 1024;
const MAX_PROFILE_BYTES = 64 * 1024;
const UNSAFE_KEYS = new Set(["__proto__", "prototype", "constructor"]);

class ValidationError extends Error {}

function json(data: unknown, init?: ResponseInit) {
  const response = Response.json(data, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function parseProfileId(value: unknown) {
  if (typeof value !== "string" || !PROFILE_ID_PATTERN.test(value)) {
    throw new ValidationError(
      "profileId must be 8–128 characters using letters, numbers, hyphens, or underscores."
    );
  }
  return value;
}

function sanitizeJson(value: unknown, depth = 0): unknown {
  if (depth > 8) throw new ValidationError("profile is nested too deeply.");
  if (value === null || typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.length > 8_192) throw new ValidationError("profile contains a string that is too long.");
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new ValidationError("profile contains an invalid number.");
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > 256) throw new ValidationError("profile contains an array with too many items.");
    return value.map((item) => sanitizeJson(item, depth + 1));
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length > 128) throw new ValidationError("profile contains an object with too many fields.");
    const sanitized = Object.create(null) as Record<string, unknown>;
    for (const [key, child] of entries) {
      if (!key || key.length > 100 || UNSAFE_KEYS.has(key)) {
        throw new ValidationError("profile contains an invalid field name.");
      }
      sanitized[key] = sanitizeJson(child, depth + 1);
    }
    return sanitized;
  }
  throw new ValidationError("profile must contain only JSON-compatible values.");
}

function sanitizeProfile(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ValidationError("profile must be a JSON object.");
  }
  const profile = sanitizeJson(value) as Record<string, unknown>;
  if (new TextEncoder().encode(JSON.stringify(profile)).byteLength > MAX_PROFILE_BYTES) {
    throw new ValidationError("profile is too large.");
  }
  return profile;
}

function errorResponse(error: unknown) {
  if (error instanceof ValidationError) return json({ error: error.message }, { status: 400 });
  console.error("Profile API error", error);
  return json(
    { error: "Profile storage is temporarily unavailable. Please try again." },
    { status: 500 }
  );
}

export async function GET(request: Request) {
  try {
    const profileId = parseProfileId(new URL(request.url).searchParams.get("profileId"));
    const stored = await readProfile(profileId);
    return stored
      ? json(stored)
      : json({ profile: null, updatedAt: null }, { status: 404 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
      return json({ error: "Request body is too large." }, { status: 413 });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError("Request body must be valid JSON.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ValidationError("Request body must be a JSON object.");
    }
    const payload = body as Record<string, unknown>;
    const stored = await writeProfile(
      parseProfileId(payload.profileId),
      sanitizeProfile(payload.profile)
    );
    return json(stored);
  } catch (error) {
    return errorResponse(error);
  }
}
