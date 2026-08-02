export type QuestionVariety = "product" | "missing-factor" | "division" | "missing-divisor" | "missing-dividend";
export type CoreVariety = "product" | "missing-factor" | "division";
export interface FactRef { table: number; multiplier: number }
export interface TrailQuestion {
  id: string; prompt: string; answer: number; variety: QuestionVariety;
  coreVariety: CoreVariety; fact: FactRef; remediationOf?: string;
}
export interface TrailNode {
  id: string; region: string; title: string; description: string;
  tables: readonly number[]; difficulty: number; minimumQuestions: number;
  unlock: { allOf?: readonly string[]; anyOf?: readonly string[] };
  guardianId: string; relicId: string;
}
export interface QuestionResult {
  questionId: string; answer: number; correct: boolean;
  variety: QuestionVariety; coreVariety: CoreVariety; fact: FactRef;
}
export interface ExpeditionSession {
  nodeId: string; queue: readonly TrailQuestion[]; cursor: number;
  results: readonly QuestionResult[]; score: number; currentStreak: number;
  bestStreak: number; seed: number; complete: boolean;
}
export interface MasteryGate {
  passed: boolean; assessed: number; correct: number; accuracy: number;
  requiredQuestions: number; varietiesSeen: readonly CoreVariety[];
  missingVarieties: readonly CoreVariety[]; message: string;
}
export interface NodeMastery { attempts: number; bestAccuracy: number; completed: boolean; completedAt?: string }
export interface PlayerProgress {
  coins: number; mastery: Readonly<Record<string, NodeMastery>>;
  completedNodeIds: readonly string[]; unlockedNodeIds: readonly string[];
  ownedGearIds: readonly string[]; equippedGearIds: readonly string[]; relicIds: readonly string[];
}
export interface ExpeditionReward {
  score: number; coins: number; accuracy: number; difficultyMultiplier: number; firstMasteryBonus: number;
}
export interface GearDefinition {
  id: string; name: string; description: string; effect: string; cost: number; slot: "tool" | "clothing" | "charm";
}
export interface TrailEvent { id: string; name: string; description: string; rule: string; rewardCoins: number }
export interface GuardianDefinition { id: string; name: string; challenge: string; requiredCorrect: number; questionCount: number }
export interface MuseumRelic { id: string; name: string; region: string; description: string }
