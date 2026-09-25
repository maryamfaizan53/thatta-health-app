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

/** Evaluates simple rule expressions like "ageMonths<3", "days>5", "pregnant". */
function evalRule(
  expr: string,
  ctx: { ageMonths: number; days: number; pregnant: boolean },
): boolean {
  const e = expr.trim();
  if (e === "pregnant") return ctx.pregnant;
  const ops = ["<=", ">=", "==", "<", ">"];
  for (const op of ops) {
    const idx = e.indexOf(op);
    if (idx === -1) continue;
    const key = e.slice(0, idx).trim();
    const num = Number(e.slice(idx + op.length).trim());
    const val = key === "ageMonths" ? ctx.ageMonths : key === "days" ? ctx.days : NaN;
    if (Number.isNaN(val) || Number.isNaN(num)) return false;
    switch (op) {
      case "<=":
        return val <= num;
      case ">=":
        return val >= num;
      case "==":
        return val === num;
      case "<":
        return val < num;
      case ">":
        return val > num;
    }
  }
  return false;
}

/** Core triage decision. Deterministic, rule-based — no AI. */
export function triage(input: TriageInput): TriageResult {
  const { condition, ageMonths, pregnant, days, checkedFlagIds } = input;
  let tier: Tier = condition.base_tier;
  const reasons: L[] = [];

  // 1. Condition rules (age etc.)
  for (const rule of condition.rules) {
    if (evalRule(rule.if, { ageMonths, days, pregnant })) {
      tier = maxTier(tier, rule.tier);
      reasons.push(rule.why);
    }
  }

  // 2. Checked warning signs (condition flags + global flags)
  const allFlags = [...condition.flags, ...content.global_flags];
  for (const flag of allFlags) {
    if (checkedFlagIds.includes(flag.id)) {
      tier = maxTier(tier, flag.tier);
      reasons.push(flag.label);
    }
  }

  // 3. Pregnancy raises to at least the configured minimum tier
  if (pregnant && RANK[tier] < RANK[content.pregnancy.min_tier]) {
    tier = content.pregnancy.min_tier;
    reasons.push(content.pregnancy.why);
  }

  // 4. Lasting too long for home care
  if (days > condition.max_home_days && RANK[tier] < RANK.yellow) {
    tier = "yellow";
    reasons.push(content.too_long_why);
  }

  return { tier, reasons };
}

export type TriageEvent = {
  condition_id: string;
  tier: Tier;
  lang: string;
  taluka: string | null;
  ts: number;
};

const EVENTS_KEY = "ss_events";

/** Anonymous local event log (no names, no phone numbers, no exact location). */
export function recordTriageEvent(ev: Omit<TriageEvent, "ts">) {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    const list: TriageEvent[] = raw ? JSON.parse(raw) : [];
    list.push({ ...ev, ts: Date.now() });
    localStorage.setItem(EVENTS_KEY, JSON.stringify(list.slice(-500)));
  } catch {
    /* storage unavailable */
  }
}

export function impactToday(): number {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    const list: TriageEvent[] = raw ? JSON.parse(raw) : [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return list.filter((e) => e.ts >= start.getTime()).length;
  } catch {
    return 0;
  }
}
