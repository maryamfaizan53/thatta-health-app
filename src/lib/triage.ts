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
  const m = expr.match(/^age_months\s*(