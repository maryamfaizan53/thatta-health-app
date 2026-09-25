import { content, type Condition, type Tier } from "./content";
import type { L } from "./i18n";

export type TriageInput = {
  condition: Condition;
  ageMonths: number;
  pregnant: boolean;
  days: number;
  checkedFlagIds: string[];
};

export type TriageResult = {
  tier: Tier;
  reasons: L[];
};

const RANK: Record<Tier, number> = { green: 0, yellow: 1, red: 2 };
const maxTier = (a: Tier, b: Tier): Tier => (RANK[a] >= RANK[b] ? a : b);

/** Evaluates simple rule expressions like "ageMonths LT 3", "days GT 5", "pregnant". */
function evalRule(
  expr: string,
  ctx: { ageMonths: number; days: number; pregnant: boolean },
): boolean {
  const e = expr.trim();
  if (e === "pregnant") return ctx.pregnant;
  const m = e.match(/^(ageMonths|days)\s*(<=|>=|