import { useEffect, useMemo } from "react";
import type { CountryPrices } from "../models/fuel";
import { STORAGE_LASTSEEN_KEY } from "../config/constants";

type Mem = Record<
  string,
  {
    t: string;
    gasoline95_eur: number | null;
    diesel_eur: number | null;
    lpg_eur: number | null;
  }
>;

function read(): Mem {
  try {
    const raw = localStorage.getItem(STORAGE_LASTSEEN_KEY);
    if (!raw) return {};
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? (v as Mem) : {};
  } catch {
    return {};
  }
}

function write(mem: Mem) {
  try {
    localStorage.setItem(STORAGE_LASTSEEN_KEY, JSON.stringify(mem));
  } catch {
    //
  }
}

export function usePriceMemory(country: string, selected: CountryPrices | null) {
  const deltas = useMemo(() => {
    const mem = read();
    const prev = mem[country];
    if (!prev || !selected) return { gasoline95: null, diesel: null, lpg: null };
    const d = (a: number | null, b: number | null) => (a == null || b == null ? null : a - b);
    return {
      gasoline95: d(selected.gasoline95_eur, prev.gasoline95_eur),
      diesel: d(selected.diesel_eur, prev.diesel_eur),
      lpg: d(selected.lpg_eur, prev.lpg_eur),
    };
  }, [country, selected]);

  useEffect(() => {
    if (!selected) return;
    const mem = read();
    mem[country] = {
      t: new Date().toISOString(),
      gasoline95_eur: selected.gasoline95_eur,
      diesel_eur: selected.diesel_eur,
      lpg_eur: selected.lpg_eur,
    };
    write(mem);
  }, [country, selected]);

  return deltas;
}