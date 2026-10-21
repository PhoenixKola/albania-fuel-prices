import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_STATIONS_CACHE_KEY } from "../constants/storage";
import { is24Hours, parseStationSnapshot, readHours } from "../utils/stationSnapshot";
import { inAlbaniaSnapshotArea, requestStations, type StationSource } from "../utils/stationRequest";
import { readStationCache, type CacheEnvelope } from "../utils/stationCache";

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

const FETCH_TIMEOUT_MS = 18 * 1000;
/** Placeholder older app versions wrote into the cache for unnamed stations. */
const LEGACY_UNNAMED = "Fuel station";

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
  const [source, setSource] = useState<StationSource>("snapshot");
  const [cacheSavedAtUtc, setCacheSavedAtUtc] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const resultKeyRef = useRef("");
  const key = centerLat === null || centerLon === null ? "" : `${centerLat.toFixed(4)},${centerLon.toFixed(4)},${radiusM}`;

  // strict=true enforces the TTL; strict=false accepts any age for the same centre and radius.
  const loadCache = useCallback(async (strict: boolean, requestId: number) => {
    if (centerLat === null || centerLon === null) return null;
    const env = readStationCache(await AsyncStorage.getItem(STORAGE_STATIONS_CACHE_KEY).catch(() => null), { lat: centerLat, lon: centerLon }, radiusM, strict);
    if (!env || requestId !== requestIdRef.current) return null;

    setStations(withFreshHours(env.stations));
    setFromCache(true);
    setSource(env.source === "global" ? "global" : "snapshot");
    setCacheSavedAtUtc(env.savedAtUtc);
    resultKeyRef.current = key;
    return env;
  }, [centerLat, centerLon, radiusM, key]);

  const refresh = useCallback(async () => {
    if (centerLat === null || centerLon === null) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;
    const startedAt = Date.now();

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const { json, source: fetchedSource } = await requestStations({ lat: centerLat, lon: centerLon }, radiusM, controller.signal);
      if (requestId !== requestIdRef.current) return;
      const parsed = parseStationSnapshot(json, { lat: centerLat, lon: centerLon });

      const savedAtUtc = new Date().toISOString();
      setStations(parsed);
      setFromCache(false);
      setSource(fetchedSource);
      setCacheSavedAtUtc(savedAtUtc);
      resultKeyRef.current = key;
      if (__DEV__) console.info("[stations]", { phase: "fetch", status: "success", source: fetchedSource, durationMs: Date.now() - startedAt, count: parsed.length });

      const env: CacheEnvelope = { savedAtUtc, center: { lat: centerLat, lon: centerLon }, radiusM, stations: parsed, source: fetchedSource };
      AsyncStorage.setItem(STORAGE_STATIONS_CACHE_KEY, JSON.stringify(env)).catch(() => {});
    } catch (caught) {
      // A superseded request (newer refresh or changed centre/radius) is dropped silently.
      if (requestId !== requestIdRef.current) return;

      const kind: StationsError = controller.signal.aborted ? "timeout" : "failed";
      if (__DEV__) console.info("[stations]", { phase: "fetch", status: "error", source: "selected-area", durationMs: Date.now() - startedAt, category: kind, detail: caught instanceof Error ? caught.message.slice(0, 40) : "unknown" });
      const usedCache = resultKeyRef.current === key ? true : await loadCache(false, requestId);
      if (requestId !== requestIdRef.current) return;
      if (!usedCache) {
        setStations([]);
        setFromCache(false);
        setCacheSavedAtUtc(null);
      } else setFromCache(true);
      setError(kind);
    } finally {
      clearTimeout(timeoutId);
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [centerLat, centerLon, radiusM, loadCache, key]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    abortRef.current?.abort();
    if (resultKeyRef.current !== key) {
      setStations([]);
      setFromCache(false);
      setCacheSavedAtUtc(null);
      setError(null);
      if (centerLat !== null && centerLon !== null) setSource(inAlbaniaSnapshotArea({ lat: centerLat, lon: centerLon }) ? "snapshot" : "global");
    }
    (async () => {
      await loadCache(true, requestId);
      if (requestId !== requestIdRef.current) return;
      if (centerLat !== null && centerLon !== null) refresh();
    })();
    return () => {
      requestIdRef.current++;
      const controller = abortRef.current;
      abortRef.current = null;
      controller?.abort();
    };
  }, [centerLat, centerLon, radiusM, loadCache, refresh, key]);

  const recheckHours = useCallback(() => {
    setStations((prev) => (prev.length ? withFreshHours(prev) : prev));
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") recheckHours();
    });
    return () => sub.remove();
  }, [recheckHours]);

  return { stations, totalCount: stations.length, loading, error, refresh, recheckHours, fromCache, source, cacheSavedAtUtc };
}
