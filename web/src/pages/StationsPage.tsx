import type { TDict } from "../locales";
import NearbyStationsCard from "../components/meta/NearbyStationsCard";

type Props = {
  t: TDict;
  radiusM: number;
  setRadiusM: (v: number) => void;
};

export default function StationsPage({ t, radiusM, setRadiusM }: Props) {
  return (
    <>
      <div className="pageHeader">
        <h1 className="pageHeaderTitle">{t.navStations}</h1>
        <p className="pageHeaderSub">{t.nearbyGuidance}</p>
      </div>
      <NearbyStationsCard t={t} radiusM={radiusM} setRadiusM={setRadiusM} />

      <article className="contentPage">
        <section className="contentSection">
          <h2 className="contentHeading">{t.stationsEditorialTitle}</h2>
          <p className="contentBody">{t.stationsEditorialP1}</p>
          <p className="contentBody">{t.stationsEditorialP2}</p>
          <p className="contentBody">{t.stationsEditorialP3}</p>
        </section>
        <section className="contentSection">
          <h3 className="contentHeading">{t.stationsEditorialTipTitle}</h3>
          <p className="contentBody">{t.stationsEditorialTip}</p>
        </section>
      </article>
    </>
  );
}
