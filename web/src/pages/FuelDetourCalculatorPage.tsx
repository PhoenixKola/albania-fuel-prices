import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TripSelect from "../components/content/TripSelect";
import { fuelDetourCopy } from "../config/fuelDetourCopy";
import { calculateFuelDetour, detourSearch, parseDetourSearch, validDetourInput, type DetourInput } from "../models/fuelDetour";
import type { LatestEurope, FuelType } from "../models/fuel";
import type { Lang } from "../models/i18n";

type Props = { lang: Lang; data: LatestEurope | null };
const markets: DetourInput["home"][] = ["Albania", "Greece", "Kosovo"];
const fuels: FuelType[] = ["diesel", "gasoline95", "lpg"];

export default function FuelDetourCalculatorPage({ lang, data }: Props) {
  const { search } = useLocation();
  return <Calculator key={search} lang={lang} data={data} search={search} />;
}

function Calculator({ lang, data, search }: Props & { search: string }) {
  const initial = parseDetourSearch(search);
  const [input, setInput] = useState<DetourInput>(initial.input);
  const [share, setShare] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const c = fuelDetourCopy[lang];
  const valid = validDetourInput(input);
  const result = calculateFuelDetour(input, data);
  const money = (value: number) => new Intl.NumberFormat(lang === "sq" ? "sq-AL" : "en-GB", { style: "currency", currency: "EUR" }).format(value);
  const decimal = (value: number) => new Intl.NumberFormat(lang === "sq" ? "sq-AL" : "en-GB", { maximumFractionDigits: 2 }).format(value);
  const update = (part: Partial<DetourInput>) => { setInput((current) => ({ ...current, ...part })); setShare(null); };
  const date = result?.comparison.sourceDateA === result?.comparison.sourceDateB
    ? result?.comparison.sourceDateA
    : `${result?.comparison.sourceDateA ?? "?"} / ${result?.comparison.sourceDateB ?? "?"}`;
  return <main className="detourPage">
    <header className="detourHero">
      <p className="travelEyebrow">{c.eyebrow}</p>
      <h1>{c.title}</h1>
      <p>{c.lede}</p>
      <div className="detourRoute" aria-hidden="true"><span>{c[input.home]}</span><i /><span>{c[input.alternate]}</span></div>
    </header>
    <noscript><p className="travelNotice">{lang === "sq" ? "Aktivizoni JavaScript për ta ndryshuar shembullin. Më poshtë shfaqet llogaritja fillestare me çmimet e datuara të burimit." : "Enable JavaScript to change the example. The default calculation below uses dated source prices."}</p></noscript>
    {initial.invalid && <p className="travelNotice" role="status">{c.invalidLink}</p>}
    <div className="detourWorkspace">
      <form className="tripForm detourForm" onSubmit={(event) => event.preventDefault()}>
        <h2>{c.calculate}</h2>
        <div className="detourFields">
          <TripSelect label={c.home} value={input.home} options={markets.map((market) => ({ value: market, label: c[market] }))} onChange={(value) => {
            const home = value as DetourInput["home"];
            update({ home, alternate: home === "Albania" ? (input.alternate === "Albania" ? "Greece" : input.alternate) : "Albania" });
          }} />
          <TripSelect label={c.alternate} value={input.alternate} options={markets.filter((market) => market !== input.home).map((market) => ({ value: market, label: c[market] }))} onChange={(value) => {
            const alternate = value as DetourInput["alternate"];
            update({ home: alternate === "Albania" ? input.home : "Albania", alternate });
          }} />
          <TripSelect label={c.fuel} value={input.fuel} options={fuels.map((fuel) => ({ value: fuel, label: c[fuel] }))} onChange={(value) => update({ fuel: value as FuelType })} />
          <label>{c.litres}<input type="number" min="0.01" max="200" step="any" inputMode="decimal" value={input.litres} aria-invalid={!Number.isFinite(input.litres) || input.litres <= 0 || input.litres > 200} onChange={(event) => update({ litres: event.target.value === "" ? NaN : Number(event.target.value) })} /></label>
          <label>{c.extraKm}<input type="number" min="0" max="1000" step="any" inputMode="decimal" value={input.extraKm} aria-invalid={!Number.isFinite(input.extraKm) || input.extraKm < 0 || input.extraKm > 1000} onChange={(event) => update({ extraKm: event.target.value === "" ? NaN : Number(event.target.value) })} /></label>
          <label>{c.consumption}<input type="number" min="0.01" max="50" step="any" inputMode="decimal" value={input.consumption} aria-invalid={!Number.isFinite(input.consumption) || input.consumption <= 0 || input.consumption > 50} onChange={(event) => update({ consumption: event.target.value === "" ? NaN : Number(event.target.value) })} /></label>
        </div>
        {!valid && <p className="travelNotice" role="status">{c.invalid}</p>}
      </form>
      <section className="detourResult" aria-label={c.calculate} aria-live="polite">
        <span className="travelEyebrow">{c.net}</span>
        {result ? <>
          <strong className="detourTotal">{money(result.netDifference)}</strong>
          <p className="detourOutcome">{result.netDifference > 0.005 ? c.positive : result.netDifference < -0.005 ? c.negative : c.equal}</p>
          <dl className="detourBreakdown">
            <div><dt>{c.gross}</dt><dd>{money(result.grossDifference)}</dd></div>
            <div><dt>{c.extraLitres}</dt><dd>{decimal(result.extraLitres)} L</dd></div>
            <div><dt>{c.extraCost}</dt><dd>−{money(result.extraFuelCost)}</dd></div>
          </dl>
          <p className="detourDate"><b>{c.date}:</b> {date}</p>
          <p className="detourDate">{c[input.home]}: {money(result.comparison.priceA)}/L · {c[input.alternate]}: {money(result.comparison.priceB)}/L</p>
          {result.comparison.stale && <p className="travelNotice">{c.stale}</p>}
          {result.comparison.provisional && <p className="travelNotice">{c.unverified}</p>}
        </> : <p className="travelNotice" role="status">{!valid ? c.invalid : data ? c.unavailable : c.noData}</p>}
        <button className="btn btn-primary" type="button" disabled={!valid} onClick={async () => {
          const url = `${window.location.origin}/fuel-detour-calculator${detourSearch(input)}`;
          setShare(url);
          try { await navigator.clipboard.writeText(url); setCopied(true); } catch { setCopied(false); }
        }}>{c.share}</button>
        {share && <div className="tripShare"><p role="status">{copied ? c.copied : c.shareFallback}</p><label>{c.shareLink}<input readOnly value={share} onFocus={(event) => event.target.select()} /></label></div>}
      </section>
    </div>
    <section className="detourExplainer"><h2>{c.methodTitle}</h2><p>{c.method}</p><h2>{c.limitsTitle}</h2><p>{c.limits}</p><p>{c.source}: {data?.source_url ? <a href={data.source_url} target="_blank" rel="noopener noreferrer">{data.source}</a> : <Link to="/methodology">{c.methodology}</Link>}</p></section>
    <nav className="detourRelated" aria-label={lang === "sq" ? "Mjete të lidhura" : "Related tools"}><Link to="/compare">{c.compare} →</Link><Link to="/trip-cost-calculator">{c.trip} →</Link><Link to="/methodology">{c.methodology} →</Link></nav>
  </main>;
}
