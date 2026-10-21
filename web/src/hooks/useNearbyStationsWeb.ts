import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { haversineKm } from "../utils/geo";
import { stationEndpoint, stationFallbackUrl } from "../utils/stationEndpoint";
import { stationErrorCode, type StationErrorCode } from "../utils/stationErrors";

export type Station = {
  id: string;
  name: string;
  brand?: string;
  lat: number;
  lon: number;
  distanceKm: number;
  openingHours?: string;
  isOpen24Hours?: boolean;
  isOpenNow?: boolean | null;
};

const FETCH_TIMEOUT_MS = 18 * 1000;

function is24Hours(openingHours?: string) {
  if (!openingHours) return false;

  const normalized = openingHours.trim().toLowerCase();

  return normalized === "24/7" || normalized === "00:00-24:00" || normalized.includes("24/7");
}

function getOpenNow(openingHours: string | undefined, parser: typeof import("opening_hours").default | null): boolean | null {
  if (!openingHours || !parser) return null;

  try {
    const oh = new parser(openingHours, null);
    return oh.getState();
  } catch {
    return null;
  }
}

type OverpassElement = {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string | number | boolean>;
};

export function useNearbyStationsWeb(center: { lat: number; lon: number } | null, radiusM: number) {
  const lat = center?.lat ?? null;
  const lon = center?.lon ?? null;

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StationErrorCode | null>(null);
  const [resultKey, setResultKey] = useState("");
  const [previouslyLoaded, setPreviouslyLoaded] = useState(false);
  const previousRef = useRef<Map<string, Station[]>>(new Map());

  const inFlightRef = useRef<{ key: string; controller: AbortController } | null>(null);
  const requestIdRef = useRef(0);
  const cancelRequest = useCallback(() => {
    requestIdRef.current++;
    inFlightRef.current?.controller.abort();
    inFlightRef.current = null;
  }, []);

  const key = useMemo(() => {
    if (lat == null || lon == null) return "";
    return `${lat},${lon},${radiusM}`;
  }, [lat, lon, radiusM]);

  const refresh = useCallback(async () => {
    if (!key) return;
    if (inFlightRef.current?.key === key) return;
    inFlightRef.current?.controller.abort();

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;
    inFlightRef.current = { key, controller };
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    setLoading(true);
    setError(null);
    setPreviouslyLoaded(false);

    try {
      const [slat, slon] = key.split(",").slice(0, 2).map(Number);
      const { url, source } = stationEndpoint(slat, slon, radiusM);
      const backup = stationFallbackUrl(url, source);
      let json: { elements?: OverpassElement[] } | null = null;
      let lastError: unknown;
      for (const candidate of backup ? [url, backup] : [url]) {
        if (controller.signal.aborted) break;
        const attempt = new AbortController();
        const abortAttempt = () => attempt.abort();
        controller.signal.addEventListener("abort", abortAttempt, { once: true });
        const attemptTimeout = setTimeout(abortAttempt, backup ? 8_000 : 17_000);
        try {
          const response = await fetch(candidate, { method: "GET", signal: attempt.signal });
          if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
          json = await response.json();
          if (!Array.isArray(json?.elements)) throw new Error("Invalid station response");
          break;
        } catch (caught) {
          lastError = caught;
        } finally {
          clearTimeout(attemptTimeout);
          controller.signal.removeEventListener("abort", abortAttempt);
        }
      }
      if (!json) throw lastError ?? new Error("Station search unavailable");
      if (!Array.isArray(json?.elements)) throw new Error("Invalid station response");
      const elements: OverpassElement[] = json.elements;
      // The parser is large; only fetch it after a location search returns opening-hour data.
      const hoursParser = elements.some((element) => typeof element.tags?.opening_hours === "string")
        ? (await import("opening_hours")).default : null;

      const parsed = elements
        .map((el) => {
          const plat = typeof el.lat === "number" ? el.lat : typeof el.center?.lat === "number" ? el.center.lat : null;
          const plon = typeof el.lon === "number" ? el.lon : typeof el.center?.lon === "number" ? el.center.lon : null;
          if (plat == null || plon == null) return null;

          const tags = el.tags ?? {};
          const name =
            typeof tags.name === "string"
              ? tags.name
              : typeof tags.brand === "string"
                ? tags.brand
                : "Fuel station";
          const brand = typeof tags.brand === "string" ? tags.brand : undefined;
          const openingHours = typeof tags.opening_hours === "string" ? tags.opening_hours : undefined;
          const d = haversineKm({ lat: slat, lon: slon }, { lat: plat, lon: plon });

          return {
            id: `${el.type}:${el.id}`,
            name,
            brand,
            lat: plat,
            lon: plon,
            distanceKm: d,
            openingHours,
            isOpen24Hours: is24Hours(openingHours),
            isOpenNow: getOpenNow(openingHours, hoursParser)
          } as Station;
        })
        .filter(Boolean) as Station[];

      parsed.sort((a, b) => a.distanceKm - b.distanceKm);
      if (requestId !== requestIdRef.current) return;
      setStations(parsed);
      setResultKey(key);
      previousRef.current.set(key, parsed);
    } catch (e) {
      if (requestId === requestIdRef.current) {
        const prior = previousRef.current.get(key);
        if (prior) { setStations(prior); setResultKey(key); setPreviouslyLoaded(true); }
        setError(stationErrorCode(e));
      }
    } finally {
      clearTimeout(timeoutId);
      if (requestId === requestIdRef.current) {
        inFlightRef.current = null;
        setLoading(false);
      }
    }
  }, [key, radiusM]);

  useEffect(() => {
    if (!key) return;
    setError(null);
    refresh();
    return cancelRequest;
  }, [key, refresh, cancelRequest]);

  // The view paginates eight results and renders only that page on the map.
  // Do not silently hide valid results beyond the first hundred.
  const visible = resultKey === key ? stations : [];
  return { stations: visible, totalCount: visible.length, loading, error, refresh, hasRetrieved: resultKey === key, previouslyLoaded: previouslyLoaded && resultKey === key, source: lat == null || lon == null ? "snapshot" as const : stationEndpoint(lat, lon, radiusM).source };
}
