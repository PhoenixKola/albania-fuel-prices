import { useEffect, useState, useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { STORAGE_FX_KEY } from "../config/constants";

type FxCache = { fetchedAtUtc: string; date: string; rates: Record<string, number> };

const FX_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function normalizeRatesToUpper(rates: Record<string, number | string>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(rates)) {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) out[k.toUpperCase()] = n;
  }
  return out;
}

export function useFxRates() {
  const [cache, setCache] = useLocalStorageState<FxCache | null>(STORAGE_FX_KEY, null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(FX_URL);
      const json = await r.json();
      const next: FxCache = {
        fetchedAtUtc: new Date().toISOString(),
        date: String(json?.date ?? ""),
        rates: normalizeRatesToUpper(json?.eur ?? {}),
      };
      setCache(next);
    } finally {
      setLoading(false);
    }
  }, [setCache]);

  useEffect(() => {
    const fetchedAt = cache?.fetchedAtUtc ? new Date(cache.fetchedAtUtc).getTime() : 0;
    const stale = !fetchedAt || Date.now() - fetchedAt > ONE_DAY_MS;
    const missingEUR = !cache?.rates || !Number.isFinite(cache.rates["USD"]); // sanity
    if (!cache || stale || missingEUR) refresh();
  }, [cache, refresh]);

  return { rates: cache?.rates ?? null, date: cache?.date ?? null, loading, refresh };
}