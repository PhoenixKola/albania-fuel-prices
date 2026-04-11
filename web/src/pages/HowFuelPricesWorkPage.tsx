import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function HowFuelPricesWorkPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.howPricesTitle}</h1>
      <p className="contentBody">{t.howPricesIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.howPricesCrudeTitle}</h2>
        <p className="contentBody">{t.howPricesCrudeP1}</p>
        <p className="contentBody">{t.howPricesCrudeP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.howPricesRefiningTitle}</h2>
        <p className="contentBody">{t.howPricesRefiningP1}</p>
        <p className="contentBody">{t.howPricesRefiningP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.howPricesDistributionTitle}</h2>
        <p className="contentBody">{t.howPricesDistributionP1}</p>
        <p className="contentBody">{t.howPricesDistributionP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.howPricesTaxTitle}</h2>
        <p className="contentBody">{t.howPricesTaxP1}</p>
        <p className="contentBody">{t.howPricesTaxP2}</p>
        <p className="contentBody">{t.howPricesTaxP3}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.howPricesRetailTitle}</h2>
        <p className="contentBody">{t.howPricesRetailP1}</p>
        <p className="contentBody">{t.howPricesRetailP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.howPricesSeasonalTitle}</h2>
        <p className="contentBody">{t.howPricesSeasonalP1}</p>
        <p className="contentBody">{t.howPricesSeasonalP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.howPricesSummaryTitle}</h2>
        <p className="contentBody">{t.howPricesSummaryP1}</p>
        <p className="contentBody">
          <Link to="/methodology" className="inlineLink">{t.navMethodology}</Link>
          {" · "}
          <Link to="/europe-fuel-comparison" className="inlineLink">{t.navEuropeComparison}</Link>
          {" · "}
          <Link to="/road-trip-fuel-guide" className="inlineLink">{t.navRoadTripGuide}</Link>
        </p>
      </section>
    </article>
  );
}
