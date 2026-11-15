import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

type CountryPrices = {
  country: string;
  source_as_of?: string;
  last_observed_at?: string;
  provenance?: string;
  gasoline95_eur: number | null;
  diesel_eur: number | null;
  lpg_eur: number | null;
};

type HistoryEurope = {
  region: "Europe";
  unit: "EUR_per_liter";
  market_observations?: Array<{ as_of: string; source: string; countries: CountryPrices[] }>;
  series: Array<{
    as_of: string;
    source: string;
    countries: CountryPrices[];
  }>;
};

export type TrendsFile = {
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

// 30-day comparison plus seven-day gap tolerance.
const TREND_POINTS = 38;

export function buildTrends(history: HistoryEurope): TrendsFile {
  // Legacy rows retain their collection date; independently dated markets use
  // their own publication date and never inherit Europe's date.
  const dated = new Map<string, Map<string, CountryPrices>>();
  for (const point of [...history.series, ...(history.market_observations ?? [])]) {
    for (const row of point.countries) {
      if (row.provenance) continue;
      const date = row.source_as_of ?? (row.country === "Kosovo" ? row.last_observed_at : point.as_of);
      if (!date) continue;
      if (!dated.has(date)) dated.set(date, new Map());
      dated.get(date)!.set(row.country, row);
    }
  }
  const series = [...dated].map(([as_of, rows]) => ({ as_of, countries: [...rows.values()] }))
    .sort((a,b) => a.as_of.localeCompare(b.as_of))
    .filter((point, _, all) => Date.parse(point.as_of) >= Date.parse(all[all.length - 1].as_of) - (TREND_POINTS - 1) * 86400000);

  const dates = series.map((point) => point.as_of);

  const countryNames = new Set<string>();
  for (const point of series) {
    for (const c of point.countries) countryNames.add(c.country);
  }

  const countries: TrendsFile["countries"] = {};
  for (const name of [...countryNames].sort()) {
    const gasoline95: Array<number | null> = [];
    const diesel: Array<number | null> = [];
    const lpg: Array<number | null> = [];

    for (const point of series) {
      const row = point.countries.find((c) => c.country === name) ?? null;
      gasoline95.push(row?.gasoline95_eur ?? null);
      diesel.push(row?.diesel_eur ?? null);
      lpg.push(row?.lpg_eur ?? null);
    }

    countries[name] = { gasoline95, diesel, lpg };
  }

  return {
    unit: "EUR_per_liter",
    generated_at_utc: new Date().toISOString(),
    dates,
    countries,
  };
}

export function writeTrends(historyPath: string, trendsPath: string) {
  const parsed = JSON.parse(fs.readFileSync(historyPath, "utf8")) as HistoryEurope;
  const trends = buildTrends(parsed);
  fs.writeFileSync(trendsPath, JSON.stringify(trends), "utf8");
  return trends;
}

// Allow running standalone: `npm run trends`
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const outDir = path.join(process.cwd(), "..", "data");
  const trends = writeTrends(path.join(outDir, "history.json"), path.join(outDir, "trends.json"));
  console.log("Wrote data/trends.json —", trends.dates.length, "points,", Object.keys(trends.countries).length, "countries");
}
