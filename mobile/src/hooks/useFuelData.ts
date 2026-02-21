import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LatestEurope } from "../types/fuel";

export function useFuelData(opts: {
  url: string;
  country: string;
  setCountry: (c: string) => void;
}) {
  const { url, country, setCountry } = opts;

  const countryRef = useRef(country);
  useEffect(() => {
    countryRef.current = country;
  }, [country]);

  const [data, setData] = useState<LatestEurope | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (isRefresh: boolean) => {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        const json: LatestEurope = await r.json();
        setData(json);

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
    [url, setCountry]
  );

  useEffect(() => {
    load(false);
  }, [load]);

  const countries = useMemo(() => (data?.countries ?? []).map((c) => c.country), [data]);

  const selected = useMemo(() => {
    if (!data) return null;
    return data.countries.find((c) => c.country === country) ?? data.countries[0] ?? null;
  }, [data, country]);

  return {
    data,
    error,
    loading,
    refreshing,
    countries,
    selected,
    refresh: () => load(true),
  };
}