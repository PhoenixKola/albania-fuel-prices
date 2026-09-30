import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STATION_FAVORITES_KEY = "stations_favorites_v1";

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function useStationFavorites() {
  const [ids, setIds] = useState<string[]>([]);
  const hydrated = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STATION_FAVORITES_KEY)
      .then((raw) => {
        if (cancelled) return;
        hydrated.current = true;
        const stored = parse(raw);
        // Merge in case the user starred something before storage answered.
        setIds((prev) => (prev.length ? Array.from(new Set([...prev, ...stored])) : stored));
      })
      .catch(() => {
        hydrated.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current || !dirty.current) return;
    AsyncStorage.setItem(STATION_FAVORITES_KEY, JSON.stringify(ids)).catch(() => {});
  }, [ids]);

  const toggle = useCallback((id: string) => {
    dirty.current = true;
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  const set = useMemo(() => new Set(ids), [ids]);
  return { favoriteSet: set, toggleFavorite: toggle };
}
