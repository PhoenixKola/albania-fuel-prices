import { useCallback, useEffect, useRef, useState } from "react";

type Coords = { lat: number; lon: number };

function almostSame(a: Coords | null, b: Coords, eps = 0.00001) {
  if (!a) return false;
  return Math.abs(a.lat - b.lat) < eps && Math.abs(a.lon - b.lon) < eps;
}

export function useUserLocationWeb() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const lastReqAtRef = useRef(0);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const now = Date.now();
    if (inFlightRef.current) return;
    if (now - lastReqAtRef.current < 3000) return;

    inFlightRef.current = true;
    lastReqAtRef.current = now;

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lon: pos.coords.longitude };

        setCoords((prev) => (almostSame(prev, next) ? prev : next));

        inFlightRef.current = false;
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        inFlightRef.current = false;
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    let perm: PermissionStatus | null = null;

    (async () => {
      try {
        const nav = navigator as Navigator & { permissions?: { query?: (descriptor: PermissionDescriptor) => Promise<PermissionStatus> } };
        if (!nav.permissions?.query) return;

        perm = await nav.permissions.query({ name: "geolocation" });
        if (cancelled) return;

        if (perm.state === "granted" && !coords) request();

        const onChange = () => {
          if (perm && perm.state === "granted" && !coords) request();
        };

        if (perm) perm.onchange = onChange;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
      if (perm) perm.onchange = null;
    };
  }, [request, coords]);

  return { coords, loading, checking, error, request };
}