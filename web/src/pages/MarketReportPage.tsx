import type { Lang } from "../models/i18n";
import type { LatestEurope } from "../models/fuel";
import { editorialCopy } from "../config/editorialCopy";
import { MARKET_REPORT_HTML } from "../generated/marketReport";
import { ANALYSIS_META } from "../generated/analysisMeta";
import { EditorialMetrics, EditorialShell } from "../components/content/EditorialLayout";
import { isEuropeanCountry } from "../utils/regions";

export default function MarketReportPage({ lang, data }: { lang: Lang; data: LatestEurope | null }) {
  const copy = editorialCopy[lang];
  const report = copy.report;
  const sections = [
    { id: "market-summary", label: lang === "sq" ? "Përmbledhja" : "Market summary" },
    { id: "market-movers", label: lang === "sq" ? "Lëvizjet" : "Market movers" },
    { id: "market-volatility", label: lang === "sq" ? "Paqëndrueshmëria" : "Volatility" },
    { id: "market-rankings", label: lang === "sq" ? "Renditja e plotë" : "Full ranking" },
    { id: "market-methodology", label: report.methodology },
  ];
  const dieselMarkets = data?.countries
    .filter((item) => isEuropeanCountry(item.country) && typeof item.diesel_eur === "number")
    .map((item) => ({ country: item.country, price: item.diesel_eur as number }))
    .sort((a, b) => a.price - b.price) ?? [];
  const cheapest = dieselMarkets[0];
  const dearest = dieselMarkets[dieselMarkets.length - 1];
  const europeAverage = dieselMarkets.length ? dieselMarkets.reduce((sum, item) => sum + item.price, 0) / dieselMarkets.length : null;

  if (!MARKET_REPORT_HTML) {
    return (
      <EditorialShell variant="newsroom" eyebrow={report.eyebrow} title={report.unavailableTitle} lede={report.unavailableText} sections={[]} contentsLabel={copy.contents}>
        <div />
      </EditorialShell>
    );
  }

  return (
    <EditorialShell
      variant="newsroom"
      eyebrow={report.eyebrow}
      title={report.title}
      lede={report.lede(ANALYSIS_META.daysObserved)}
      status={ANALYSIS_META.stale ? report.stale : report.fresh}
      updated={`${copy.lastUpdated}: ${ANALYSIS_META.endLabel}`}
      sections={sections}
      contentsLabel={copy.contents}
      heroAside={<EditorialMetrics items={[
        { label: lang === "sq" ? "Më i liri" : "Cheapest", value: cheapest ? `€${cheapest.price.toFixed(3)}` : "—", note: cheapest?.country },
        { label: lang === "sq" ? "Mesatarja evropiane" : "Europe average", value: europeAverage == null ? "—" : `€${europeAverage.toFixed(3)}`, note: `${dieselMarkets.length || ANALYSIS_META.countriesAnalysed} ${lang === "sq" ? "tregje" : "markets"}` },
        { label: lang === "sq" ? "Më i shtrenjti" : "Most expensive", value: dearest ? `€${dearest.price.toFixed(3)}` : "—", note: dearest?.country },
        { label: lang === "sq" ? "Diferenca" : "Market spread", value: cheapest && dearest ? `€${(dearest.price - cheapest.price).toFixed(3)}` : "—", note: lang === "sq" ? "për litër" : "per litre" },
      ]} />}
    >
      {ANALYSIS_META.stale ? <p className="editorialStaleNotice" role="status">{lang === "sq" ? `Burimi i çmimeve u përditësua më ${ANALYSIS_META.asOf}. Shifrat mund të jenë të vjetruara.` : `The price feed was last updated on ${ANALYSIS_META.asOf}. Figures may be out of date while the daily update is restored.`}</p> : null}
      <div className="marketReportHtml" dangerouslySetInnerHTML={{ __html: MARKET_REPORT_HTML }} />
    </EditorialShell>
  );
}
