"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "multiply" | "divide" | "mixed";
type Screen = "setup" | "game" | "results";
type Question = { text: string; answer: number; family: number; symbol: string };
type GameResult = {
  score: number; correct: number; attempts: number; accuracy: number;
  speed: number; keys: number; best: number; previousBest: number;
};

const FACTS = Array.from({ length: 11 }, (_, i) => i + 2);
const STOPS = [
  ["⛺", "Base Camp"], ["🌴", "Parrot Palms"], ["🪨", "Echo Caves"],
  ["🌉", "Rope Bridge"], ["🌋", "Fire Peak"], ["💧", "Moon Lagoon"],
  ["🏛️", "Lost Temple"], ["💎", "Treasure Vault"],
];

function createQuestion(families: number[], mode: Mode): Question {
  const family = families[Math.floor(Math.random() * families.length)];
  const partner = Math.floor(Math.random() * 11) + 2;
  const divide = mode === "divide" || (mode === "mixed" && Math.random() > .5);
  return divide
    ? { text: `${family * partner} ÷ ${family}`, answer: partner, family, symbol: "÷" }
    : { text: `${family} × ${partner}`, answer: family * partner, family, symbol: "×" };
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [families, setFamilies] = useState([2, 3, 4, 5, 10]);
  const [mode, setMode] = useState<Mode>("mixed");
  const [duration, setDuration] = useState(90);
  const [time, setTime] = useState(90);
  const [question, setQuestion] = useState(() => createQuestion([2, 3, 4, 5, 10], "mixed"));
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [keys, setKeys] = useState(0);
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const [best, setBest] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [sound, setSound] = useState(true);
  const startedAt = useRef(Date.now());
  const live = useRef({ correct: 0, attempts: 0, speed: 0, keys: 0 });

  useEffect(() => setBest(Number(localStorage.getItem("treasure-trail-best") || 0)), []);

  const finish = useCallback(() => {
    const now = live.current;
    const accuracy = now.attempts ? Math.round(now.correct / now.attempts * 100) : 0;
    const allowedSpeed = accuracy >= 80 ? now.speed : 0;
    const score = now.correct * 100 + allowedSpeed;
    const previousBest = Number(localStorage.getItem("treasure-trail-best") || 0);
    const newBest = Math.max(previousBest, score);
    if (score > previousBest) localStorage.setItem("treasure-trail-best", String(score));
    setBest(newBest);
    setResult({ ...now, accuracy, speed: allowedSpeed, score, best: newBest, previousBest });
    setScreen("results");
  }, []);

  useEffect(() => {
    if (screen !== "game") return;
    const id = window.setInterval(() => setTime(value => {
      if (value <= 1) {
        window.clearInterval(id);
        window.setTimeout(finish, 0);
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [screen, finish]);

  const start = () => {
    setTime(duration); setCorrect(0); setAttempts(0); setSpeed(0); setKeys(0);
    setAnswer(""); setFeedback(null); setResult(null);
    live.current = { correct: 0, attempts: 0, speed: 0, keys: 0 };
    setQuestion(createQuestion(families, mode));
    startedAt.current = Date.now();
    setScreen("game");
  };

  const next = useCallback(() => {
    setQuestion(createQuestion(families, mode));
    setAnswer(""); setFeedback(null); startedAt.current = Date.now();
  }, [families, mode]);

  const submit = useCallback(() => {
    if (!answer || feedback) return;
    const right = Number(answer) === question.answer;
    const seconds = (Date.now() - startedAt.current) / 1000;
    const bonus = right ? (seconds <= 3 ? 50 : seconds <= 5 ? 25 : 0) : 0;
    const c = correct + (right ? 1 : 0);
    const a = attempts + 1;
    const k = keys + (right && c % 3 === 0 ? 1 : 0);
    const s = speed + bonus;
    setCorrect(c); setAttempts(a); setKeys(k); setSpeed(s);
    live.current = { correct: c, attempts: a, keys: k, speed: s };
    setFeedback(right ? "yes" : "no");
    window.setTimeout(next, right ? 450 : 850);
  }, [answer, feedback, question.answer, correct, attempts, keys, speed, next]);

  useEffect(() => {
    if (screen !== "game") return;
    const handler = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) setAnswer(v => v.length < 3 ? v + e.key : v);
      if (e.key === "Backspace") setAnswer(v => v.slice(0, -1));
      if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, submit]);

  const accuracy = attempts ? Math.round(correct / attempts * 100) : 100;
  const checkpoint = Math.min(7, Math.floor(Math.min(correct / 24, .999) * 8));
  const score = correct * 100 + (accuracy >= 80 ? speed : 0);

  const toggleFamily = (fact: number) => setFamilies(current =>
    current.includes(fact)
      ? current.length === 1 ? current : current.filter(x => x !== fact)
      : [...current, fact].sort((a, b) => a - b)
  );

  return (
    <main>
      <header>
        <button className="brand" onClick={() => setScreen("setup")}>
          <span>🧭</span><div><strong>Treasure Trail</strong><small>NUMBER FACTS EXPEDITION</small></div>
        </button>
        <div className="head-actions">
          <div className="best">🏆 Best <strong>{best.toLocaleString()}</strong></div>
          <button className="sound" onClick={() => setSound(v => !v)} aria-label="Toggle sound">{sound ? "🔊" : "🔇"}</button>
        </div>
      </header>

      {screen === "setup" && <section className="setup">
        <div className="intro">
          <span className="eyebrow">✦ THE VAULT IS WAITING ✦</span>
          <h1>Choose your trail.<em>Claim the treasure.</em></h1>
          <p>Race through number facts, collect ancient keys and unlock the lost vault. Quick thinking helps—but sharp accuracy wins the prize.</p>
          <div className="rule"><span>🛡️</span><p><strong>Explorer’s rule</strong><br />Speed bonus unlocks at 80% accuracy. Careful answers beat wild guesses!</p></div>
        </div>

        <div className="setup-card">
          <div className="card-title"><b>1</b><div><h2>Pack your expedition</h2><p>Choose what you want to practise.</p></div></div>
          <fieldset>
            <legend>Fact families</legend>
            <div className="facts">
              {FACTS.map(f => <button key={f} className={families.includes(f) ? "on" : ""} onClick={() => toggleFamily(f)}>×{f}</button>)}
            </div>
            <button className="text-button" onClick={() => setFamilies(families.length === 11 ? [2, 3, 4, 5, 10] : FACTS)}>
              {families.length === 11 ? "Reset favourites" : "Select all"}
            </button>
          </fieldset>
          <fieldset>
            <legend>Trail challenge</legend>
            <div className="segments">
              {(["multiply", "divide", "mixed"] as Mode[]).map(m =>
                <button key={m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}>
                  <b>{m === "multiply" ? "×" : m === "divide" ? "÷" : "× ÷"}</b>{m === "multiply" ? "Multiply" : m === "divide" ? "Divide" : "Mixed"}
                </button>
              )}
            </div>
          </fieldset>
          <fieldset>
            <legend>Expedition time</legend>
            <div className="times">{[60, 90, 120].map(t => <button className={duration === t ? "on" : ""} key={t} onClick={() => setDuration(t)}><b>{t}</b> seconds</button>)}</div>
          </fieldset>
          <button className="primary" onClick={start}>Begin expedition <span>→</span></button>
          <small className="summary">{families.length === 11 ? "All facts" : families.map(f => `×${f}`).join(", ")} · {mode} · {duration}s</small>
        </div>

        <div className="map" aria-label="Eight checkpoint expedition route">
          <div className="dotted" />
          {STOPS.map(([icon, label], i) => <div className={`map-stop p${i}`} key={label}><b>{icon}</b><small>{label}</small></div>)}
          <div className="map-label"><b>8</b> checkpoints to the lost vault</div>
        </div>
      </section>}

      {screen === "game" && <section className="game">
        <div className="hud">
          <div className="timer"><span>⏱️</span><div><small>TIME LEFT</small><b>{time}<i>s</i></b></div><div className="bar"><i style={{ width: `${time / duration * 100}%` }} /></div></div>
          <div><span>🎯</span><section><small>ACCURACY</small><b className={accuracy < 80 ? "low" : ""}>{accuracy}%</b></section></div>
          <div><span>🔑</span><section><small>KEYS</small><b>{keys}</b></section></div>
          <div><span>⭐</span><section><small>SCORE</small><b>{score}</b></section></div>
        </div>
        <div className="trail">
          <div className="trail-title"><div><small>YOUR ROUTE</small><h2>{STOPS[checkpoint][1]}</h2></div><p>{correct} correct · Reach 24 to discover the vault</p></div>
          <div className="trail-stops">
            <div className="path" />
            {STOPS.map(([icon, label], i) => <div key={label} className={`trail-stop ${i <= checkpoint ? "reached" : ""} ${i === checkpoint ? "current" : ""}`}>
              {i === checkpoint && <i>🧭</i>}<b>{icon}</b><small>{label}</small>
            </div>)}
          </div>
        </div>
        <div className={`question ${feedback || ""}`}>
          <div className="question-head"><span>{question.symbol === "×" ? "MULTIPLICATION" : "DIVISION"} · {question.family}s TRAIL</span><b>{feedback === "yes" ? "Brilliant! +100" : feedback === "no" ? `Answer: ${question.answer}` : "Solve the clue"}</b></div>
          <div className="equation"><b>{question.text}</b><span>=</span><output>{answer || "?"}</output></div>
          <div className="gate"><span>{accuracy >= 80 ? "⚡ Speed bonus active" : "🛡️ Reach 80% accuracy for speed bonus"}</span><span>{speed} bonus banked</span></div>
        </div>
        <div className="keypad">
          {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={() => setAnswer(v => v.length < 3 ? v + n : v)}>{n}</button>)}
          <button className="clear" onClick={() => setAnswer(v => v.slice(0,-1))}>⌫</button>
          <button onClick={() => setAnswer(v => v.length < 3 ? v + "0" : v)}>0</button>
          <button className="enter" onClick={submit}>→</button>
        </div>
        <p className="hint">Use your keyboard or tap the number pad · Enter submits</p>
      </section>}

      {screen === "results" && result && <section className="results">
        <div className="chest"><div>✦ ✦ ✦</div><b>💎</b></div>
        <span className="eyebrow">✦ EXPEDITION COMPLETE ✦</span>
        <h1>{result.accuracy >= 90 ? "Treasure found!" : result.accuracy >= 80 ? "Trail conquered!" : "Brave exploring!"}</h1>
        <p>You returned with <b>{result.correct} correct answers</b> and {Math.min(3, Math.floor(result.keys / 3))} treasure chests.</p>
        <div className="score-card">
          <div><small>EXPEDITION SCORE</small><strong>{result.score.toLocaleString()}</strong><span>Personal best: {result.best.toLocaleString()}</span></div>
          <section><p><span>Correct answers</span><b>{result.correct} × 100</b></p><p><span>Speed bonus</span><b>{result.speed ? `+${result.speed}` : "Not unlocked"}</b></p><p><span>Accuracy</span><b>{result.accuracy}%</b></p></section>
          {result.accuracy < 80 && <aside>🛡️ Speed bonus needs 80% accuracy. Slow down, aim true, then try again!</aside>}
        </div>
        <div className="stars">
          <div className={result.accuracy >= 90 ? "earned" : ""}><span>⭐</span><b>Sharp Shooter</b><small>90% accuracy</small></div>
          <div className={result.correct >= (duration === 60 ? 14 : duration === 90 ? 20 : 26) ? "earned" : ""}><span>⭐</span><b>Trail Blazer</b><small>Beat the pace target</small></div>
          <div className={result.score > result.previousBest ? "earned" : ""}><span>⭐</span><b>Rising Explorer</b><small>New personal best</small></div>
        </div>
        <div className="achievement"><span>🏅</span><div><small>ACHIEVEMENT</small><b>{result.accuracy === 100 ? "Perfect Pathfinder" : result.correct >= 20 ? "Temple Trailblazer" : "Courageous Cartographer"}</b></div><p>Your latest trail badge has been added.</p></div>
        <div className="actions"><button className="secondary" onClick={() => setScreen("setup")}>Change trail</button><button className="primary" onClick={start}>Explore again <span>↻</span></button></div>
      </section>}

      <footer><b>Treasure Trail</b><span>Every answer is another step forward.</span></footer>
    </main>
  );
}
