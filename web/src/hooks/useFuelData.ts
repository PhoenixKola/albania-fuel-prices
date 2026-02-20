import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CountryPrices, LatestEurope } from "../models/fuel";
import { fetchLatestEurope } from "../services/fuelApi";

type Params = {
  url: string;
  country: string;
  setCountry: (next: string) => void;
};

export function useFuelData({ url, country, setCountry }: Params) {
  const [data, setData] = useState<LatestEurope | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const initialCountry = useRef(country);
  const didInit = useRef(false);

  const countries = useMemo(() => (data?.countries ?? []).map((c) => c.country), [data]);

  const selected: CountryPrices | null = useMemo(() => {
    if (!data?.countries?.length) return null;
    return data.countries.find((c) => c.country === country) ?? data.countries[0] ?? null;
  }, [data, country]);

  const load = useCallback(
    async (mode: "init" | "refresh", countrySnapshot: string) => {
      setError("");
      if (mode === "refresh") setRefreshing(true);

      try {
        const json = await fetchLatestEurope(url);
        setData(json);

        if (json.countries?.length) {
          const exists = json.countries.some((c) => c.country === countrySnapshot);
          if (!exists) setCountry(json.countries[0].country);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        if (mode === "refresh") setRefreshing(false);
        setLoading(false);
      }
    },
    [url, setCountry]
  );

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    void load("init", initialCountry.current);
  }, [load]);

  const refresh = useCallback(() => {
    void load("refresh", country);
  }, [load, country]);

  return { data, error, loading, refreshing, countries, selected, refresh };
}