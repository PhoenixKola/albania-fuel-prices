import type { Lang } from "../../models/i18n";
import type { TDict } from "../../locales";

type HeroIntroProps = {
  t: TDict;
  lang: Lang;
  updatedAt?: string | Date | null;
};

function formatUpdatedAt(value: string | Date | null | undefined, t: TDict, lang: Lang) {
  if (!value) return t.heroLiveFallback;

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return t.heroLiveFallback;

  const locale = lang === "sq" ? "sq-AL" : "en-GB";
  return t.heroUpdatedAt(
    date.toLocaleString(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    })
  );
}

export default function HeroIntro({ t, lang, updatedAt }: HeroIntroProps) {
  return (
    <section className="contentHero">
      <div className="contentHeroBadge">{formatUpdatedAt(updatedAt, t, lang)}</div>
      <h1 className="contentHeroTitle">{t.heroTitle}</h1>
      <p className="contentHeroText">{t.heroSubtitle}</p>
    </section>
  );
}