import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TRENDS_URL } from "../constants/urls";
import type { FuelType } from "../types/fuel";

export type Trends = {
  unit: "EUR_per_liter";
  generated_at_utc: string;
  dates: string[];
  countries: Record<
    string,
    {
      gasoline95: Array<number | null>;
      diesel: Array<number | null>;
      lpg: Array<number | null>;
    }
  >;
};

const CACHE_KEY = "trends_cache_v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CacheEnvelope = {
  savedAtMs: number;
  data: Trends;
};

function safeParse(raw: string | null): CacheEnvelope | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    if (!j?.data?.dates || !Array.isArray(j.data.dates) || typeof j.savedAtMs !== "number") return null;
    return j as CacheEnvelope;
  } catch {
    return null;
  }
}

export function getTrendSeries(trends: Trends | null, country: string, fuelType: FuelType): Array<number | null> | null {
  const row = trends?.countries?.[country];
  if (!row) return null;
  const series = fuelType === "gasoline95" ? row.gasoline95 : fuelType === "diesel" ? row.diesel : row.lpg;
  if (!Array.isArray(series) || !series.some((v) => typeof v === "number")) return null;
  return series;
}

/** Change in EUR between the latest point and the point closest to 7 days earlier. */
export function getWeeklyDeltaEur(trends: Trends | null, country: string, fuelType: FuelType): number | null {
  const series = getTrendSeries(trends, country, fuelType);
  if (!series || !trends) return null;

  let lastIdx = -1;
  for (let i = series.length - 1; i >= 0; i--) {
    if (typeof series[i] === "number") {
      lastIdx = i;
      break;
    }
  }
  if (lastIdx < 0) return null;

  const lastDate = new Date(trends.dates[lastIdx]);
  let refIdx = -1;
  for (let i = lastIdx - 1; i >= 0; i--) {
    if (typeof series[i] !== "number") continue;
    refIdx = i;
    const ageDays = (lastDate.getTime() - new Date(trends.dates[i]).getTime()) / 86400000;
    if (ageDays >= 7) break;
  }
  if (refIdx < 0) return null;

  return (series[lastIdx] as number) - (series[refIdx] as number);
}

/**
 * Fetches the 30-day trend series, cache-first. Fails silently (null) so
 * every consumer treats trends as an optional enhancement — including when
 * trends.json has not been published by the data pipeline yet.
 */
export function useTrends() {
  const [trends, setTrends] = useState<Trends | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = safeParse(await AsyncStorage.getItem(CACHE_KEY));
      if (cancelled) return;

      if (cached) {
        setTrends(cached.data);
        if (Date.now() - cached.savedAtMs <= CACHE_TTL_MS) return;
      }

      try {
        const r = await fetch(TRENDS_URL, { cache: "no-store" });
        if (!r.ok) return;
        const json = (await r.json()) as Trends;
        if (!json?.dates?.length || !json.countries) return;
        if (cancelled) return;
        setTrends(json);
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ savedAtMs: Date.now(), data: json } as CacheEnvelope)).catch(
          () => {}
        );
      } catch {
        // offline — cached data (if any) stays on screen
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return trends;
}
