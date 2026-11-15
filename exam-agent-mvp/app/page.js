"use client";
import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("Python basics");
  const [kind, setKind] = useState("MCQ");
  const [count, setCount] = useState(5);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [warning, setWarning] = useState("");

  async function generate() {
    setBusy(true); setResult(null);
    try {
      const r = await fetch("/api/exam", { method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ action: "create", topic, kind, count }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not create exam");
      setExam(data); setAnswers({}); setWarning("");
    } catch(e) { alert(e.message); } finally { setBusy(false); }
  }
  async function submit() {
    setBusy(true);
    try {
      const r = await fetch("/api/exam", { method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ action: "grade", exam, answers }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Could not grade exam");
      setResult(data);
    } catch(e) { alert(e.message); } finally { setBusy(false); }
  }
  function trackFocus() {
    setWarning("Leaving the exam window was detected. This is a warning, not proof of cheating.");
  }
  return <main className="wrap">
    <header><span className="logo">EP</span><div><h1>ExamPilot</h1><p>AI-assisted online examination MVP</p></div></header>
    {!exam ? <section className="panel">
      <h2>Create an exam</h2>
      <label>Subject or topic<input value={topic} onChange={e=>setTopic(e.target.value)} /></label>
      <label>Question format<select value={kind} onChange={e=>setKind(e.target.value)}>
        <option>MCQ</option><option>Short answer</option><option>Long answer</option><option>Oral (transcript)</option>
      </select></label>
      <label>Number of questions<select value={count} onChange={e=>setCount(Number(e.target.value))}>
        {[3,5,10].map(n=><option key={n}>{n}</option>)}
      </select></label>
      <button onClick={generate} disabled={busy || !topic.trim()}>{busy?"Creating...":"Generate exam"}</button>
    </section> : <section className="panel" onBlur={trackFocus}>
      <div className="examhead"><div><h2>{exam.title || topic}</h2><p>{kind} · {exam.questions.length} questions</p></div>
      <button className="secondary" onClick={()=>{setExam(null);setResult(null)}}>New exam</button></div>
      {warning && <p className="warning">{warning}</p>}
      {exam.questions.map((q,i)=><article className="question" key={i}>
        <h3>{i+1}. {q.question}</h3>
        {kind==="MCQ" ? <div className="options">{(q.options||[]).map((o,j)=><label className="option" key={j}>
          <input type="radio" name={"q"+i} checked={answers[i]===o} onChange={()=>setAnswers({...answers,[i]:o})}/>{o}
        </label>)}</div> : <textarea rows={kind==="Long answer"?6:3} placeholder={kind==="Oral (transcript)"?"Type or paste your spoken answer here...":"Your answer..."} value={answers[i]||""} onChange={e=>setAnswers({...answers,[i]:e.target.value})}/>}
      </article>)}
      <button onClick={submit} disabled={busy}>{busy?"Submitting...":"Submit and grade"}</button>
      {result && <div className="result"><h2>Result: {result.score}/{result.total}</h2><p>{result.summary}</p>
        {(result.feedback||[]).map((f,i)=><p key={i}><b>Q{i+1}:</b> {f}</p>)}</div>}
    </section>}
    <p className="foot">Prototype only. AI-based monitoring cannot guarantee that a candidate did not use another device or external help.</p>
  </main>;
}
