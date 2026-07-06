import { Link } from "react-router-dom";
import type { TDict } from "../locales";
import type { LatestEurope, FuelType } from "../models/fuel";
import type { Currency } from "../models/currency";
import type { FxRates } from "../utils/currency";
import type { Trends } from "../models/trends";
import WatchlistCard from "../components/fuel/WatchlistCard";

type Props = {
  t: TDict;
  data: LatestEurope | null;
  watchlist: string[];
  has: Set<string>;
  current: string;
  onAdd: (country: string) => void;
  onRemove: (country: string) => void;
  onOpen: (country: string) => void;
  fuelType: FuelType;
  currency: Currency;
  fxRates: FxRates | null;
  trends: Trends | null;
};

export default function ComparePage({
  t,
  data,
  watchlist,
  has,
  current,
  onAdd,
  onRemove,
  onOpen,
  fuelType,
  currency,
  fxRates,
  trends,
}: Props) {
  return (
    <>
      <div className="pageHeader">
        <h1 className="pageHeaderTitle">{t.navCompare}</h1>
        <p className="pageHeaderSub">{t.watchlistGuidance}</p>
      </div>
      <WatchlistCard
        t={t}
        data={data}
        watchlist={watchlist}
        has={has}
        current={current}
        onAdd={onAdd}
        onRemove={onRemove}
        onOpen={onOpen}
        fuelType={fuelType}
        currency={currency}
        fxRates={fxRates}
        trends={trends}
      />

      <article className="contentPage">
        <section className="contentSection">
          <h2 className="contentHeading">{t.compareEditorialTitle}</h2>
          <p className="contentBody">{t.compareEditorialP1}</p>
          <p className="contentBody">{t.compareEditorialP2}</p>
          <p className="contentBody">{t.compareEditorialP3}</p>
        </section>
        <section className="contentSection">
          <h3 className="contentHeading">{t.compareEditorialTipTitle}</h3>
          <p className="contentBody">{t.compareEditorialTip}</p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Practical comparison examples</h2>
          <p className="contentBody">
            Here are some of the most useful country comparisons for Albanian drivers and travelers:
          </p>
          <h3 className="contentHeading">Albania vs Kosovo</h3>
          <p className="contentBody">
            The most frequently used comparison due to the high traffic on the Tirana–Pristina corridor. Prices are typically very close (within 0.02–0.05 EUR/L), so the refueling decision often comes down to convenience. Kosovo uses the Euro directly, making price comparisons straightforward. Add both to your watchlist to monitor when meaningful gaps appear.
          </p>
          <h3 className="contentHeading">Albania vs Greece</h3>
          <p className="contentBody">
            One of the largest price differences in the Balkans. Greek fuel is typically 0.20–0.40 EUR/L more expensive due to high excise duties and 24% VAT. This comparison is essential for anyone driving south through Kakavija or Kapshticë — fill up in Albania before crossing. The savings on a full tank can be 10–20 EUR.
          </p>
          <h3 className="contentHeading">Albania vs Italy</h3>
          <p className="contentBody">
            Relevant for ferry travelers between Durrës/Vlorë and Bari/Brindisi. Italian fuel is among the most expensive in Europe (0.40–0.60 EUR/L above Albania). Fill up before the ferry and minimize Italian refueling. This is one of the most impactful cross-border strategies available.
          </p>
          <h3 className="contentHeading">Albania vs Montenegro</h3>
          <p className="contentBody">
            A moderate price difference (typically 0.05–0.15 EUR/L in Montenegro&apos;s disadvantage). Relevant for coastal trips north of Shkodër or transit to Croatia. The savings are modest per liter but consistent — Albanian fuel is usually cheaper.
          </p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Cross-border planning with the comparison tool</h2>
          <p className="contentBody">
            The comparison tool is designed for recurring use. Rather than checking prices once, the idea is to maintain a watchlist of your most relevant countries and check before each trip or commute. Price gaps widen and narrow based on market conditions — a comparison that showed minimal difference last month might show a meaningful gap today.
          </p>
          <p className="contentBody">
            For multi-country road trips, add all countries on your route to the watchlist. This gives you a quick overview of where to prioritize refueling and where to avoid filling up if possible.
          </p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Related tools</h2>
          <ul className="contentList">
            <li><Link className="inlineLink" to="/rankings">Full rankings</Link> — see all countries sorted by price</li>
            <li><Link className="inlineLink" to="/road-trip-fuel-guide">Road trip guide</Link> — estimate costs for specific routes</li>
            <li><Link className="inlineLink" to="/europe-fuel-comparison">Europe comparison guide</Link> — understand why prices differ</li>
            <li><Link className="inlineLink" to="/methodology">Methodology</Link> — how comparison data is collected</li>
          </ul>
        </section>
      </article>
    </>
  );
}
