import { useEffect } from "react";
import { MARKET_REPORT_HTML } from "../generated/marketReport";
import { ANALYSIS_META } from "../generated/analysisMeta";

/**
 * Renders the same generated market-report HTML that the prerender injects,
 * so crawlers and visitors see identical content.
 */
export default function MarketReportPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!MARKET_REPORT_HTML) {
    return (
      <article className="contentPage">
        <h1 className="contentPageTitle">Market report unavailable</h1>
        <p className="contentBody">
          We could not compute today's market analysis. Please check back after the next daily
          data update.
        </p>
      </article>
    );
  }

  return (
    <>
      {ANALYSIS_META.stale ? (
        <p className="staleNotice" role="status">
          Our price feed was last updated on {ANALYSIS_META.asOf} ({ANALYSIS_META.dataAgeDays} days
          ago). Figures may be out of date while we restore the daily update.
        </p>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: MARKET_REPORT_HTML }} />
    </>
  );
}
