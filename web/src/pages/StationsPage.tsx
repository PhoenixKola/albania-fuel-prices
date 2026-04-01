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
        <h2 className="pageHeaderTitle">{t.navStations}</h2>
        <p className="pageHeaderSub">{t.nearbyGuidance}</p>
      </div>
      <NearbyStationsCard t={t} radiusM={radiusM} setRadiusM={setRadiusM} />
    </>
  );
}
