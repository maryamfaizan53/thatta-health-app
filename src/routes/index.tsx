import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mic, Phone, X } from "lucide-react";
import { content } from "@/lib/content";
import {
  LANGS,
  TALUKAS,
  speak,
  t,
  useApp,
  useLang,
  type Lang,
  type Taluka,
} from "@/lib/i18n";
import { lt } from "@/lib/i18n";
import { impactToday } from "@/lib/triage";
import {
  AjrakStrip,
  BigButton,
  BottomNav,
  EmergencyStrip,
  EmojiIcon,
  Shell,
  SpeakerButton,
} from "@/components/chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sehat Saathi — صحت ساٿي | First-aid guide for Thatta" },
      {
        name: "description",
        content:
          "Free first-aid and triage guide for Thatta district, Sindh. Sindhi, Urdu and English. Connects you to 1122 ambulance and 1123 free doctor advice.",
      },
      { property: "og:title", content: "Sehat Saathi — صحت ساٿي" },
      {
        property: "og:description",
        content:
          "Free first-aid and triage guide for Thatta district, Sindh. Works offline, in Sindhi, Urdu and English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { lang, taluka, ready } = useApp();
  if (!ready) {
    return (
      <Shell>
        <AjrakStrip />
        <div className="flex flex-1 flex-col gap-4 p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      </Shell>
    );
  }
  if (!lang) return <LanguageScreen />;
  if (!taluka) return <AreaScreen />;
  return <Home />;
}

function LanguageScreen() {
  const { setLang } = useApp();
  return (
    <Shell>
      <AjrakStrip />
      <div className="flex flex-1 flex-col justify-center gap-4 p-6">
        <h1 className="mb-4 text-center text-3xl font-extrabold text-primary">
          Sehat Saathi · صحت ساٿي
        </h1>
        {LANGS.map((l) => (
          <div key={l.id} className="flex items-center gap-2">
            <BigButton onClick={() => setLang(l.id as Lang)} className="py-6 text-2xl">
              {l.name}
            </BigButton>
            <SpeakerButton text={l.name} className="h-14 w-14" />
          </div>
        ))}
      </div>
      <AjrakStrip />
    </Shell>
  );
}

function AreaScreen() {
  const { setTaluka } = useApp();
  const lang = useLang();
  return (
    <Shell>
      <AjrakStrip />
      <div className="flex flex-1 flex-col justify-center gap-4 p-6">
        <h1 className="mb-4 text-center text-2xl font-extrabold text-foreground">
          {t("chooseArea", lang)}
        </h1>
        {TALUKAS.map((ta) => (
          <BigButton key={ta} onClick={() => setTaluka(ta as Taluka)} className="py-6 text-xl">
            {ta}
          </BigButton>
        ))}
      </div>
    </Shell>
  );
}

function Home() {
  const lang = useLang();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [textBox, setTextBox] = useState(false);
  const [query, setQuery] = useState("");
  const impact = useMemo(() => impactToday(), []);

  const match = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;
    return (
      content.conditions.find(
        (c) =>
          c.keywords.some((k) => q.includes(k)) ||
          c.label.en.toLowerCase().includes(q) ||
          c.label.ur.includes(query.trim()) ||
          c.label.sd.includes(query.trim()),
      ) ?? null
    );
  }, [query]);

  return (
    <Shell>
      <EmergencyStrip />
      <AjrakStrip />
      <main className="flex flex-1 flex-col gap-5 p-5">
        <h1 className="text-center text-2xl font-extrabold text-foreground">
          {t("greeting", lang)}
        </h1>

        <button
          type="button"
          onClick={() => setTextBox(true)}
          className="mx-auto flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-full bg-primary text-primary-foreground shadow-soft transition-transform active:scale-95"
        >
          <Mic size={44} />
          <span className="px-4 text-center text-sm font-bold leading-tight">
            {t("micPrompt", lang)}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          {content.conditions.map((c, i) => (
            <motion.div
              key={c.id}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduce ? 0 : i * 0.04 }}
            >
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/triage/$condition",
                    params: { condition: c.id },
                    search: c.base_tier === "red" ? { direct: true } : {},
                  })
                }
                className={`flex min-h-[120px] w-full flex-col items-center justify-center gap-1 rounded-3xl bg-card p-3 shadow-soft transition-transform active:scale-95 ${
                  c.base_tier === "red" ? "ring-2 ring-tier-red" : ""
                }`}
              >
                <EmojiIcon icon={c.icon} emoji={c.emoji} size={52} />
                <span className="text-base font-bold leading-snug text-card-foreground">
                  {lt(c.label, lang)}
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={t("listen", lang)}
                  className="rounded-full p-1 text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(lt(c.label, lang), lang);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      speak(lt(c.label, lang), lang);
                    }
                  }}
                >
                  🔊
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        <a
          href="tel:1123"
          className="touch-target flex items-center justify-center gap-2 rounded-3xl bg-card p-4 text-lg font-bold text-primary shadow-soft"
        >
          <Phone size={22} />
          {t("doctorAdvice", lang)}
        </a>

        {impact > 0 && (
          <p className="text-center text-sm font-semibold text-muted-foreground">
            {t("impactToday", lang, { n: impact })}
          </p>
        )}
      </main>
      <BottomNav />

      {textBox && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40">
          <div className="w-full max-w-[480px] rounded-t-3xl bg-card p-5 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-card-foreground">
                {t("micPrompt", lang)}
              </h2>
              <button
                type="button"
                aria-label={t("close", lang)}
                onClick={() => setTextBox(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
              >
                <X size={22} />
              </button>
            </div>
            <textarea
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("typeProblem", lang)}
              rows={3}
              className="w-full rounded-2xl border-2 border-input bg-background p-4 text-lg text-foreground"
            />
            {match && (
              <BigButton
                className="mt-3"
                onClick={() => {
                  setTextBox(false);
                  navigate({
                    to: "/triage/$condition",
                    params: { condition: match.id },
                    search: match.base_tier === "red" ? { direct: true } : {},
                  });
                }}
              >
                <EmojiIcon icon={match.icon} emoji={match.emoji} size={28} />
                {lt(match.label, lang)}
              </BigButton>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}
