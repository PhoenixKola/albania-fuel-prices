import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import { haversineKm } from "../utils/geo";

type Coords = { lat: number; lon: number };
export type LocationPermission = "unknown" | "granted" | "denied";

/** Moves smaller than this keep the current centre, so GPS jitter doesn't refetch stations. */
const MIN_MOVE_KM = 0.1;

export function useUserLocation() {
  const [permission, setPermission] = useState<LocationPermission>("unknown");
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [checked, setChecked] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coordsRef = useRef<Coords | null>(null);
  const inFlight = useRef<Promise<boolean> | null>(null);

  const applyPermission = useCallback((p: Location.LocationPermissionResponse) => {
    setCanAskAgain(p.canAskAgain !== false);
    const next: LocationPermission = p.status === "granted" ? "granted" : p.status === "denied" ? "denied" : "unknown";
    setPermission(next);
    return next;
  }, []);

  /** Reads the device position. Resolves true when the centre changed. */
  const locate = useCallback(() => {
    if (inFlight.current) return inFlight.current;
    const run = (async () => {
      setLoading(true);
      setError(null);
      try {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const next = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        const prev = coordsRef.current;
        if (prev && haversineKm(prev, next) < MIN_MOVE_KM) return false;
        coordsRef.current = next;
        setCoords(next);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        return false;
      } finally {
        setLoading(false);
        inFlight.current = null;
      }
    })();
    inFlight.current = run;
    return run;
  }, []);

  const request = useCallback(async () => {
    try {
      const p = await Location.requestForegroundPermissionsAsync();
      if (applyPermission(p) !== "granted") {
        coordsRef.current = null;
        setCoords(null);
        return;
      }
      await locate();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [applyPermission, locate]);

  // Re-check on launch and whenever the app returns to the foreground: the
  // user may have granted access in system settings meanwhile.
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const p = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;
        const next = applyPermission(p);
        if (next === "granted") {
          if (!coordsRef.current) await locate();
        } else if (coordsRef.current) {
          coordsRef.current = null;
          setCoords(null);
        }
      } catch {
        // Leave the previous state if the check fails.
      } finally {
        if (!cancelled) setChecked(true);
      }
    };

    check();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") check();
    });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [applyPermission, locate]);

  return { permission, canAskAgain, checked, coords, loading, error, request, locate };
}
