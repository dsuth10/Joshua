"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AdventureMap,
  BaseCampMuseum,
  ExpeditionLoadout,
  ExplorerProfileSummary,
  GearShop,
  TrailEncounterCard,
  type GearItem,
  type RelicItem,
  type TrailEncounter,
  type TrailNode as MapTrailNode,
} from "./components";
import {
  GEAR,
  GUARDIANS,
  MUSEUM_RELICS,
  TRAIL_EVENTS,
  TRAIL_NODES,
  assessMastery,
  buyGear,
  completeNode,
  createExpeditionSession,
  createPlayerProgress,
  currentQuestion,
  equipGear,
  getTrailNode,
  recommendNode,
  submitAnswer,
  type ExpeditionSession,
  type PlayerProgress,
  type TrailQuestion,
} from "./game";

type Screen = "adventure" | "practice" | "shop" | "museum" | "game" | "results";
type PlayMode = "adventure" | "practice";
type PracticeMode = "multiply" | "divide" | "mixed";
type QuickQuestion = { prompt: string; answer: number; table: number; variety: string };
type ExpeditionResult = {
  kind: PlayMode;
  title: string;
  correct: number;
  attempts: number;
  accuracy: number;
  score: number;
  coins: number;
  relicName?: string;
  mastered?: boolean;
};
type SavedProfile = {
  version: 1;
  explorerName: string;
  progress: PlayerProgress;
  totalCorrect: number;
  expeditions: number;
  quickBest: number;
};

const FACTS = Array.from({ length: 11 }, (_, index) => index + 2);
const NODE_ICONS: Record<string, string> = {
  "base-camp": "⛺", "jungle-trail": "🌿", "river-trail": "🛶",
  "mountain-pass": "🏔️", "volcano-route": "🌋", "temple-route": "🌙",
  "ancient-ruins": "🏛️", "final-vault": "💎",
};
const GEAR_ICONS: Record<string, string> = {
  "trail-compass": "🧭", "pattern-lantern": "🏮", "sturdy-boots": "🥾",
  "climbing-rope": "🪢", "treasure-map": "🗺️", "lucky-charm": "🍀",
};
const RELIC_ICONS: Record<string, string> = {
  "brass-compass": "🧭", "jade-leaf": "🍃", "silver-oar": "🛶",
  "echo-crystal": "🔮", "ember-idol": "🗿", "moon-tablet": "🌙",
  "twin-crest": "⚜️", "golden-sun": "☀️",
};

const defaultProfile = (): SavedProfile => ({
  version: 1,
  explorerName: "Explorer",
  progress: createPlayerProgress(),
  totalCorrect: 0,
  expeditions: 0,
  quickBest: 0,
});

function normaliseProfile(value: unknown): SavedProfile {
  if (!value || typeof value !== "object") return defaultProfile();
  const candidate = value as Partial<SavedProfile>;
  const fallback = defaultProfile();
  const progress = candidate.progress && typeof candidate.progress === "object"
    ? { ...fallback.progress, ...candidate.progress }
    : fallback.progress;
  return {
    version: 1,
    explorerName: typeof candidate.explorerName === "string"
      ? candidate.explorerName.slice(0, 24) || "Explorer"
      : "Explorer",
    progress,
    totalCorrect: Number.isFinite(candidate.totalCorrect) ? Number(candidate.totalCorrect) : 0,
    expeditions: Number.isFinite(candidate.expeditions) ? Number(candidate.expeditions) : 0,
    quickBest: Number.isFinite(candidate.quickBest) ? Number(candidate.quickBest) : 0,
  };
}

function createQuickQuestion(families: number[], mode: PracticeMode): QuickQuestion {
  const table = families[Math.floor(Math.random() * families.length)];
  const multiplier = Math.floor(Math.random() * 11) + 2;
  const product = table * multiplier;
  const roll = Math.random();
  const divide = mode === "divide" || (mode === "mixed" && roll > 0.56);
  if (divide) {
    return roll > 0.82
      ? { prompt: `${product} ÷ ? = ${multiplier}`, answer: table, table, variety: "Missing divisor" }
      : { prompt: `${product} ÷ ${table} = ?`, answer: multiplier, table, variety: "Division" };
  }
  return roll > 0.65
    ? { prompt: `${table} × ? = ${product}`, answer: multiplier, table, variety: "Missing factor" }
    : { prompt: `${table} × ${multiplier} = ?`, answer: product, table, variety: "Multiplication" };
}

function questionHint(question: TrailQuestion | QuickQuestion): string {
  if ("fact" in question) {
    const { table, multiplier } = question.fact;
    if (question.variety === "product") return `Skip-count by ${table}, ${multiplier} times.`;
    if (question.variety === "missing-factor") return `Ask: ${question.answer * table} divided by ${table} is how many groups?`;
    return `Use the related fact: ${table} × ${multiplier} = ${table * multiplier}.`;
  }
  return question.prompt.includes("÷")
    ? "Think of the related multiplication fact."
    : `Try skip-counting in ${question.table}s.`;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("adventure");
  const [profile, setProfile] = useState<SavedProfile>(defaultProfile);
  const [profileId, setProfileId] = useState("");
  const [profileReady, setProfileReady] = useState(false);
  const [saveState, setSaveState] = useState<"loading" | "saved" | "offline">("loading");
  const [selectedNodeId, setSelectedNodeId] = useState("base-camp");
  const [playMode, setPlayMode] = useState<PlayMode>("adventure");
  const [session, setSession] = useState<ExpeditionSession | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [eventShown, setEventShown] = useState(false);
  const [guardianShown, setGuardianShown] = useState(false);
  const [encounter, setEncounter] = useState<TrailEncounter | null>(null);
  const [eventCoins, setEventCoins] = useState(0);
  const [result, setResult] = useState<ExpeditionResult | null>(null);
  const [families, setFamilies] = useState([2, 3, 4, 5, 10]);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("mixed");
  const [duration, setDuration] = useState(90);
  const [time, setTime] = useState(90);
  const [quickQuestion, setQuickQuestion] = useState(() => createQuickQuestion([2, 3, 4, 5, 10], "mixed"));
  const [quickCorrect, setQuickCorrect] = useState(0);
  const [quickAttempts, setQuickAttempts] = useState(0);
  const [quickScore, setQuickScore] = useState(0);
  const quickLive = useRef({ correct: 0, attempts: 0, score: 0 });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      let id = localStorage.getItem("treasure-trail-profile-id");
      if (!id) {
        id = `explorer-${crypto.randomUUID()}`;
        localStorage.setItem("treasure-trail-profile-id", id);
      }
      setProfileId(id);
      try {
        const response = await fetch(`/api/profile?profileId=${encodeURIComponent(id)}`);
        if (response.ok) {
          const payload = await response.json() as { profile?: unknown };
          if (!cancelled && payload.profile) setProfile(normaliseProfile(payload.profile));
        }
        if (!cancelled) setSaveState("saved");
      } catch {
        if (!cancelled) setSaveState("offline");
      } finally {
        if (!cancelled) setProfileReady(true);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!profileReady || !profileId) return;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ profileId, profile }),
        });
        setSaveState(response.ok ? "saved" : "offline");
      } catch {
        setSaveState("offline");
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [profile, profileId, profileReady]);

  const progress = profile.progress;
  const selectedNode = getTrailNode(selectedNodeId);
  const activeQuestion = playMode === "adventure" && session ? currentQuestion(session) : quickQuestion;
  const accuracy = playMode === "adventure" && session
    ? (session.results.length ? Math.round(session.results.filter(item => item.correct).length / session.results.length * 100) : 100)
    : (quickAttempts ? Math.round(quickCorrect / quickAttempts * 100) : 100);
  const hasLantern = progress.equippedGearIds.includes("pattern-lantern");
  const hasBoots = progress.equippedGearIds.includes("sturdy-boots");
  const recommendedId = recommendNode(progress);

  const mapNodes = useMemo<MapTrailNode[]>(() => TRAIL_NODES.map(node => {
    const completed = progress.completedNodeIds.includes(node.id);
    const unlocked = progress.unlockedNodeIds.includes(node.id);
    const mastery = progress.mastery[node.id];
    return {
      id: node.id,
      name: node.title,
      region: node.region,
      icon: NODE_ICONS[node.id],
      facts: [...node.tables],
      status: completed ? "completed" : node.id === selectedNodeId && unlocked ? "current" : unlocked ? "available" : "locked",
      questionCount: node.minimumQuestions,
      masteryPercent: mastery ? Math.round(mastery.bestAccuracy * 100) : 0,
      rewardCoins: Math.round(22 * node.difficulty),
      unlockHint: node.id === "ancient-ruins"
        ? "Master both the ×7 and ×8 routes."
        : node.id === "final-vault" ? "Restore the Twin Crest at the Ancient Ruins." : "Complete the earlier trail.",
    };
  }), [progress, selectedNodeId]);

  const gearItems = useMemo<GearItem[]>(() => GEAR.map(item => ({
    id: item.id,
    name: item.name,
    icon: GEAR_ICONS[item.id],
    description: item.description,
    effectLabel: item.effect,
    cost: item.cost,
    owned: progress.ownedGearIds.includes(item.id),
    equipped: progress.equippedGearIds.includes(item.id),
    rarity: item.cost >= 110 ? "rare" : item.cost >= 70 ? "uncommon" : "common",
  })), [progress]);

  const relicItems = useMemo<RelicItem[]>(() => MUSEUM_RELICS.map(item => ({
    id: item.id,
    name: item.name,
    icon: RELIC_ICONS[item.id],
    region: item.region,
    description: item.description,
    found: progress.relicIds.includes(item.id),
    fragmentCount: progress.relicIds.includes(item.id) ? 1 : 0,
    fragmentsRequired: 1,
  })), [progress.relicIds]);

  const familyMastery = FACTS.map(family => {
    const relevant = TRAIL_NODES.filter(node => node.tables.includes(family));
    const values = relevant.map(node => progress.mastery[node.id]?.bestAccuracy ?? 0);
    const percent = values.length ? Math.round(Math.max(...values) * 100) : 0;
    return { family, percent, crestEarned: percent >= 80 };
  });

  const startAdventure = (nodeId = selectedNodeId) => {
    if (!progress.unlockedNodeIds.includes(nodeId)) return;
    setSelectedNodeId(nodeId);
    setPlayMode("adventure");
    setSession(createExpeditionSession(nodeId, Date.now()));
    setAnswer(""); setFeedback(null); setHintUsed(false); setShowHint(false);
    setEventShown(false); setGuardianShown(false); setEncounter(null); setEventCoins(0); setResult(null);
    setScreen("game");
  };

  const startPractice = () => {
    setPlayMode("practice");
    setQuickQuestion(createQuickQuestion(families, practiceMode));
    setQuickCorrect(0); setQuickAttempts(0); setQuickScore(0);
    quickLive.current = { correct: 0, attempts: 0, score: 0 };
    setTime(duration); setAnswer(""); setFeedback(null); setShowHint(false); setResult(null);
    setScreen("game");
  };

  const finishPractice = useCallback(() => {
    const now = quickLive.current;
    const practiceAccuracy = now.attempts ? Math.round(now.correct / now.attempts * 100) : 0;
    const practiceCoins = Math.min(8, Math.floor(now.correct / 3));
    setProfile(current => ({
      ...current,
      totalCorrect: current.totalCorrect + now.correct,
      expeditions: current.expeditions + 1,
      quickBest: Math.max(current.quickBest, now.score),
      progress: { ...current.progress, coins: current.progress.coins + practiceCoins },
    }));
    setResult({
      kind: "practice", title: "Practice trail complete", correct: now.correct,
      attempts: now.attempts, accuracy: practiceAccuracy, score: now.score, coins: practiceCoins,
    });
    setScreen("results");
  }, []);

  useEffect(() => {
    if (screen !== "game" || playMode !== "practice") return;
    const timer = window.setInterval(() => setTime(current => {
      if (current > 1) return current - 1;
      window.clearInterval(timer);
      window.setTimeout(finishPractice, 0);
      return 0;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [finishPractice, playMode, screen]);

  const finishAdventure = useCallback((finished: ExpeditionSession) => {
    const gate = assessMastery(finished);
    if (!gate.passed) return;
    const first = !progress.completedNodeIds.includes(finished.nodeId);
    const beforeCoins = progress.coins;
    const completed = completeNode(progress, finished);
    const withEventCoins = { ...completed, coins: completed.coins + eventCoins };
    const relic = MUSEUM_RELICS.find(item => item.id === getTrailNode(finished.nodeId).relicId);
    const correct = finished.results.filter(item => item.correct).length;
    setProfile(current => ({
      ...current,
      progress: withEventCoins,
      totalCorrect: current.totalCorrect + correct,
      expeditions: current.expeditions + 1,
    }));
    setResult({
      kind: "adventure",
      title: finished.nodeId === "final-vault" ? "The final vault is open!" : "Trail crest earned!",
      correct,
      attempts: finished.results.length,
      accuracy: Math.round(gate.accuracy * 100),
      score: finished.score,
      coins: withEventCoins.coins - beforeCoins,
      relicName: first ? relic?.name : undefined,
      mastered: true,
    });
    setScreen("results");
  }, [eventCoins, progress]);

  const submit = useCallback(() => {
    if (!answer || feedback || !activeQuestion) return;
    const numeric = Number(answer);
    const correct = numeric === activeQuestion.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (playMode === "adventure" && session) {
      let next = submitAnswer(session, numeric);
      if (!correct && hasBoots && session.currentStreak > 0) {
        next = { ...next, currentStreak: session.currentStreak };
      }
      setSession(next);
      window.setTimeout(() => {
        setAnswer(""); setFeedback(null); setShowHint(false);
        if (next.complete) {
          finishAdventure(next);
        } else if (!eventShown && next.results.length >= 6) {
          const event = TRAIL_EVENTS[Math.floor(Math.random() * TRAIL_EVENTS.length)];
          setEncounter({
            id: event.id,
            kind: "event",
            icon: event.id === "repair-bridge" ? "🌉" : event.id === "storm-shelter" ? "⛈️" : "🗺️",
            title: event.name,
            story: event.description,
            challengeLabel: event.rule,
            choices: [
              { id: "steady", label: "Take the steady route", description: "Continue safely", rewardLabel: `+${Math.max(1, event.rewardCoins - 2)} coins` },
              { id: "bold", label: "Use the rope shortcut", description: "Choose the harder trail event", rewardLabel: `+${event.rewardCoins + 3} coins`, disabled: !progress.equippedGearIds.includes("climbing-rope") },
            ],
          });
        } else if (!guardianShown && next.results.length >= Math.max(7, next.queue.length - 5)) {
          const guardian = GUARDIANS.find(item => item.id === getTrailNode(next.nodeId).guardianId);
          if (guardian) {
            setEncounter({
              id: guardian.id,
              kind: "guardian",
              icon: next.nodeId === "final-vault" ? "🐉" : "🗿",
              title: guardian.name,
              story: guardian.challenge,
              challengeLabel: `Aim for ${guardian.requiredCorrect} of the final ${guardian.questionCount} clues while keeping the expedition at 80% mastery.`,
              choices: [{ id: "face-guardian", label: "Face the guardian", description: "Begin the final mixed-fact challenge", rewardLabel: "Trail crest" }],
            });
          }
        }
      }, correct ? 480 : 900);
    } else {
      const c = quickCorrect + (correct ? 1 : 0);
      const a = quickAttempts + 1;
      const s = quickScore + (correct ? 100 : 0);
      setQuickCorrect(c); setQuickAttempts(a); setQuickScore(s);
      quickLive.current = { correct: c, attempts: a, score: s };
      window.setTimeout(() => {
        setQuickQuestion(createQuickQuestion(families, practiceMode));
        setAnswer(""); setFeedback(null); setShowHint(false);
      }, correct ? 420 : 800);
    }
  }, [activeQuestion, answer, eventShown, feedback, finishAdventure, guardianShown, hasBoots, playMode, practiceMode, progress, quickAttempts, quickCorrect, quickScore, session, families]);

  useEffect(() => {
    if (screen !== "game") return;
    const handler = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) setAnswer(value => value.length < 3 ? value + event.key : value);
      if (event.key === "Backspace") setAnswer(value => value.slice(0, -1));
      if (event.key === "Enter") submit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, submit]);

  const selectScreen = (next: Screen) => {
    setScreen(next);
    setEncounter(null);
  };

  const toggleGear = (gearId: string, on: boolean) => {
    try {
      const ids = on
        ? [...progress.equippedGearIds, gearId]
        : progress.equippedGearIds.filter(id => id !== gearId);
      setProfile(current => ({ ...current, progress: equipGear(current.progress, ids, 3) }));
    } catch { /* The component disables invalid choices. */ }
  };

  const purchaseGear = (gearId: string) => {
    try {
      setProfile(current => ({ ...current, progress: buyGear(current.progress, gearId) }));
    } catch { /* The shop disables unaffordable choices. */ }
  };

  const toggleFamily = (family: number) => setFamilies(current =>
    current.includes(family)
      ? current.length === 1 ? current : current.filter(item => item !== family)
      : [...current, family].sort((a, b) => a - b)
  );

  const answered = playMode === "adventure" ? session?.results.length ?? 0 : quickAttempts;
  const totalQuestions = playMode === "adventure" ? session?.queue.length ?? 12 : 0;
  const guardianRound = playMode === "adventure" && session
    ? answered >= Math.max(7, session.queue.length - 5)
    : false;

  return (
    <main className="tt-app">
      <header className="tt-topbar">
        <button className="brand" onClick={() => selectScreen("adventure")}>
          <span>🧭</span><div><strong>Treasure Trail</strong><small>NUMBER FACTS ADVENTURE</small></div>
        </button>
        <nav aria-label="Main navigation">
          <button className={screen === "adventure" ? "on" : ""} onClick={() => selectScreen("adventure")}>🗺️ Adventure</button>
          <button className={screen === "practice" ? "on" : ""} onClick={() => selectScreen("practice")}>🎯 Practice</button>
          <button className={screen === "shop" ? "on" : ""} onClick={() => selectScreen("shop")}>🎒 Gear</button>
          <button className={screen === "museum" ? "on" : ""} onClick={() => selectScreen("museum")}>🏛️ Museum</button>
        </nav>
        <div className="tt-header-stats">
          <span title={saveState === "saved" ? "Progress saved" : "Progress will retry saving"}>{saveState === "saved" ? "☁️" : "↻"}</span>
          <strong>🪙 {progress.coins}</strong>
        </div>
      </header>

      {screen === "adventure" && (
        <div className="tt-page-shell">
          <section className="tt-campaign-hero">
            <div>
              <span className="eyebrow">✦ A WORLD OF NUMBER FACTS ✦</span>
              <h1>Choose your path.<em>Master every trail.</em></h1>
              <p>Every stop contains at least 12 varied questions. Missed facts return in a new form, and the final vault only opens after the ×7 and ×8 crests are restored.</p>
              <div className="tt-hero-actions">
                <button className="primary" onClick={() => startAdventure(recommendedId)}>Continue adventure <span>→</span></button>
                <button className="secondary" onClick={() => selectScreen("practice")}>Free practice</button>
              </div>
            </div>
            <ExplorerProfileSummary
              explorerName={profile.explorerName}
              level={Math.max(1, progress.completedNodeIds.length + 1)}
              coins={progress.coins}
              crestsEarned={progress.completedNodeIds.length}
              crestsRequired={TRAIL_NODES.length}
              mastery={familyMastery}
            />
          </section>
          {progress.equippedGearIds.includes("trail-compass") && (
            <div className="tt-recommendation">🧭 Your compass recommends <b>{getTrailNode(recommendedId).title}</b>.</div>
          )}
          <AdventureMap
            nodes={mapNodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onStartNode={startAdventure}
          />
          <div className="tt-two-column">
            <section className="tt-mission-brief">
              <p className="tt-kicker">Selected expedition</p>
              <span className="tt-big-icon">{NODE_ICONS[selectedNode.id]}</span>
              <h2>{selectedNode.title}</h2>
              <p>{selectedNode.description}</p>
              <ul>
                <li><b>{selectedNode.minimumQuestions}+</b> questions</li>
                <li><b>80%</b> mastery gate</li>
                <li>Product, missing-number and division clues</li>
              </ul>
              {progress.unlockedNodeIds.includes(selectedNode.id)
                ? <button className="primary" onClick={() => startAdventure(selectedNode.id)}>Begin expedition <span>→</span></button>
                : <div className="tt-locked-note">🔒 Complete the connecting trail first.</div>}
            </section>
            <ExpeditionLoadout
              gear={gearItems}
              slotLimit={3}
              onEquip={id => toggleGear(id, true)}
              onUnequip={id => toggleGear(id, false)}
            />
          </div>
        </div>
      )}

      {screen === "practice" && (
        <div className="tt-page-shell tt-practice-page">
          <section className="tt-section-intro">
            <span className="eyebrow">✦ FREE PRACTICE ✦</span>
            <h1>Train your way.</h1>
            <p>Choose any fact families and session length. Practice earns a small coin allowance, but Adventure mastery is what opens the world map.</p>
          </section>
          <section className="setup-card tt-practice-card">
            <div className="card-title"><b>🎯</b><div><h2>Build a quick expedition</h2><p>Missing-number clues are mixed in automatically.</p></div></div>
            <fieldset>
              <legend>Fact families</legend>
              <div className="facts">{FACTS.map(family => <button key={family} className={families.includes(family) ? "on" : ""} onClick={() => toggleFamily(family)}>×{family}</button>)}</div>
            </fieldset>
            <fieldset>
              <legend>Question mix</legend>
              <div className="segments">{(["multiply", "divide", "mixed"] as PracticeMode[]).map(mode => <button key={mode} className={practiceMode === mode ? "on" : ""} onClick={() => setPracticeMode(mode)}><b>{mode === "multiply" ? "×" : mode === "divide" ? "÷" : "× ÷"}</b>{mode}</button>)}</div>
            </fieldset>
            <fieldset>
              <legend>Expedition time</legend>
              <div className="times">{[60, 90, 120].map(value => <button className={duration === value ? "on" : ""} key={value} onClick={() => setDuration(value)}><b>{value}</b> seconds</button>)}</div>
            </fieldset>
            <button className="primary" onClick={startPractice}>Start practice <span>→</span></button>
            <small className="summary">Practice coins are capped at 8 per run and cannot unlock campaign nodes.</small>
          </section>
        </div>
      )}

      {screen === "shop" && <div className="tt-page-shell"><GearShop gear={gearItems} coins={progress.coins} onBuy={purchaseGear} /><ExpeditionLoadout gear={gearItems} slotLimit={3} onEquip={id => toggleGear(id, true)} onUnequip={id => toggleGear(id, false)} /></div>}
      {screen === "museum" && <div className="tt-page-shell"><BaseCampMuseum relics={relicItems} /></div>}

      {screen === "game" && activeQuestion && (
        <section className="tt-game">
          <div className="tt-game-top">
            <button className="tt-exit-button" onClick={() => selectScreen(playMode === "adventure" ? "adventure" : "practice")}>← Leave trail</button>
            <div className="tt-progress-copy">
              <small>{playMode === "adventure" ? getTrailNode(session!.nodeId).region : "Free practice"}</small>
              <strong>{playMode === "adventure" ? `${answered} of ${totalQuestions}+ clues` : `${time}s remaining`}</strong>
            </div>
            <div className="tt-game-stat"><small>Accuracy</small><b className={accuracy < 80 ? "low" : ""}>{accuracy}%</b></div>
            <div className="tt-game-stat"><small>Score</small><b>{playMode === "adventure" ? session?.score : quickScore}</b></div>
          </div>
          <div className="tt-route-progress"><span style={{ width: playMode === "adventure" ? `${Math.min(100, answered / Math.max(totalQuestions, 12) * 100)}%` : `${time / duration * 100}%` }} /></div>
          {guardianRound && <div className="tt-guardian-banner">🗿 Guardian challenge · Finish the mixed clues with at least 80% accuracy</div>}
          <div className={`question ${feedback ?? ""}`}>
            <div className="question-head">
              <span>{playMode === "adventure" ? `${activeQuestion.variety.replaceAll("-", " ").toUpperCase()} · MASTERY TRAIL` : `${quickQuestion.variety.toUpperCase()} · ×${quickQuestion.table} PRACTICE`}</span>
              <b>{feedback === "correct" ? "Trail secured! +100" : feedback === "wrong" ? `Answer: ${activeQuestion.answer} · a recovery clue was added` : "Solve the clue"}</b>
            </div>
            <div className="equation"><b>{activeQuestion.prompt}</b><output>{answer || "?"}</output></div>
            <div className="gate">
              <span>{playMode === "adventure" ? "🛡️ 12+ clues and 80% accuracy to earn the crest" : "🎯 Practice mode does not skip campaign mastery"}</span>
              {hasBoots && playMode === "adventure" && <span>🥾 Streak shield equipped</span>}
            </div>
            {showHint && <div className="tt-hint-box">🏮 {questionHint(activeQuestion)}</div>}
          </div>
          <div className="tt-question-actions">
            {playMode === "adventure" && hasLantern && !hintUsed && <button className="secondary" onClick={() => { setShowHint(true); setHintUsed(true); }}>Use lantern hint</button>}
          </div>
          <div className="keypad">
            {[1,2,3,4,5,6,7,8,9].map(number => <button key={number} onClick={() => setAnswer(value => value.length < 3 ? value + number : value)}>{number}</button>)}
            <button className="clear" onClick={() => setAnswer(value => value.slice(0, -1))}>⌫</button>
            <button onClick={() => setAnswer(value => value.length < 3 ? value + "0" : value)}>0</button>
            <button className="enter" onClick={submit}>→</button>
          </div>
        </section>
      )}

      {screen === "game" && encounter && (
        <div className="tt-encounter-overlay">
          <TrailEncounterCard
            encounter={encounter}
            onChoose={choice => {
              if (encounter.kind === "guardian") {
                setGuardianShown(true);
                setEncounter(null);
                return;
              }
              const event = TRAIL_EVENTS.find(item => item.id === encounter.id);
              setEventCoins(value => value + (choice === "bold" ? (event?.rewardCoins ?? 0) + 3 : Math.max(1, (event?.rewardCoins ?? 2) - 2)));
              setEventShown(true);
              setEncounter(null);
            }}
          />
        </div>
      )}

      {screen === "results" && result && (
        <section className="tt-results">
          <div className="chest"><div>✦ ✦ ✦</div><b>{result.kind === "adventure" ? "💎" : "🪙"}</b></div>
          <span className="eyebrow">✦ EXPEDITION COMPLETE ✦</span>
          <h1>{result.title}</h1>
          <p>{result.kind === "adventure" ? "Your mastery has opened the next part of the world map." : "Your chosen practice helped sharpen your facts without bypassing Adventure gates."}</p>
          <div className="tt-result-card">
            <div><small>SCORE</small><strong>{result.score.toLocaleString()}</strong><span>{result.correct} correct from {result.attempts} clues</span></div>
            <section><p><span>Accuracy</span><b>{result.accuracy}%</b></p><p><span>Coins earned</span><b>🪙 {result.coins}</b></p><p><span>Campaign progress</span><b>{result.kind === "adventure" ? "Crest earned" : "Practice only"}</b></p></section>
          </div>
          {result.relicName && <div className="achievement"><span>🏺</span><div><small>NEW MUSEUM RELIC</small><b>{result.relicName}</b></div><p>Added to your Base Camp collection.</p></div>}
          <div className="actions">
            <button className="secondary" onClick={() => selectScreen(result.kind === "adventure" ? "adventure" : "practice")}>{result.kind === "adventure" ? "Return to map" : "Change practice"}</button>
            <button className="primary" onClick={() => result.kind === "adventure" ? startAdventure(recommendNode(profile.progress)) : startPractice()}>Continue exploring <span>→</span></button>
          </div>
        </section>
      )}
      <footer><b>Treasure Trail</b><span>{profileReady ? `${profile.expeditions} expeditions · ${profile.totalCorrect} correct answers` : "Loading explorer profile…"}</span></footer>
    </main>
  );
}
