import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import * as cheerio from "cheerio";
import { buildTrends } from "./trends";
import { parseDateFromText, validSourceDate } from "./sourceDate";

const SOURCES = [
  {
    name: "cargopedia.net",
    url: "https://www.cargopedia.net/europe-fuel-prices",
    parser: parseCargopediaEurope,
  },
  {
    name: "tolls.eu",
    url: "https://www.tolls.eu/fuel-prices",
    parser: parseTollsEurope,
  },
];

const KOSOVO_FUELO_URL = "https://gr.fuelo.net/world/country/27?lang=en";

type CountryPrices = {
  country: string;
  gasoline95_eur: number | null;
  diesel_eur: number | null;
  lpg_eur: number | null;
  /** Optional provenance for a market supplied outside the main Europe table. */
  source?: string;
  source_url?: string;
  source_as_of?: string;
  last_observed_at?: string;
  provenance?: "historical-fallback" | "date-unverified";
};

type LatestEurope = {
  region: "Europe";
  as_of: string;
  source: string;
  source_url: string;
  fetched_at_utc: string;
  unit: "EUR_per_liter";
  countries: CountryPrices[];
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

function toNum(v: string) {
  const s = String(v).trim().replace(/^€\s*/, "");
  if (!s || s === "-" || s.toLowerCase() === "n/a") return null;
  if (!/^\d+(?:[.,]\d+)?$/.test(s)) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) && n >= 0.1 && n <= 10 ? n : null;
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; albania-fuel-prices/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.text();
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function normalizeCountry(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function sameCountry(a: string, b: string) {
  return normalizeCountry(a).toLowerCase() === normalizeCountry(b).toLowerCase();
}

function uniqueSourceCountries(rows: CountryPrices[]): CountryPrices[] {
  const unique = new Map<string, CountryPrices>();
  for (const row of rows) {
    const key = row.country.toLocaleLowerCase("en");
    const previous = unique.get(key);
    if (previous && (["gasoline95_eur", "diesel_eur", "lpg_eur"] as const).some((fuel) => previous[fuel] !== row[fuel])) {
      throw new Error(`Conflicting source rows for ${row.country}`);
    }
    unique.set(key, previous ?? row);
  }
  return [...unique.values()].sort((a, b) => a.country.localeCompare(b.country));
}

export function upsertCountry(countries: CountryPrices[], country: CountryPrices): CountryPrices[] {
  return countries
    .filter((item) => !sameCountry(item.country, country.country))
    .concat(country)
    .sort((a, b) => a.country.localeCompare(b.country));
}

export function getLastCountryFromHistory(history: HistoryEurope, countryName: string): CountryPrices | null {
  const newestFirst = [...history.series].sort((a, b) => b.as_of.localeCompare(a.as_of));

  for (const point of newestFirst) {
    const found = point.countries.find((country) => sameCountry(country.country, countryName));
    if (!found) continue;

    return {
      country: countryName,
      gasoline95_eur: found.gasoline95_eur,
      diesel_eur: found.diesel_eur,
      lpg_eur: found.lpg_eur,
      last_observed_at: point.as_of,
      provenance: "historical-fallback",
    };
  }

  return null;
}

function positivePrice(value: string) {
  const parsed = toNum(value);
  return parsed != null && parsed > 0 ? parsed : null;
}

export function parseKosovoFromFuelo(html: string): CountryPrices | null {
  const $ = cheerio.load(html);
  const candidates: CountryPrices[] = [];

  $("tr").each((_, el) => {
    const cells = $(el)
      .find("td,th")
      .map((__, cell) => $(cell).text().replace(/\s+/g, " ").trim())
      .get();

    if (cells.length < 3 || !/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(cells[0])) return;
    const [day, month, year] = cells[0].split(".");
    const sourceDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    if (!validSourceDate(sourceDate)) return;

    const candidate: CountryPrices = {
      country: "Kosovo",
      gasoline95_eur: positivePrice(cells[1] ?? ""),
      diesel_eur: positivePrice(cells[2] ?? ""),
      lpg_eur: positivePrice(cells[3] ?? ""),
      source: "fuelo.net",
      source_url: KOSOVO_FUELO_URL,
      source_as_of: sourceDate,
    };

    if (candidate.gasoline95_eur != null || candidate.diesel_eur != null || candidate.lpg_eur != null) {
      candidates.push(candidate);
    }
  });

  return candidates.sort((a, b) => (a.source_as_of ?? "").localeCompare(b.source_as_of ?? "")).at(-1) ?? null;
}

async function fetchKosovoPrices(): Promise<CountryPrices | null> {
  try {
    const html = await fetchHtml(KOSOVO_FUELO_URL);
    const fuelo = parseKosovoFromFuelo(html);
    if (fuelo) return fuelo;
  } catch (error) {
    console.warn("Kosovo Fuelo fetch failed:", error instanceof Error ? error.message : error);
  }

  // The secondary PDF row has no per-price publication date. It cannot
  // establish a current reading, so we retain a labelled historical fallback.
  return null;
}

export function parseCargopediaEurope(html: string) {
  const $ = cheerio.load(html);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();
  const as_of = parseDateFromText(pageText);
  if (!as_of) throw new Error("Cargopedia publication date is missing or invalid");

  const rows: string[] = [];
  $("tr").each((_, el) => {
    const cells = $(el).find("th,td").toArray().map((cell) => $(cell).text().trim());
    const t = (cells.length ? cells.join(" ") : $(el).text()).replace(/\s+/g, " ").trim();
    if (t) rows.push(t);
  });

  const countries: CountryPrices[] = [];

  for (const line of rows) {
    const m = line.match(
      /^(.+?)\s+([0-9]+(?:[.,][0-9]+)?|-)\s+([0-9]+(?:[.,][0-9]+)?|-)\s+([0-9]+(?:[.,][0-9]+)?|-)\s*$/i
    );
    if (!m) continue;

    const country = normalizeCountry(m[1]);
    if (!country || country.length < 2) continue;

    countries.push({
      country,
      gasoline95_eur: toNum(m[2]),
      diesel_eur: toNum(m[3]),
      lpg_eur: toNum(m[4]),
    });
  }

  if (!countries.length) throw new Error("Could not parse Europe table from cargopedia");

  return { as_of, countries: uniqueSourceCountries(countries) };
}

export function parseTollsEurope(html: string) {
  const $ = cheerio.load(html);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();
  const as_of = parseDateFromText(pageText);
  if (!as_of) throw new Error("Tolls publication date is missing or invalid");

  const rows: string[] = [];
  $("tr").each((_, el) => {
    const cells = $(el).find("th,td").toArray().map((cell) => $(cell).text().trim());
    const t = (cells.length ? cells.join(" ") : $(el).text()).replace(/\s+/g, " ").trim();
    if (t) rows.push(t);
  });

  const countries: CountryPrices[] = [];

  for (const line of rows) {
    const euroParts = line.match(/€\s*[0-9]+(?:[.,][0-9]+)?/g);
    if (!euroParts || euroParts.length < 2) continue;

    const country = normalizeCountry(line.split("€")[0]);
    if (!country || country.length < 2) continue;

    const nums = euroParts.map((x) => toNum(x));
    countries.push({
      country,
      gasoline95_eur: nums[0] ?? null,
      diesel_eur: nums[1] ?? null,
      lpg_eur: nums[2] ?? null,
    });
  }

  if (!countries.length) throw new Error("Could not parse Europe table from tolls.eu");

  return { as_of, countries: uniqueSourceCountries(countries) };
}

async function main() {
  let picked:
    | { source: string; url: string; as_of: string; countries: CountryPrices[] }
    | null = null;

  for (const s of SOURCES) {
    try {
      const html = await fetchHtml(s.url);
      const parsed = s.parser(html);
      picked = { source: s.name, url: s.url, as_of: parsed.as_of, countries: parsed.countries };
      break;
    } catch {}
  }

  if (!picked) throw new Error("All sources failed (cargopedia.net and tolls.eu).");
  if (picked.countries.filter((country) => country.gasoline95_eur != null || country.diesel_eur != null).length < 20 ||
      !picked.countries.some((country) => sameCountry(country.country, "Albania"))) {
    throw new Error("Source table lacks sufficient valid European prices; keeping the previous public snapshot.");
  }

  const outDir = path.join(process.cwd(), "..", "data");
  ensureDir(outDir);

  const latestPath = path.join(outDir, "latest.json");
  const historyPath = path.join(outDir, "history.json");

  let history: HistoryEurope = { region: "Europe", unit: "EUR_per_liter", series: [] };

  if (fs.existsSync(historyPath)) {
    // Fail hard on a corrupt history file: silently starting from an empty
    // series would permanently discard months of accumulated price data.
    const parsed = JSON.parse(fs.readFileSync(historyPath, "utf8"));
    if (!parsed || !Array.isArray(parsed.series)) {
      throw new Error("data/history.json exists but has no valid series — refusing to overwrite it.");
    }
    history = { region: "Europe", unit: "EUR_per_liter", series: parsed.series };
  }

  if (fs.existsSync(latestPath)) {
    const previous = JSON.parse(fs.readFileSync(latestPath, "utf8")) as LatestEurope;
    if (validSourceDate(previous.as_of) && picked.as_of < previous.as_of) {
      throw new Error(`Source date ${picked.as_of} predates published snapshot ${previous.as_of}; keeping the previous data.`);
    }
    if (picked.as_of === previous.as_of) {
      const mainCountries = previous.countries.filter((country) => !sameCountry(country.country, "Kosovo"));
      const sourceCountries = picked.countries.filter((country) => !sameCountry(country.country, "Kosovo"));
      if (JSON.stringify(mainCountries) === JSON.stringify(sourceCountries)) {
        console.log(`Source publication ${picked.as_of} is unchanged; no new observation written.`);
        return;
      }
      throw new Error(`Source values changed without a newer publication date (${picked.as_of}); manual review required.`);
    }
  }

  const kosovoLive = await fetchKosovoPrices();
  const kosovoFallback = kosovoLive ? null : getLastCountryFromHistory(history, "Kosovo");
  const kosovo = kosovoLive ?? kosovoFallback;
  const europeanCountries = kosovo ? upsertCountry(picked.countries, kosovo) : upsertCountry(picked.countries, {
    country: "Kosovo",
    gasoline95_eur: null,
    diesel_eur: null,
    lpg_eur: null,
  }).filter((country) => !sameCountry(country.country, "Kosovo"));
  // Only real, sourced prices are published. Non-European "reference" markets
  // used to be synthesised here from hardcoded bases with a hash-derived daily
  // wobble, which meant ~20% of the dataset was invented.
  const countries = europeanCountries;

  if (kosovoLive) {
    console.log("Kosovo added from live/free source");
  } else if (kosovoFallback) {
    console.log("Kosovo source unavailable; using last known Kosovo prices from history");
  } else {
    console.warn("Kosovo source unavailable and no history fallback found");
  }

  const latest: LatestEurope = {
    region: "Europe",
    as_of: picked.as_of,
    source: picked.source,
    source_url: picked.url,
    fetched_at_utc: new Date().toISOString(),
    unit: "EUR_per_liter",
    countries,
  };

  fs.writeFileSync(latestPath, JSON.stringify(latest, null, 2), "utf8");

  history.series = history.series.filter((x) => x.as_of !== latest.as_of);
  history.series.push({
    as_of: latest.as_of,
    source: latest.source,
    // A historical Kosovo fallback is not a new Kosovo observation.
    countries: latest.countries.filter((country) => country.provenance !== "historical-fallback"),
  });
  history.series.sort((a, b) => a.as_of.localeCompare(b.as_of));

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), "utf8");

  const trendsPath = path.join(outDir, "trends.json");
  fs.writeFileSync(trendsPath, JSON.stringify(buildTrends(history)), "utf8");

  console.log("Wrote data/latest.json, data/history.json and data/trends.json");
  console.log("As of:", latest.as_of, "Source:", latest.source);
  console.log("Countries:", latest.countries.length);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
