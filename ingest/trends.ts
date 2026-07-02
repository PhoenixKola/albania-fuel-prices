import fs from "fs";
import path from "path";

type CountryPrices = {
  country: string;
  gasoline95_eur: number | null;
  diesel_eur: number | null;
  lpg_eur: number | null;
};

type HistoryEurope = {
  region: "Europe";
  unit: "EUR_per_liter";
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

const TREND_POINTS = 30;

export function buildTrends(history: HistoryEurope): TrendsFile {
  const series = [...history.series]
    .sort((a, b) => a.as_of.localeCompare(b.as_of))
    .slice(-TREND_POINTS);

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
if (process.argv[1] && path.basename(process.argv[1]).startsWith("trends")) {
  const outDir = path.join(process.cwd(), "..", "data");
  const trends = writeTrends(path.join(outDir, "history.json"), path.join(outDir, "trends.json"));
  console.log("Wrote data/trends.json —", trends.dates.length, "points,", Object.keys(trends.countries).length, "countries");
}
