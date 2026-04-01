import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import opening_hours from "opening_hours";
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
  openingHours?: string;
  isOpen24Hours?: boolean;
  isOpenNow?: boolean | null;
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

function is24Hours(openingHours?: string) {
  if (!openingHours) return false;

  const normalized = openingHours.trim().toLowerCase();

  return normalized === "24/7" || normalized === "00:00-24:00" || normalized.includes("24/7");
}

function getOpenNow(openingHours?: string): boolean | null {
  if (!openingHours) return null;

  try {
    const oh = new opening_hours(openingHours, null);
    return oh.getState();
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

export function useNearbyStations(opts: { center: { lat: number; lon: number } | null; radiusM?: number }) {
  const radiusM = opts.radiusM ?? 5000;
  // Extract primitives so callbacks don't re-create when the center object reference changes
  const centerLat = opts.center?.lat ?? null;
  const centerLon = opts.center?.lon ?? null;

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  // Tracks the AbortController of the current in-flight request
  const abortRef = useRef<AbortController | null>(null);

  // Merged cache loader: strict=true enforces the TTL, strict=false returns any matching cached data
  const loadCache = useCallback(async (strict: boolean) => {
    const raw = await AsyncStorage.getItem(STORAGE_STATIONS_CACHE_KEY);
    const env = safeParse(raw);
    if (!env) return null;

    if (strict) {
      const age = Date.now() - new Date(env.savedAtUtc).getTime();
      if (age > CACHE_TTL_MS) return null;
    }

    if (centerLat === null || centerLon === null) return null;

    const nearSameCenter =
      Math.abs(env.center.lat - centerLat) < 0.01 &&
      Math.abs(env.center.lon - centerLon) < 0.01;
    const sameRadius = env.radiusM === radiusM;

    if (!nearSameCenter || !sameRadius) return null;

    setStations(env.stations);
    setFromCache(true);
    return env;
  }, [centerLat, centerLon, radiusM]);

  const refresh = useCallback(async () => {
    if (centerLat === null || centerLon === null) return;

    // Cancel any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const q = overpassQuery(centerLat, centerLon, radiusM);
      const r = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(q)}`,
        signal: controller.signal
      });

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
            isOpenNow: getOpenNow(openingHours)
          } as Station;
        })
        .filter(Boolean) as Station[];

      parsed.sort((a, b) => a.distanceKm - b.distanceKm);

      setStations(parsed);
      setFromCache(false);

      const env: CacheEnvelope = {
        savedAtUtc: new Date().toISOString(),
        center: { lat: centerLat, lon: centerLon },
        radiusM,
        stations: parsed
      };
      await AsyncStorage.setItem(STORAGE_STATIONS_CACHE_KEY, JSON.stringify(env));
    } catch (e) {
      // Silently drop if this request was superseded by a newer refresh() call
      if (abortRef.current !== controller) return;

      const msg = e instanceof Error ? e.message : String(e);
      const usedCache = await loadCache(false);
      if (usedCache) {
        setError("Stations server timeout. Showing cached results.");
      } else {
        setError(msg);
      }
    } finally {
      clearTimeout(timeoutId);
      // Only clear loading for the request that is still current
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, [centerLat, centerLon, radiusM, loadCache]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadCache(true);
      if (cancelled) return;
      if (centerLat !== null && centerLon !== null) refresh();
    })();
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, [centerLat, centerLon, radiusM, loadCache, refresh]);

  const top = useMemo(() => stations.slice(0, 100), [stations]);
  return { stations: top, totalCount: stations.length, loading, error, refresh, fromCache };
}