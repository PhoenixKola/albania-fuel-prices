import type { TDict } from "../locales";
import type { LatestEurope, FuelType } from "../models/fuel";
import type { Currency } from "../models/currency";
import type { FxRates } from "../utils/currency";
import RankingCard from "../components/fuel/RankingCard";

type Props = {
  t: TDict;
  data: LatestEurope | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  currency: Currency;
  fxRates: FxRates | null;
  onOpen: (country: string) => void;
};

export default function RankingsPage({
  t,
  data,
  fuelType,
  setFuelType,
  currency,
  fxRates,
  onOpen,
}: Props) {
  return (
    <>
      <div className="pageHeader">
        <h2 className="pageHeaderTitle">{t.navRankings}</h2>
        <p className="pageHeaderSub">{t.rankingsGuidance}</p>
      </div>
      <RankingCard
        t={t}
        data={data}
        fuelType={fuelType}
        setFuelType={setFuelType}
        currency={currency}
        fxRates={fxRates}
        onOpen={onOpen}
      />

      <article className="contentPage">
        <section className="contentSection">
          <h2 className="contentHeading">{t.rankingsEditorialTitle}</h2>
          <p className="contentBody">{t.rankingsEditorialP1}</p>
          <p className="contentBody">{t.rankingsEditorialP2}</p>
          <p className="contentBody">{t.rankingsEditorialP3}</p>
          <p className="contentBody">{t.rankingsEditorialP4}</p>
        </section>
      </article>
    </>
  );
}
