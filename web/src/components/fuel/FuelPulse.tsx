import { useMemo } from "react";
import type { Lang } from "../../models/i18n";
import { FUEL_TYPES, type CountryPrices, type FuelType, type LatestEurope } from "../../models/fuel";
import type { Trends } from "../../models/trends";
import { getTrendSeries, getWeeklyDeltaEur } from "../../models/trends";
import type { Currency } from "../../models/currency";
import type { FxRates } from "../../utils/currency";
import type { TDict } from "../../locales";
import { fuelLabel, getEurPrice } from "../../utils/fuel";
import { formatFuelPrice } from "../../utils/priceDisplay";
import { getFlagImgUrl, getIso2ForCountry } from "../../utils/countryFlag";
import TripSelect from "../content/TripSelect";
import LoadingRow from "../feedback/LeadingRow";
import type { HomeHeroModel } from "../content/HeroIntro";

type Props = {
  t: TDict;
  lang: Lang;
  data: LatestEurope | null;
  loading: boolean;
  countries: string[];
  country: string;
  selected: CountryPrices | null;
  fuelType: FuelType;
  setFuelType: (fuel: FuelType) => void;
  setCountry: (country: string) => void;
  currency: Currency;
  fxRates: FxRates | null;
  trends: Trends | null;
  model: HomeHeroModel;
  onCopy: (text: string) => void;
  onShare: (text: string) => void;
};

const QUICK_COUNTRIES = ["Albania", "Kosovo", "Greece", "Italy", "Montenegro", "North Macedonia", "Croatia"];
const W = 720;
const H = 250;
const PX = 10;
const PY = 20;

const copy = {
  en: {
    national: "National reference",
    scope: "Country averages for planning—not guaranteed prices at an individual pump.",
    priceBoard: "Price board",
    history: "30-day history",
    low: "Period low",
    high: "Period high",
    current: "Current reading",
    rank: "Europe rank",
    source: "Source",
    copy: "Copy prices",
    share: "Share snapshot",
    unavailable: "A reliable trend is not available for this market and fuel yet.",
  },
  sq: {
    national: "Vlerë orientuese kombëtare",
    scope: "Mesatare kombëtare për planifikim—jo çmime të garantuara në një pompë të veçantë.",
    priceBoard: "Tabela e çmimeve",
    history: "Historiku 30-ditor",
    low: "Minimumi i periudhës",
    high: "Maksimumi i periudhës",
    current: "Leximi aktual",
    rank: "Renditja në Evropë",
    source: "Burimi",
    copy: "Kopjo çmimet",
    share: "Ndaj pamjen",
    unavailable: "Nuk ka ende një trend të besueshëm për këtë treg dhe karburant.",
  },
} as const;

function shortDate(iso: string, lang: Lang) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === "sq" ? "sq-AL" : "en-GB", { day: "numeric", month: "short" });
}

export default function FuelPulse({
  t, lang, data, loading, countries, country, selected, fuelType, setFuelType,
  setCountry, currency, fxRates, trends, model, onCopy, onShare,
}: Props) {
  const c = copy[lang];
  const iso2 = getIso2ForCountry(country);
  const available = useMemo(() => new Set(countries), [countries]);
  const quickCountries = useMemo(() => QUICK_COUNTRIES.filter((name) => available.has(name)), [available]);
  const series = getTrendSeries(trends, country, fuelType);

  const chart = useMemo(() => {
    if (!series || !trends) return null;
    const points = series.map((value, index) => ({ value, index }))
      .filter((point): point is { value: number; index: number } => typeof point.value === "number" && Number.isFinite(point.value));
    if (points.length < 2) return null;
    const min = Math.min(...points.map((point) => point.value));
    const max = Math.max(...points.map((point) => point.value));
    const span = max - min || max * 0.02 || 1;
    const x = (index: number) => PX + (index / (series.length - 1)) * (W - PX * 2);
    const y = (value: number) => PY + (1 - (value - min) / span) * (H - PY * 2);
    const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.index).toFixed(1)},${y(point.value).toFixed(1)}`).join(" ");
    const first = points[0];
    const last = points.at(-1)!;
    return {
      line,
      area: `${line} L${x(last.index).toFixed(1)},${H} L${x(first.index).toFixed(1)},${H} Z`,
      min,
      max,
      last: last.value,
      lastX: x(last.index),
      lastY: y(last.value),
      firstDate: trends.dates[first.index],
      lastDate: trends.dates[last.index],
    };
  }, [series, trends]);

  const format = (value: number | null) => formatFuelPrice(country, value, currency, fxRates);
  const shareText = useMemo(() => {
    const rows = FUEL_TYPES.map((fuel) => `${fuelLabel(t, fuel)}: ${formatFuelPrice(country, getEurPrice(selected, fuel), currency, fxRates)}`);
    return ["Fuel Today | Karburanti Sot", `${country} · ${data?.as_of ?? ""}`, ...rows, `${c.source}: ${data?.source ?? t.notAvailable}`, "https://karburantisot.com"].filter(Boolean).join("\n");
  }, [c.source, country, currency, data?.as_of, data?.source, fxRates, selected, t]);

  return (
    <section id="price-tool" className="homeFuelPulse" aria-labelledby="home-command-title">
      <header className="homePulseIntro">
        <div><span className="homeEyebrow">{t.homeCommandKicker}</span><h2 id="home-command-title">{t.homeCommandTitle}</h2></div>
        <p>{t.homeCommandSubtitle}</p>
      </header>

      <div className="homePulseShell">
        <div className="homePulseToolbar">
          <div className="homePulseCountry"><span>{c.national}</span><strong>{iso2 ? <img src={getFlagImgUrl(iso2)} alt="" aria-hidden="true" /> : null}{country}</strong></div>
          <div className="homePulseControls">
            <TripSelect label={t.selectCountry} value={country} options={countries.map((name) => ({ value: name, label: name }))} onChange={setCountry} />
            <button type="button" className="homePulseUtility" onClick={() => onCopy(shareText)}>{c.copy}</button>
            <button type="button" className="homePulseUtility" onClick={() => onShare(shareText)}>{c.share}</button>
          </div>
        </div>

        <div className="homePulseCountryRail" aria-label={t.selectCountry}>
          {quickCountries.map((name) => {
            const flag = getIso2ForCountry(name);
            return <button key={name} type="button" className={name === country ? "is-active" : ""} aria-pressed={name === country} onClick={() => setCountry(name)}>{flag ? <img src={getFlagImgUrl(flag)} alt="" aria-hidden="true" /> : null}{name}</button>;
          })}
        </div>

        {loading ? <LoadingRow t={t} /> : (
          <div className="homePulseBody">
            <div className="homePulsePriceBoard">
              <div className="homePulseColumnLabel"><span>{c.priceBoard}</span><span>EUR / L</span></div>
              {FUEL_TYPES.map((fuel, index) => {
                const value = getEurPrice(selected, fuel);
                const delta = getWeeklyDeltaEur(trends, country, fuel);
                const active = fuel === fuelType;
                return (
                  <button key={fuel} type="button" className={`homePulsePriceRow${active ? " is-active" : ""}`} aria-pressed={active} onClick={() => setFuelType(fuel)}>
                    <span className="homePulsePriceIndex">{String(index + 1).padStart(2, "0")}</span>
                    <span className="homePulsePriceName"><i aria-hidden="true" />{fuelLabel(t, fuel)}<small>{c.national}</small></span>
                    <strong>{value == null ? "—" : format(value)}</strong>
                    <span className={`homePulseDelta${delta != null && delta > 0 ? " is-up" : ""}`}>{delta == null ? t.notAvailable : Math.abs(delta) < 0.0005 ? t.trendFlatWeek : `${delta > 0 ? "+" : "−"}${Math.abs(delta).toFixed(3)}`}</span>
                  </button>
                );
              })}
            </div>

            <div className="homePulseChartPanel">
              <div className="homePulseChartHeader"><div><span>{c.history}</span><strong>{fuelLabel(t, fuelType)} · {country}</strong></div>{chart ? <small>{shortDate(chart.firstDate, lang)} — {shortDate(chart.lastDate, lang)}</small> : null}</div>
              {chart ? (
                <>
                  <dl className="homePulseStats">
                    <div><dt>{c.current}</dt><dd>{format(chart.last)}</dd></div>
                    <div><dt>{c.low}</dt><dd>{format(chart.min)}</dd></div>
                    <div><dt>{c.high}</dt><dd>{format(chart.max)}</dd></div>
                    <div><dt>{c.rank}</dt><dd>{model.rank == null ? t.notAvailable : t.homeGaugeRankValue(model.rank, model.marketTotal)}</dd></div>
                  </dl>
                  <svg className="homePulseChart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`${country} ${fuelLabel(t, fuelType)} ${c.history}`}>
                    <defs><linearGradient id="homePulseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.24" /><stop offset="100%" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
                    <path d={chart.area} fill="url(#homePulseFill)" /><path d={chart.line} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><circle cx={chart.lastX} cy={chart.lastY} r="5" fill="currentColor" />
                  </svg>
                </>
              ) : <div className="homePulseUnavailable" role="status"><span aria-hidden="true">∿</span><p>{c.unavailable}</p></div>}
            </div>
          </div>
        )}

        <footer className="homePulseFooter">
          <p>{c.scope}</p>
          <p><b>{c.source}:</b> {data?.source_url ? <a href={data.source_url} target="_blank" rel="noopener noreferrer">{data.source ?? t.notAvailable} ↗</a> : data?.source ?? t.notAvailable} · {data?.as_of ?? t.notAvailable}</p>
        </footer>
      </div>
    </section>
  );
}
