import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OVERPASS_URL } from "../constants/urls";
import { STORAGE_STATIONS_CACHE_KEY } from "../constants/storage";
import { haversineKm } from "../utils/geo";

export type Station = {
  id: string;
  name: string;
  brand?: string;
  lat: number;
  lon: number;
  distanceKm: number;
};

type CacheEnvelope = {
  savedAtUtc: string;
  center: { lat: number; lon: number };
  radiusM: number;
  stations: Station[];
};

const CACHE_TTL_MS = 15 * 60 * 1000;
const FETCH_TIMEOUT_MS = 12 * 1000;

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

function overpassQuery(lat: number, lon: number, radiusM: number) {
  return `
[out:json][timeout:25];
(
  node["amenity"="fuel"](around:${radiusM},${lat},${lon});
  way["amenity"="fuel"](around:${radiusM},${lat},${lon});
  relation["amenity"="fuel"](around:${radiusM},${lat},${lon});
);
out center tags;
`;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...init, signal: controller.signal });
    return r;
  } finally {
    clearTimeout(t);
  }
}

export function useNearbyStations(opts: { center: { lat: number; lon: number } | null; radiusM?: number }) {
  const radiusM = opts.radiusM ?? 5000;

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const loadCacheStrict = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_STATIONS_CACHE_KEY);
    const env = safeParse(raw);
    if (!env) return null;

    const age = Date.now() - new Date(env.savedAtUtc).getTime();
    if (age > CACHE_TTL_MS) return null;

    if (!opts.center) return null;

    const nearSameCenter =
      Math.abs(env.center.lat - opts.center.lat) < 0.01 &&
      Math.abs(env.center.lon - opts.center.lon) < 0.01;

    const sameRadius = env.radiusM === radiusM;

    if (!nearSameCenter || !sameRadius) return null;

    setStations(env.stations);
    setFromCache(true);
    return env;
  }, [opts.center, radiusM]);

  const loadCacheAny = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_STATIONS_CACHE_KEY);
    const env = safeParse(raw);
    if (!env) return null;

    if (!opts.center) return null;

    const nearSameCenter =
      Math.abs(env.center.lat - opts.center.lat) < 0.01 &&
      Math.abs(env.center.lon - opts.center.lon) < 0.01;

    const sameRadius = env.radiusM === radiusM;
    if (!nearSameCenter || !sameRadius) return null;

    setStations(env.stations);
    setFromCache(true);
    return env;
  }, [opts.center, radiusM]);

  const refresh = useCallback(async () => {
    if (!opts.center) return;
    setLoading(true);
    setError(null);

    try {
      const q = overpassQuery(opts.center.lat, opts.center.lon, radiusM);
      const body = `data=${encodeURIComponent(q)}`;

      const r = await fetchWithTimeout(
        OVERPASS_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body
        },
        FETCH_TIMEOUT_MS
      );

      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const json = await r.json();

      const elements: any[] = Array.isArray(json?.elements) ? json.elements : [];

      const parsed: Station[] = elements
        .map((el) => {
          const lat = typeof el.lat === "number" ? el.lat : typeof el.center?.lat === "number" ? el.center.lat : null;
          const lon = typeof el.lon === "number" ? el.lon : typeof el.center?.lon === "number" ? el.center.lon : null;
          if (lat == null || lon == null) return null;

          const tags = el.tags ?? {};
          const name = typeof tags.name === "string" ? tags.name : typeof tags.brand === "string" ? tags.brand : "Fuel station";
          const brand = typeof tags.brand === "string" ? tags.brand : undefined;

          const d = haversineKm({ lat: opts.center!.lat, lon: opts.center!.lon }, { lat, lon });

          return {
            id: `${el.type}:${String(el.id)}`,
            name,
            brand,
            lat,
            lon,
            distanceKm: d
          } as Station;
        })
        .filter(Boolean) as Station[];

      parsed.sort((a, b) => a.distanceKm - b.distanceKm);

      setStations(parsed);
      setFromCache(false);

      const env: CacheEnvelope = {
        savedAtUtc: new Date().toISOString(),
        center: opts.center,
        radiusM,
        stations: parsed
      };

      await AsyncStorage.setItem(STORAGE_STATIONS_CACHE_KEY, JSON.stringify(env));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);

      const usedCache = await loadCacheAny();
      if (usedCache) {
        setError("Stations server timeout. Showing cached results.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [opts.center, radiusM, loadCacheAny]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadCacheStrict();
      if (cancelled) return;
      if (opts.center) refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [opts.center?.lat, opts.center?.lon, radiusM, loadCacheStrict, refresh]);

  const top = useMemo(() => stations.slice(0, 100), [stations]);
  return { stations: top, totalCount: stations.length, loading, error, refresh, fromCache };
}