import { useEffect, useMemo, useRef, useState } from "react";
import type { TDict } from "../../locales";
import { searchPlaces, type PlaceGazetteer, type StationPlace } from "../../utils/stationPlaces";
import { ALBANIA_PLACE_LIST_RETRIEVED } from "../../config/stationSnapshot";

type Props = { t: TDict; onSelect: (place: StationPlace) => void; onClose: () => void };

export default function StationPlacePicker({ t, onSelect, onClose }: Props) {
  const [gazetteer, setGazetteer] = useState<PlaceGazetteer | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let active = true;
    import("../../data/albaniaPlaces.json").then((module) => {
      if (active) setGazetteer(module.default as PlaceGazetteer);
    }).catch(() => { if (active) setFailed(true); });
    inputRef.current?.focus();
    return () => { active = false; };
  }, []);
  const matches = useMemo(() => searchPlaces(gazetteer?.places ?? [], query), [gazetteer, query]);
  return (
    <section className="stationPlacePicker" aria-label={t.stationsChoosePlace} onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}>
      <div className="stationPlaceHead"><strong>{t.stationsChoosePlace}</strong><button type="button" className="btn btn-ghost" onClick={onClose} aria-label={t.stationsClosePlacePicker}>×</button></div>
      <label htmlFor="station-place-search">{t.stationsSearchPlace}</label>
      <input ref={inputRef} id="station-place-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.stationsSearchPlaceHint} autoComplete="off" />
      <p className="stationPlaceStatus" role="status" aria-live="polite">{failed ? t.stationsPlacesUnavailable : !gazetteer ? t.stationsPlacesLoading : query.trim().length < 2 ? t.stationsPlacePrompt : matches.length ? t.stationsPlaceResults(matches.length) : t.stationsNoPlaces}</p>
      {matches.length > 0 && query.trim().length >= 2 ? <div className="stationPlaceResults">{matches.map((place) => <button type="button" key={place.id} onClick={() => onSelect(place)}><span>{place.name}</span><small>{place.region}</small></button>)}</div> : null}
      <p className="stationPlaceCredit">{t.stationsPlacesSource(gazetteer?.retrieved ?? ALBANIA_PLACE_LIST_RETRIEVED)} <a href="https://www.geonames.org/" target="_blank" rel="noopener noreferrer">GeoNames · CC BY 4.0</a></p>
    </section>
  );
}
