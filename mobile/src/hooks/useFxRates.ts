import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_FX_KEY } from "../constants/storage";

type FxCache = {
  fetchedAtUtc: string;
  date: string;
  base: "EUR";
  rates: Record<string, number>; // UPPERCASE keys: ALL, USD, GBP...
};

const FX_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function safeParse(raw: string | null): FxCache | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    if (!j || typeof j !== "object") return null;
    if (typeof j.fetchedAtUtc !== "string") return null;
    if (typeof j.date !== "string") return null;
    if (j.base !== "EUR") return null;
    if (!j.rates || typeof j.rates !== "object") return null;
    return j as FxCache;
  } catch {
    return null;
  }
}

function normalizeRatesToUpper(rates: Record<string, any>) {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(rates)) {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) out[k.toUpperCase()] = n;
  }
  return out;
}

export function useFxRates() {
  const [cache, setCache] = useState<FxCache | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCache = useCallback(async () => {
    const raw = await AsyncStorage.getItem(STORAGE_FX_KEY);
    const parsed = safeParse(raw);
    setCache(parsed);
    return parsed;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(FX_URL);
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const json = await r.json();

      const date = String(json?.date ?? "");
      const eurRates = (json?.eur ?? {}) as Record<string, any>;
      const ratesUpper = normalizeRatesToUpper(eurRates);

      const next: FxCache = {
        fetchedAtUtc: new Date().toISOString(),
        date,
        base: "EUR",
        rates: ratesUpper,
      };

      setCache(next);
      await AsyncStorage.setItem(STORAGE_FX_KEY, JSON.stringify(next));
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = await loadCache();
      if (cancelled) return;

      const fetchedAt = existing?.fetchedAtUtc ? new Date(existing.fetchedAtUtc).getTime() : 0;
      const stale = !fetchedAt || Date.now() - fetchedAt > ONE_DAY_MS;

      const missingAll = !existing?.rates || !Number.isFinite(existing.rates["ALL"]);

      if (!existing || stale || missingAll) await refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [loadCache, refresh]);

  return { rates: cache?.rates ?? null, date: cache?.date ?? null, loading, refresh };
}