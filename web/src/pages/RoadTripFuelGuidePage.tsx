import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function RoadTripFuelGuidePage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.roadTripTitle}</h1>
      <p className="contentBody">{t.roadTripIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.roadTripCalcTitle}</h2>
        <p className="contentBody">{t.roadTripCalcP1}</p>
        <p className="contentBody">{t.roadTripCalcP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.roadTripConsumptionTitle}</h2>
        <p className="contentBody">{t.roadTripConsumptionP1}</p>
        <p className="contentBody">{t.roadTripConsumptionP2}</p>
        <p className="contentBody">{t.roadTripConsumptionP3}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.roadTripCrossBorderTitle}</h2>
        <p className="contentBody">{t.roadTripCrossBorderP1}</p>
        <p className="contentBody">{t.roadTripCrossBorderP2}</p>
        <p className="contentBody">{t.roadTripCrossBorderP3}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.roadTripPaymentTitle}</h2>
        <p className="contentBody">{t.roadTripPaymentP1}</p>
        <p className="contentBody">{t.roadTripPaymentP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.roadTripSavingsTitle}</h2>
        <ul className="contentList">
          <li>{t.roadTripSavingsP1}</li>
          <li>{t.roadTripSavingsP2}</li>
          <li>{t.roadTripSavingsP3}</li>
          <li>{t.roadTripSavingsP4}</li>
          <li>{t.roadTripSavingsP5}</li>
        </ul>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.roadTripExampleTitle}</h2>
        <p className="contentBody">{t.roadTripExampleP1}</p>
        <p className="contentBody">{t.roadTripExampleP2}</p>
        <p className="contentBody">{t.roadTripExampleP3}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.roadTripSummaryTitle}</h2>
        <p className="contentBody">{t.roadTripSummaryP1}</p>
        <p className="contentBody">
          <Link to="/how-fuel-prices-work" className="inlineLink">{t.navHowPricesWork}</Link>
          {" · "}
          <Link to="/europe-fuel-comparison" className="inlineLink">{t.navEuropeComparison}</Link>
          {" · "}
          <Link to="/methodology" className="inlineLink">{t.navMethodology}</Link>
        </p>
      </section>
    </article>
  );
}
