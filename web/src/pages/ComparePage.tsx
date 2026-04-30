import type { TDict } from "../locales";
import type { LatestEurope, FuelType } from "../models/fuel";
import type { Currency } from "../models/currency";
import type { FxRates } from "../utils/currency";
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
      </article>
    </>
  );
}
