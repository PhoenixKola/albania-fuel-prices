import { Link } from "react-router-dom";
import type { TDict } from "../locales";
import NearbyStationsCard from "../components/meta/NearbyStationsCard";
import RoadStatusLink from "../components/road/RoadStatusLink";
import type { Lang } from "../models/i18n";
import AdsterraNativeAd from "../components/ads/AdsterraNativeAd";

type Props = { t: TDict; lang: Lang; radiusM: number; setRadiusM: (value: number) => void };

export default function StationsPage({ t, lang, radiusM, setRadiusM }: Props) {
  const sq = lang === "sq";
  return (
    <>
      <NearbyStationsCard t={t} radiusM={radiusM} setRadiusM={setRadiusM} />
      <RoadStatusLink lang={lang} />
      <AdsterraNativeAd location="stations-after-map-tool" />
      <article className="contentPage">
        <section className="contentSection">
          <h2 className="contentHeading">{sq ? "Çfarë tregon harta" : "What the map shows"}</h2>
          <p className="contentBody">{sq
            ? "Me lejen tuaj për vendndodhjen, mjeti kërkon pika karburanti të shënuara në OpenStreetMap brenda rrezes së zgjedhur. Distancat janë afërsisht në vijë të drejtë, jo itinerare drejtimi. Orari shfaqet vetëm kur është listuar dhe mund të jetë i vjetruar."
            : "With your location permission, the tool looks for fuel stations mapped in OpenStreetMap within your chosen radius. Distances are approximate straight-line distances, not driving routes. Opening hours appear only when listed and may be outdated."}</p>
          <p className="contentBody">{sq
            ? "Kjo faqe nuk shfaq çmime aktuale në pompa të veçanta. Vlerat në faqen kryesore dhe në renditje janë referenca kombëtare të datuara. Konfirmoni çmimin dhe orarin te pika përpara një devijimi të posaçëm."
            : "This page does not show current prices at individual pumps. Home and ranking values are dated country-level references. Confirm the station's price and hours before making a special detour."}</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">{sq ? "Vendndodhja dhe privatësia" : "Location and privacy"}</h2>
          <p className="contentBody">{sq
            ? "Kur zgjidhni kërkimin pranë, shfletuesi dërgon koordinatat te shërbimi ynë i kërkimit të pikave. Ky shërbim mund të pyesë OpenStreetMap/Overpass për vendndodhje të hartuara. Nuk e përdorim vendndodhjen për reklama apo për të ndërtuar një historik vendndodhjesh. Mund të refuzoni lejen dhe të përdorni pjesën tjetër të faqes."
            : "When you choose a nearby search, your browser sends coordinates to our station lookup service. That service may query OpenStreetMap/Overpass for mapped locations. We do not use your location for advertising or to build a location history. You can decline permission and still use the rest of the site."}</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">{sq ? "Planifikoni me kontekst" : "Plan with context"}</h2>
          <ul className="contentList">
            <li><Link className="inlineLink" to="/fuel-prices/albania">{sq ? "Çmimet orientuese në Shqipëri" : "Albania reference prices"}</Link></li>
            <li><Link className="inlineLink" to="/trip-cost-calculator">{sq ? "Llogaritësi i udhëtimit" : "Trip cost calculator"}</Link></li>
            <li><Link className="inlineLink" to="/road-status">{sq ? "Gjendja e rrugëve" : "Road status"}</Link></li>
            <li><Link className="inlineLink" to="/methodology">{sq ? "Metodologjia e të dhënave" : "Data methodology"}</Link></li>
          </ul>
        </section>
      </article>
    </>
  );
}
