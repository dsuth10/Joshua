"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "multiply" | "divide" | "mixed";
type Question = { text: string; answer: number; key: string };
type Best = { score: number; accuracy: number };
const FACTS = Array.from({ length: 11 }, (_, i) => i + 2);

function nextQuestion(facts: number[], mode: Mode, old = ""): Question {
  let q: Question;
  do {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    const other = Math.floor(Math.random() * 11) + 2;
    const division = mode === "divide" || (mode === "mixed" && Math.random() > .5);
    q = division
      ? { text: `${fact * other} ÷ ${fact}`, answer: other, key: `${fact * other}/${fact}` }
      : { text: `${fact} × ${other}`, answer: fact * other, key: `${fact}x${other}` };
  } while (q.key === old);
  return q;
}

export default function Home() {
  const [screen, setScreen] = useState<"setup" | "play" | "result">("setup");
  const [facts, setFacts] = useState([2, 5, 10]);
  const [mode, setMode] = useState<Mode>("mixed");
  const [duration, setDuration] = useState(60);
  const [time, setTime] = useState(60);
  const [q, setQ] = useState(() => nextQuestion([2, 5, 10], "mixed"));
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [topStreak, setTopStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [best, setBest] = useState<Best | null>(null);
  const started = useRef(Date.now());
  const ended = useRef(false);

  const accuracy = attempts ? Math.round(correct / attempts * 100) : 100;
  const speedOn = attempts === 0 || accuracy >= 80;
  const finalScore = speedOn ? points : correct * 100;

  useEffect(() => {
    try { const saved = localStorage.getItem("fact-factory-best"); if (saved) setBest(JSON.parse(saved)); } catch {}
  }, []);

  const finish = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    setScreen("result");
  }, []);

  useEffect(() => {
    if (screen !== "play") return;
    const id = window.setInterval(() => setTime(t => {
      if (t <= 1) { window.clearInterval(id); finish(); return 0; }
      return t - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [screen, finish]);

  useEffect(() => {
    if (screen !== "result") return;
    const record = { score: finalScore, accuracy };
    if (!best || finalScore > best.score) {
      setBest(record);
      try { localStorage.setItem("fact-factory-best", JSON.stringify(record)); } catch {}
    }
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    const chosen = facts.length ? facts : [2];
    setFacts(chosen); setQ(nextQuestion(chosen, mode)); setTime(duration);
    setCorrect(0); setAttempts(0); setStreak(0); setTopStreak(0); setPoints(0);
    setAnswer(""); setStatus("idle"); ended.current = false; started.current = Date.now();
    setScreen("play");
  };

  const submit = useCallback(() => {
    if (screen !== "play" || !answer || status !== "idle") return;
    const right = Number(answer) === q.answer;
    const seconds = (Date.now() - started.current) / 1000;
    setAttempts(n => n + 1);
    if (right) {
      const combo = streak + 1;
      setCorrect(n => n + 1); setStreak(combo); setTopStreak(n => Math.max(n, combo));
      setPoints(n => n + 100 + Math.round(Math.max(0, 5 - seconds) * 15) + Math.min(combo, 10) * 5);
      setStatus("correct");
    } else { setStreak(0); setStatus("wrong"); }
    const old = q.key;
    window.setTimeout(() => {
      setQ(nextQuestion(facts, mode, old)); setAnswer(""); setStatus("idle"); started.current = Date.now();
    }, right ? 300 : 700);
  }, [answer, facts, mode, q, screen, status, streak]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (screen !== "play") return;
      if (/^\d$/.test(e.key)) setAnswer(v => (v + e.key).slice(0, 3));
      if (e.key === "Backspace") setAnswer(v => v.slice(0, -1));
      if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [screen, submit]);

  const medal = accuracy >= 95 && correct >= 20 ? "Gold Gear" : accuracy >= 90 && correct >= 12 ? "Silver Cog" : accuracy >= 80 && correct >= 6 ? "Bronze Bolt" : "Practice Patch";
  const toggle = (n: number) => setFacts(v => v.includes(n) ? v.filter(x => x !== n) : [...v, n].sort((a,b) => a-b));

  return <main>
    <header>
      <button className="brand" onClick={() => setScreen("setup")}><b>FF</b><span><strong>FACT FACTORY</strong><small>Make numbers. Build confidence.</small></span></button>
      {screen === "play" ? <div className="stats"><span><small>TIME</small><b>{time}s</b></span><span><small>ACCURACY</small><b>{accuracy}%</b></span><span><small>STREAK</small><b>🔥 {streak}</b></span></div>
      : best && <p className="best">🏆 Best {best.score.toLocaleString()}</p>}
    </header>

    {screen === "setup" && <section className="setup">
      <div className="intro">
        <p className="eyebrow">SHIFT READY • LINE 01</p>
        <h1>Fire up your<br/><em>fact power.</em></h1>
        <p>Pick your number facts, start the conveyor, and build as many mighty maths-bots as you can.</p>
        <aside>✓ <span><b>Accuracy powers the factory.</b><br/>Speed boosts unlock at 80% accuracy or higher.</span></aside>
        <div className="factory-art" aria-hidden="true"><div className="machine">⚙️</div><div className="belt">🤖　📦　🤖</div></div>
      </div>
      <div className="panel">
        <div className="panel-title"><b>SHIFT CONTROLS</b><span>● ONLINE</span></div>
        <fieldset><legend>1. Choose fact families</legend><div className="facts">{FACTS.map(n => <button key={n} className={facts.includes(n) ? "selected":""} onClick={() => toggle(n)}>×{n}</button>)}</div><div className="quick"><button onClick={() => setFacts(FACTS)}>Select all</button><button onClick={() => setFacts([2,5,10])}>Starter set</button></div></fieldset>
        <fieldset><legend>2. Pick the machine mode</legend><div className="choices">{(["multiply","divide","mixed"] as Mode[]).map(m => <button key={m} className={mode===m?"selected":""} onClick={()=>setMode(m)}>{m==="multiply"?"× Multiply":m==="divide"?"÷ Divide":"⚡ Mixed"}</button>)}</div></fieldset>
        <fieldset><legend>3. Set your shift timer</legend><div className="choices">{[60,90,120].map(n => <button key={n} className={duration===n?"selected":""} onClick={()=>setDuration(n)}><b>{n}</b><small> SEC</small></button>)}</div></fieldset>
        <button className="primary" onClick={start} disabled={!facts.length}>START THE FACTORY <b>→</b></button>
      </div>
    </section>}

    {screen === "play" && <section className="play">
      <div className="progress"><span style={{width:`${(duration-time)/duration*100}%`}} /></div>
      <div className="game">
        <aside className="output"><div className="big-machine">{status==="correct"?"✨":status==="wrong"?"🔧":"⚙️"}</div><div className="belt">{Array.from({length:Math.min(correct,6)}).map((_,i)=><span key={i}>🤖</span>)}</div><b>{correct} BOTS BUILT</b></aside>
        <div className={`card ${status}`}><p>PRODUCTION UNIT #{String(attempts+1).padStart(2,"0")}</p><h2>{q.text}</h2><div className="answer">{answer || "?"}</div><p className="feedback">{status==="correct"?"Perfect part!":status==="wrong"?`Almost! It was ${q.answer}`:"Type your answer, then press enter"}</p><div className="pad">{[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>setAnswer(v=>(v+n).slice(0,3))}>{n}</button>)}<button onClick={()=>setAnswer(v=>v.slice(0,-1))}>⌫</button><button onClick={()=>setAnswer(v=>(v+"0").slice(0,3))}>0</button><button className="go" onClick={submit}>✓</button></div></div>
        <aside className="score"><small>LIVE OUTPUT</small><strong>{points.toLocaleString()}</strong><p>POINTS</p><hr/><div><span>Correct</span><b>{correct}/{attempts}</b></div><div><span>Best streak</span><b>{topStreak}</b></div><div><span>Speed boost</span><b className={speedOn?"on":"off"}>{speedOn?"ON":"LOCKED"}</b></div><p>Keep accuracy at 80%+ to bank speed points.</p></aside>
      </div>
    </section>}

    {screen === "result" && <section className="results">
      <div className="medal">🏅</div><p className="eyebrow">SHIFT COMPLETE • PRODUCTION REPORT</p><h1>{medal}</h1>
      <p>{accuracy >= 80 ? "Brilliant work — the factory is humming!" : "Good practice! Slow down next shift and make every answer count."}</p>
      <div className="total"><small>FINAL FACTORY SCORE</small><strong>{finalScore.toLocaleString()}</strong>{!speedOn&&<p>Speed points locked: accuracy was below 80%.</p>}</div>
      <div className="report"><article>🤖<b>{correct}</b><small>BOTS BUILT</small></article><article>🎯<b>{accuracy}%</b><small>ACCURACY</small></article><article>🔥<b>{topStreak}</b><small>BEST STREAK</small></article><article>⚡<b>{speedOn?"BANKED":"LOCKED"}</b><small>SPEED BOOST</small></article></div>
      {best&&<p>🏆 Personal best: <b>{Math.max(best.score,finalScore).toLocaleString()} points</b> on this device</p>}
      <div className="actions"><button className="primary" onClick={start}>RUN ANOTHER SHIFT ↻</button><button onClick={()=>setScreen("setup")}>⚙ Change settings</button></div>
    </section>}
    <footer>FACT FACTORY • Every careful answer makes your brain stronger.</footer>
  </main>;
}
