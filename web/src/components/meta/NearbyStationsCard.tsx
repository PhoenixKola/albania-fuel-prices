import { useMemo, useRef, useState } from "react";
import type { TDict } from "../../locales";
import { useUserLocationWeb } from "../../hooks/useUserLocationWeb";
import { useNearbyStationsWeb } from "../../hooks/useNearbyStationsWeb";
import StationMapPreview from "./StationMapPreview";
import StationPlacePicker from "./StationPlacePicker";
import { ALBANIA_STATION_SNAPSHOT_DATE } from "../../config/stationSnapshot";

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
  const [placePickerOpen, setPlacePickerOpen] = useState(false);
  const placeButtonRef = useRef<HTMLButtonElement>(null);

  const pageCount = Math.max(1, Math.ceil(nearby.stations.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount - 1);
  const shown = useMemo(
    () => nearby.stations.slice(activePage * PAGE_SIZE, activePage * PAGE_SIZE + PAGE_SIZE),
    [nearby.stations, activePage]
  );

  const radiusDisabled = !loc.coords;

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
              <h1 className="nearbyTitle">{t.stationsNearbyTitle}</h1>
              <div className="nearbySub">
                {loc.place ? `${t.stationsManualMode} · ${t.stationsNearPlace(loc.place.name)}` : loc.coords ? t.stationsGpsMode : t.stationsUseMyLocation}
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
          {nearby.source === "global" ? t.nearbyGuidanceGlobal : `${t.stationsSnapshotDate(ALBANIA_STATION_SNAPSHOT_DATE)}. ${t.nearbyGuidance}`}
        </p>

        <div className="nearbyStats">
          <div className="nearbyStat">
            <div className="nearbyStatLabel">{t.stationsRadius}</div>
            <div className="nearbyStatValue">{radiusM / 1000} km</div>
          </div>

          <div className="nearbyStat">
            <div className="nearbyStatLabel">{t.stationsNearbyTitle}</div>
            <div className="nearbyStatValue">{nearby.error && !nearby.totalCount ? "—" : nearby.totalCount}</div>
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

        <div className="nearbyEmptyAction stationLocationActions">
            <button
              className="btn btn-primary nearbyLocateBtn"
              type="button"
              onClick={() => { setPage(0); loc.request(); }}
              disabled={loc.loading}
            >
              {loc.loading ? t.stationsGettingLocation : t.stationsUseMyLocation}
            </button>
            <button ref={placeButtonRef} className="btn btn-ghost nearbyLocateBtn" type="button" aria-expanded={placePickerOpen} onClick={() => setPlacePickerOpen((open) => !open)}>{t.stationsChoosePlace}</button>
          </div>
        {placePickerOpen ? <StationPlacePicker t={t} onSelect={(place) => { setPage(0); loc.selectPlace(place); setPlacePickerOpen(false); placeButtonRef.current?.focus(); }} onClose={() => { setPlacePickerOpen(false); placeButtonRef.current?.focus(); }} /> : null}
        {loc.coords ? (
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
                    disabled={nearby.loading || activePage === 0}
                  >
                    {t.stationsPrevious}
                  </button>
                  <span className="badge nearbyPageBadge">{t.stationsPage(activePage + 1, pageCount)}</span>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                    disabled={nearby.loading || activePage >= pageCount - 1}
                  >
                    {t.stationsNext}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        {loc.error ? <div className="alert nearbyAlert" role="alert">{t.stationsLocationError(loc.error)}</div> : null}
        {nearby.error ? <div className="alert nearbyAlert" role="alert">{t.stationsProviderError(nearby.error)} {nearby.previouslyLoaded ? t.stationsPreviouslyLoaded : null}</div> : null}
        {loc.coords && nearby.hasRetrieved && !nearby.loading && !nearby.error ? <p className="tinyNote">{t.stationsRetrievedNow}</p> : null}

        {loc.coords ? (
          <div className="nearbyMapListGrid">
            <StationMapPreview
              center={loc.coords}
              stations={shown}
              t={t}
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

              {nearby.stations.length === 0 && !nearby.loading && !nearby.error ? (
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
                    <div className="nearbyRowIndex">{activePage * PAGE_SIZE + index + 1}</div>

                    <div className="nearbyRowText">
                      <div className="nearbyRowName">{s.name || t.stationsUnnamed}</div>

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
                    <div className="nearbyDistancePill">{t.stationsDistance(s.distanceKm)}</div>
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
