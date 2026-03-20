import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import opening_hours from "opening_hours";
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

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const FETCH_TIMEOUT_MS = 12 * 1000;

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
  const lat = center?.lat ?? null;
  const lon = center?.lon ?? null;

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const lastKeyRef = useRef<string>("");
  const lastFetchAtRef = useRef<number>(0);

  const key = useMemo(() => {
    if (lat == null || lon == null) return "";
    const rlat = lat.toFixed(3);
    const rlon = lon.toFixed(3);
    return `${rlat},${rlon},${radiusM}`;
  }, [lat, lon, radiusM]);

  const refresh = useCallback(async () => {
    if (!key) return;
    if (inFlightRef.current) return;

    const now = Date.now();
    const sameKey = lastKeyRef.current === key;
    if (sameKey && now - lastFetchAtRef.current < 30_000) return;

    inFlightRef.current = true;
    lastKeyRef.current = key;
    lastFetchAtRef.current = now;

    setLoading(true);
    setError(null);

    try {
      const [slat, slon] = key.split(",").slice(0, 2).map(Number);
      const q = overpassQuery(slat, slon, radiusM);
      const body = `data=${encodeURIComponent(q)}`;

      const r = await fetchWithTimeout(
        OVERPASS_URL,
        { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body },
        FETCH_TIMEOUT_MS
      );

      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const json = await r.json();
      const elements: OverpassElement[] = Array.isArray(json?.elements) ? json.elements : [];

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
            isOpenNow: getOpenNow(openingHours)
          } as Station;
        })
        .filter(Boolean) as Station[];

      parsed.sort((a, b) => a.distanceKm - b.distanceKm);
      setStations(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [key, radiusM]);

  useEffect(() => {
    if (!key) return;
    refresh();
  }, [key, refresh]);

  const top = useMemo(() => stations.slice(0, 100), [stations]);
  return { stations: top, totalCount: stations.length, loading, error, refresh };
}