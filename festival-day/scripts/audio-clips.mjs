import fs from "fs";
import path from "path";
import crypto from "crypto";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");
export const AUDIO_DIR = path.join(ROOT, "audio");
export const MANIFEST_PATH = path.join(AUDIO_DIR, "manifest.json");

export const PROFILE_ID = "6c705007-69e0-4a8c-9bca-bb5c2947fccd";
export const PROFILE_NAME = "Doug's Best Voice";
export const VOICEBOX = "http://127.0.0.1:17493";

const CONTENT_FILES = [
  "content-english-hass.js",
  "content-maths.js",
  "content-science.js",
  "content-synthesis.js"
];

function textOf(v) {
  if (Array.isArray(v)) return v.join("\n\n");
  if (typeof v === "object" && v) {
    return (v.paragraphs || Object.values(v).filter(x => typeof x === "string")).join("\n\n");
  }
  return v || "";
}

function sourceText(s) {
  return textOf(s?.text) || s?.claim || s?.detail || "";
}

function kindOf(q) {
  return ({ numeric: "number", response: "text", shortText: "text" })[q.kind || q.type]
    || q.kind || q.type || "text";
}

function optionLabel(o) {
  if (typeof o === "object" && o) return String(o.label ?? o.value ?? "");
  return String(o);
}

function clean(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

export function hashText(text) {
  return crypto.createHash("sha256").update(clean(text), "utf8").digest("hex").slice(0, 16);
}

export function loadMissions() {
  const sandbox = { window: {} };
  for (const file of CONTENT_FILES) {
    const code = fs.readFileSync(path.join(ROOT, file), "utf8");
    vm.runInNewContext(code, sandbox, { filename: file });
  }
  const groups = [
    sandbox.window.FestivalEnglishHass,
    sandbox.window.FestivalMaths,
    sandbox.window.FestivalScience,
    sandbox.window.FestivalSynthesis
  ].filter(Boolean);
  return groups.flatMap(g => g.missions || []).sort((a, b) => a.film - b.film);
}

function addClip(clips, missionId, clipKey, text, kind) {
  const spoken = clean(text);
  if (!spoken) return;
  clips.push({
    missionId,
    clipKey,
    kind,
    text: spoken,
    textHash: hashText(spoken),
    relPath: `audio/${missionId}/${clipKey}.mp3`
  });
}

function questionSpeech(q) {
  const prompt = clean(q.prompt);
  if (kindOf(q) === "choice" && Array.isArray(q.options) && q.options.length) {
    const opts = q.options.map((o, i) => `Option ${i + 1}: ${optionLabel(o)}`).join(". ");
    return `${prompt} ${opts}`;
  }
  return prompt;
}

/** Build every Listen clip for one mission (matches app.js Listen targets). */
export function clipsForMission(m) {
  const clips = [];
  const mid = m.id;
  const opening = m.caseOpening || { title: "Case opening", text: textOf(m.reading?.main) };
  const support = textOf(m.support?.text || m.reading?.support);
  const evidence = m.evidence || m.sources || [];
  const first = m.firstDecision || m.writing || {};

  addClip(clips, mid, "mission-brief", m.brief, "brief");
  addClip(clips, mid, "main-reading", textOf(opening.text), "main-reading");
  addClip(clips, mid, "support-reading", support, "support");

  evidence.forEach(s => {
    const eid = s.id || "unknown";
    const spoken = `${s.label || "Source"}. ${sourceText(s)}`;
    addClip(clips, mid, `src-${eid}`, spoken, "evidence");
  });

  (m.questions || []).forEach(q => {
    addClip(clips, mid, `prompt-${q.id}`, questionSpeech(q), "question");
  });

  addClip(clips, mid, "first-decision-prompt", first.prompt, "first-decision");
  addClip(clips, mid, "update-reading", textOf(m.update?.text), "update-reading");
  addClip(clips, mid, "update-prompt", m.update?.prompt, "update-prompt");
  addClip(clips, mid, "revision-prompt", m.update?.prompt, "revision-prompt");

  return clips;
}

export function allClips(missions = loadMissions()) {
  return missions.flatMap(clipsForMission);
}

export function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      version: 1,
      profileId: PROFILE_ID,
      profileName: PROFILE_NAME,
      engine: "qwen",
      modelSize: "0.6B",
      clips: {}
    };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

export function saveManifest(manifest) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
}

export function clipManifestKey(missionId, clipKey) {
  return `${missionId}/${clipKey}`;
}
