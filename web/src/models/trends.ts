import type { FuelType } from "./fuel";

export type CountryTrend = {
  gasoline95: Array<number | null>;
  diesel: Array<number | null>;
  lpg: Array<number | null>;
};

export type Trends = {
  unit: "EUR_per_liter";
  generated_at_utc: string;
  dates: string[];
  countries: Record<string, CountryTrend>;
};

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
