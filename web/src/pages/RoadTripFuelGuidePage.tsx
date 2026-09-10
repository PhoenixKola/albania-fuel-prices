import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";
import AdBar from "../components/ads/AdBar";

import type { Lang } from "../models/i18n";
import { TravelLinks } from "../components/content/TravelLinks";
import RentalReferral from "../components/ads/RentalReferral";
import RoadStatusLink from "../components/road/RoadStatusLink";
type Props = { t: TDict; lang: Lang };

export default function RoadTripFuelGuidePage({ t, lang }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.roadTripTitle}</h1>
      <p className="contentBody">{t.roadTripIntro}</p>
      <TravelLinks lang={lang} />

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

      <AdBar placement="content" />
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
        <h2 className="contentHeading">{lang === "sq" ? "Shembuj itinerarësh nga Shqipëria" : "Route examples from Albania"}</h2>
        <ul className="contentList">
          <li>{lang === "sq" ? "Tiranë–Shkodër: i dobishëm për buxhetimin e udhëtimeve të shkurtra brenda vendit dhe krahasimin e ndikimit të naftës me benzinën." : "Tirana to Shkoder: useful for short domestic budgeting and diesel-vs-petrol sensitivity checks."}</li>
          <li>{lang === "sq" ? "Tiranë–Prishtinë: itinerar ndërkufitar ku ndryshimet e çmimeve në Kosovë mund të ndryshojnë ndjeshëm koston totale." : "Tirana to Pristina: cross-border route where Kosovo price differences can materially change total cost."}</li>
          <li>{lang === "sq" ? "Tiranë–Ohër: itinerar malor ku supozimet për konsumin kanë më shumë rëndësi sesa në lëvizjet brenda qytetit." : "Tirana to Ohrid: mountainous route where consumption assumptions matter more than city commuting."}</li>
          <li>{lang === "sq" ? "Tiranë–Podgoricë: korridor rajonal ku çmimet në Mal të Zi mund të ndryshojnë strategjinë e furnizimit." : "Tirana to Podgorica: regional corridor where Montenegro price context can shift fueling strategy."}</li>
        </ul>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{lang === "sq" ? "Ndryshimet në planifikim për benzinën, naftën dhe LPG-në" : "Petrol, diesel, and LPG planning differences"}</h2>
        <p className="contentBody">
          {lang === "sq" ? "Makinat me benzinë shpesh e kanë më të lehtë furnizimin falë mbulimit të gjerë të stacioneve, ndërsa nafta mund të përmirësojë efikasitetin në distanca të gjata sipas makinës dhe mënyrës së drejtimit. LPG-ja mund të kushtojë më pak për litër aty ku gjendet, por mbulimi i stacioneve dhe kufizimet e sistemit të rezervuarit duhen kontrolluar paraprakisht." : "Petrol vehicles are often simpler for broad station coverage, while diesel can improve long-distance efficiency depending on vehicle type and driving profile. LPG can be cheaper per liter where available, but station coverage and tank setup constraints should be checked in advance."}
        </p>
        <p className="contentBody">
          {lang === "sq" ? "Për çmimet sipas vendit, hap " : "For country-specific price context, open "}<Link to="/fuel-prices/albania" className="inlineLink">{lang === "sq" ? "çmimet e karburantit në Shqipëri" : "Albania fuel prices"}</Link>{lang === "sq" ? " dhe krahasoji me itineraret fqinje te " : " and compare with neighboring routes in "}<Link to="/europe-fuel-comparison" className="inlineLink">{lang === "sq" ? "krahasimi i Europës" : "Europe comparison"}</Link>.
        </p>
      </section>

      <RoadStatusLink lang={lang} />
      <RentalReferral lang={lang} placement="roadTrip" />
      <AdBar placement="articleEnd" />
    </article>
  );
}
