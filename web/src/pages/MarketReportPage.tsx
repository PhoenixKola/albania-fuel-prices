import type { Lang } from "../models/i18n";
import type { LatestEurope } from "../models/fuel";
import { editorialCopy } from "../config/editorialCopy";
import { MARKET_REPORT_HTML } from "../generated/marketReport";
import { ANALYSIS_META } from "../generated/analysisMeta";
import { isEuropeanCountry } from "../utils/regions";

/**
 * A market report is read for its numbers, so the headline figures sit above
 * the fold and the prose follows. It uses a horizontal jump strip rather than
 * the dossier contents rail: this is a briefing to scan, not a policy document
 * to navigate section by section.
 */
export default function MarketReportPage({ lang, data }: { lang: Lang; data: LatestEurope | null }) {
  const copy = editorialCopy[lang];
  const report = copy.report;
  const sq = lang === "sq";

  const jumps = [
    { id: "market-summary", label: sq ? "Përmbledhja" : "Summary" },
    { id: "market-movers", label: sq ? "Lëvizjet" : "Movers" },
    { id: "market-volatility", label: sq ? "Paqëndrueshmëria" : "Volatility" },
    { id: "market-rankings", label: sq ? "Renditja" : "Ranking" },
    { id: "market-methodology", label: report.methodology },
  ];

  const markets = data?.countries
    .filter((item) => isEuropeanCountry(item.country) && typeof item.diesel_eur === "number")
    .map((item) => ({ country: item.country, price: item.diesel_eur as number }))
    .sort((a, b) => a.price - b.price) ?? [];
  const cheapest = markets[0];
  const dearest = markets[markets.length - 1];
  const average = markets.length ? markets.reduce((sum, item) => sum + item.price, 0) / markets.length : null;
  const spread = cheapest && dearest ? dearest.price - cheapest.price : null;

  if (!MARKET_REPORT_HTML) {
    return (
      <main className="reportPage">
        <header className="reportHero">
          <p className="reportEyebrow"><i aria-hidden="true" />{report.eyebrow}</p>
          <h1>{report.unavailableTitle}</h1>
          <p className="reportLede">{report.unavailableText}</p>
        </header>
      </main>
    );
  }

  const figures = [
    { key: "cheap", label: sq ? "Më i liri" : "Cheapest", value: cheapest ? `€${cheapest.price.toFixed(3)}` : "—", note: cheapest?.country ?? "—", tone: "good" },
    { key: "avg", label: sq ? "Mesatarja evropiane" : "Europe average", value: average == null ? "—" : `€${average.toFixed(3)}`, note: `${markets.length || ANALYSIS_META.countriesAnalysed} ${sq ? "tregje" : "markets"}`, tone: "" },
    { key: "dear", label: sq ? "Më i shtrenjti" : "Most expensive", value: dearest ? `€${dearest.price.toFixed(3)}` : "—", note: dearest?.country ?? "—", tone: "bad" },
    { key: "spread", label: sq ? "Diferenca" : "Spread", value: spread == null ? "—" : `€${spread.toFixed(3)}`, note: sq ? "për litër" : "per litre", tone: "" },
  ];

  return (
    <main className="reportPage">
      <header className="reportHero">
        <div className="reportHeroTop">
          <p className="reportEyebrow"><i aria-hidden="true" />{report.eyebrow}</p>
          <p className="reportStamp">
            <span className={ANALYSIS_META.stale ? "reportStatus reportStatusStale" : "reportStatus"}>
              <i aria-hidden="true" />{ANALYSIS_META.stale ? report.stale : report.fresh}
            </span>
            <span>{copy.lastUpdated}: {ANALYSIS_META.endLabel}</span>
          </p>
        </div>
        <h1>{report.title}</h1>
        <p className="reportLede">{report.lede(ANALYSIS_META.daysObserved)}</p>

        <div className="reportFigures">
          {figures.map((figure) => (
            <div className={`reportFigure${figure.tone ? ` reportFigure-${figure.tone}` : ""}`} key={figure.key}>
              <span>{figure.label}</span>
              <strong>{figure.value}</strong>
              <small>{figure.note}</small>
            </div>
          ))}
        </div>
      </header>

      <nav className="reportJump" aria-label={copy.contents}>
        {jumps.map((jump) => <a key={jump.id} href={`#${jump.id}`}>{jump.label}</a>)}
      </nav>

      {ANALYSIS_META.stale ? (
        <p className="reportStaleNotice" role="status">
          {sq
            ? `Burimi i çmimeve u përditësua më ${ANALYSIS_META.asOf}. Shifrat mund të jenë të vjetruara.`
            : `The price feed was last updated on ${ANALYSIS_META.asOf}. Figures may be out of date while the daily update is restored.`}
        </p>
      ) : null}

      <div className="reportBody marketReportHtml" dangerouslySetInnerHTML={{ __html: MARKET_REPORT_HTML }} />
    </main>
  );
}
