import { countryLabel } from "../utils/countryLabel";
import { TravelLinks } from "../components/content/TravelLinks";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Lang } from "../models/i18n";
import type { FuelType, LatestEurope } from "../models/fuel";
import type { FxRates } from "../utils/currency";
import { travelCopy } from "../config/travelCopy";
import { calculateTrip, parseTrip, positiveNumber, tripSearch, MAX_LEGS, type TripInput } from "../utils/trip";
import { COUNTRY_PAGES } from "../config/countryPages";
import { isEuropeanCountry } from "../utils/regions";
import { PriceDate, TravelHeader, TripExample, TripExplanation } from "../components/content/TravelContent";
import RentalReferral from "../components/ads/RentalReferral";
import AdBar from "../components/ads/AdBar";
import type { MonetizationConfig } from "../config/monetization";
import TripSelect from "../components/content/TripSelect";
import RoadStatusLink from "../components/road/RoadStatusLink";

type Props = { lang: Lang; data: LatestEurope | null; fxRates: FxRates | null; loading: boolean; config?: MonetizationConfig };
export default function TripCostCalculatorPage(props: Props) {
  const { search } = useLocation();
  // Back/forward to a different shared trip restores its inputs.
  return <TripCalculator key={search} {...props} search={search} />;
}
function TripCalculator({ lang, data, fxRates, loading, search, config }: Props & { search: string }) {
  const initial = useMemo(() => parseTrip(search), [search]);
  const [input, setInput] = useState<TripInput>(initial.input);
  const [share, setShare] = useState<{ url: string; copied: boolean } | null>(null);
  const c = travelCopy[lang];
  const result = calculateTrip(input, data?.countries ?? [], fxRates?.ALL ?? null);
  const countries = Array.from(new Set([
    ...COUNTRY_PAGES.map((country) => country.dataCountryName),
    ...(data?.countries ?? []).filter((country) => isEuropeanCountry(country.country)).map((country) => country.country),
    ...input.legs.map((leg) => leg.country),
  ])).sort((a, b) => a.localeCompare(b));
  const update = (next: TripInput) => { setInput(next); setShare(null); };
  const money = (value: number | null, currency: string) => value === null ? "—" : new Intl.NumberFormat(lang === "sq" ? "sq-AL" : "en-GB", { style: "currency", currency }).format(value);
  const num = (value: number | null) => value === null ? "—" : new Intl.NumberFormat(lang === "sq" ? "sq-AL" : "en-GB", { maximumFractionDigits: 2 }).format(value);
  return <main className="travelPage">
    <TravelHeader lang={lang} />
    <noscript><p className="travelNotice">{lang === "sq" ? "Aktivizo JavaScript për të ndryshuar itinerarin. Shembulli më poshtë përdor çmimet e datuara të publikimit." : "Enable JavaScript to edit your route. The example below uses the dated prices available when this page was published."}</p></noscript>
    {initial.invalid ? <p className="travelNotice" role="status">{c.invalidLink}</p> : null}
    <div className="tripWorkspace">
      <form className="tripForm" onSubmit={(event) => event.preventDefault()} aria-label={c.calculator}>
        <h2>{c.legs}</h2>
        {input.legs.map((leg, index) => <fieldset className="tripLeg" key={index}>
          <legend>{c.leg} {index + 1}</legend>
          <TripSelect label={c.country} value={leg.country} options={countries.map((country) => ({ value: country, label: countryLabel(country, lang) }))}
            onChange={(country) => update({ ...input, legs: input.legs.map((item, i) => i === index ? { ...item, country } : item) })} />
          <label>{c.distance}<input inputMode="decimal" value={leg.km} aria-invalid={positiveNumber(leg.km, 10000) === null} aria-describedby={!result.valid ? "trip-validation" : undefined}
            onChange={(event) => update({ ...input, legs: input.legs.map((item, i) => i === index ? { ...item, km: event.target.value } : item) })} /></label>
          <div className="tripDistanceChips" role="group" aria-label={`${c.quickDistance} ${index + 1}`}>{[100, 300, 500].map((km) => <button type="button" key={km} aria-pressed={Number(leg.km) === km} onClick={() => update({ ...input, legs: input.legs.map((item, i) => i === index ? { ...item, km: String(km) } : item) })}>{km} km</button>)}</div>
          {input.legs.length > 1 ? <button type="button" className="btn btn-ghost tripRemove" aria-label={`${c.remove} ${c.leg} ${index + 1}`} onClick={() => update({ ...input, legs: input.legs.filter((_, i) => i !== index) })}>{c.remove}</button> : null}
        </fieldset>)}
        <button type="button" className="btn btn-ghost" disabled={input.legs.length >= MAX_LEGS} onClick={() => update({ ...input, legs: [...input.legs, { country: "Albania", km: "100" }] })}>+ {c.add}</button>
        <div className="tripPreferences">
          <label>{c.consumption}<input inputMode="decimal" value={input.consumption} aria-invalid={positiveNumber(input.consumption, 100) === null} aria-describedby={!result.valid ? "trip-validation" : undefined} onChange={(event) => update({ ...input, consumption: event.target.value })} /></label>
          <TripSelect label={c.fuel} value={input.fuel} options={(["gasoline95", "diesel", "lpg"] as FuelType[]).map((fuel) => ({ value: fuel, label: c[fuel] }))}
            onChange={(fuel) => update({ ...input, fuel: fuel as FuelType })} />
        </div>
        <label className="tripCheckbox"><input type="checkbox" checked={input.roundTrip} onChange={(event) => update({ ...input, roundTrip: event.target.checked })} />{c.roundTrip}</label>
        {!result.valid ? <p className="travelNotice" id="trip-validation">{c.validation}</p> : null}
      </form>
      <section className="tripResults" aria-label={c.results}>
        <span className="travelEyebrow">{c.results}</span>
        <div aria-live="polite" aria-atomic="true">
          <h2>{c.total}</h2><p className="tripTotal">{money(result.totalEur, "EUR")}</p>
          <p className="tripAll">{money(result.totalAll, "ALL")}</p>
          <dl className="tripMetrics"><div><dt>{c.distanceTotal}</dt><dd>{num(result.distance)} <small>km</small></dd></div><div><dt>{c.liters}</dt><dd>{num(result.liters)} <small>L</small></dd></div><div><dt>{c.per100}</dt><dd>{money(result.totalEur !== null && result.distance ? result.totalEur / result.distance * 100 : null, "EUR")}</dd></div></dl>
        </div>
        {loading ? <p role="status">{c.loading}</p> : !data ? <p role="status">{c.noData}</p> : null}
        {!loading && data && result.valid && !result.complete ? <p className="travelNotice">{c.incomplete}</p> : null}
        {result.totalEur !== null && result.totalAll === null ? <p className="travelSmall">{c.noFx}</p> : null}
        <h3>{c.perLeg}</h3>
        <div className="tripRouteBar" aria-hidden="true">{result.legs.map((leg, index) => <span key={index} style={{ flexGrow: leg.distance ?? 0 }} />)}</div>
        <ul className="tripBreakdown">{result.legs.map((leg, index) => <li key={index}>
          <div><strong>{countryLabel(leg.country, lang)}</strong><span>{num(leg.distance)} km · {num(leg.liters)} L{leg.price !== null ? ` · €${leg.price.toFixed(3)}/L` : ""}</span></div>
          <strong>{leg.price === null ? c.unavailable : money(leg.cost, "EUR")}</strong>
        </li>)}</ul>
        <PriceDate lang={lang} asOf={data?.as_of} />
        <button className="btn btn-primary" type="button" disabled={!result.valid} onClick={async () => {
          const url = `${window.location.origin}/trip-cost-calculator${tripSearch(input)}`;
          try { await navigator.clipboard.writeText(url); setShare({ url, copied: true }); }
          catch { setShare({ url, copied: false }); }
        }}>{c.share}</button>
        {share ? <div className="tripShare"><p role="status">{share.copied ? c.copied : c.copyFallback}</p><label>{c.shareLink}<input readOnly value={share.url} onFocus={(event) => event.target.select()} /></label></div> : null}
      </section>
    </div>
    <RoadStatusLink lang={lang} />
    <RentalReferral lang={lang} placement="calculator" config={config} />
    <TripExplanation lang={lang} />
    <AdBar placement="content" enabled={!!data} />
    <TripExample lang={lang} data={data} />
    <TravelLinks lang={lang} />
  </main>;
}
