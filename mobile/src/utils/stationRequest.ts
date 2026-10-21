import { OVERPASS_URL } from "../constants/urls";
import albaniaRing from "../data/albaniaBoundary.json";

type Center = { lat: number; lon: number };
export type StationSource = "snapshot" | "global";
const GLOBAL_URL = "https://overpass.private.coffee/api/interpreter";
const GLOBAL_BACKUP_URL = "https://overpass-api.de/api/interpreter";

/** Natural Earth 1:50m boundary via world-atlas (public-domain geography). */
export function inAlbaniaSnapshotArea(center: Center) {
  let inside = false;
  for (let i = 0, j = albaniaRing.length - 1; i < albaniaRing.length; j = i++) {
    const [x1, y1] = albaniaRing[i];
    const [x2, y2] = albaniaRing[j];
    if ((y1 > center.lat) !== (y2 > center.lat) && center.lon < ((x2 - x1) * (center.lat - y1)) / (y2 - y1) + x1) inside = !inside;
  }
  return inside;
}

export async function requestStations(
  center: Center,
  radiusM: number,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<{ json: unknown; source: StationSource }> {
  const snapshot = inAlbaniaSnapshotArea(center);
  const source: StationSource = snapshot ? "snapshot" : "global";
  const url = snapshot
    ? `${OVERPASS_URL}?lat=${encodeURIComponent(center.lat)}&lon=${encodeURIComponent(center.lon)}&radiusM=${encodeURIComponent(radiusM)}`
    : `${GLOBAL_URL}?data=${encodeURIComponent(`[out:json][timeout:15];(node["amenity"="fuel"](around:${radiusM},${center.lat},${center.lon});way["amenity"="fuel"](around:${radiusM},${center.lat},${center.lon}););out center;`)}`;
  const urls = snapshot ? [url] : [url, url.replace(GLOBAL_URL, GLOBAL_BACKUP_URL)];
  let lastError: unknown;
  for (const candidate of urls) {
    if (signal.aborted) throw new Error("aborted");
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(abort, snapshot ? 17_000 : 8_000);
    try {
      const response = await fetcher(candidate, { method: "GET", signal: controller.signal });
      if (!response.ok) throw new Error(`http-${response.status}`);
      const json: unknown = await response.json();
      if (!json || typeof json !== "object" || !Array.isArray((json as { elements?: unknown }).elements)) throw new Error("Invalid station response");
      return { json, source };
    } catch (error) {
      lastError = error;
      if (signal.aborted) throw error;
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
    }
  }
  throw lastError ?? new Error("Station search unavailable");
}
