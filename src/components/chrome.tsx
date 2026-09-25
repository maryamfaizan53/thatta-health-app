import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Hospital, Info, Phone, Volume2 } from "lucide-react";
import { speak, stopSpeak, t, ui, useApp, useLang, type L, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Thin ajrak-pattern strip. Use only in header, splash and empty states. */
export function AjrakStrip() {
  return <div className="ajrak-strip w-full" aria-hidden="true" />;
}

/** Sticky red emergency strip at the top of every screen. */
export function EmergencyStrip() {
  const lang = useLang();
  return (
    <a
      href="tel:1122"
      className="sticky top-0 z-40 flex min-h-[48px] items-center justify-center gap-2 bg-tier-red px-4 text-center text-sm font-bold text-primary-foreground"
    >
      {t("emergencyStrip", lang)}
    </a>
  );
}

export function SpeakerButton({
  text,
  className,
  size = 22,
}: {
  text: string;
  className?: string;
  size?: number;
}) {
  const lang = useLang();
  return (
    <button
      type="button"
      aria-label={t("listen", lang)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        speak(text, lang);
      }}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      <Volume2 size={size} />
    </button>
  );
}

/** Fluent Emoji 3D image with native emoji fallback. */
export function EmojiIcon({
  icon,
  emoji,
  size = 56,
  className,
}: {
  icon: string;
  emoji: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span style={{ fontSize: size * 0.8, lineHeight: 1 }} role="img" className={className}>
        {emoji}
      </span>
    );
  }
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/${icon}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

const NAV = [
  { to: "/", key: "home", icon: Home },
  { to: "/hospitals", key: "hospitals", icon: Hospital },
  { to: "/about", key: "about", icon: Info },
] as const;

export function BottomNav() {
  const lang = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-card">
      <div className="mx-auto flex max-w-[480px]">
        {NAV.map(({ to, key, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-bold",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon size={24} />
              {t(key, lang)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Centered 480px column shell used by all screens. */
export function Shell({ children }: { children: ReactNode }) {
  const { lang } = useApp();
  const rtl = lang === "ur" || lang === "sd";
  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={cn(
        "mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background",
        rtl && (lang === "ur" ? "font-urdu" : "font-sindhi"),
      )}
    >
      {children}
    </div>
  );
}

export function BigButton({
  children,
  onClick,
  variant = "primary",
  className,
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "crimson" | "tier-red";
  className?: string;
  href?: string;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-card text-card-foreground border-2 border-border",
    crimson: "bg-accent text-accent-foreground",
    "tier-red": "bg-tier-red text-primary-foreground",
  }[variant];
  const cls = cn(
    "touch-target flex w-full items-center justify-center gap-3 rounded-2xl px-5 text-lg font-bold shadow-soft transition-transform active:scale-[0.98]",
    styles,
    className,
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function CallButton({
  number,
  label,
  pulse = false,
  big = false,
}: {
  number: string;
  label: string;
  pulse?: boolean;
  big?: boolean;
}) {
  return (
    <a
      href={`tel:${number}`}
      className={cn(
        "touch-target flex w-full items-center justify-center gap-3 rounded-2xl bg-tier-red px-5 font-bold text-primary-foreground shadow-soft",
        big ? "py-5 text-2xl" : "text-lg",
        pulse && "animate-pulse-gentle",
      )}
    >
      <Phone size={big ? 30 : 22} />
      {label}
    </a>
  );
}

export function lt(l: L | undefined, lang: Lang) {
  if (!l) return "";
  return l[lang] ?? l.en;
}

export { stopSpeak, ui };
