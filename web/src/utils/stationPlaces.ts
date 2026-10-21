export type StationPlace = { id: number; name: string; ascii: string; lat: number; lon: number; region: string; population: number };
export type PlaceGazetteer = { source: string; retrieved: string; places: StationPlace[] };

export function normalizePlace(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function searchPlaces(places: StationPlace[], query: string, limit = 24) {
  const needle = normalizePlace(query);
  if (needle.length < 2) return [];
  const matches = places.filter((place) => normalizePlace(place.name).includes(needle) || normalizePlace(place.ascii).includes(needle));
  const rank = (place: StationPlace) => {
    const name = normalizePlace(place.name);
    const ascii = normalizePlace(place.ascii);
    return name === needle || ascii === needle ? 0 : name.startsWith(needle) || ascii.startsWith(needle) ? 1 : 2;
  };
  return matches.sort((a, b) => rank(a) - rank(b) || b.population - a.population || a.name.localeCompare(b.name)).slice(0, limit);
}
