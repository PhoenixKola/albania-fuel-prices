import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

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

type CountryPrices = {
  country: string;
  gasoline95_eur: number | null;
  diesel_eur: number | null;
  lpg_eur: number | null;
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
  const s = String(v).trim();
  if (!s || s === "-" || s.toLowerCase() === "n/a") return null;
  const n = Number(s.replace(",", ".").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; albania-fuel-prices/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.text();
}

function isoTodayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function parseDateFromText(text: string) {
  const m = text.match(/(\d{1,2})\.\s*([A-Za-z]+)\s*(\d{4})/);
  if (!m) return isoTodayUTC();

  const day = Number(m[1]);
  const monName = m[2].toLowerCase();
  const year = Number(m[3]);

  const map: Record<string, number> = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  const month = map[monName];
  if (!month) return isoTodayUTC();

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function normalizeCountry(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function parseCargopediaEurope(html: string) {
  const $ = cheerio.load(html);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();
  const as_of = parseDateFromText(pageText);

  const rows: string[] = [];
  $("tr").each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
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

  countries.sort((a, b) => a.country.localeCompare(b.country));
  return { as_of, countries };
}

function parseTollsEurope(html: string) {
  const $ = cheerio.load(html);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();
  const as_of = parseDateFromText(pageText);

  const rows: string[] = [];
  $("tr").each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
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

  countries.sort((a, b) => a.country.localeCompare(b.country));
  return { as_of, countries };
}

async function main() {
  let picked:
    | { source: string; url: string; as_of: string; countries: CountryPrices[] }
    | null = null;

  for (const s of SOURCES) {
    try {
      const html = await fetchHtml(s.url);
      const parsed = s.parser(html) as any;
      picked = { source: s.name, url: s.url, as_of: parsed.as_of, countries: parsed.countries };
      break;
    } catch {}
  }

  if (!picked) throw new Error("All sources failed (cargopedia.net and tolls.eu).");

  const latest: LatestEurope = {
    region: "Europe",
    as_of: picked.as_of,
    source: picked.source,
    source_url: picked.url,
    fetched_at_utc: new Date().toISOString(),
    unit: "EUR_per_liter",
    countries: picked.countries,
  };

  const outDir = path.join(process.cwd(), "..", "data");
  ensureDir(outDir);

  const latestPath = path.join(outDir, "latest.json");
  const historyPath = path.join(outDir, "history.json");

  fs.writeFileSync(latestPath, JSON.stringify(latest, null, 2), "utf8");

  let history: HistoryEurope = { region: "Europe", unit: "EUR_per_liter", series: [] };

  if (fs.existsSync(historyPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(historyPath, "utf8"));
      if (parsed && Array.isArray(parsed.series)) {
        history = { region: "Europe", unit: "EUR_per_liter", series: parsed.series };
      }
    } catch {}
  }

  const exists = history.series.some((x) => x.as_of === latest.as_of);
  if (!exists) {
    history.series.push({
      as_of: latest.as_of,
      source: latest.source,
      countries: latest.countries,
    });
    history.series.sort((a, b) => (a.as_of < b.as_of ? -1 : 1));
  }

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), "utf8");

  console.log("Wrote data/latest.json and data/history.json");
  console.log("As of:", latest.as_of, "Source:", latest.source);
  console.log("Countries:", latest.countries.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});