import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { facilitiesFor, directionsUrl } from "@/lib/facilities";
import { TALUKAS, t, useApp, useLang, type Taluka } from "@/lib/i18n";
import { BottomNav, EmergencyStrip, Shell } from "@/components/chrome";

export const Route = createFileRoute("/hospitals")({
  head: () => ({
    meta: [
      { title: "Hospitals near you — Sehat Saathi" },
      {
        name: "description",
        content:
          "DHQ, RHC and BHU hospitals in Thatta, Mirpur Sakro, Ghorabari and Keti Bandar with directions.",
      },
      { property: "og:title", content: "Hospitals near you — Sehat Saathi" },
      {
        property: "og:description",
        content:
          "DHQ, RHC and BHU hospitals in Thatta, Mirpur Sakro, Ghorabari and Keti Bandar with directions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HospitalsPage,
});

function HospitalsPage() {
  const lang = useLang();
  const { taluka, setTaluka } = useApp();
  const list = facilitiesFor(taluka ?? "Thatta");

  return (
    <Shell>
      <EmergencyStrip />
      <main className="flex flex-1 flex-col gap-4 p-5 pb-8">
        <h1 className="text-2xl font-extrabold text-foreground">{t("hospitals", lang)}</h1>

        <div className="flex flex-wrap gap-2">
          {TALUKAS.map((ta) => (
            <button
              key={ta}
              type="button"
              onClick={() => setTaluka(ta as Taluka)}
              className={`min-h-[44px] rounded-full px-4 text-sm font-bold ${
                (taluka ?? "Thatta") === ta
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground shadow-soft"
              }`}
            >
              {ta}
            </button>
          ))}
        </div>

        {list.map((f) => (
          <div key={f.name} className="rounded-3xl bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <p className="text-lg font-extrabold text-card-foreground">{f.name}</p>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-extrabold ${
                  f.type === "DHQ"
                    ? "bg-accent text-accent-foreground"
                    : f.type === "RHC"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                }`}
              >
                {f.type}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {f.taluka} · {f.managed_by}
            </p>
            {f.has_asv === null && (
              <p className="mt-2 rounded-xl bg-tier-amber-soft p-2 text-sm font-bold text-foreground">
                🐍 {t("asvNotVerified", lang)}
              </p>
            )}
            {f.has_arv === null && (
              <p className="mt-2 rounded-xl bg-tier-amber-soft p-2 text-sm font-bold text-foreground">
                🐶 {t("arvNotVerified", lang)}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              {f.phone && (
                <a
                  href={`tel:${f.phone}`}
                  className="touch-target flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-3 font-bold text-primary-foreground"
                >
                  <Phone size={18} /> {t("call", lang)}
                </a>
              )}
              <a
                href={directionsUrl(f)}
                target="_blank"
                rel="noreferrer"
                className="touch-target flex flex-1 items-center justify-center gap-2 rounded-2xl bg-secondary px-3 font-bold text-secondary-foreground"
              >
                <MapPin size={18} /> {t("directions", lang)}
              </a>
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </Shell>
  );
}
