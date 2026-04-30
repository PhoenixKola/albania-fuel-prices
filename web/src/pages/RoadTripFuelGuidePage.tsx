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

      <section className="contentSection">
        <h2 className="contentHeading">Route examples from Albania</h2>
        <ul className="contentList">
          <li>Tirana to Shkoder: useful for short domestic budgeting and diesel-vs-petrol sensitivity checks.</li>
          <li>Tirana to Pristina: cross-border route where Kosovo price differences can materially change total cost.</li>
          <li>Tirana to Ohrid: mountainous route where consumption assumptions matter more than city commuting.</li>
          <li>Tirana to Podgorica: regional corridor where Montenegro price context can shift fueling strategy.</li>
        </ul>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Petrol, diesel, and LPG planning differences</h2>
        <p className="contentBody">
          Petrol vehicles are often simpler for broad station coverage, while diesel can improve long-distance efficiency depending on vehicle type and driving profile. LPG can be cheaper per liter where available, but station coverage and tank setup constraints should be checked in advance.
        </p>
        <p className="contentBody">
          For country-specific price context, open <Link to="/fuel-prices/albania" className="inlineLink">Albania fuel prices</Link> and compare with neighboring routes in <Link to="/europe-fuel-comparison" className="inlineLink">Europe comparison</Link>.
        </p>
      </section>
    </article>
  );
}
