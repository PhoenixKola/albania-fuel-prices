import { Link } from "react-router-dom";
import type { Lang } from "../models/i18n";
import type { Currency } from "../models/currency";
import type { FuelType, LatestEurope, CountryPrices } from "../models/fuel";
import type { Trends } from "../models/trends";
import type { TDict } from "../locales";
import type { FxRates } from "../utils/currency";
import { getCountryEditorial } from "../config/countryContent";
import { editorialCopy } from "../config/editorialCopy";
import { getCountryAnalysis } from "../generated/countryAnalysis";
import { ANALYSIS_META } from "../generated/analysisMeta";
import { getTrendSeries } from "../models/trends";
import { fuelLabel, getEurPrice } from "../utils/fuel";
import { isEuropeanCountry } from "../utils/regions";
import { convertEur, getCurrencyForCountry, hasRate } from "../utils/currency";
import { formatMoney } from "../utils/money";
import TrendCard from "../components/fuel/TrendCard";
import { EditorialCallout, EditorialMetrics, EditorialSection, EditorialShell } from "../components/content/EditorialLayout";

type Props = {
  slug: string;
  t: TDict;
  lang: Lang;
  data: LatestEurope | null;
  trends: Trends | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  loading: boolean;
  setCountry: (country: string) => void;
  currency: Currency;
  fxRates: FxRates | null;
};

const FLAGS: Record<string, string> = {
  Albania: "🇦🇱", Kosovo: "🇽🇰", Montenegro: "🇲🇪", "North Macedonia": "🇲🇰",
  Greece: "🇬🇷", Italy: "🇮🇹", Croatia: "🇭🇷", Portugal: "🇵🇹", Switzerland: "🇨🇭", "United Kingdom": "🇬🇧",
};

const FUELS: FuelType[] = ["gasoline95", "diesel", "lpg"];

function thirtyDayDelta(trends: Trends | null, country: string, fuel: FuelType) {
  const series = getTrendSeries(trends, country, fuel);
  if (!series) return null;
  const values = series.map((value, index) => ({ value, index })).filter((point): point is { value: number; index: number } => typeof point.value === "number" && Number.isFinite(point.value));
  if (values.length < 2) return null;
  const latest = values[values.length - 1];
  const targetIndex = Math.max(0, latest.index - 30);
  const earlier = [...values].reverse().find((point) => point.index <= targetIndex) ?? values[0];
  return latest.value - earlier.value;
}

function signed(value: number | null, suffix = "") {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(3)}${suffix}`;
}

function eurPrice(row: CountryPrices | null, fuel: FuelType) {
  return getEurPrice(row, fuel);
}

export default function CountryFuelPricesPage({
  slug, t, lang, data, trends, fuelType, setFuelType, loading, setCountry, currency, fxRates,
}: Props) {
  const editorial = getCountryEditorial(slug);
  const copy = editorialCopy[lang];
  const c = copy.country;

  if (!editorial) {
    return (
      <EditorialShell variant="newsroom" eyebrow={c.eyebrow} title={c.notFoundTitle} lede={c.notFoundText} sections={[]} contentsLabel={copy.contents} actions={<Link className="editorialAction editorialActionPrimary" to="/">{c.dashboardCta}</Link>}>
        <div />
      </EditorialShell>
    );
  }

  const countryName = editorial.dataCountryName;
  const row = data?.countries.find((item) => item.country === countryName) ?? null;
  const albania = data?.countries.find((item) => item.country === "Albania") ?? null;
  const hasAnyPrice = !!row && FUELS.some((fuel) => typeof eurPrice(row, fuel) === "number");
  const selectedPrice = eurPrice(row, fuelType);
  const markets = data?.countries
    .filter((item) => isEuropeanCountry(item.country))
    .map((item) => ({ country: item.country, price: eurPrice(item, fuelType) }))
    .filter((item): item is { country: string; price: number } => typeof item.price === "number" && Number.isFinite(item.price))
    .sort((a, b) => a.price - b.price) ?? [];
  const average = markets.length ? markets.reduce((total, item) => total + item.price, 0) / markets.length : null;
  const rank = selectedPrice == null ? null : markets.filter((item) => item.price < selectedPrice).length + 1;
  const delta30 = thirtyDayDelta(trends, countryName, fuelType);
  const localCurrency = getCurrencyForCountry(countryName);
  const localValue = hasRate(localCurrency, fxRates) ? convertEur(selectedPrice, localCurrency, fxRates) : null;
  const userValue = currency === "local" && localValue != null ? formatMoney(localValue, localCurrency) : formatMoney(selectedPrice, "EUR");
  const updated = data?.fetched_at_utc
    ? new Date(data.fetched_at_utc).toLocaleDateString(lang === "sq" ? "sq-AL" : "en-GB", { dateStyle: "medium" })
    : ANALYSIS_META.endLabel;
  const analysisHtml = getCountryAnalysis(slug);

  const sections = [
    { id: "country-prices", label: c.currentPrices(editorial.label) },
    { id: "country-trend", label: c.trend(editorial.label) },
    ...(analysisHtml ? [{ id: "country-history", label: lang === "sq" ? "Leximi historik" : "Historical reading" }] : []),
    { id: "country-market", label: c.market(editorial.label) },
    { id: "country-comparison", label: countryName === "Albania" ? c.albaniaReference : c.comparison(editorial.label) },
    { id: "country-travel", label: c.travel },
    { id: "country-coverage", label: c.limitations },
    { id: "country-faq", label: c.faq(editorial.label) },
  ];

  const compareLine = (fuel: FuelType) => {
    const label = fuelLabel(t, fuel);
    const base = eurPrice(albania, fuel);
    const value = eurPrice(row, fuel);
    if (base == null || value == null) return c.comparisonMissing(label);
    const diff = value - base;
    if (Math.abs(diff) < 0.001) return c.close(label);
    return diff > 0 ? c.higher(label, Math.abs(diff).toFixed(3)) : c.lower(label, Math.abs(diff).toFixed(3));
  };

  return (
    <EditorialShell
      variant="newsroom"
      eyebrow={c.eyebrow}
      title={c.title(editorial.label)}
      lede={c.lede(editorial.label)}
      status={ANALYSIS_META.stale ? c.stale : c.fresh}
      updated={c.dataUpdated(updated)}
      sections={sections}
      contentsLabel={copy.contents}
      heroAside={
        <div className="countryHeroInstrument">
          <span className="countryHeroFlag" aria-hidden="true">{FLAGS[countryName] ?? "◉"}</span>
          <div><small>{c.priceNow} · {fuelLabel(t, fuelType)}</small><strong>{userValue}</strong><span>{selectedPrice == null ? copy.unavailable : `${selectedPrice.toFixed(3)} EUR/L`}</span></div>
          <EditorialMetrics items={[
            { label: c.europeRank, value: rank == null ? "—" : `#${rank}/${markets.length}` },
            { label: c.versusAverage, value: selectedPrice == null || average == null ? "—" : signed(selectedPrice - average, " €") },
            { label: c.thirtyDay, value: signed(delta30, " €") },
            { label: c.localEstimate, value: localValue == null ? "—" : formatMoney(localValue, localCurrency) },
          ]} />
        </div>
      }
      actions={<><Link className="editorialAction editorialActionPrimary" to="/" onClick={() => setCountry(countryName)}>{c.openDashboard(editorial.label)}</Link><Link className="editorialAction" to="/compare">{c.compareCta}</Link></>}
    >
      {ANALYSIS_META.stale ? <p className="editorialStaleNotice" role="status">{lang === "sq" ? `Leximi burimor është i datës ${ANALYSIS_META.asOf}; përdore si referencë.` : `The source reading is dated ${ANALYSIS_META.asOf}; use it as a reference while the next update arrives.`}</p> : null}

      <EditorialSection id="country-prices" index="01" title={c.currentPrices(editorial.label)} intro={c.currentIntro} tone="accent">
        {loading ? <p role="status">{c.loading}</p> : null}
        {!loading && !hasAnyPrice ? <EditorialCallout label={copy.unavailable} warning>{c.missing(editorial.label)}</EditorialCallout> : null}
        {!loading && hasAnyPrice ? (
          <div className="countryPriceGrid" role="group" aria-label={c.currentPrices(editorial.label)}>
            {FUELS.map((fuel) => {
              const value = eurPrice(row, fuel);
              return (
                <button key={fuel} type="button" className={`countryPriceTile ${fuelType === fuel ? "isSelected" : ""}`} aria-pressed={fuelType === fuel} onClick={() => setFuelType(fuel)} disabled={value == null}>
                  <span>{fuelLabel(t, fuel)}</span><strong>{value == null ? "—" : `€${value.toFixed(3)}`}</strong><small>{c.eurReference}</small>
                </button>
              );
            })}
          </div>
        ) : null}
      </EditorialSection>

      <EditorialSection id="country-trend" index="02" title={c.trend(editorial.label)} intro={c.trendIntro(editorial.label)}>
        <div className="contentToolEmbed"><TrendCard t={t} trends={trends} country={countryName} fuelType={fuelType} setFuelType={setFuelType} /></div>
      </EditorialSection>

      {analysisHtml ? <EditorialSection id="country-history" index="03" title={lang === "sq" ? "Çfarë tregon historiku" : "What the history says"}><div className="countryAnalysisHtml" dangerouslySetInnerHTML={{ __html: analysisHtml }} /></EditorialSection> : null}

      <EditorialSection id="country-market" index={analysisHtml ? "04" : "03"} title={c.market(editorial.label)}><p>{editorial.marketOverview}</p></EditorialSection>

      <EditorialSection id="country-comparison" index={analysisHtml ? "05" : "04"} title={countryName === "Albania" ? c.albaniaReference : c.comparison(editorial.label)}>
        <div className="countryComparisonGrid">{FUELS.map((fuel) => <div className="editorialCard" key={fuel}><b>{fuelLabel(t, fuel)}</b><p>{compareLine(fuel)}</p></div>)}</div>
        <p>{editorial.albaniaContext}</p>
      </EditorialSection>

      <EditorialSection id="country-travel" index={analysisHtml ? "06" : "05"} title={c.travel}>
        <div className="editorialCardGrid"><div className="editorialCard"><b>{c.travel}</b><p>{editorial.travelRelevance}</p></div><div className="editorialCard"><b>{c.borders}</b><p>{editorial.borderAdvice}</p></div><div className="editorialCard"><b>{c.fuels(editorial.label)}</b><p>{editorial.fuelInterpretation}</p></div></div>
      </EditorialSection>

      <EditorialSection id="country-coverage" index={analysisHtml ? "07" : "06"} title={c.limitations}>
        <p>{editorial.dataLimitations}</p><p>{editorial.sourceTransparency}</p>
        {data?.source ? <EditorialCallout label={copy.source}>{data.source} · {c.dataUpdated(updated)}</EditorialCallout> : null}
      </EditorialSection>

      <EditorialSection id="country-faq" index={analysisHtml ? "08" : "07"} title={c.faq(editorial.label)}>
        {editorial.faqs.map((faq) => <details className="editorialFaq" key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
      </EditorialSection>

      <EditorialSection id="country-explore" title={c.explore} tone="accent">
        <div className="editorialHeroActions"><Link className="editorialAction editorialActionPrimary" to="/" onClick={() => setCountry(countryName)}>{c.dashboardCta}</Link><Link className="editorialAction" to="/rankings">{c.rankingsCta}</Link><Link className="editorialAction" to="/compare">{c.compareCta}</Link></div>
      </EditorialSection>
    </EditorialShell>
  );
}
