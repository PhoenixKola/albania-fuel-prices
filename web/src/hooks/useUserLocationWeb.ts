import { useCallback, useEffect, useState } from "react";

export function useUserLocationWeb() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const nav = navigator as Navigator & { permissions?: PermissionStatus };
        if (!nav.permissions?.query) return;

        const p = await nav.permissions.query({ name: "geolocation" });
        if (cancelled) return;

        // If user already granted, fetch coords automatically on page load
        if (p.state === "granted") request();

        // If permission changes while tab open, react to it
        p.onchange = () => {
          if (p.state === "granted") request();
        };
      } catch {
        // ignore (some browsers block permissions API)
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [request]);

  return { coords, loading, checking, error, request };
}