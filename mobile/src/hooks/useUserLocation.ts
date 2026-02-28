import { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";

export function useUserLocation() {
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermission("denied");
        setCoords(null);
        return;
      }
      setPermission("granted");

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const p = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;

        if (p.status === "granted") {
          setPermission("granted");
          setLoading(true);
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          if (cancelled) return;
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLoading(false);
        } else if (p.status === "denied") {
          setPermission("denied");
        } else {
          setPermission("unknown");
        }
      } catch {
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { permission, coords, loading, error, request, setCoords };
}