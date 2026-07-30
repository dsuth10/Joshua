import { GEAR, getTrailNode, MASTERY_ACCURACY, TRAIL_NODES, unlockedNodeIds } from "./campaign.ts";
import { assessMastery } from "./questions.ts";
import type { ExpeditionReward, ExpeditionSession, NodeMastery, PlayerProgress } from "./types.ts";
export function createPlayerProgress():PlayerProgress{return{coins:0,mastery:{},completedNodeIds:[],unlockedNodeIds:unlockedNodeIds([]),ownedGearIds:[],equippedGearIds:[],relicIds:[]};}
export function calculateReward(session:ExpeditionSession,firstMastery:boolean):ExpeditionReward{
  const gate=assessMastery(session),node=getTrailNode(session.nodeId),firstMasteryBonus=firstMastery?Math.round(10*node.difficulty):0;
  const coins=Math.round(12*node.difficulty*(gate.accuracy>=MASTERY_ACCURACY?1:.5))+firstMasteryBonus;
  return{score:session.score,coins,accuracy:gate.accuracy,difficultyMultiplier:node.difficulty,firstMasteryBonus};
}
export function completeNode(progress:PlayerProgress,session:ExpeditionSession,completedAt=new Date().toISOString()):PlayerProgress{
  const gate=assessMastery(session);if(!gate.passed)throw new Error("Mastery gate has not passed.");
  const node=getTrailNode(session.nodeId),existing=progress.mastery[node.id],first=!existing?.completed,reward=calculateReward(session,first);
  const mastery:NodeMastery={attempts:(existing?.attempts??0)+1,bestAccuracy:Math.max(existing?.bestAccuracy??0,gate.accuracy),completed:true,completedAt:existing?.completedAt??completedAt};
  const completed=first?[...progress.completedNodeIds,node.id]:[...progress.completedNodeIds];
  return{...progress,coins:progress.coins+reward.coins,mastery:{...progress.mastery,[node.id]:mastery},completedNodeIds:completed,unlockedNodeIds:unlockedNodeIds(completed),relicIds:first?[...new Set([...progress.relicIds,node.relicId])]:[...progress.relicIds]};
}
export function buyGear(progress:PlayerProgress,gearId:string):PlayerProgress{
  const gear=GEAR.find((g)=>g.id===gearId);if(!gear)throw new Error(`Unknown gear: ${gearId}`);if(progress.ownedGearIds.includes(gearId))return progress;if(progress.coins<gear.cost)throw new Error("Not enough coins.");
  return{...progress,coins:progress.coins-gear.cost,ownedGearIds:[...progress.ownedGearIds,gearId]};
}
export function equipGear(progress:PlayerProgress,gearIds:readonly string[],maximumSlots=3):PlayerProgress{
  const unique=[...new Set(gearIds)];if(unique.length>maximumSlots)throw new Error(`Only ${maximumSlots} items can be equipped.`);if(unique.some((id)=>!progress.ownedGearIds.includes(id)))throw new Error("Only owned gear can be equipped.");return{...progress,equippedGearIds:unique};
}
export function recommendNode(progress:PlayerProgress):string{return TRAIL_NODES.find((n)=>progress.unlockedNodeIds.includes(n.id)&&!progress.completedNodeIds.includes(n.id))?.id??"base-camp";}
