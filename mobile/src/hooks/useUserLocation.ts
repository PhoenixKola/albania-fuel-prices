import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import type { StationCity } from "../data/stationCities";
import { haversineKm } from "../utils/geo";

type Coords = { lat: number; lon: number };
export type LocationPermission = "unknown" | "granted" | "denied";
export type LocationIssue = "servicesOff" | "noFix" | null;
const MIN_MOVE_KM = 0.1;
const FIX_TIMEOUT_MS = 9000;
const LAST_KNOWN_MAX_AGE_MS = 10 * 60 * 1000;
const LAST_KNOWN_MAX_ACCURACY_M = 2500;

function validPosition(pos: Location.LocationObject | null): Coords | null {
  if (!pos) return null;
  const { latitude: lat, longitude: lon } = pos.coords;
  return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? { lat, lon } : null;
}

/** Native location calls can remain pending; a retry must always become usable. */
async function withTimeout<T>(promise: Promise<T>, durationMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("location-timeout")), durationMs); }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function useUserLocation() {
  const [permission, setPermission] = useState<LocationPermission>("unknown");
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [checked, setChecked] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [mode, setMode] = useState<"device" | "lastKnown" | "city">("device");
  const [city, setCity] = useState<StationCity | null>(null);
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState<LocationIssue>(null);

  const coordsRef = useRef<Coords | null>(null);
  const modeRef = useRef<"device" | "lastKnown" | "city">("device");
  const inFlight = useRef<Promise<boolean> | null>(null);
  const requestId = useRef(0);

  const applyPermission = useCallback((p: Location.LocationPermissionResponse) => {
    setCanAskAgain(p.canAskAgain !== false);
    const next: LocationPermission = p.status === "granted" ? "granted" : p.status === "denied" ? "denied" : "unknown";
    setPermission(next);
    return next;
  }, []);

  const applyCoords = useCallback((next: Coords, nextMode: "device" | "lastKnown", id: number) => {
    if (id !== requestId.current) return false;
    const prev = coordsRef.current;
    const changed = !prev || modeRef.current === "city" || haversineKm(prev, next) >= MIN_MOVE_KM;
    coordsRef.current = next;
    modeRef.current = nextMode;
    setMode(nextMode);
    setCity(null);
    setIssue(null);
    if (changed) setCoords(next);
    return changed;
  }, []);

  /** True means a new centre will trigger a station query. */
  const locate = useCallback(() => {
    if (inFlight.current) return inFlight.current;
    const id = ++requestId.current;
    const run = (async () => {
      setLoading(true);
      setIssue(null);
      try {
        const servicesOn = await withTimeout(Location.hasServicesEnabledAsync(), 2500);
        if (id !== requestId.current) return false;
        if (!servicesOn) { setIssue("servicesOff"); return false; }
        try {
          const current = validPosition(await withTimeout(Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }), FIX_TIMEOUT_MS));
          if (current) return applyCoords(current, "device", id);
        } catch {
          // A recent, accurate enough device fix can still answer a nearby search.
        }
        const last = await withTimeout(Location.getLastKnownPositionAsync({
          maxAge: LAST_KNOWN_MAX_AGE_MS, requiredAccuracy: LAST_KNOWN_MAX_ACCURACY_M,
        }), 2500).catch(() => null);
        if (id !== requestId.current) return false;
        const fallback = validPosition(last);
        if (fallback) return applyCoords(fallback, "lastKnown", id);
        setIssue("noFix");
        return false;
      } catch {
        if (id === requestId.current) setIssue("noFix");
        return false;
      } finally {
        if (id === requestId.current) { setLoading(false); inFlight.current = null; }
      }
    })();
    inFlight.current = run;
    return run;
  }, [applyCoords]);

  const selectCity = useCallback((selected: StationCity) => {
    requestId.current++;
    inFlight.current = null;
    const next = { lat: selected.lat, lon: selected.lon };
    coordsRef.current = next;
    modeRef.current = "city";
    setCoords(next);
    setMode("city");
    setCity(selected);
    setIssue(null);
    setLoading(false);
  }, []);

  const request = useCallback(async () => {
    const id = requestId.current;
    try {
      const p = await Location.requestForegroundPermissionsAsync();
      if (applyPermission(p) === "granted" && id === requestId.current) await locate();
    } catch { setIssue("noFix"); }
  }, [applyPermission, locate]);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const p = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;
        const next = applyPermission(p);
        if (next === "granted" && !coordsRef.current) await locate();
        else if (next !== "granted" && modeRef.current !== "city" && coordsRef.current) {
          coordsRef.current = null;
          setCoords(null);
        }
      } catch {
        if (!cancelled) setIssue("noFix");
      } finally {
        if (!cancelled) setChecked(true);
      }
    };
    check();
    const sub = AppState.addEventListener("change", (state) => { if (state === "active") check(); });
    return () => { cancelled = true; requestId.current++; inFlight.current = null; sub.remove(); };
  }, [applyPermission, locate]);

  return { permission, canAskAgain, checked, coords, mode, city, loading, issue, request, locate, selectCity };
}
