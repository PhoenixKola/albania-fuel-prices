import { useMemo, useState } from "react";
import type { TDict } from "../../locales";
import { useUserLocationWeb } from "../../hooks/useUserLocationWeb";
import { useNearbyStationsWeb } from "../../hooks/useNearbyStationsWeb";

type Station = {
  id: string | number;
  name: string;
  distanceKm: number;
  lat: number;
  lon: number;
};

type Props = {
  t: TDict;
  radiusM: number;
  setRadiusM: (v: number) => void;
};

export default function NearbyStationsCard({ t, radiusM, setRadiusM }: Props) {
  const loc = useUserLocationWeb();
  const nearby = useNearbyStationsWeb(loc.coords, radiusM);

  const radiusItems = useMemo(
    () => [
      { v: 2000, label: t.stations2km },
      { v: 5000, label: t.stations5km },
      { v: 10000, label: t.stations10km },
    ],
    [t]
  );

  const [visible, setVisible] = useState(10);

  const shown = useMemo(() => nearby.stations.slice(0, visible), [nearby.stations, visible]);

  const canCollapse = visible > 10;
  const canShowMore = visible < nearby.stations.length;
  const canShowAll = visible < nearby.stations.length;
  const showActions = canCollapse || canShowMore || canShowAll;

  const radiusDisabled = !loc.coords || nearby.loading;

  const onChangeRadius = (v: number) => {
    if (radiusDisabled) return;
    setVisible(10);
    setRadiusM(v);
  };

  const onRefresh = () => {
    if (!loc.coords || nearby.loading) return;
    setVisible(10);
    nearby.refresh();
  };

  return (
    <div className="card">
      <div className="cardHeader cardHeaderRow">
        <div>
          <div className="cardTitle">{t.stationsNearbyTitle}</div>
          {loc.coords ? <div className="cardSubtle">{t.stationsFound(nearby.totalCount)}</div> : null}
        </div>

        <div className="headerActions">
          <button className="btn btn-ghost" type="button" onClick={onRefresh} disabled={!loc.coords || nearby.loading}>
            {nearby.loading ? "…" : t.stationsRefresh}
          </button>
        </div>
      </div>

      <div className="body">
        <div className="toolbarRow">
          <div className="label">{t.stationsRadius}</div>

          <div className="segRow">
            {radiusItems.map((it) => (
              <button
                key={it.v}
                type="button"
                className={`seg ${radiusM === it.v ? "segActive" : ""}`}
                onClick={() => onChangeRadius(it.v)}
                disabled={radiusDisabled}
                aria-disabled={radiusDisabled}
                title={nearby.loading ? "Loading…" : ""}
              >
                {it.label}
              </button>
            ))}

            {nearby.loading ? <span className="badge">Loading…</span> : null}
          </div>
        </div>

        {!loc.coords ? (
          <button className="btn btn-primary" type="button" onClick={loc.request} disabled={loc.loading || loc.checking}>
            {loc.loading || loc.checking ? t.stationsGettingLocation : t.stationsUseMyLocation}
          </button>
        ) : (
          <div className="toolbarRow" style={{ marginTop: 10 }}>
            <div className="badge">{t.stationsShowing(shown.length, nearby.totalCount)}</div>

            <div className="segRow">
              {showActions ? (
                <>
                  {canCollapse ? (
                    <button className="btn btn-ghost" type="button" onClick={() => setVisible(10)} disabled={nearby.loading}>
                      {t.stationsCollapse}
                    </button>
                  ) : null}

                  {canShowMore ? (
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => setVisible((p) => Math.min(p + 10, nearby.stations.length))}
                      disabled={nearby.loading}
                    >
                      {t.stationsShowMore}
                    </button>
                  ) : null}

                  {canShowAll ? (
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() => setVisible(nearby.stations.length)}
                      disabled={nearby.loading}
                    >
                      {t.stationsShowAll}
                    </button>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        )}

        {loc.error ? <div className="alert">{loc.error}</div> : null}
        {nearby.error ? <div className="alert">{nearby.error}</div> : null}

        {loc.coords ? (
          <div className="tableWrap">
            <div className="table">
              {nearby.stations.length === 0 && !nearby.loading ? <div className="mutedBox">{t.stationsNone}</div> : null}

              {shown.map((s: Station) => (
                <div key={s.id} className="tRow">
                  <div className="tLeft">{s.name}</div>
                  <div className="tMid">{s.distanceKm.toFixed(2)} km</div>
                  <div className="tRight">
                    <a
                      className="btn btn-ghost"
                      href={`https://www.google.com/maps?q=${s.lat},${s.lon}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.stationsOpen}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}