#!/usr/bin/env node
/**
 * List every Festival Day Listen clip and verify inventory completeness.
 * Usage: node scripts/list-audio-clips.mjs [--json]
 */
import {
  loadMissions,
  allClips,
  clipsForMission,
  AUDIO_DIR,
  loadManifest,
  clipManifestKey
} from "./audio-clips.mjs";
import fs from "fs";
import path from "path";

const asJson = process.argv.includes("--json");
const missions = loadMissions();
const clips = allClips(missions);
const manifest = loadManifest();

let missingFiles = 0;
let staleHash = 0;
let ready = 0;

for (const c of clips) {
  const abs = path.join(AUDIO_DIR, c.missionId, `${c.clipKey}.mp3`);
  const key = clipManifestKey(c.missionId, c.clipKey);
  const entry = manifest.clips?.[key];
  const exists = fs.existsSync(abs);
  if (!exists) missingFiles += 1;
  else if (entry?.textHash !== c.textHash) staleHash += 1;
  else ready += 1;
}

const byMission = missions.map(m => {
  const list = clipsForMission(m);
  return { id: m.id, film: m.film, title: m.title, clips: list.length };
});

const expectedKinds = [
  "mission-brief",
  "main-reading",
  "support-reading",
  "first-decision-prompt",
  "update-reading",
  "update-prompt",
  "revision-prompt"
];

let failed = false;
for (const m of missions) {
  const list = clipsForMission(m);
  const keys = new Set(list.map(c => c.clipKey));
  for (const k of expectedKinds) {
    if (!keys.has(k)) {
      console.error(`FAIL ${m.id}: missing clip ${k}`);
      failed = true;
    }
  }
  const evidence = m.evidence || m.sources || [];
  for (const s of evidence) {
    if (!keys.has(`src-${s.id}`)) {
      console.error(`FAIL ${m.id}: missing evidence clip src-${s.id}`);
      failed = true;
    }
  }
  for (const q of m.questions || []) {
    if (!keys.has(`prompt-${q.id}`)) {
      console.error(`FAIL ${m.id}: missing question clip prompt-${q.id}`);
      failed = true;
    }
  }
}

if (asJson) {
  console.log(JSON.stringify({ missions: byMission, total: clips.length, ready, missingFiles, staleHash, clips }, null, 2));
} else {
  console.log(`Missions: ${missions.length}`);
  byMission.forEach(row => console.log(`  ${row.id} (film ${row.film}): ${row.clips} clips — ${row.title}`));
  console.log(`Total clips: ${clips.length}`);
  console.log(`Ready (file + matching hash): ${ready}`);
  console.log(`Missing files: ${missingFiles}`);
  console.log(`Stale hash (text changed): ${staleHash}`);
  console.log(failed ? "INVENTORY FAIL" : "INVENTORY PASS");
}

process.exit(failed ? 1 : 0);
