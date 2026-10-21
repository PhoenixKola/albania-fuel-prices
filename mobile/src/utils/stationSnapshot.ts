import opening_hours from "opening_hours";
import type { Station } from "../hooks/useNearbyStations";
import { haversineKm } from "./geo";

type Center = { lat: number; lon: number };
const DAY_MS = 24 * 60 * 60 * 1000;

export function is24Hours(openingHours?: string) {
  if (!openingHours) return false;
  const normalized = openingHours.trim().toLowerCase();
  return normalized === "24/7" || normalized === "00:00-24:00" || normalized === "mo-su 00:00-24:00";
}

export function readHours(openingHours: string | undefined, now: Date) {
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

export function parseStationSnapshot(json: unknown, center: Center, now = new Date()): Station[] {
  if (!json || typeof json !== "object" || !Array.isArray((json as { elements?: unknown }).elements)) {
    throw new Error("invalid-response");
  }
  const elements = (json as { elements: unknown[] }).elements;
  const parsed: Station[] = [];
  for (const value of elements) {
    if (!value || typeof value !== "object") continue;
    const el = value as { type?: unknown; id?: unknown; lat?: unknown; lon?: unknown; center?: { lat?: unknown; lon?: unknown }; tags?: Record<string, unknown> };
    const lat = typeof el.lat === "number" ? el.lat : el.center?.lat;
    const lon = typeof el.lon === "number" ? el.lon : el.center?.lon;
    if (typeof lat !== "number" || typeof lon !== "number" || !Number.isFinite(lat) || !Number.isFinite(lon) ||
        Math.abs(lat) > 90 || Math.abs(lon) > 180 || (el.type !== "node" && el.type !== "way") ||
        (typeof el.id !== "number" && typeof el.id !== "string")) continue;
    const tags = el.tags ?? {};
    const brand = typeof tags.brand === "string" ? tags.brand.trim() || undefined : undefined;
    const name = typeof tags.name === "string" && tags.name.trim() ? tags.name.trim() : brand ?? "";
    const openingHours = typeof tags.opening_hours === "string" ? tags.opening_hours : undefined;
    parsed.push({ id: `${el.type}:${el.id}`, name, brand, lat, lon,
      distanceKm: haversineKm(center, { lat, lon }), openingHours,
      isOpen24Hours: is24Hours(openingHours), ...readHours(openingHours, now) });
  }
  return parsed.sort((a, b) => a.distanceKm - b.distanceKm);
}
