import { useCallback, useEffect, useState } from "react";
import { haversineKm } from "../utils/geo";

export type Station = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
};

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

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

export function useNearbyStationsWeb(center: { lat: number; lon: number } | null, radiusM: number) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!center) return;
    setLoading(true);
    setError(null);
    try {
      const q = overpassQuery(center.lat, center.lon, radiusM);
      const body = `data=${encodeURIComponent(q)}`;
      const r = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
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
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [center, radiusM]);

  useEffect(() => {
    if (center) refresh();
  }, [center?.lat, center?.lon, radiusM, refresh]);

  return { stations, totalCount: stations.length, loading, error, refresh };
}