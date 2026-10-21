import albaniaRing from "../data/albaniaBoundary.json";

export type StationSource = "snapshot" | "global";

/** Natural Earth 1:50m boundary via world-atlas (public-domain geography). */
export function inAlbaniaSnapshotArea(lat: number, lon: number) {
  let inside = false;
  for (let i = 0, j = albaniaRing.length - 1; i < albaniaRing.length; j = i++) {
    const [x1, y1] = albaniaRing[i];
    const [x2, y2] = albaniaRing[j];
    if ((y1 > lat) !== (y2 > lat) && lon < ((x2 - x1) * (lat - y1)) / (y2 - y1) + x1) inside = !inside;
  }
  return inside;
}

export function stationEndpoint(lat: number, lon: number, radiusM: number): { url: string; source: StationSource } {
  const snapshot = inAlbaniaSnapshotArea(lat, lon);
  return snapshot
    ? { source: "snapshot", url: `https://fuel-proxy.fenixkola.workers.dev?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&radiusM=${encodeURIComponent(radiusM)}` }
    : { source: "global", url: `https://overpass.private.coffee/api/interpreter?data=${encodeURIComponent(`[out:json][timeout:15];(node["amenity"="fuel"](around:${radiusM},${lat},${lon});way["amenity"="fuel"](around:${radiusM},${lat},${lon}););out center;`)}` };
}

export function stationFallbackUrl(url: string, source: StationSource): string | null {
  return source === "global" ? url.replace("https://overpass.private.coffee/api/interpreter", "https://overpass-api.de/api/interpreter") : null;
}
