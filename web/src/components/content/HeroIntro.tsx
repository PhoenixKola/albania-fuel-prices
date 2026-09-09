import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import type { Lang } from "../../models/i18n";
import type { FuelType } from "../../models/fuel";
import type { TDict } from "../../locales";
import type { Currency } from "../../models/currency";
import type { FxRates } from "../../utils/currency";
import { fuelLabel } from "../../utils/fuel";
import { formatFuelPrice } from "../../utils/priceDisplay";

export type HomeHeroModel = {
  selectedPrice: number | null;
  country: string;
  fuelType: FuelType;
  rank: number | null;
  marketTotal: number;
  europeanAverage: number | null;
  averageDifference: number | null;
  weeklyDelta: number | null;
  updatedAt: string | null;
};

type HeroIntroProps = {
  t: TDict;
  lang: Lang;
  model: HomeHeroModel;
  currency: Currency;
  fxRates: FxRates | null;
};

function formatUpdatedAt(value: string | null, t: TDict, lang: Lang) {
  if (!value) return t.heroLiveFallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t.heroLiveFallback;

  return t.heroUpdatedAt(
    date.toLocaleString(lang === "sq" ? "sq-AL" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  );
}

function signed(value: number | null) {
  if (value == null || !Number.isFinite(value)) return null;
  if (Math.abs(value) < 0.0005) return "0.000";
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(3)}`;
}

export default function HeroIntro({
  t,
  lang,
  model,
  currency,
  fxRates,
}: HeroIntroProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const selectedPrice = formatFuelPrice(model.country, model.selectedPrice, currency, fxRates);
  const fuel = fuelLabel(t, model.fuelType);
  const rank = model.rank == null ? t.notAvailable : t.homeGaugeRankValue(model.rank, model.marketTotal);
  const averageValue = signed(model.averageDifference);
  const average = averageValue == null ? t.notAvailable : t.homeGaugeAverageValue(averageValue);
  const weeklyValue = signed(model.weeklyDelta);
  const week = weeklyValue == null ? t.notAvailable : weeklyValue === "0.000" ? t.homeGaugeWeekFlat : t.homeGaugeWeekValue(weeklyValue);
  const updated = formatUpdatedAt(model.updatedAt, t, lang);
  const gaugeProgress = model.rank && model.marketTotal > 1
    ? Math.max(10, Math.min(92, 100 - ((model.rank - 1) / (model.marketTotal - 1)) * 78))
    : 58;
  const sceneStyle = { "--gauge-progress": `${gaugeProgress}%` } as CSSProperties;

  useEffect(() => () => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = sceneRef.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      element.style.setProperty("--scene-rx", `${(0.5 - y) * 8}deg`);
      element.style.setProperty("--scene-ry", `${(x - 0.5) * 10}deg`);
      element.style.setProperty("--light-x", `${x * 100}%`);
      element.style.setProperty("--light-y", `${y * 100}%`);
    });
  };

  const resetPointer = () => {
    const element = sceneRef.current;
    if (!element) return;
    element.style.setProperty("--scene-rx", "0deg");
    element.style.setProperty("--scene-ry", "0deg");
    element.style.setProperty("--light-x", "50%");
    element.style.setProperty("--light-y", "42%");
  };

  return (
    <section className="homeCockpitHero" aria-labelledby="home-hero-title">
      <div className="homeHeroGrid">
        <div className="homeHeroCopy">
          <div className="homeEyebrow homeHeroEyebrow">
            <span className="homeLiveDot" aria-hidden="true" />
            {t.homeCockpitKicker}
          </div>
          <h1 id="home-hero-title" className="homeHeroTitle">{t.homeCockpitTitle}</h1>
          <p className="homeHeroText">{t.homeCockpitSubtitle}</p>
          <div className="homeHeroActions">
            <a className="homeButton homeButtonPrimary" href="#price-tool">{t.homeCockpitPrimaryCta}</a>
            <Link className="homeButton homeButtonGhost" to="/stations">{t.homeCockpitSecondaryCta}</Link>
          </div>
          <nav className="homeHeroQuickLinks" aria-label={t.homeQuickLinksLabel}>
            <Link to="/fuel-prices/albania">{t.homeAlbaniaPricesCta}</Link>
            <Link to="/trip-cost-calculator">{t.homeTripCalculatorCta}</Link>
            <Link to="/rankings">{t.homeEuropeRankingsCta}</Link>
          </nav>
          <div className="homeTrustRail" aria-label={updated}>
            <span><i aria-hidden="true" />{t.heroShowcaseTrust1}</span>
            <span><i aria-hidden="true" />{t.heroShowcaseTrust2}</span>
            <span><i aria-hidden="true" />{updated}</span>
          </div>
        </div>

        <div
          ref={sceneRef}
          className="homeCockpitScene"
          style={sceneStyle}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          role="img"
          aria-label={t.homeGaugeA11y(model.country, fuel, selectedPrice, rank, average, week)}
        >
          <div className="homeCockpitGlow" aria-hidden="true" />
          <div className="homeClusterShell">
            <div className="homeClusterTopline">
              <span><b aria-hidden="true" />{t.homeLiveStatus}</span>
              <span>{updated}</span>
            </div>
            <div className="homeGauge" aria-hidden="true">
              <div className="homeGaugeTicks" />
              <div className="homeGaugeCore">
                <span className="homeGaugeLabel">{t.homeGaugePriceLabel}</span>
                <strong className="homeGaugePrice">{model.selectedPrice == null ? "—" : selectedPrice}</strong>
                <span className="homeGaugeUnit">{model.country} <i>·</i> {fuel}</span>
              </div>
            </div>
            <div className="homeClusterStats">
              <div>
                <span>{t.homeGaugeRank}</span>
                <strong>{rank}</strong>
              </div>
              <div>
                <span>{t.homeGaugeAverage}</span>
                <strong className={model.averageDifference != null && model.averageDifference <= 0 ? "isGood" : "isWarm"}>{average}</strong>
              </div>
              <div>
                <span>{t.homeGaugeWeek}</span>
                <strong className={model.weeklyDelta != null && model.weeklyDelta <= 0 ? "isGood" : "isWarm"}>{week}</strong>
              </div>
            </div>
            <div className="homeClusterReflection" aria-hidden="true" />
          </div>
          <span className="homeOrbitLabel homeOrbitLabelTop" aria-hidden="true">{String(model.marketTotal).padStart(2, "0")} / EU</span>
          <span className="homeOrbitLabel homeOrbitLabelBottom" aria-hidden="true">EUR · LITER · LIVE</span>
        </div>
      </div>
    </section>
  );
}
