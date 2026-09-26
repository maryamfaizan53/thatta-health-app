import type { Tier } from "./triage";

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
