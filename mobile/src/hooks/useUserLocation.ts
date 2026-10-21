import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import type { StationPlace } from "../data/placeSearch";
import { haversineKm } from "../utils/geo";
import { LAST_KNOWN_MAX_ACCURACY_M, LAST_KNOWN_MAX_AGE_MS, shouldLocateOnFocus, type Coords } from "../utils/locationPolicy";
import { acquireLocation } from "../utils/locationAcquisition";

export type LocationPermission = "unknown" | "granted" | "denied";
export type LocationIssue = "servicesOff" | "noFix" | null;
const MIN_MOVE_KM = 0.1;

export function useUserLocation() {
  const [permission, setPermission] = useState<LocationPermission>("unknown");
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [checked, setChecked] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [mode, setMode] = useState<"device" | "lastKnown" | "city">("device");
  const [city, setCity] = useState<StationPlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState<LocationIssue>(null);

  const coordsRef = useRef<Coords | null>(null);
  const modeRef = useRef<"device" | "lastKnown" | "city">("device");
  const inFlight = useRef<Promise<boolean> | null>(null);
  const requestId = useRef(0);
  const lastAttemptAt = useRef(0);
  const activeRef = useRef(false);
  const permissionRef = useRef<LocationPermission>("unknown");

  const applyPermission = useCallback((p: Location.LocationPermissionResponse) => {
    setCanAskAgain(p.canAskAgain !== false);
    const next: LocationPermission = p.status === "granted" ? "granted" : p.status === "denied" ? "denied" : "unknown";
    permissionRef.current = next;
    setPermission(next);
    return next;
  }, []);

  const applyCoords = useCallback((next: Coords, nextMode: "device" | "lastKnown", id: number) => {
    if (id !== requestId.current) return false;
    const prev = coordsRef.current;
    const changed = !prev || modeRef.current === "city" || haversineKm(prev, next) >= MIN_MOVE_KM;
    if (changed) coordsRef.current = next;
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
    lastAttemptAt.current = Date.now();
    const startedAt = Date.now();
    const run = (async () => {
      setLoading(true);
      setIssue(null);
      try {
        const outcome = await acquireLocation({
          servicesEnabled: Location.hasServicesEnabledAsync,
          recent: () => Location.getLastKnownPositionAsync({ maxAge: LAST_KNOWN_MAX_AGE_MS, requiredAccuracy: LAST_KNOWN_MAX_ACCURACY_M }),
          fresh: () => Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        }, (next, source) => {
          const changed = applyCoords(next, source, id);
          if (source === "lastKnown" && id === requestId.current) setLoading(false);
          return changed;
        }, () => id === requestId.current, () => !!coordsRef.current);
        if (__DEV__ && !outcome.cancelled) console.info("[stations]", { phase: "location", status: outcome.issue ?? "ready", source: modeRef.current, durationMs: Date.now() - startedAt });
        if (id === requestId.current) setIssue(outcome.issue);
        return outcome.changed;
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

  const selectCity = useCallback((selected: StationPlace) => {
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
    } catch { if (id === requestId.current) setIssue("noFix"); }
  }, [applyPermission, locate]);

  const activate = useCallback(() => {
    activeRef.current = true;
    if (shouldLocateOnFocus(true, permissionRef.current, modeRef.current, !!coordsRef.current, lastAttemptAt.current)) void locate();
  }, [locate]);
  const deactivate = useCallback(() => { activeRef.current = false; }, []);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const p = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;
        const next = applyPermission(p);
        if (shouldLocateOnFocus(activeRef.current, next, modeRef.current, !!coordsRef.current, lastAttemptAt.current)) {
          void locate();
        }
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

  return { permission, canAskAgain, checked, coords, mode, city, loading, issue, request, locate, selectCity, activate, deactivate };
}
