import assert from "node:assert/strict";
import test from "node:test";
import {
  GEAR, MUSEUM_RELICS, TRAIL_NODES, assessMastery, calculateReward,
  completeNode, createExpeditionSession, createPlayerProgress,
  generateNodeQuestions, submitAnswer, unlockedNodeIds,
} from "../app/game/index.ts";

test("nodes generate at least 12 questions and all core forms",()=>{
  for(const node of TRAIL_NODES){
    const questions=generateNodeQuestions(node.id,42);
    assert.ok(questions.length>=12,node.id);
    for(const form of ["product","missing-factor","division"])
      assert.ok(questions.some((q)=>q.coreVariety===form),`${node.id}: ${form}`);
  }
});
test("a miss schedules two alternative reviews",()=>{
  const session=createExpeditionSession("base-camp",7),next=submitAnswer(session,-1);
  assert.equal(next.queue.length,session.queue.length+2);
  assert.ok(next.queue.slice(-2).every((q)=>q.remediationOf===session.queue[0].id));
});
test("twelve correct varied answers pass mastery",()=>{
  let session=createExpeditionSession("base-camp",10);
  while(!session.complete)session=submitAnswer(session,session.queue[session.cursor].answer);
  assert.equal(assessMastery(session).passed,true);
  assert.equal(session.results.length,12);
});
test("map branches and requires both difficult trails to reconverge",()=>{
  assert.deepEqual(unlockedNodeIds([]),["base-camp"]);
  assert.ok(unlockedNodeIds(["base-camp"]).includes("jungle-trail"));
  assert.ok(unlockedNodeIds(["base-camp","jungle-trail"]).includes("mountain-pass"));
  assert.ok(!unlockedNodeIds(["volcano-route"]).includes("ancient-ruins"));
  assert.ok(unlockedNodeIds(["volcano-route","temple-route"]).includes("ancient-ruins"));
});
test("rewards are normalized and difficulty weighted",()=>{
  const finish=(id)=>{let s=createExpeditionSession(id,5);while(!s.complete)s=submitAnswer(s,s.queue[s.cursor].answer);return s;};
  const base=finish("base-camp"),padded={...base,results:[...base.results,...base.results]};
  assert.equal(calculateReward(base,false).coins,calculateReward(padded,false).coins);
  assert.ok(calculateReward(finish("volcano-route"),false).coins>calculateReward(base,false).coins);
});
test("completion records separate coins, mastery, unlock and relic",()=>{
  let session=createExpeditionSession("base-camp",99);
  while(!session.complete)session=submitAnswer(session,session.queue[session.cursor].answer);
  const progress=completeNode(createPlayerProgress(),session);
  assert.ok(progress.coins>0);
  assert.equal(progress.mastery["base-camp"].completed,true);
  assert.ok(progress.unlockedNodeIds.includes("jungle-trail"));
  assert.ok(progress.relicIds.includes("brass-compass"));
});
test("at least four non-answer gear items and one relic per node",()=>{
  assert.ok(GEAR.length>=4);
  for(const node of TRAIL_NODES)assert.ok(MUSEUM_RELICS.some((r)=>r.id===node.relicId));
});
