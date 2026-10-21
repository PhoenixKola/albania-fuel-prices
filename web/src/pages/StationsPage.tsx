import { Link } from "react-router-dom";
import type { TDict } from "../locales";
import NearbyStationsCard from "../components/meta/NearbyStationsCard";
import RoadStatusLink from "../components/road/RoadStatusLink";
import type { Lang } from "../models/i18n";
import AdsterraNativeAd from "../components/ads/AdsterraNativeAd";
import { ALBANIA_PLACE_LIST_RETRIEVED, ALBANIA_STATION_SNAPSHOT_DATE } from "../config/stationSnapshot";

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
            ? `Mund të përdorni vendndodhjen tuaj ose të zgjidhni një vend në Shqipëri. ${t.stationsSnapshotDate(ALBANIA_STATION_SNAPSHOT_DATE)}; jashtë Shqipërisë kërkimi përdor shërbime publike OpenStreetMap. Mbulimi mund të jetë i paplotë. Distancat janë në vijë të drejtë, jo itinerare; oraret mund të jenë të vjetruara.`
            : `Use your location or choose an Albanian place. ${t.stationsSnapshotDate(ALBANIA_STATION_SNAPSHOT_DATE)}; searches outside Albania use public OpenStreetMap services. Coverage may be incomplete. Distances are straight-line measurements, not driving routes; listed hours may be outdated.`}</p>
          <p className="contentBody">{sq ? "Të dhënat e hartës: © kontribuesit e OpenStreetMap (ODbL)." : "Map data: © OpenStreetMap contributors (ODbL)."} <a className="inlineLink" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></p>
          <p className="contentBody">{t.stationsPlacesSource(ALBANIA_PLACE_LIST_RETRIEVED)} <a className="inlineLink" href="https://www.geonames.org/" target="_blank" rel="noopener noreferrer">GeoNames (CC BY 4.0)</a></p>
          <p className="contentBody">{sq
            ? "Kjo faqe nuk shfaq çmime aktuale në pompa të veçanta. Vlerat në faqen kryesore dhe në renditje janë referenca kombëtare të datuara. Konfirmoni çmimin dhe orarin te pika përpara një devijimi të posaçëm."
            : "This page does not show current prices at individual pumps. Home and ranking values are dated country-level references. Confirm the station's price and hours before making a special detour."}</p>
        </section>
        <section className="contentSection">
          <h2 className="contentHeading">{sq ? "Vendndodhja dhe privatësia" : "Location and privacy"}</h2>
          <p className="contentBody">{sq
            ? "Kur zgjidhni kërkimin pranë, shfletuesi dërgon koordinatat te shërbimi ynë për Shqipërinë ose te një shërbim publik Overpass jashtë saj. Nuk e përdorim vendndodhjen për reklama apo për të ndërtuar historik lëvizjesh."
            : "When you choose a nearby search, your browser sends coordinates to our station service for Albania or a public Overpass service elsewhere. We do not use your location for advertising or to build a movement history."}</p>
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
