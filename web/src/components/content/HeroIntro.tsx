import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroDark from "../../assets/journey-hero-dark.webp";
import heroLight from "../../assets/journey-hero-light.webp";
import type { Lang } from "../../models/i18n";
import { FUEL_TYPES, type CountryPrices, type FuelType, type LatestEurope } from "../../models/fuel";
import type { TDict } from "../../locales";
import type { Currency } from "../../models/currency";
import type { FxRates } from "../../utils/currency";
import { fuelLabel, getEurPrice } from "../../utils/fuel";
import { formatFuelPrice } from "../../utils/priceDisplay";
import { getFlagImgUrl, getIso2ForCountry } from "../../utils/countryFlag";
import { claimHomeIntro, settleHomeIntro } from "../../utils/homeIntro";
import TripSelect from "./TripSelect";

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

export type HomeFreshness = {
  state: "current" | "stale" | "unknown";
  shortLabel: string;
  detail: string;
};

type HeroIntroProps = {
  t: TDict;
  lang: Lang;
  model: HomeHeroModel;
  data: LatestEurope | null;
  selected: CountryPrices | null;
  countries: string[];
  currency: Currency;
  fxRates: FxRates | null;
  freshness: HomeFreshness;
  onSelectCountry: (country: string) => void;
  onSelectFuel: (fuel: FuelType) => void;
};

const copy = {
  en: {
    board: "Live roadside price board",
    national: "National reference prices",
    dated: "Price date",
    source: "Source",
    scope: "Country-level reference prices. Individual stations may differ.",
    selectMarket: "Destination market",
    selected: "Selected",
    marketPosition: "Europe rank",
    versusAverage: "vs Europe",
    week: "7-day move",
    sourceStep: "Fuel",
    routeStep: "Journey",
    destinationStep: "Market",
    titleLines: ["Know the fuel cost", "before the road starts."],
  },
  sq: {
    board: "Tabela e drejtpërdrejtë e çmimeve",
    national: "Çmime orientuese kombëtare",
    dated: "Data e çmimit",
    source: "Burimi",
    scope: "Çmime orientuese kombëtare. Çmimet në stacione të veçanta mund të ndryshojnë.",
    selectMarket: "Tregu i destinacionit",
    selected: "Zgjedhur",
    marketPosition: "Renditja në Evropë",
    versusAverage: "kundrejt Evropës",
    week: "Lëvizja 7-ditore",
    sourceStep: "Karburanti",
    routeStep: "Udhëtimi",
    destinationStep: "Tregu",
    titleLines: ["Njihe koston e karburantit", "para se të nisë rruga."],
  },
} as const;

function formatDate(value: string | undefined, lang: Lang, fallback: string) {
  if (!value) return fallback;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString(lang === "sq" ? "sq-AL" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function signed(value: number | null) {
  if (value == null || !Number.isFinite(value)) return null;
  if (Math.abs(value) < 0.0005) return "0.000";
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(3)}`;
}

function useDocumentTheme() {
  const read = () => (typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark");
  const [theme, setTheme] = useState<"dark" | "light">(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

export default function HeroIntro({
  t, lang, model, data, selected, countries, currency, fxRates, freshness, onSelectCountry, onSelectFuel,
}: HeroIntroProps) {
  const c = copy[lang];
  const theme = useDocumentTheme();
  const [playIntro] = useState(claimHomeIntro);
  const [introComplete, setIntroComplete] = useState(!playIntro);
  const [readyTheme, setReadyTheme] = useState<"dark" | "light" | null>(null);
  const iso2 = getIso2ForCountry(model.country);
  const average = signed(model.averageDifference);
  const week = signed(model.weeklyDelta);
  const date = formatDate(data?.as_of, lang, t.notAvailable);
  const valueKey = `${model.country}|${model.fuelType}`;

  const heroReady = readyTheme === theme;
  const introRunning = playIntro && heroReady && !introComplete;

  useEffect(() => {
    if (!introRunning) return;
    const timer = window.setTimeout(() => {
      setIntroComplete(true);
      settleHomeIntro();
    }, 2380);
    return () => window.clearTimeout(timer);
  }, [introRunning]);

  useEffect(() => {
    return () => {
      // Strict Mode performs a development-only setup/cleanup cycle. Defer the
      // route-unmount check so that cycle does not settle the navbar early.
      window.requestAnimationFrame(() => {
        if (!document.querySelector(".homeJourneyHero")) settleHomeIntro();
      });
    };
  }, []);

  const heroImage = theme === "light" ? heroLight : heroDark;
  const markHeroReady = () => {
    const loadedTheme = theme;
    window.requestAnimationFrame(() => setReadyTheme(loadedTheme));
  };

  return (
    <section className={`homeJourneyHero${heroReady ? " is-intro-ready" : ""}${introRunning ? " is-intro-running" : ""}`} aria-labelledby="home-hero-title">
      <div className="homeHeroArt" aria-hidden="true">
        <img
          key={theme}
          className="homeHeroArtImage"
          src={heroImage}
          alt=""
          fetchPriority="high"
          decoding="async"
          onLoad={markHeroReady}
          onError={markHeroReady}
        />
        {introRunning ? (
          <>
            <span className="homeHeroNozzleLayer"><img src={heroImage} alt="" /></span>
            <span className="homeHeroRoadLayer"><img src={heroImage} alt="" /></span>
            <span className="homeHeroFuelTrail"><i /></span>
          </>
        ) : null}
      </div>

      <div className="homeJourneyGrid">
        <div className="homeHeroCopy">
          <div className="homeEyebrow homeHeroEyebrow">
            <span className={`homeStatusDot homeStatusDot-${freshness.state}`} aria-hidden="true" />
            {t.homeCockpitKicker}
          </div>
          <h1 id="home-hero-title" className="homeHeroTitle" aria-label={t.homeCockpitTitle}>
            {c.titleLines.map((line) => <span key={line} aria-hidden="true">{line}</span>)}
          </h1>
          <p className="homeHeroText">{t.homeCockpitSubtitle}</p>
          <div className="homeHeroActions">
            <Link className="homeButton homeButtonPrimary" to="/trip-cost-calculator">{t.homeCockpitPrimaryCta}<span aria-hidden="true">↗</span></Link>
            <Link className="homeButton homeButtonGhost" to="/stations">{t.homeCockpitSecondaryCta}<span aria-hidden="true">→</span></Link>
          </div>
          <nav className="homeHeroQuickLinks" aria-label={t.homeQuickLinksLabel}>
            <a href="#price-tool">{t.homeAlbaniaPricesCta}</a>
            <Link to="/compare">{t.navCompare}</Link>
            <Link to="/rankings">{t.homeEuropeRankingsCta}</Link>
          </nav>
          <div className="homeJourneySequence" aria-hidden="true">
            <span>{c.sourceStep}</span><i /><span>{c.routeStep}</span><i /><span>{c.destinationStep}</span>
          </div>
          <p className="homeHeroScope">{c.scope}</p>
        </div>

        <div className="homeHeroBoardDock">
          <div className="homeRoadBoard" aria-label={`${model.country} ${c.board}`}>
            <div className="homeRoadBoardHeader">
              <div>
                <span className="homeBoardEyebrow">{c.board}</span>
                <strong key={model.country} className="homeBoardResolve">{iso2 ? <img src={getFlagImgUrl(iso2)} alt="" aria-hidden="true" /> : null}{model.country}</strong>
              </div>
              <span className={`homeFreshnessBadge homeFreshnessBadge-${freshness.state}`}>{freshness.shortLabel}</span>
            </div>
            <div className="homeBoardCountrySelect">
              <TripSelect label={c.selectMarket} value={model.country} options={countries.map((country) => ({ value: country, label: country }))} onChange={onSelectCountry} />
            </div>
            <div className="homeBoardPrices" aria-label={c.national}>
              {FUEL_TYPES.map((fuel) => {
                const value = getEurPrice(selected, fuel);
                const active = fuel === model.fuelType;
                return (
                  <button key={fuel} type="button" className={`homeBoardPrice${active ? " is-selected" : ""}`} aria-pressed={active} onClick={() => onSelectFuel(fuel)}>
                    <span><i aria-hidden="true" />{fuelLabel(t, fuel)}{active ? <small>{c.selected}</small> : null}</span>
                    <strong key={`${model.country}|${fuel}`} className="homeBoardResolve">{value == null ? "—" : formatFuelPrice(model.country, value, currency, fxRates)}</strong>
                  </button>
                );
              })}
            </div>
            <dl className="homeBoardSignals">
              <div><dt>{c.marketPosition}</dt><dd key={valueKey} className="homeBoardResolve">{model.rank == null ? t.notAvailable : t.homeGaugeRankValue(model.rank, model.marketTotal)}</dd></div>
              <div><dt>{c.versusAverage}</dt><dd key={valueKey} className={`homeBoardResolve ${model.averageDifference != null && model.averageDifference <= 0 ? "is-good" : "is-warm"}`}>{average == null ? t.notAvailable : `${average} EUR/L`}</dd></div>
              <div><dt>{c.week}</dt><dd key={valueKey} className={`homeBoardResolve ${model.weeklyDelta != null && model.weeklyDelta <= 0 ? "is-good" : "is-warm"}`}>{week == null ? t.notAvailable : week === "0.000" ? t.homeGaugeWeekFlat : `${week} EUR/L`}</dd></div>
            </dl>
            <div className="homeBoardProvenance">
              <span><b>{c.dated}</b>{date}</span>
              <span><b>{c.source}</b>{data?.source_url ? <a href={data.source_url} target="_blank" rel="noopener noreferrer">{data.source ?? t.notAvailable} ↗</a> : data?.source ?? t.notAvailable}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
