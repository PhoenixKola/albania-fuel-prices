import { useEffect, useMemo, useState } from "react";
import type { TDict } from "../../locales";
import { useUserLocationWeb } from "../../hooks/useUserLocationWeb";
import { useNearbyStationsWeb } from "../../hooks/useNearbyStationsWeb";
import StationMapPreview from "./StationMapPreview";

type Station = {
  id: string | number;
  name: string;
  brand?: string;
  distanceKm: number;
  lat: number;
  lon: number;
  openingHours?: string;
  isOpen24Hours?: boolean;
  isOpenNow?: boolean | null;
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
      { v: 10000, label: t.stations10km }
    ],
    [t]
  );

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(nearby.stations.length / PAGE_SIZE));
  const shown = useMemo(
    () => nearby.stations.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [nearby.stations, page]
  );

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  const radiusDisabled = !loc.coords || nearby.loading;

  const onChangeRadius = (v: number) => {
    if (radiusDisabled) return;
    setPage(0);
    setRadiusM(v);
  };

  const onRefresh = () => {
    if (!loc.coords || nearby.loading) return;
    setPage(0);
    nearby.refresh();
  };

  return (
    <div className="card nearbyCard">
      <div className="nearbyTop">
        <div className="nearbyTopRow">
          <div className="nearbyTopText">
            <div className="nearbyTitleWrap">
              <div className="nearbyTitle">{t.stationsNearbyTitle}</div>
              <div className="nearbySub">
                {loc.coords ? t.stationsFound(nearby.totalCount) : t.stationsUseMyLocation}
              </div>
            </div>
          </div>

          <div className="headerActions nearbyHeaderActions">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={onRefresh}
              disabled={!loc.coords || nearby.loading}
            >
              {nearby.loading ? (
                <>
                  <span className="spinner spinnerSm" aria-hidden="true" />
                  {t.refreshing}
                </>
              ) : (
                t.stationsRefresh
              )}
            </button>
          </div>
        </div>

        <p className="tinyNote" style={{ marginTop: 10, lineHeight: 1.7 }}>
          {t.nearbyGuidance}
        </p>

        <div className="nearbyStats">
          <div className="nearbyStat">
            <div className="nearbyStatLabel">{t.stationsRadius}</div>
            <div className="nearbyStatValue">{radiusM / 1000} km</div>
          </div>

          <div className="nearbyStat">
            <div className="nearbyStatLabel">{t.stationsNearbyTitle}</div>
            <div className="nearbyStatValue">{nearby.totalCount}</div>
          </div>

          <div className="nearbyStat">
            <div className="nearbyStatLabel">{t.stationsShowAll}</div>
            <div className="nearbyStatValue">{shown.length}</div>
          </div>
        </div>
      </div>

      <div className="body nearbyBody">
        <div className="nearbySection">
          <div className="toolbarRow nearbyToolbar">
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
                  title={nearby.loading ? t.refreshing : ""}
                >
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!loc.coords ? (
          <div className="nearbyEmptyAction">
            <button
              className="btn btn-primary nearbyLocateBtn"
              type="button"
              onClick={loc.request}
              disabled={loc.loading || loc.checking}
            >
              {loc.loading || loc.checking ? t.stationsGettingLocation : t.stationsUseMyLocation}
            </button>
          </div>
        ) : (
          <div className="nearbyControlBar">
            <div className="badge">
              {nearby.loading ? (
                <span className="inlineLoading">
                  <span className="spinner spinnerSm" aria-hidden="true" />
                  {t.refreshing}
                </span>
              ) : (
                t.stationsShowing(shown.length, nearby.totalCount)
              )}
            </div>

            <div className="segRow nearbyActionRow">
              {nearby.stations.length > PAGE_SIZE ? (
                <>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={nearby.loading || page === 0}
                  >
                    Prev
                  </button>
                  <span className="badge nearbyPageBadge">Page {page + 1} / {pageCount}</span>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    disabled={nearby.loading || page >= pageCount - 1}
                  >
                    Next
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}

        {loc.error ? <div className="alert nearbyAlert">{loc.error}</div> : null}
        {nearby.error ? <div className="alert nearbyAlert">{nearby.error}</div> : null}

        {loc.coords ? (
          <div className="nearbyMapListGrid">
            <StationMapPreview
              center={loc.coords}
              stations={shown}
              onSelect={(station) => {
                window.open(`https://www.google.com/maps?q=${station.lat},${station.lon}`, "_blank", "noopener,noreferrer");
              }}
            />

            <div className="tableWrap nearbyTableWrap">
              <div className="table nearbyTable">
              {nearby.loading && shown.length === 0 ? (
                <div className="mutedBox nearbyLoadingBox">
                  <span className="spinner" aria-hidden="true" />
                  <span>{t.refreshing}</span>
                </div>
              ) : null}

              {nearby.stations.length === 0 && !nearby.loading ? (
                <div className="mutedBox">{t.stationsNone}</div>
              ) : null}

              {shown.map((s: Station, index) => (
                <a
                  key={s.id}
                  className="nearbyRow"
                  href={`https://www.google.com/maps?q=${s.lat},${s.lon}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="nearbyRowLeft">
                    <div className="nearbyRowIndex">{page * PAGE_SIZE + index + 1}</div>

                    <div className="nearbyRowText">
                      <div className="nearbyRowName">{s.name}</div>

                      {/* <div className="nearbyRowMeta">
                        {s.brand ? `${s.brand} • ` : ""}
                        {s.distanceKm.toFixed(2)} km
                      </div> */}

                      {s.isOpen24Hours ? (
                        <div className="nearbyHoursBadge">24h</div>
                      ) : s.isOpenNow === true ? (
                        <div className="nearbyHoursBadge">{t.stationsOpenNow}</div>
                      ) : s.isOpenNow === false ? (
                        <div className="nearbyHoursBadge nearbyHoursBadgeClosed">{t.stationsClosed}</div>
                      ) : (
                        <div className="nearbyHoursBadge">{t.stationsHoursUnknown}</div>
                      )}
                    </div>
                  </div>

                  <div className="nearbyRowRight">
                    <div className="nearbyDistancePill">{s.distanceKm.toFixed(2)} km</div>
                  </div>
                </a>
              ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
