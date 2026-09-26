// Sehat Saathi — deterministic triage engine.
// The AI never decides the tier. It only fills the form (condition, age, flags);
// this function makes the decision from doctor-reviewed rules in triage-content.json.
export type Tier = "green" | "yellow" | "red";
export type Lang = "en" | "ur" | "sd";
type T = Record<Lang, string>;
export interface TriageInput {
  conditionId: string;
  ageMonths: number;          // form asks age with a months/years toggle
  sex: "male" | "female" | "other";
  pregnant?: boolean;         // only asked for females aged 12–50
  days: number;               // how many days it has been going on (0 = today)
  flags: string[];            // ids of ticked warning signs (condition + global)
}
export interface TriageResult {
  tier: Tier;
  reasons: T[];               // why this tier — shown to the user, in their language
  firstAid: T[];              // red-tier steps to do while getting help
  home: T[];                  // green/yellow home care
  dont: T[];
  medicines: { id: string; name: T; note: T }[];
  hiddenMedicines: string[];  // filtered out for age or pregnancy (for transparency)
}
const RANK: Record<Tier, number> = { green: 0, yellow: 1, red: 2 };
const maxTier = (a: Tier, b: Tier): Tier => (RANK[b] > RANK[a] ? b : a);
function checkRule(expr: string, ageMonths: number): boolean {
  // Rules are deliberately tiny: "age_months < N" or "age_months >= N".
  const m = expr.match(/^age_months\s*(<|<=|>|>=)\s*(\d+)$/);
  if (!m) throw new Error(`Unsupported rule: ${expr}`);
  const n = Number(m[2]);
  switch (m[1]) {
    case "<": return ageMonths < n;
    case "<=": return ageMonths <= n;
    case ">": return ageMonths > n;
    default: return ageMonths >= n;
  }
}
export function triage(content: any, input: TriageInput): TriageResult {
  const c = content.conditions.find((x: any) => x.id === input.conditionId);
  if (!c) throw new Error(`Unknown condition: ${input.conditionId}`);
  let tier: Tier = c.base_tier;
  const reasons: T[] = [];
  if (c.base_tier === "red") reasons.push(c.urgent_label ?? content.tiers.red.title);
  // 1) Emergency signs from any form, then condition warning signs
  const allFlags = [...content.global_flags, ...c.flags];
  for (const f of allFlags) {
    if (input.flags.includes(f.id)) {
      tier = maxTier(tier, f.tier);
      reasons.push(f.label);
    }
  }
  // 2) Age rules
  for (const r of c.rules) {
    if (checkRule(r.if, input.ageMonths)) {
      tier = maxTier(tier, r.tier);
      reasons.push(r.why);
    }
  }
  // 3) Lasting too long for home care
  if (c.base_tier !== "red" && input.days > c.max_home_days) {
    tier = maxTier(tier, "yellow");
    reasons.push(content.too_long_why);
  }
  // 4) Pregnancy: at least yellow, and only pregnancy-safe medicines
  const pregnant = input.sex === "female" && !!input.pregnant;
  if (pregnant) {
    tier = maxTier(tier, content.pregnancy.min_tier);
    reasons.push(content.pregnancy.why);
  }
  // 5) Medicines — never shown for red (go to hospital instead)
  const medicines: TriageResult["medicines"] = [];
  const hiddenMedicines: string[] = [];
  if (tier !== "red") {
    for (const id of c.meds) {
      const m = content.medicines[id];
      const tooYoung = input.ageMonths < (m.min_age_months ?? 0);
      const tooOld = m.max_age_months != null && input.ageMonths > m.max_age_months;
      const notInPregnancy = pregnant && !m.pregnancy_ok;
      if (tooYoung || tooOld || notInPregnancy) hiddenMedicines.push(id);
      else medicines.push({ id, name: m.name, note: m.note });
    }
  }
  return {
    tier,
    reasons,
    firstAid: tier === "red" ? (c.red_first_aid ?? []) : [],
    home: tier === "red" ? [] : c.home,
    dont: c.dont,
    medicines,
    hiddenMedicines,
  };
}
