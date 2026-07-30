import { getTrailNode, MASTERY_ACCURACY } from "./campaign.ts";
import type { CoreVariety, ExpeditionSession, FactRef, MasteryGate, QuestionResult, QuestionVariety, TrailNode, TrailQuestion } from "./types.ts";

const CORE:readonly CoreVariety[]=["product","missing-factor","division"];
function randomFrom(seed:number):()=>number {
  let state=seed>>>0;
  return ()=>{ state+=0x6d2b79f5; let v=state; v=Math.imul(v^(v>>>15),v|1); v^=v+Math.imul(v^(v>>>7),v|61); return ((v^(v>>>14))>>>0)/4294967296; };
}
function shuffled<T>(values:readonly T[],random:()=>number):T[] {
  const result=[...values];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
function factFor(node:TrailNode,index:number,random:()=>number):FactRef {
  const start=node.difficulty>=2?4:node.difficulty>=1.5?3:2;
  const multipliers=shuffled(Array.from({length:13-start},(_,i)=>start+i),random);
  return {table:node.tables[index%node.tables.length],multiplier:multipliers[index%multipliers.length]};
}
export function makeQuestion(fact:FactRef,variety:QuestionVariety,id:string,remediationOf?:string):TrailQuestion {
  const {table,multiplier}=fact; const product=table*multiplier; const common={id,fact,remediationOf};
  if(variety==="product") return {...common,variety,coreVariety:"product",prompt:`${table} × ${multiplier} = ?`,answer:product};
  if(variety==="missing-factor") return {...common,variety,coreVariety:"missing-factor",prompt:`${table} × ? = ${product}`,answer:multiplier};
  if(variety==="division") return {...common,variety,coreVariety:"division",prompt:`${product} ÷ ${table} = ?`,answer:multiplier};
  if(variety==="missing-divisor") return {...common,variety,coreVariety:"division",prompt:`${product} ÷ ? = ${multiplier}`,answer:table};
  return {...common,variety,coreVariety:"division",prompt:`? ÷ ${table} = ${multiplier}`,answer:product};
}
export function generateNodeQuestions(nodeId:string,seed=Date.now()):TrailQuestion[] {
  const node=getTrailNode(nodeId),random=randomFrom(seed);
  const varieties:QuestionVariety[]=["product","missing-factor","division","product","missing-factor","missing-divisor","product","missing-factor","missing-dividend","division","product","missing-factor"];
  while(varieties.length<node.minimumQuestions) varieties.push(CORE[varieties.length%CORE.length]);
  return shuffled(varieties.map((v,i)=>makeQuestion(factFor(node,i,random),v,`${node.id}-${seed}-${i+1}`)),random);
}
export function createExpeditionSession(nodeId:string,seed=Date.now()):ExpeditionSession {
  return {nodeId,queue:generateNodeQuestions(nodeId,seed),cursor:0,results:[],score:0,currentStreak:0,bestStreak:0,seed,complete:false};
}
export function currentQuestion(session:ExpeditionSession):TrailQuestion|undefined{return session.queue[session.cursor];}
function remediation(question:TrailQuestion,length:number):TrailQuestion[]{
  const alternatives:QuestionVariety[]=question.coreVariety==="division"?["product","missing-factor"]:["division","missing-divisor"];
  return alternatives.map((v,i)=>makeQuestion(question.fact,v,`${question.id}-review-${length+i+1}`,question.id));
}
export function assessMastery(session:ExpeditionSession):MasteryGate {
  const required=getTrailNode(session.nodeId).minimumQuestions,assessed=session.results.length;
  const correct=session.results.filter((r)=>r.correct).length,accuracy=assessed?correct/assessed:0;
  const varietiesSeen=CORE.filter((v)=>session.results.some((r)=>r.coreVariety===v));
  const missingVarieties=CORE.filter((v)=>!varietiesSeen.includes(v));
  const passed=assessed>=required&&accuracy>=MASTERY_ACCURACY&&!missingVarieties.length;
  const message=passed?"Trail mastered!":assessed<required?`${required-assessed} assessed questions still required.`:accuracy<MASTERY_ACCURACY?"Keep practising to reach 80% accuracy.":"Complete every question style.";
  return {passed,assessed,correct,accuracy,requiredQuestions:required,varietiesSeen,missingVarieties,message};
}
function recovery(session:ExpeditionSession):TrailQuestion[]{
  const gate=assessMastery(session); if(gate.accuracy>=MASTERY_ACCURACY||!gate.assessed)return[];
  const count=Math.max(1,Math.ceil((MASTERY_ACCURACY*gate.assessed-gate.correct)/(1-MASTERY_ACCURACY)));
  const missed=session.results.filter((r)=>!r.correct);
  return Array.from({length:count},(_,i)=>makeQuestion(missed[i%missed.length].fact,i%2?"division":"missing-factor",`${session.nodeId}-${session.seed}-gate-${session.queue.length+i+1}`,missed[i%missed.length].questionId));
}
export function submitAnswer(session:ExpeditionSession,answer:number):ExpeditionSession {
  if(session.complete)return session; const q=currentQuestion(session); if(!q)return session;
  const correct=answer===q.answer,streak=correct?session.currentStreak+1:0;
  const result:QuestionResult={questionId:q.id,answer,correct,variety:q.variety,coreVariety:q.coreVariety,fact:q.fact};
  let queue=[...session.queue]; if(!correct)queue.push(...remediation(q,queue.length));
  let next:ExpeditionSession={...session,queue,cursor:session.cursor+1,results:[...session.results,result],score:session.score+(correct?Math.round(100*(1+Math.min(streak,10)*.05)):0),currentStreak:streak,bestStreak:Math.max(session.bestStreak,streak)};
  if(next.cursor>=next.queue.length){if(assessMastery(next).passed)next={...next,complete:true};else{const extra=recovery(next);if(extra.length)next={...next,queue:[...next.queue,...extra]};}}
  return next;
}
