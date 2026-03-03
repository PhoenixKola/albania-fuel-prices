import { useCallback, useEffect, useMemo, useState } from "react";
import { haversineKm } from "../utils/geo";

export type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
};

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const CACHE_KEY = "stationsCacheWeb";
const CACHE_TTL_MS = 15 * 60 * 1000;
const FETCH_TIMEOUT_MS = 12 * 1000;

function overpassQuery(lat: number, lon: number, radiusM: number) {
  return `
[out:json][timeout:25];
(
  node["amenity"="fuel"](around:${radiusM},${lat},${lon});
  way["amenity"="fuel"](around:${radiusM},${lat},${lon});
  relation["amenity"="fuel"](around:${radiusM},${lat},${lon});
);
out center tags;`;
}

type OverpassElement = {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string | number | boolean>;
};

type CacheEnvelope = {
  savedAtUtc: string;
  center: { lat: number; lon: number };
  radiusM: number;
  stations: Station[];
};

function safeParse(raw: string | null): CacheEnvelope | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    if (!j || typeof j !== "object") return null;
    if (typeof j.savedAtUtc !== "string") return null;
    if (!j.center || typeof j.center.lat !== "number" || typeof j.center.lon !== "number") return null;
    if (typeof j.radiusM !== "number") return null;
    if (!Array.isArray(j.stations)) return null;
    return j as CacheEnvelope;
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

export function useNearbyStationsWeb(center: { lat: number; lon: number } | null, radiusM: number) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const loadCacheStrict = useCallback(() => {
    if (!center) return null;
    const env = safeParse(localStorage.getItem(CACHE_KEY));
    if (!env) return null;

    const age = Date.now() - new Date(env.savedAtUtc).getTime();
    if (age > CACHE_TTL_MS) return null;

    const nearSameCenter = Math.abs(env.center.lat - center.lat) < 0.01 && Math.abs(env.center.lon - center.lon) < 0.01;
    const sameRadius = env.radiusM === radiusM;

    if (!nearSameCenter || !sameRadius) return null;

    setStations(env.stations);
    setFromCache(true);
    return env;
  }, [center, radiusM]);

  const loadCacheAny = useCallback(() => {
    if (!center) return null;
    const env = safeParse(localStorage.getItem(CACHE_KEY));
    if (!env) return null;

    const nearSameCenter = Math.abs(env.center.lat - center.lat) < 0.01 && Math.abs(env.center.lon - center.lon) < 0.01;
    const sameRadius = env.radiusM === radiusM;

    if (!nearSameCenter || !sameRadius) return null;

    setStations(env.stations);
    setFromCache(true);
    return env;
  }, [center, radiusM]);

  const refresh = useCallback(async () => {
    if (!center) return;
    setLoading(true);
    setError(null);

    try {
      const q = overpassQuery(center.lat, center.lon, radiusM);
      const body = `data=${encodeURIComponent(q)}`;

      const r = await fetchWithTimeout(
        OVERPASS_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        },
        FETCH_TIMEOUT_MS
      );

      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const json = await r.json();
      const elements: OverpassElement[] = Array.isArray(json?.elements) ? json.elements : [];

      const parsed = elements
        .map((el) => {
          const lat = typeof el.lat === "number" ? el.lat : typeof el.center?.lat === "number" ? el.center.lat : null;
          const lon = typeof el.lon === "number" ? el.lon : typeof el.center?.lon === "number" ? el.center.lon : null;
          if (lat == null || lon == null) return null;

          const tags = el.tags ?? {};
          const name = typeof tags.name === "string" ? tags.name : "Fuel station";
          const d = haversineKm(center, { lat, lon });

          return { id: `${el.type}:${el.id}`, name, lat, lon, distanceKm: d } as Station;
        })
        .filter(Boolean) as Station[];

      parsed.sort((a, b) => a.distanceKm - b.distanceKm);

      setStations(parsed);
      setFromCache(false);

      const env: CacheEnvelope = {
        savedAtUtc: new Date().toISOString(),
        center,
        radiusM,
        stations: parsed,
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(env));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);

      const usedCache = loadCacheAny();
      if (usedCache) {
        setError("Stations server timeout. Showing cached results.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [center, radiusM, loadCacheAny]);

  useEffect(() => {
    loadCacheStrict();
    if (center) refresh();
  }, [center?.lat, center?.lon, radiusM, loadCacheStrict, refresh]);

  const top = useMemo(() => stations.slice(0, 100), [stations]);
  return { stations: top, totalCount: stations.length, loading, error, refresh, fromCache };
}