import { useCallback, useEffect, useRef, useState } from "react";
import type { StationPlace } from "../utils/stationPlaces";
import { locationErrorCode, type LocationErrorCode } from "../utils/stationErrors";

type Coords = { lat: number; lon: number };

export function useUserLocationWeb() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [place, setPlace] = useState<StationPlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<LocationErrorCode | null>(null);
  const inFlightRef = useRef(false);
  const requestIdRef = useRef(0);
  const placeRef = useRef<StationPlace | null>(null);

  const selectPlace = useCallback((next: StationPlace) => {
    requestIdRef.current++;
    inFlightRef.current = false;
    placeRef.current = next;
    setPlace(next);
    setCoords({ lat: next.lat, lon: next.lon });
    setError(null);
    setLoading(false);
  }, []);

  const request = useCallback(() => {
    if (!window.isSecureContext) { setError("insecure"); return; }
    if (!navigator.geolocation) { setError("unsupported"); return; }
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition((pos) => {
      if (requestId !== requestIdRef.current) return;
      placeRef.current = null;
      setPlace(null);
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      inFlightRef.current = false;
      setLoading(false);
    }, (err) => {
      if (requestId !== requestIdRef.current) return;
      setError(locationErrorCode(err.code));
      inFlightRef.current = false;
      setLoading(false);
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 });
  }, []);

  useEffect(() => () => { requestIdRef.current++; inFlightRef.current = false; }, []);
  useEffect(() => {
    let cancelled = false;
    let perm: PermissionStatus | null = null;
    (async () => {
      try {
        const nav = navigator as Navigator & { permissions?: { query?: (descriptor: PermissionDescriptor) => Promise<PermissionStatus> } };
        if (!nav.permissions?.query) return;
        perm = await nav.permissions.query({ name: "geolocation" });
        if (cancelled) return;
        if (perm.state === "granted" && !coords && !placeRef.current) request();
        perm.onchange = () => { if (perm?.state === "granted" && !coords && !placeRef.current) request(); };
      } catch {
        // Permissions API is optional; the explicit location button still works.
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; if (perm) perm.onchange = null; };
  }, [request, coords]);

  return { coords, place, loading, checking, error, request, selectPlace };
}
