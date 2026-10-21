import gazetteer from "./albaniaPlaces.json";

export type StationPlace = {
  id: string;
  en: string;
  sq: string;
  lat: number;
  lon: number;
  region?: string;
};

export const PLACE_SOURCE = "GeoNames · CC BY 4.0";
export const PLACE_SOURCE_URL = "https://www.geonames.org/";
export const PLACE_SNAPSHOT_DATE = gazetteer.retrieved;

function fold(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

/** Bundled gazetteer: search never needs location permission or a live geocoder. */
export function searchAlbaniaPlaces(query: string, limit = 12): StationPlace[] {
  const needle = fold(query);
  if (needle.length < 2) return [];
  const matches = gazetteer.places.filter((place) => fold(place.name).includes(needle) || fold(place.ascii).includes(needle));
  matches.sort((a, b) => {
    const aPrefix = fold(a.name).startsWith(needle) ? 0 : 1;
    const bPrefix = fold(b.name).startsWith(needle) ? 0 : 1;
    return aPrefix - bPrefix || b.population - a.population || a.name.localeCompare(b.name);
  });
  return matches.slice(0, limit).map((place) => ({
    id: `geonames:${place.id}`, en: place.name, sq: place.name,
    lat: place.lat, lon: place.lon, region: place.region,
  }));
}
