#!/usr/bin/env node
/**
 * Bake Festival Day Listen clips via Voicebox (Doug's Best Voice).
 *
 * Usage:
 *   node scripts/bake-audio.mjs --probe
 *   node scripts/bake-audio.mjs --only m01
 *   node scripts/bake-audio.mjs
 *   node scripts/bake-audio.mjs --force
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import {
  ROOT,
  AUDIO_DIR,
  VOICEBOX,
  PROFILE_ID,
  PROFILE_NAME,
  loadMissions,
  allClips,
  clipsForMission,
  loadManifest,
  saveManifest,
  clipManifestKey,
  hashText
} from "./audio-clips.mjs";

const args = process.argv.slice(2);
const probeOnly = args.includes("--probe");
const force = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const onlyMission = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

async function getJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.error || data?.detail || text || res.statusText;
    throw new Error(`${opts.method || "GET"} ${url} → ${res.status}: ${msg}`);
  }
  return data;
}

async function confirmDoug() {
  const profiles = await getJson(`${VOICEBOX}/profiles`);
  const list = Array.isArray(profiles) ? profiles : (profiles.profiles || []);
  const doug = list.find(p => /doug'?s\s+best\s+voice/i.test(p.name || ""));
  if (!doug) throw new Error("Doug's Best Voice was not found in Voicebox /profiles.");
  if (doug.id !== PROFILE_ID) {
    throw new Error(`Doug's Best Voice id is ${doug.id}, but config expects ${PROFILE_ID}.`);
  }
  console.log(`Voice OK: ${doug.name} (${doug.id})`);
  return doug;
}

async function waitForJob(id, { maxWaitMs = 20 * 60 * 1000 } = {}) {
  const start = Date.now();
  let lastStatus = "";
  while (Date.now() - start < maxWaitMs) {
    const job = await getJson(`${VOICEBOX}/history/${id}`);
    if (job.status !== lastStatus) {
      lastStatus = job.status;
      console.log(`  status: ${job.status}`);
    }
    if (job.status === "completed" || job.status === "done") return job;
    if (job.status === "failed" || job.error) {
      throw new Error(job.error || `Voicebox job ${id} failed`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error(`Voicebox job ${id} timed out after ${Math.round(maxWaitMs / 1000)}s (last status: ${lastStatus || "unknown"})`);
}

async function generateSpeech(text) {
  const job = await getJson(`${VOICEBOX}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile_id: PROFILE_ID,
      text,
      language: "en",
      engine: "qwen",
      model_size: "0.6B"
    })
  });
  const id = job.id || job.generation_id;
  if (!id) throw new Error("Voicebox generate response missing id");
  if (job.status === "completed" || job.status === "done") return job;
  return waitForJob(id);
}

function convertToMp3(wavPath, mp3Path) {
  const result = spawnSync(
    "ffmpeg",
    ["-y", "-i", wavPath, "-ac", "1", "-ar", "22050", "-b:a", "96k", mp3Path],
    { encoding: "utf8" }
  );
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed: ${result.stderr || result.stdout || "unknown error"}`);
  }
}

async function downloadAudio(jobId, mp3Path) {
  const tmpDir = path.join(AUDIO_DIR, "_tmp");
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.mkdirSync(path.dirname(mp3Path), { recursive: true });
  const wavPath = path.join(tmpDir, `${path.basename(mp3Path, ".mp3")}.wav`);
  const res = await fetch(`${VOICEBOX}/audio/${jobId}`);
  if (!res.ok) throw new Error(`Download /audio/${jobId} failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(wavPath, buf);
  convertToMp3(wavPath, mp3Path);
  fs.unlinkSync(wavPath);
}

async function bakeClip(clip, manifest) {
  const key = clipManifestKey(clip.missionId, clip.clipKey);
  const abs = path.join(ROOT, clip.relPath);
  const existing = manifest.clips[key];
  if (!force && fs.existsSync(abs) && existing?.textHash === clip.textHash) {
    return { skipped: true, key };
  }
  console.log(`Generating ${key} (${clip.text.length} chars)…`);
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const job = await generateSpeech(clip.text);
      await downloadAudio(job.id, abs);
      manifest.clips[key] = {
        missionId: clip.missionId,
        clipKey: clip.clipKey,
        kind: clip.kind,
        textHash: clip.textHash,
        path: clip.relPath,
        voiceboxId: job.id,
        duration: job.duration ?? null,
        bakedAt: new Date().toISOString(),
        profileId: PROFILE_ID,
        profileName: PROFILE_NAME
      };
      saveManifest(manifest);
      console.log(`  saved ${clip.relPath}`);
      return { skipped: false, key };
    } catch (err) {
      lastErr = err;
      console.error(`  attempt ${attempt} failed: ${err.message || err}`);
      if (attempt < 3) await new Promise(r => setTimeout(r, 5000));
    }
  }
  throw lastErr;
}

async function runProbe() {
  await confirmDoug();
  const text = "Hello. This is a Festival Day voice probe using Doug's Best Voice.";
  const job = await generateSpeech(text);
  const out = path.join(AUDIO_DIR, "_probe", "probe.mp3");
  await downloadAudio(job.id, out);
  console.log(`Probe OK → ${out} (${job.duration ?? "?"}s)`);
}

async function main() {
  if (probeOnly) {
    await runProbe();
    return;
  }

  await confirmDoug();
  const missions = loadMissions();
  let clips = allClips(missions);
  if (onlyMission) {
    const m = missions.find(x => x.id === onlyMission);
    if (!m) throw new Error(`Unknown mission id: ${onlyMission}`);
    clips = clipsForMission(m);
    console.log(`Baking only ${onlyMission}: ${clips.length} clips`);
  } else {
    console.log(`Baking all missions: ${clips.length} clips`);
  }

  const manifest = loadManifest();
  manifest.profileId = PROFILE_ID;
  manifest.profileName = PROFILE_NAME;
  manifest.engine = "qwen";
  manifest.modelSize = "0.6B";
  manifest.updatedAt = new Date().toISOString();
  if (!manifest.clips) manifest.clips = {};

  let baked = 0;
  let skipped = 0;
  for (const clip of clips) {
    const result = await bakeClip(clip, manifest);
    if (result.skipped) skipped += 1;
    else baked += 1;
  }
  saveManifest(manifest);
  console.log(`Done. Baked ${baked}, skipped ${skipped}, total ${clips.length}.`);
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
