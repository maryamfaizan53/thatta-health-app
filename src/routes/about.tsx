import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { content } from "@/lib/content";
import { lt, t, useApp, useLang } from "@/lib/i18n";
import {
  AjrakStrip,
  BigButton,
  BottomNav,
  EmergencyStrip,
  Shell,
} from "@/components/chrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Sehat Saathi" },
      {
        name: "description",
        content:
          "How Sehat Saathi works: doctor-reviewed rules, offline-first, in Sindhi, Urdu and English.",
      },
      { property: "og:title", content: "About — Sehat Saathi" },
      {
        property: "og:description",
        content:
          "How Sehat Saathi works: doctor-reviewed rules, offline-first, in Sindhi, Urdu and English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const lang = useLang();
  const { dark, toggleDark, setLang, setTaluka } = useApp();
  const navigate = useNavigate();

  return (
    <Shell>
      <EmergencyStrip />
      <AjrakStrip />
      <main className="flex flex-1 flex-col gap-5 p-5 pb-8">
        <h1 className="text-center text-3xl font-extrabold text-primary">
          Sehat Saathi · صحت ساٿي
        </h1>

        <section className="rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="mb-3 text-xl font-extrabold text-card-foreground">
            {t("howItWorks", lang)}
          </h2>
          <ol className="flex flex-col gap-3">
            {(["step1", "step2", "step3"] as const).map((k, i) => (
              <li key={k} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-lg text-card-foreground">{t(k, lang)}</p>
              </li>
            ))}
          </ol>
        </section>

        {content.reviewed_by && (
          <p className="rounded-3xl bg-card p-4 text-center font-bold text-card-foreground shadow-soft">
            {t("reviewedBy", lang)}: {content.reviewed_by}
          </p>
        )}

        <section className="rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="mb-2 text-xl font-extrabold text-card-foreground">
            {t("sources", lang)}
          </h2>
          <ul className="list-disc ps-6 text-card-foreground">
            <li>WHO / Sindh Health Department first-aid guidance</li>
            <li>Icons: Microsoft Fluent Emoji (MIT)</li>
            <li>Fonts: Nunito, Noto Nastaliq Urdu, Noto Naskh Arabic (OFL)</li>
            <li>Emergency services: Sindh 1122 (ambulance), 1123 (doctor advice)</li>
          </ul>
        </section>

        <p className="rounded-3xl bg-card p-4 text-sm text-muted-foreground shadow-soft">
          {lt(content.disclaimer, lang)}
        </p>

        <div className="flex items-center justify-between rounded-3xl bg-card p-4 shadow-soft">
          <span className="text-lg font-bold text-card-foreground">
            {t("darkMode", lang)}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            onClick={toggleDark}
            className={`relative h-9 w-16 rounded-full transition-colors ${dark ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-1 h-7 w-7 rounded-full bg-card transition-all ${dark ? "start-8" : "start-1"}`}
            />
          </button>
        </div>

        <BigButton
          variant="secondary"
          onClick={() => {
            setLang(null as never);
            navigate({ to: "/" });
          }}
        >
          {t("changeLanguage", lang)}
        </BigButton>
        <BigButton
          variant="secondary"
          onClick={() => {
            setTaluka(null as never);
            navigate({ to: "/" });
          }}
        >
          {t("changeArea", lang)}
        </BigButton>
      </main>
      <BottomNav />
    </Shell>
  );
}
