import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Share2, X } from "lucide-react";
import { conditionById, content, type Tier } from "@/lib/content";
import { lt, speak, stopSpeak, t, useApp, useLang, type L } from "@/lib/i18n";
import { facilitiesFor, directionsUrl } from "@/lib/facilities";
import { triage } from "@/lib/triage";
import { recordTriageEvent } from "@/lib/events";
import {
  BigButton,
  CallButton,
  EmergencyStrip,
  EmojiIcon,
  Shell,
  SpeakerButton,
} from "@/components/chrome";

const DAY_OPTIONS = [
  { key: "today", days: 0 },
  { key: "day1", days: 1 },
  { key: "day2", days: 2 },
  { key: "day3", days: 3 },
  { key: "days47", days: 5 },
  { key: "weekPlus", days: 8 },
] as const;

export const Route = createFileRoute("/triage/$condition")({
  validateSearch: (s: Record<string, unknown>) => ({ direct: s["direct"] === true }),
  head: ({ params }) => {
    const c = conditionById(params.condition);
    const name = c ? c.label.en : "Triage";
    return {
      meta: [
        { title: `${name} — Sehat Saathi` },
        {
          name: "description",
          content: `First-aid guidance for ${name} in Sindhi, Urdu and English.`,
        },
        { property: "og:title", content: `${name} — Sehat Saathi` },
        {
          property: "og:description",
          content: `First-aid guidance for ${name} in Sindhi, Urdu and English.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TriagePage,
});

type Answers = {
  who: "me" | "child" | "other" | null;
  ageMonths: number;
  ageUnit: "months" | "years";
  sex: "male" | "female" | null;
  pregnant: boolean;
  days: number | null;
  flags: string[];
};

const STEPS = ["who", "age", "sex", "pregnant", "since", "flags"] as const;

function TriagePage() {
  const { condition: condId } = Route.useParams();
  const { direct } = Route.useSearch();
  const navigate = useNavigate();
  const condition = conditionById(condId);

  const [answers, setAnswers] = useState<Answers>({
    who: null,
    ageMonths: 300, // 25 years default
    ageUnit: "years",
    sex: null,
    pregnant: false,
    days: null,
    flags: [],
  });
  const [stepIdx, setStepIdx] = useState(0);
  const [showResult, setShowResult] = useState(direct && condition?.base_tier === "red");

  const steps = useMemo(() => {
    const needPreg =
      answers.sex === "female" && answers.ageMonths >= 144 && answers.ageMonths <= 600;
    return STEPS.filter((s) => s !== "pregnant" || needPreg);
  }, [answers.sex, answers.ageMonths]);

  useEffect(() => () => stopSpeak(), []);

  if (!condition) {
    return (
      <Shell>
        <EmergencyStrip />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <p className="text-lg font-bold">?</p>
          <Link to="/" className="text-primary underline">
            {t("home", useLang())}
          </Link>
        </div>
      </Shell>
    );
  }

  if (showResult) {
    return <Result condition={condition} answers={answers} direct={direct} />;
  }

  const step = steps[stepIdx] ?? "flags";
  const ageDisplay =
    answers.ageUnit === "years"
      ? Math.round(answers.ageMonths / 12)
      : answers.ageMonths;

  const setAge = (v: number) => {
    const months = answers.ageUnit === "years" ? v * 12 : v;
    setAnswers((a) => ({ ...a, ageMonths: Math.min(1080, Math.max(0, months)) }));
  };

  const next = () => {
    if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1);
    else setShowResult(true);
  };
  const back = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
    else navigate({ to: "/" });
  };

  const canContinue =
    step === "who"
      ? answers.who !== null
      : step === "sex"
        ? answers.sex !== null
        : step === "since"
          ? answers.days !== null
          : true;

  return (
    <Shell>
      <EmergencyStrip />
      <main className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            className="touch-target flex items-center gap-1 rounded-2xl bg-card px-4 font-bold text-card-foreground shadow-soft"
          >
            <ArrowLeft size={20} /> {t("back", useLang())}
          </button>
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`h-3 w-3 rounded-full ${
                  i < stepIdx ? "bg-primary" : i === stepIdx ? "bg-accent" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col gap-4"
        >
          {step === "who" && (
            <Question
              title={t("whoIsSick", useLang())}
              options={[
                { key: "me", label: `🧑 ${t("me", useLang())}` },
                { key: "child", label: `🧒 ${t("myChild", useLang())}` },
                { key: "other", label: `👥 ${t("someoneElse", useLang())}` },
              ]}
              value={answers.who}
              onPick={(v) =>
                setAnswers((a) => ({
                  ...a,
                  who: v as Answers["who"],
                  ageMonths: v === "child" ? 36 : 300,
                  ageUnit: v === "child" ? "years" : "years",
                }))
              }
            />
          )}

          {step === "age" && (
            <div className="flex flex-1 flex-col items-center gap-5">
              <QuestionTitle text={t("ageQuestion", useLang())} />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="-"
                  onClick={() => setAge(ageDisplay - 1)}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-card-foreground shadow-soft"
                >
                  <Minus size={30} />
                </button>
                <div className="w-28 text-center text-6xl font-extrabold text-foreground">
                  {ageDisplay}
                </div>
                <button
                  type="button"
                  aria-label="+"
                  onClick={() => setAge(ageDisplay + 1)}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-card-foreground shadow-soft"
                >
                  <Plus size={30} />
                </button>
              </div>
              <div className="flex gap-2">
                {(["months", "years"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() =>
                      setAnswers((a) => ({
                        ...a,
                        ageUnit: u,
                        ageMonths:
                          u === "months"
                            ? Math.min(a.ageMonths, 24)
                            : Math.max(12, a.ageMonths),
                      }))
                    }
                    className={`touch-target rounded-2xl px-6 font-bold ${
                      answers.ageUnit === u
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground"
                    }`}
                  >
                    {t(u, useLang())}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "sex" && (
            <Question
              title={t("sexQuestion", useLang())}
              options={[
                { key: "male", label: `👨 ${t("male", useLang())}` },
                { key: "female", label: `👩 ${t("female", useLang())}` },
              ]}
              value={answers.sex}
              onPick={(v) => setAnswers((a) => ({ ...a, sex: v as Answers["sex"] }))}
            />
          )}

          {step === "pregnant" && (
            <Question
              title={t("pregnantQuestion", useLang())}
              options={[
                { key: "yes", label: t("yes", useLang()) },
                { key: "no", label: t("no", useLang()) },
                { key: "notSure", label: t("notSure", useLang()) },
              ]}
              value={answers.pregnant ? "yes" : null}
              onPick={(v) =>
                setAnswers((a) => ({ ...a, pregnant: v !== "no" }))
              }
            />
          )}

          {step === "since" && (
            <div className="flex flex-1 flex-col gap-4">
              <QuestionTitle text={t("sinceWhen", useLang())} />
              <div className="grid grid-cols-2 gap-3">
                {DAY_OPTIONS.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, days: d.days }))}
                    className={`touch-target rounded-2xl px-4 text-lg font-bold shadow-soft ${
                      answers.days === d.days
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground"
                    }`}
                  >
                    {t(d.key, useLang())}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "flags" && (
            <FlagsStep
              condition={condition}
              checked={answers.flags}
              onToggle={(id) =>
                setAnswers((a) => ({
                  ...a,
                  flags: a.flags.includes(id)
                    ? a.flags.filter((f) => f !== id)
                    : [...a.flags, id],
                }))
              }
            />
          )}
        </motion.div>

        {step !== "flags" && (
          <div className="pt-4">
            <BigButton onClick={next} className={!canContinue ? "opacity-50" : ""}>
              {t("continue", useLang())}
            </BigButton>
          </div>
        )}
        {step === "flags" && (
          <div className="pt-4">
            <BigButton onClick={next}>{t("noneOfThese", useLang())}</BigButton>
          </div>
        )}
      </main>
    </Shell>
  );
}

function QuestionTitle({ text }: { text: string }) {
  const lang = useLang();
  return (
    <div className="flex items-center justify-center gap-2">
      <h1 className="text-center text-2xl font-extrabold text-foreground">{text}</h1>
      <SpeakerButton text={text} />
    </div>
  );
}

function Question({
  title,
  options,
  value,
  onPick,
}: {
  title: string;
  options: { key: string; label: string }[];
  value: string | null;
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <QuestionTitle text={title} />
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onPick(o.key)}
          className={`touch-target rounded-3xl px-5 text-xl font-bold shadow-soft transition-transform active:scale-95 ${
            value === o.key
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function FlagsStep({
  condition,
  checked,
  onToggle,
}: {
  condition: NonNullable<ReturnType<typeof conditionById>>;
  checked: string[];
  onToggle: (id: string) => void;
}) {
  const lang = useLang();
  return (
    <div className="flex flex-1 flex-col gap-4">
      <QuestionTitle text={t("warningSigns", lang)} />
      {condition.flags.map((f) => (
        <FlagCard key={f.id} id={f.id} label={lt(f.label, lang)} checked={checked.includes(f.id)} onToggle={onToggle} />
      ))}
      <div className="rounded-3xl border-2 border-tier-red bg-tier-red-soft p-4">
        <h2 className="mb-3 text-lg font-extrabold text-tier-red">
          {t("anyOfThese", lang)}
        </h2>
        <div className="flex flex-col gap-3">
          {content.global_flags.map((f) => (
            <FlagCard key={f.id} id={f.id} label={lt(f.label, lang)} checked={checked.includes(f.id)} onToggle={onToggle} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FlagCard({
  id,
  label,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  const lang = useLang();
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`touch-target flex flex-1 items-center gap-3 rounded-2xl px-4 text-left text-lg font-bold shadow-soft ${
          checked ? "bg-tier-red text-primary-foreground" : "bg-card text-card-foreground"
        }`}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 ${
            checked ? "border-primary-foreground bg-primary-foreground text-tier-red" : "border-border"
          }`}
        >
          {checked ? "✓" : ""}
        </span>
        {label}
      </button>
      <SpeakerButton text={label} />
    </div>
  );
}

const TIER_STYLE: Record<Tier, { bg: string; soft: string; text: string }> = {
  red: { bg: "bg-tier-red", soft: "bg-tier-red-soft", text: "text-tier-red" },
  yellow: { bg: "bg-tier-amber", soft: "bg-tier-amber-soft", text: "text-tier-amber" },
  green: { bg: "bg-tier-green", soft: "bg-tier-green-soft", text: "text-tier-green" },
};

function Result({
  condition,
  answers,
  direct,
}: {
  condition: NonNullable<ReturnType<typeof conditionById>>;
  answers: Answers;
  direct: boolean;
}) {
  const lang = useLang();
  const { taluka } = useApp();
  const reduce = useReducedMotion();
  const [storeMed, setStoreMed] = useState<string | null>(null);

  const result = useMemo(
    () =>
      triage(content, {
        conditionId: condition.id,
        ageMonths: direct ? 300 : answers.ageMonths,
        sex: direct ? "other" : (answers.sex ?? "other"),
        pregnant: direct ? false : answers.pregnant,
        days: direct ? 0 : (answers.days ?? 0),
        flags: direct ? [] : answers.flags,
      }),
    [condition, answers, direct],
  );

  useEffect(() => {
    recordTriageEvent({
      condition_id: condition.id,
      tier: result.tier,
      lang,
      taluka: taluka ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ts = TIER_STYLE[result.tier];
  const tierInfo = content.tiers[result.tier];
  const meds = result.medicines;
  const showMeds = meds.length > 0;
  const watchFor = [...condition.flags, ...content.global_flags].filter(
    (f) => RANK[f.tier] >= RANK[result.tier],
  );
  const hospitals = facilitiesFor(taluka ?? "Thatta").filter((f) =>
    result.tier === "red" ? f.type !== "BHU" : true,
  );

  const listenAll = () => {
    const parts = [
      lt(tierInfo.title, lang),
      lt(tierInfo.action, lang),
      ...result.reasons.map((r) => lt(r, lang)),
      ...((result.tier === "red" ? condition.red_first_aid : condition.home) ?? []).map((s) =>
        lt(s, lang),
      ),
    ];
    speak(parts.join(". "), lang);
  };

  const share = () => {
    const text = `Sehat Saathi: ${lt(condition.label, lang)} — ${lt(tierInfo.title, lang)}. ${lt(tierInfo.action, lang)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Shell>
      <EmergencyStrip />
      <motion.main
        initial={reduce ? false : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`flex flex-1 flex-col gap-4 p-5 ${ts.soft}`}
      >
        <div className={`rounded-3xl ${ts.bg} p-5 text-center shadow-soft`}>
          <h1 className="text-3xl font-extrabold text-primary-foreground">
            {lt(result.tier === "red" && condition.urgent_label ? condition.urgent_label : tierInfo.title, lang)}
          </h1>
          <p className="mt-2 text-lg font-semibold text-primary-foreground/90">
            {lt(tierInfo.action, lang)}
          </p>
        </div>

        {result.reasons.length > 0 && (
          <div className="rounded-3xl bg-card p-4 shadow-soft">
            <h2 className="font-extrabold text-card-foreground">{t("reasons", lang)}</h2>
            <ul className="mt-1 list-disc ps-6 text-card-foreground">
              {result.reasons.map((r, i) => (
                <li key={i} className="text-lg">{lt(r, lang)}</li>
              ))}
            </ul>
          </div>
        )}

        {result.tier === "red" && (
          <CallButton number="1122" label={`📞 1122 — ${t("emergencyStrip", lang).split("—")[1] ?? ""}`} pulse big />
        )}
        {result.tier === "yellow" && (
          <CallButton number="1123" label={t("doctorAdvice", lang)} />
        )}

        {result.tier === "red" && condition.red_first_aid && (
          <Section title={t("doThisNow", lang)}>
            {condition.red_first_aid.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ts.bg} text-lg font-extrabold text-primary-foreground`}>
                  {i + 1}
                </span>
                <p className="text-lg text-card-foreground">{lt(s, lang)}</p>
              </div>
            ))}
          </Section>
        )}

        {result.tier !== "red" && condition.home.length > 0 && (
          <Section title={t("homeCare", lang)}>
            {condition.home.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft">
                <span className="text-2xl">🏠</span>
                <p className="text-lg text-card-foreground">{lt(s, lang)}</p>
              </div>
            ))}
          </Section>
        )}

        {showMeds && (
          <Section title={t("medicines", lang)}>
            {meds.map((m) => (
              <div key={m.id} className="rounded-2xl bg-card p-4 shadow-soft">
                <p className="text-lg font-extrabold text-card-foreground">💊 {lt(m.name, lang)}</p>
                <p className="mt-1 text-card-foreground">{lt(m.note, lang)}</p>
                <button
                  type="button"
                  onClick={() => setStoreMed(m.id)}
                  className="touch-target mt-3 w-full rounded-2xl bg-secondary px-4 font-bold text-secondary-foreground"
                >
                  {t("showAtStore", lang)}
                </button>
              </div>
            ))}
          </Section>
        )}

        {condition.dont.length > 0 && (
          <Section title={t("doNot", lang)}>
            {condition.dont.map((s, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft">
                <span className="text-2xl font-extrabold text-tier-red">✗</span>
                <p className="text-lg text-card-foreground">{lt(s, lang)}</p>
              </div>
            ))}
          </Section>
        )}

        {result.tier === "green" && watchFor.length > 0 && (
          <Section title={t("goToDoctorIf", lang)}>
            {watchFor.map((f) => (
              <div key={f.id} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-soft">
                <span className={f.tier === "red" ? "text-xl text-tier-red" : "text-xl text-tier-amber"}>⚠️</span>
                <p className="text-lg text-card-foreground">{lt(f.label, lang)}</p>
              </div>
            ))}
          </Section>
        )}

        <Section title={t("nearestHospitals", lang)}>
          {condition.id === "snakebite" && (
            <p className="rounded-2xl bg-tier-amber-soft p-3 font-bold text-foreground">
              {t("callFirstASV", lang)}
            </p>
          )}
          {condition.id === "dogbite" && (
            <p className="rounded-2xl bg-tier-amber-soft p-3 font-bold text-foreground">
              {t("callFirstARV", lang)}
            </p>
          )}
          {hospitals.slice(0, 3).map((f) => (
            <div key={f.name} className="rounded-2xl bg-card p-4 shadow-soft">
              <p className="font-extrabold text-card-foreground">{f.name}</p>
              <p className="text-sm text-muted-foreground">{f.type} · {f.taluka}</p>
              <div className="mt-2 flex gap-2">
                {f.phone && (
                  <a href={`tel:${f.phone}`} className="touch-target flex-1 rounded-xl bg-primary px-3 text-center font-bold text-primary-foreground">
                    {t("call", lang)}
                  </a>
                )}
                <a
                  href={directionsUrl(f)}
                  target="_blank"
                  rel="noreferrer"
                  className="touch-target flex-1 rounded-xl bg-secondary px-3 text-center font-bold text-secondary-foreground"
                >
                  {t("directions", lang)}
                </a>
              </div>
            </div>
          ))}
        </Section>

        <div className="flex gap-2">
          <BigButton variant="secondary" onClick={listenAll}>
            {t("listen", lang)}
          </BigButton>
          <BigButton variant="secondary" onClick={share}>
            <Share2 size={20} /> {t("shareWhatsApp", lang)}
          </BigButton>
        </div>

        <Link to="/" className="text-center font-bold text-primary underline">
          {t("startOver", lang)}
        </Link>

        <p className="rounded-2xl bg-card p-4 text-center text-sm text-muted-foreground">
          {lt(content.disclaimer, lang)}
        </p>
      </motion.main>

      {storeMed && content.medicines[storeMed] && (
        <div className="fixed inset-0 z-50 flex flex-col bg-card p-6" dir="ltr">
          <button
            type="button"
            aria-label={t("close", lang)}
            onClick={() => setStoreMed(null)}
            className="ms-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
          >
            <X size={28} />
          </button>
          <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
            <p className="font-urdu text-4xl font-extrabold leading-relaxed text-card-foreground">
              {content.medicines[storeMed]?.name.ur}
            </p>
            <p className="text-4xl font-extrabold text-card-foreground">
              {content.medicines[storeMed]?.name.en}
            </p>
          </div>
        </div>
      )}
    </Shell>
  );
}

const RANK: Record<Tier, number> = { green: 0, yellow: 1, red: 2 };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
