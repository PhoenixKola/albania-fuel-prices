import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";
import { ANALYSIS_META } from "../generated/analysisMeta";
import AdBar from "../components/ads/AdBar";

type Props = { t: TDict };

export default function MethodologyPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.methodologyPageTitle}</h1>
      <p className="contentBody">{t.methodologyPageIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologySourcesTitle}</h2>
        <p className="contentBody">{t.methodologySourcesP1}</p>
        <p className="contentBody">{t.methodologySourcesP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyProcessTitle}</h2>
        <p className="contentBody">{t.methodologyProcessP1}</p>
        <p className="contentBody">{t.methodologyProcessP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyFxTitle}</h2>
        <p className="contentBody">{t.methodologyFxP1}</p>
        <p className="contentBody">{t.methodologyFxP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyAccuracyTitle}</h2>
        <p className="contentBody">{t.methodologyAccuracyP1}</p>
        <p className="contentBody">{t.methodologyAccuracyP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyUpdateTitle}</h2>
        <p className="contentBody">{t.methodologyUpdateP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyEditorialTitle}</h2>
        <p className="contentBody">{t.methodologyEditorialP1}</p>
        <p className="contentBody">{t.methodologyEditorialP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyOpenTitle}</h2>
        <p className="contentBody">
          {t.methodologyOpenP1}{" "}
          <Link to="/contact" className="inlineLink">{t.navContact}</Link>
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Data source and update summary</h2>
        <p className="contentBody">
          This website publishes informational country-level fuel prices sourced from public datasets and normalized for comparison use. Update timing depends on upstream publication schedules, so not every country changes at the same frequency.
        </p>
        <p className="contentBody">
          The timestamp shown in the tool indicates when the dataset was refreshed. It should be interpreted as data availability timing, not as a guarantee of real-time pump updates.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">How we build our historical record</h2>
        <p className="contentBody">
          Public price aggregators publish a snapshot of today and nothing else. Since{" "}
          <strong>{ANALYSIS_META.startLabel || "February 2026"}</strong> we have captured that
          snapshot once a day and appended it to our own history file, which now holds{" "}
          <strong>{ANALYSIS_META.daysObserved || 0} consecutive daily readings</strong> across{" "}
          {ANALYSIS_META.countriesAnalysed || 0} markets, with no gaps. That record is what makes
          the analysis on this site possible: the upstream sources publish only today's snapshot,
          so ranges, records and trends simply do not exist unless someone keeps the history. The
          exact calculations applied to it are described below.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">How the analysis is calculated</h2>
        <p className="contentBody">
          Every derived figure on this site is computed from that history file at build time. None
          of it comes from the upstream source:
        </p>
        <ul className="contentList">
          <li><strong>Period low, high and average</strong> — the minimum, maximum and arithmetic mean of all daily readings we hold for that country and fuel, with the dates on which the extremes occurred.</li>
          <li><strong>Position in range (percentile)</strong> — the share of recorded days that were cheaper than today. 0% means today is the cheapest price we have ever recorded; 100% means the most expensive.</li>
          <li><strong>Volatility</strong> — the standard deviation of day-to-day percentage price changes across the full record. Higher values mean a market that reprices frequently and unpredictably.</li>
          <li><strong>30/90-day change</strong> — the percentage difference between today's price and the reading from 30 or 90 observations earlier.</li>
          <li><strong>Refuelling verdict</strong> — a plain-language reading of the percentile figure above. It is a description of where today sits in our recorded range, not a price forecast.</li>
          <li><strong>Cross-border spread history</strong> — the daily difference between two countries' prices, tracked over time.</li>
        </ul>
        <p className="contentBody">
          Statistics are only produced for a country and fuel once we hold at least 30 daily
          readings for it; below that threshold we show nothing rather than something unreliable.
          Countries absent from the upstream feed are excluded from search indexing rather than
          padded with placeholder content.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Fuel types and limitations</h2>
        <p className="contentBody">
          Petrol (95), diesel, and LPG are shown only when each value exists in the source. Missing fields are not guessed or interpolated. Local station offers, promotions, and micro-regional pricing are outside country-level scope.
        </p>
        <p className="contentBody">
          Before making travel or purchasing decisions, users should verify prices with local stations or official channels. For practical examples, see <Link to="/road-trip-fuel-guide" className="inlineLink">Road trip fuel guide</Link>.
        </p>
      </section>

      <AdBar adClient="ca-pub-2653462201538649" adSlot="5789581249" />
    </article>
  );
}
