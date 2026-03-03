import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LatestEurope } from "../types/fuel";
import { STORAGE_FUEL_CACHE_KEY, STORAGE_FUEL_PREV_KEY } from "../constants/storage";

type CacheEnvelope = {
  savedAtUtc: string;
  data: LatestEurope;
};

function safeParseEnvelope(raw: string | null): CacheEnvelope | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    if (!j || typeof j !== "object") return null;
    if (typeof (j as any).savedAtUtc !== "string") return null;
    if (!(j as any).data || typeof (j as any).data !== "object") return null;
    return j as CacheEnvelope;
  } catch {
    return null;
  }
}

export function useFuelData(opts: { url: string; country: string; setCountry: (c: string) => void }) {
  const { url, country, setCountry } = opts;

  const countryRef = useRef(country);
  useEffect(() => {
    countryRef.current = country;
  }, [country]);

  const [data, setData] = useState<LatestEurope | null>(null);
  const [prevData, setPrevData] = useState<LatestEurope | null>(null);

  const [cacheSavedAtUtc, setCacheSavedAtUtc] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCache = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_FUEL_CACHE_KEY);
    const env = safeParseEnvelope(raw);
    if (env?.data) {
      setData(env.data);
      setCacheSavedAtUtc(env.savedAtUtc);
      setIsFromCache(true);
    }

    const prevRaw = await AsyncStorage.getItem(STORAGE_FUEL_PREV_KEY);
    const prevEnv = safeParseEnvelope(prevRaw);
    if (prevEnv?.data) setPrevData(prevEnv.data);
  }, []);

  const persistCache = useCallback(async (next: LatestEurope, prev: LatestEurope | null, nowIso: string) => {
    await AsyncStorage.setItem(
      STORAGE_FUEL_CACHE_KEY,
      JSON.stringify({ savedAtUtc: nowIso, data: next } as CacheEnvelope)
    );
    if (prev) {
      await AsyncStorage.setItem(
        STORAGE_FUEL_PREV_KEY,
        JSON.stringify({ savedAtUtc: nowIso, data: prev } as CacheEnvelope)
      );
    }
  }, []);

  const load = useCallback(
    async (isRefresh: boolean) => {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const prevRaw = await AsyncStorage.getItem(STORAGE_FUEL_CACHE_KEY);
        const prevEnv = safeParseEnvelope(prevRaw);
        const prev = prevEnv?.data ?? null;

        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        const json: LatestEurope = await r.json();

        if (prev) setPrevData(prev);

        setData(json);
        const nowIso = new Date().toISOString();
        setCacheSavedAtUtc(nowIso);
        setIsFromCache(false);

        persistCache(json, prev, nowIso).catch(() => {});

        if (json.countries?.length) {
          const current = countryRef.current;
          const exists = json.countries.some((c) => c.country === current);
          if (!exists) setCountry(json.countries[0].country);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [url, setCountry, persistCache]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await loadCache();
      if (cancelled) return;
      load(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadCache, load]);

  const countries = useMemo(() => (data?.countries ?? []).map((c) => c.country), [data]);

  const selected = useMemo(() => {
    if (!data) return null;
    return data.countries.find((c) => c.country === country) ?? data.countries[0] ?? null;
  }, [data, country]);

  const prevSelected = useMemo(() => {
    if (!prevData) return null;
    return prevData.countries.find((c) => c.country === country) ?? prevData.countries[0] ?? null;
  }, [prevData, country]);

  return {
    data,
    prevData,
    prevSelected,
    cacheSavedAtUtc,
    isFromCache,
    error,
    loading,
    refreshing,
    countries,
    selected,
    refresh: () => load(true)
  };
}