import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import opening_hours from "opening_hours";
import { OVERPASS_URL } from "../constants/urls";
import { STORAGE_STATIONS_CACHE_KEY } from "../constants/storage";
import { haversineKm } from "../utils/geo";

export type Station = {
  id: string;
  /** Empty when OpenStreetMap has neither a name nor a brand; the UI localises the fallback. */
  name: string;
  brand?: string;
  lat: number;
  lon: number;
  /** Straight-line distance from the search centre. */
  distanceKm: number;
  openingHours?: string;
  isOpen24Hours?: boolean;
  /** Derived from the listed opening_hours; null when not listed or not machine-readable. */
  isOpenNow?: boolean | null;
  /** Next listed open/close change within 24 h, epoch ms. */
  hoursChangeAtMs?: number | null;
};

export type StationsError = "timeout" | "failed" | null;

type CacheEnvelope = {
  savedAtUtc: string;
  center: { lat: number; lon: number };
  radiusM: number;
  stations: Station[];
};

const CACHE_TTL_MS = 15 * 60 * 1000;
const FETCH_TIMEOUT_MS = 12 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Placeholder older app versions wrote into the cache for unnamed stations. */
const LEGACY_UNNAMED = "Fuel station";

function safeParse(raw: string | null): CacheEnvelope | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    if (!j || typeof j !== "object") return null;
    if (typeof (j as any).savedAtUtc !== "string") return null;
    if (!(j as any).center || typeof (j as any).center.lat !== "number" || typeof (j as any).center.lon !== "number") return null;
    if (typeof (j as any).radiusM !== "number") return null;
    if (!Array.isArray((j as any).stations)) return null;
    return j as CacheEnvelope;
  } catch {
    return null;
  }
}

function is24Hours(openingHours?: string) {
  if (!openingHours) return false;
  const normalized = openingHours.trim().toLowerCase();
  return normalized === "24/7" || normalized === "00:00-24:00" || normalized === "mo-su 00:00-24:00";
}

/**
 * Evaluates the listed OSM hours in device-local time. Nearby stations share
 * the user's timezone, so local evaluation is correct for this screen.
 * Rules the parser marks "unknown" (e.g. "open by appointment") stay unknown
 * instead of being reported as closed.
 */
function readHours(openingHours: string | undefined, now: Date) {
  if (!openingHours) return { isOpenNow: null, hoursChangeAtMs: null };
  if (is24Hours(openingHours)) return { isOpenNow: true, hoursChangeAtMs: null };
  try {
    const oh = new opening_hours(openingHours, null);
    if (oh.getUnknown(now)) return { isOpenNow: null, hoursChangeAtMs: null };
    const next = oh.getNextChange(now, new Date(now.getTime() + DAY_MS));
    return { isOpenNow: oh.getState(now), hoursChangeAtMs: next ? next.getTime() : null };
  } catch {
    return { isOpenNow: null, hoursChangeAtMs: null };
  }
}

/**
 * isOpenNow is evaluated when a station is fetched and then cached with it,
 * so it must be re-derived from the retained hours string whenever it is
 * shown later — otherwise a station could read "Open now" hours after it closed.
 */
function withFreshHours(stations: Station[]): Station[] {
  const now = new Date();
  return stations.map((st) => ({
    ...st,
    name: st.name === LEGACY_UNNAMED && !st.brand ? "" : st.name,
    isOpen24Hours: is24Hours(st.openingHours),
    ...readHours(st.openingHours, now),
  }));
}

export function useNearbyStations(opts: { center: { lat: number; lon: number } | null; radiusM?: number }) {
  const radiusM = opts.radiusM ?? 5000;
  const centerLat = opts.center?.lat ?? null;
  const centerLon = opts.center?.lon ?? null;

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StationsError>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cacheSavedAtUtc, setCacheSavedAtUtc] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // strict=true enforces the TTL; strict=false accepts any age for the same centre and radius.
  const loadCache = useCallback(async (strict: boolean) => {
    if (centerLat === null || centerLon === null) return null;
    const env = safeParse(await AsyncStorage.getItem(STORAGE_STATIONS_CACHE_KEY));
    if (!env) return null;

    if (strict && Date.now() - new Date(env.savedAtUtc).getTime() > CACHE_TTL_MS) return null;

    const nearSameCenter = Math.abs(env.center.lat - centerLat) < 0.01 && Math.abs(env.center.lon - centerLon) < 0.01;
    if (!nearSameCenter || env.radiusM !== radiusM) return null;

    setStations(withFreshHours(env.stations));
    setFromCache(true);
    setCacheSavedAtUtc(env.savedAtUtc);
    return env;
  }, [centerLat, centerLon, radiusM]);

  const refresh = useCallback(async () => {
    if (centerLat === null || centerLon === null) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const url = `${OVERPASS_URL}?lat=${encodeURIComponent(centerLat)}&lon=${encodeURIComponent(centerLon)}&radiusM=${encodeURIComponent(radiusM)}`;
      const r = await fetch(url, { method: "GET", signal: controller.signal });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const json = await r.json();
      if (abortRef.current !== controller) return;

      const elements: any[] = Array.isArray(json?.elements) ? json.elements : [];
      const now = new Date();

      const parsed: Station[] = elements
        .map((el) => {
          const lat = typeof el.lat === "number" ? el.lat : typeof el.center?.lat === "number" ? el.center.lat : null;
          const lon = typeof el.lon === "number" ? el.lon : typeof el.center?.lon === "number" ? el.center.lon : null;
          if (lat == null || lon == null) return null;

          const tags = el.tags ?? {};
          const brand = typeof tags.brand === "string" ? tags.brand.trim() || undefined : undefined;
          const name = typeof tags.name === "string" && tags.name.trim() ? tags.name.trim() : brand ?? "";
          const openingHours = typeof tags.opening_hours === "string" ? tags.opening_hours : undefined;

          return {
            id: `${el.type}:${String(el.id)}`,
            name,
            brand,
            lat,
            lon,
            distanceKm: haversineKm({ lat: centerLat, lon: centerLon }, { lat, lon }),
            openingHours,
            isOpen24Hours: is24Hours(openingHours),
            ...readHours(openingHours, now),
          } as Station;
        })
        .filter(Boolean) as Station[];

      parsed.sort((a, b) => a.distanceKm - b.distanceKm);

      const savedAtUtc = new Date().toISOString();
      setStations(parsed);
      setFromCache(false);
      setCacheSavedAtUtc(savedAtUtc);

      const env: CacheEnvelope = { savedAtUtc, center: { lat: centerLat, lon: centerLon }, radiusM, stations: parsed };
      AsyncStorage.setItem(STORAGE_STATIONS_CACHE_KEY, JSON.stringify(env)).catch(() => {});
    } catch {
      // A superseded request (newer refresh or changed centre/radius) is dropped silently.
      if (abortRef.current !== controller) return;

      const kind: StationsError = controller.signal.aborted ? "timeout" : "failed";
      const usedCache = await loadCache(false);
      if (abortRef.current !== controller) return;
      if (!usedCache) {
        setStations([]);
        setFromCache(false);
        setCacheSavedAtUtc(null);
      }
      setError(kind);
    } finally {
      clearTimeout(timeoutId);
      if (abortRef.current === controller) setLoading(false);
    }
  }, [centerLat, centerLon, radiusM, loadCache]);

  useEffect(() => {
    let cancelled = false;
    // A new centre or radius must never keep showing the previous result set.
    setStations([]);
    setFromCache(false);
    setCacheSavedAtUtc(null);
    setError(null);
    (async () => {
      await loadCache(true);
      if (cancelled) return;
      if (centerLat !== null && centerLon !== null) refresh();
    })();
    return () => {
      cancelled = true;
      const controller = abortRef.current;
      abortRef.current = null;
      controller?.abort();
      setLoading(false);
    };
  }, [centerLat, centerLon, radiusM, loadCache, refresh]);

  const recheckHours = useCallback(() => {
    setStations((prev) => (prev.length ? withFreshHours(prev) : prev));
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") recheckHours();
    });
    return () => sub.remove();
  }, [recheckHours]);

  return { stations, totalCount: stations.length, loading, error, refresh, recheckHours, fromCache, cacheSavedAtUtc };
}
