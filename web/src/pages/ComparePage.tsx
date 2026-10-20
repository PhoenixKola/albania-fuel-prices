import { Link } from "react-router-dom";
import type { TDict } from "../locales";
import type { Lang } from "../models/i18n";
import type { LatestEurope, FuelType } from "../models/fuel";
import type { Currency } from "../models/currency";
import type { FxRates } from "../utils/currency";
import type { Trends } from "../models/trends";
import { compareCountries, comparisonSentence } from "../models/countryComparison";
import WatchlistCard from "../components/fuel/WatchlistCard";
import AdsterraNativeAd from "../components/ads/AdsterraNativeAd";

type Props = {
  t: TDict;
  lang: Lang;
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
  t, lang, data, watchlist, has, current, onAdd, onRemove, onOpen,
  fuelType, currency, fxRates, trends,
}: Props) {
  const examples = ["Kosovo", "Greece", "Italy", "Montenegro"].map((country) => ({
    country,
    sentence: comparisonSentence(
      compareCountries(data, country, "Albania", fuelType),
      country, "Albania", fuelType, lang,
    ),
  }));
  return (
    <>
      <WatchlistCard
        t={t} data={data} watchlist={watchlist} has={has} current={current}
        onAdd={onAdd} onRemove={onRemove} onOpen={onOpen} fuelType={fuelType}
        currency={currency} fxRates={fxRates} trends={trends}
      />
      <AdsterraNativeAd location="compare-after-watchlist" />
      <article className="contentPage">
        <section className="contentSection">
          <h2 className="contentHeading">{t.compareEditorialTitle}</h2>
          <p className="contentBody">{t.compareEditorialP1}</p>
          <p className="contentBody">{t.compareEditorialP2}</p>
          <p className="contentBody">{t.compareEditorialP3}</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">{lang === "sq" ? "Shembuj sipas karburantit të zgjedhur" : "Examples for the selected fuel"}</h2>
          <p className="contentBody">{lang === "sq"
            ? "Krahasimet më poshtë përdorin leximet orientuese të datuara. Ndryshoni karburantin për të parë se si mund të ndryshojë drejtimi i diferencës."
            : "These examples use the dated national reference readings. Switch fuel type to see how the direction of a gap can change."}</p>
          {examples.map(({ country, sentence }) => (
            <div key={country}>
              <h3 className="contentHeading">{country} / {lang === "sq" ? "Shqipëri" : "Albania"}</h3>
              <p className="contentBody">{sentence}</p>
            </div>
          ))}
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">{lang === "sq" ? "Planifikoni rrugën" : "Plan the route"}</h2>
          <p className="contentBody">{lang === "sq"
            ? "Shtoni vendet e rrugës në listën tuaj, krahasoni të njëjtin karburant dhe kontrolloni datën e secilit treg. Diferenca orientuese nuk përfshin çmimin real në pompë, devijimet apo pagesat e rrugës."
            : "Add the countries on your route to the watchlist, compare the same fuel and check each market's source date. Reference-price differences exclude actual pumps, detours and tolls."}</p>
          <p className="contentBody"><Link className="inlineLink" to="/trip-cost-calculator">{lang === "sq" ? "Llogarit koston e udhëtimit" : "Calculate trip fuel cost"}</Link> · <Link className="inlineLink" to="/methodology">{lang === "sq" ? "Metodologjia" : "Methodology"}</Link></p>
        </section>
      </article>
    </>
  );
}
