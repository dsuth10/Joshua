import type { GearDefinition, GuardianDefinition, MuseumRelic, TrailEvent, TrailNode } from "./types.ts";

export const MINIMUM_NODE_QUESTIONS = 12;
export const MASTERY_ACCURACY = 0.8;

export const TRAIL_NODES: readonly TrailNode[] = [
  { id:"base-camp", region:"Base Camp", title:"Supply Trail", description:"Prepare with the ×2, ×5 and ×10 facts.", tables:[2,5,10], difficulty:1, minimumQuestions:12, unlock:{}, guardianId:"camp-keeper", relicId:"brass-compass" },
  { id:"jungle-trail", region:"Whispering Jungle", title:"Vine Bridge", description:"Cross using ×3 and ×4.", tables:[3,4], difficulty:1.25, minimumQuestions:12, unlock:{allOf:["base-camp"]}, guardianId:"jungle-jaguar", relicId:"jade-leaf" },
  { id:"river-trail", region:"Silver River", title:"Rapid Crossing", description:"Steer through ×10 and ×11.", tables:[10,11], difficulty:1.25, minimumQuestions:12, unlock:{allOf:["base-camp"]}, guardianId:"river-serpent", relicId:"silver-oar" },
  { id:"mountain-pass", region:"Cloud Mountains", title:"Echo Pass", description:"Climb with ×6 and ×9.", tables:[6,9], difficulty:1.6, minimumQuestions:12, unlock:{anyOf:["jungle-trail","river-trail"]}, guardianId:"stone-eagle", relicId:"echo-crystal" },
  { id:"volcano-route", region:"Ember Volcano", title:"Seven-Fire Path", description:"Master the demanding ×7 facts.", tables:[7], difficulty:2, minimumQuestions:12, unlock:{allOf:["mountain-pass"]}, guardianId:"lava-golem", relicId:"ember-idol" },
  { id:"temple-route", region:"Moon Temple", title:"Eight-Moon Steps", description:"Unlock the temple with ×8 facts.", tables:[8], difficulty:2, minimumQuestions:12, unlock:{allOf:["mountain-pass"]}, guardianId:"temple-sphinx", relicId:"moon-tablet" },
  { id:"ancient-ruins", region:"Ancient Ruins", title:"Twin Crest Gate", description:"Combine ×7, ×8 and related division.", tables:[7,8], difficulty:2.3, minimumQuestions:12, unlock:{allOf:["volcano-route","temple-route"]}, guardianId:"ruin-sentinel", relicId:"twin-crest" },
  { id:"final-vault", region:"Treasure Vault", title:"The Final Lock", description:"Use mixed facts from every trail.", tables:[2,3,4,5,6,7,8,9,10,11], difficulty:2.6, minimumQuestions:15, unlock:{allOf:["ancient-ruins"]}, guardianId:"vault-guardian", relicId:"golden-sun" },
] as const;

export const GEAR: readonly GearDefinition[] = [
  { id:"trail-compass", name:"Trail Compass", description:"Points towards facts needing practice.", effect:"Highlights a recommended unlocked node.", cost:45, slot:"tool" },
  { id:"pattern-lantern", name:"Pattern Lantern", description:"Illuminates a multiplication pattern.", effect:"Once per expedition, shows a skip-counting or array hint.", cost:70, slot:"tool" },
  { id:"sturdy-boots", name:"Sturdy Boots", description:"Keeps an explorer steady.", effect:"Protects a score streak after one error.", cost:85, slot:"clothing" },
  { id:"climbing-rope", name:"Climbing Rope", description:"Reaches optional challenge routes.", effect:"Unlocks one harder event choice, never a mastery bypass.", cost:100, slot:"tool" },
  { id:"treasure-map", name:"Treasure Map", description:"Shows a chest's reward category.", effect:"Reveals a chest category before choosing.", cost:60, slot:"tool" },
  { id:"lucky-charm", name:"Lucky Charm", description:"Attracts unusual cosmetic finds.", effect:"Improves cosmetic rarity only.", cost:120, slot:"charm" },
] as const;

export const TRAIL_EVENTS: readonly TrailEvent[] = [
  { id:"repair-bridge", name:"Repair the Bridge", description:"Complete linked facts to replace three planks.", rule:"Answer three linked multiplication and division questions.", rewardCoins:5 },
  { id:"forked-tunnel", name:"Forked Tunnel", description:"Choose the tunnel labelled by the product.", rule:"A mistake triggers review.", rewardCoins:4 },
  { id:"recover-supplies", name:"Recover Supplies", description:"Retry a missed fact in a different form.", rule:"Correct a misconception.", rewardCoins:6 },
  { id:"storm-shelter", name:"Storm Shelter", description:"Build shelter carefully.", rule:"Accuracy matters; speed gives no advantage.", rewardCoins:5 },
] as const;

const guardianPairs = [["camp-keeper","Camp Keeper"],["jungle-jaguar","Jungle Jaguar"],["river-serpent","River Serpent"],["stone-eagle","Stone Eagle"],["lava-golem","Lava Golem"],["temple-sphinx","Temple Sphinx"],["ruin-sentinel","Ruin Sentinel"],["vault-guardian","Vault Guardian"]] as const;
export const GUARDIANS: readonly GuardianDefinition[] = guardianPairs.map(([id,name]) => ({ id, name, challenge:"Complete a five-question mixed-fact challenge.", requiredCorrect:4, questionCount:5 }));
const relicRows = [
  ["brass-compass","Brass Compass","Base Camp","The compass that began the expedition."],
  ["jade-leaf","Jade Leaf","Whispering Jungle","A carved leaf from the hidden bridge."],
  ["silver-oar","Silver Oar","Silver River","An oar engraved with number patterns."],
  ["echo-crystal","Echo Crystal","Cloud Mountains","A crystal that repeats nearby facts."],
  ["ember-idol","Ember Idol","Ember Volcano","A warm stone marked with seven flames."],
  ["moon-tablet","Moon Tablet","Moon Temple","Eight moon phases circle its edge."],
  ["twin-crest","Twin Crest","Ancient Ruins","The joined Seven and Eight seals."],
  ["golden-sun","Golden Sun","Treasure Vault","The museum's centrepiece."],
] as const;
export const MUSEUM_RELICS: readonly MuseumRelic[] = relicRows.map(([id,name,region,description]) => ({id,name,region,description}));

export function getTrailNode(nodeId:string):TrailNode {
  const node=TRAIL_NODES.find((item)=>item.id===nodeId);
  if(!node) throw new Error(`Unknown trail node: ${nodeId}`);
  return node;
}
export function isNodeUnlocked(node:TrailNode, completedIds:readonly string[]):boolean {
  const done=new Set(completedIds);
  return (node.unlock.allOf??[]).every((id)=>done.has(id)) &&
    ((node.unlock.anyOf??[]).length===0 || (node.unlock.anyOf??[]).some((id)=>done.has(id)));
}
export function unlockedNodeIds(completedIds:readonly string[]):string[] {
  return TRAIL_NODES.filter((node)=>isNodeUnlocked(node,completedIds)).map((node)=>node.id);
}
