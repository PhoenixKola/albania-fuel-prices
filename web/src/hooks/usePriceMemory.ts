import { useEffect, useMemo } from "react";
import type { CountryPrices } from "../models/fuel";
import { STORAGE_LASTSEEN_KEY } from "../config/constants";

type MemEntry = {
  t: string;
  gasoline95_eur: number | null;
  diesel_eur: number | null;
  lpg_eur: number | null;
};

type Mem = Record<string, MemEntry>;

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

function sameEntry(a: MemEntry, b: MemEntry) {
  return (
    a.gasoline95_eur === b.gasoline95_eur &&
    a.diesel_eur === b.diesel_eur &&
    a.lpg_eur === b.lpg_eur
  );
}

export function usePriceMemory(country: string, selected: CountryPrices | null) {
  const deltas = useMemo(() => {
    const mem = read();
    const prev = mem[country];
    if (!prev || !selected) return { gasoline95: null, diesel: null, lpg: null };

    const d = (a: number | null, b: number | null) => (a == null || b == null ? null : a - b);

    return {
      gasoline95: d(selected.gasoline95_eur ?? null, prev.gasoline95_eur ?? null),
      diesel: d(selected.diesel_eur ?? null, prev.diesel_eur ?? null),
      lpg: d(selected.lpg_eur ?? null, prev.lpg_eur ?? null),
    };
  }, [country, selected]);

  useEffect(() => {
    if (!selected) return;

    const next: MemEntry = {
      t: new Date().toISOString(),
      gasoline95_eur: selected.gasoline95_eur ?? null,
      diesel_eur: selected.diesel_eur ?? null,
      lpg_eur: selected.lpg_eur ?? null,
    };

    const mem = read();
    const prev = mem[country];

    if (prev && sameEntry(prev, next)) return;

    mem[country] = next;
    write(mem);
  }, [country, selected]);

  return deltas;
}