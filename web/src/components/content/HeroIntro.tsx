import { Link } from "react-router-dom";
import type { Lang } from "../../models/i18n";
import { FUEL_TYPES, type CountryPrices, type FuelType, type LatestEurope } from "../../models/fuel";
import type { TDict } from "../../locales";
import type { Currency } from "../../models/currency";
import type { FxRates } from "../../utils/currency";
import { fuelLabel, getEurPrice } from "../../utils/fuel";
import { formatFuelPrice } from "../../utils/priceDisplay";
import { getFlagImgUrl, getIso2ForCountry } from "../../utils/countryFlag";
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
    board: "Roadside price board",
    national: "National reference",
    dated: "Prices dated",
    source: "Source",
    scope: "Country-level reference values. Individual pump prices vary.",
    selectMarket: "Choose market",
    selected: "Selected",
    marketPosition: "European position",
    versusAverage: "vs Europe average",
    week: "7-day movement",
    routeLabel: "Journey starts here",
  },
  sq: {
    board: "Tabela e çmimeve në rrugë",
    national: "Vlerë orientuese kombëtare",
    dated: "Çmimet më",
    source: "Burimi",
    scope: "Vlera orientuese kombëtare. Çmimet në pompa të veçanta ndryshojnë.",
    selectMarket: "Zgjidh tregun",
    selected: "Zgjedhur",
    marketPosition: "Pozicioni në Evropë",
    versusAverage: "kundrejt mesatares evropiane",
    week: "Lëvizja 7-ditore",
    routeLabel: "Udhëtimi nis këtu",
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

export default function HeroIntro({
  t,
  lang,
  model,
  data,
  selected,
  countries,
  currency,
  fxRates,
  freshness,
  onSelectCountry,
  onSelectFuel,
}: HeroIntroProps) {
  const c = copy[lang];
  const iso2 = getIso2ForCountry(model.country);
  const average = signed(model.averageDifference);
  const week = signed(model.weeklyDelta);
  const date = formatDate(data?.as_of, lang, t.notAvailable);

  return (
    <section className="homeJourneyHero" aria-labelledby="home-hero-title">
      <div className="homeJourneyGrid">
        <div className="homeHeroCopy">
          <div className="homeEyebrow homeHeroEyebrow">
            <span className={`homeStatusDot homeStatusDot-${freshness.state}`} aria-hidden="true" />
            {t.homeCockpitKicker}
          </div>
          <h1 id="home-hero-title" className="homeHeroTitle">{t.homeCockpitTitle}</h1>
          <p className="homeHeroText">{t.homeCockpitSubtitle}</p>
          <div className="homeHeroActions">
            <Link className="homeButton homeButtonPrimary" to="/trip-cost-calculator">
              {t.homeCockpitPrimaryCta}<span aria-hidden="true">↗</span>
            </Link>
            <Link className="homeButton homeButtonGhost" to="/stations">
              {t.homeCockpitSecondaryCta}<span aria-hidden="true">→</span>
            </Link>
          </div>
          <nav className="homeHeroQuickLinks" aria-label={t.homeQuickLinksLabel}>
            <a href="#price-tool">{t.homeAlbaniaPricesCta}</a>
            <Link to="/compare">{t.navCompare}</Link>
            <Link to="/rankings">{t.homeEuropeRankingsCta}</Link>
          </nav>
          <p className="homeHeroScope">{c.scope}</p>
        </div>

        <div className="homeRoadBoard" aria-label={`${model.country} ${c.board}`}>
          <div className="homeRoadBoardRoute" aria-hidden="true">
            <span>AL</span><i /><small>{c.routeLabel}</small>
          </div>

          <div className="homeRoadBoardHeader">
            <div>
              <span className="homeBoardEyebrow">{c.board}</span>
              <strong>{iso2 ? <img src={getFlagImgUrl(iso2)} alt="" aria-hidden="true" /> : null}{model.country}</strong>
            </div>
            <span className={`homeFreshnessBadge homeFreshnessBadge-${freshness.state}`}>{freshness.shortLabel}</span>
          </div>

          <div className="homeBoardCountrySelect">
            <TripSelect
              label={c.selectMarket}
              value={model.country}
              options={countries.map((country) => ({ value: country, label: country }))}
              onChange={onSelectCountry}
            />
          </div>

          <div className="homeBoardPrices" aria-label={c.national}>
            {FUEL_TYPES.map((fuel) => {
              const value = getEurPrice(selected, fuel);
              const active = fuel === model.fuelType;
              return (
                <button
                  key={fuel}
                  type="button"
                  className={`homeBoardPrice${active ? " is-selected" : ""}`}
                  aria-pressed={active}
                  onClick={() => onSelectFuel(fuel)}
                >
                  <span><i aria-hidden="true" />{fuelLabel(t, fuel)}{active ? <small>{c.selected}</small> : null}</span>
                  <strong>{value == null ? "—" : formatFuelPrice(model.country, value, currency, fxRates)}</strong>
                </button>
              );
            })}
          </div>

          <dl className="homeBoardSignals">
            <div><dt>{c.marketPosition}</dt><dd>{model.rank == null ? t.notAvailable : t.homeGaugeRankValue(model.rank, model.marketTotal)}</dd></div>
            <div><dt>{c.versusAverage}</dt><dd className={model.averageDifference != null && model.averageDifference <= 0 ? "is-good" : "is-warm"}>{average == null ? t.notAvailable : `${average} EUR/L`}</dd></div>
            <div><dt>{c.week}</dt><dd className={model.weeklyDelta != null && model.weeklyDelta <= 0 ? "is-good" : "is-warm"}>{week == null ? t.notAvailable : week === "0.000" ? t.homeGaugeWeekFlat : `${week} EUR/L`}</dd></div>
          </dl>

          <div className="homeBoardProvenance">
            <span><b>{c.dated}</b>{date}</span>
            <span><b>{c.source}</b>{data?.source_url ? <a href={data.source_url} target="_blank" rel="noopener noreferrer">{data.source ?? t.notAvailable} ↗</a> : data?.source ?? t.notAvailable}</span>
          </div>
        </div>
      </div>
      <div className="homeRouteTrace" aria-hidden="true"><i /><i /><i /></div>
    </section>
  );
}
