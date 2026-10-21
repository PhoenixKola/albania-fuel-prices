import type { Station } from "../hooks/useNearbyStations";
import type { StationSource } from "./stationRequest";

export type CacheEnvelope = {
  savedAtUtc: string;
  center: { lat: number; lon: number };
  radiusM: number;
  stations: Station[];
  source?: StationSource | "proxy" | "backup";
};

const CACHE_TTL_MS = 15 * 60 * 1000;

export function readStationCache(raw: string | null, center: { lat: number; lon: number }, radiusM: number, strict: boolean, now = Date.now()): CacheEnvelope | null {
  if (!raw) return null;
  try {
    const env = JSON.parse(raw) as CacheEnvelope;
    if (!env || !Array.isArray(env.stations) || typeof env.center?.lat !== "number" || typeof env.center?.lon !== "number" ||
        !Number.isFinite(env.center.lat) || !Number.isFinite(env.center.lon) || env.radiusM !== radiusM) return null;
    const savedAt = Date.parse(env.savedAtUtc);
    if (!Number.isFinite(savedAt) || savedAt > now + 30_000 || (strict && now - savedAt > CACHE_TTL_MS)) return null;
    if (Math.abs(env.center.lat - center.lat) >= 0.001 || Math.abs(env.center.lon - center.lon) >= 0.001) return null;
    return env;
  } catch { return null; }
}
