import { useEffect, useState } from "react";
import type { Trends } from "../models/trends";
import { TRENDS_URL } from "../config/constants";

const CACHE_KEY = "trendsCache";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CacheEnvelope = {
  savedAtMs: number;
  data: Trends;
};

function readCache(): Trends | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const env = JSON.parse(raw) as CacheEnvelope;
    if (!env?.data?.dates || Date.now() - env.savedAtMs > CACHE_TTL_MS) return null;
    return env.data;
  } catch {
    return null;
  }
}

/**
 * Fetches the 30-day price trend series. Fails silently (returns null) so
 * every consumer can treat trends as an optional enhancement.
 */
export function useTrends() {
  const [trends, setTrends] = useState<Trends | null>(() => readCache());

  useEffect(() => {
    if (trends) return;
    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(TRENDS_URL, { cache: "no-store" });
        if (!r.ok) return;
        const json = (await r.json()) as Trends;
        if (!json?.dates?.length || !json.countries) return;
        if (cancelled) return;
        setTrends(json);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAtMs: Date.now(), data: json } as CacheEnvelope));
        } catch {
          // storage full — cache is best-effort
        }
      } catch {
        // offline or 404 (file not published yet) — UI simply hides trends
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [trends]);

  return trends;
}
