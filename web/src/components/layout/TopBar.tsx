import type { Lang } from "../../models/i18n";
import type { Theme } from "../../models/theme";
import type { TDict } from "../../locales";

type Props = {
  t: TDict;
  logoSrc: string;
  subtitle: string;
  lang: Lang;
  theme: Theme;
  refreshing: boolean;
  onRefresh: () => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
};

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12Zm0-14.5a1 1 0 0 1 1 1V6a1 1 0 1 1-2 0V4.5a1 1 0 0 1 1-1Zm0 16a1 1 0 0 1 1 1V22a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM3.5 11a1 1 0 0 1 1-1H6a1 1 0 1 1 0 2H4.5a1 1 0 0 1-1-1Zm16 0a1 1 0 0 1 1-1H22a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM6.05 5.64a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41L6.05 7.05a1 1 0 0 1 0-1.41Zm10.78 10.78a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41ZM18.36 5.64a1 1 0 0 1 0 1.41L17.3 8.11a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0ZM8.11 15.89a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 14.6A8.9 8.9 0 0 1 9.4 3a1 1 0 0 0-1.1 1.4A10 10 0 1 0 20.6 15.7a1 1 0 0 0 .4-1.1Z"
      />
    </svg>
  );
}

export default function TopBar({
  t,
  logoSrc,
  subtitle,
  lang,
  theme,
  refreshing,
  onRefresh,
  onToggleLang,
  onToggleTheme,
}: Props) {
  return (
    <div className="topbar">
      <div className="brand">
        <img className="logoImg" src={logoSrc} alt="" aria-hidden="true" />
        <div className="hgroup">
          <h1 className="h1">{t.title}</h1>
          <p className="sub">{subtitle}</p>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? t.refreshing : t.refresh}
        </button>

        <button className="btn btn-ghost" onClick={onToggleTheme} aria-label="Toggle theme" title="Toggle theme">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <button className="btn btn-ghost" onClick={onToggleLang}>
          {lang === "en" ? t.langSQ : t.langEN}
        </button>
      </div>
    </div>
  );
}