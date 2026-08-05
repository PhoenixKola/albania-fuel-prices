/**
 * Build step 1: compute the site's original analysis once, and write it to
 * src/generated/ as plain TypeScript modules.
 *
 * Both the prerendered HTML and the React app import these modules, which
 * guarantees a crawler and a real visitor see exactly the same analysis —
 * no divergence, no client-side refetch, no cloaking risk.
 *
 * Runs before `vite build`. The generated files are committed so a fresh
 * clone (and the Cloudflare build) always typechecks.
 *
 * Run: npx tsx scripts/generateAnalysis.ts
 */

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTRY_EDITORIAL } from "../src/config/countryContent";
import {
  loadHistory,
  renderCountryAnalysis,
  renderSpreadSection,
  renderHomeMarketSummary,
  renderMarketReport,
} from "./analysisSections";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../src/generated");
const DATA_DIR = resolve(__dirname, "../../data");

/** Beyond this, the deployed HTML is stale enough to tell readers about. */
const STALE_AFTER_DAYS = 3;

const HEADER = `/**
 * GENERATED FILE — do not edit by hand.
 * Produced by scripts/generateAnalysis.ts from data/history.json on each build.
 */\n\n`;

function daysBetween(a: string, b: string): number {
  const t1 = Date.parse(`${a}T00:00:00Z`);
  const t2 = Date.parse(`${b}T00:00:00Z`);
  if (Number.isNaN(t1) || Number.isNaN(t2)) return 0;
  return Math.round((t2 - t1) / 86_400_000);
}

function main() {
  const hist = loadHistory();

  let asOf = "";
  try {
    asOf = JSON.parse(readFileSync(resolve(DATA_DIR, "latest.json"), "utf-8")).as_of ?? "";
  } catch {
    /* handled below via empty asOf */
  }

  const today = new Date().toISOString().slice(0, 10);
  const dataAgeDays = asOf ? daysBetween(asOf, today) : 0;
  const stale = dataAgeDays > STALE_AFTER_DAYS;

  if (!hist.ok) {
    console.warn("⚠ generateAnalysis: no usable history — generating empty analysis modules.");
  }
  if (stale) {
    console.warn(
      `⚠ generateAnalysis: price data is ${dataAgeDays} days old (as_of ${asOf}, today ${today}).\n` +
        "  The site will show a visible freshness notice. Check that the daily data workflow\n" +
        "  and the Cloudflare Pages rebuild are both running."
    );
  }

  const slugByCountry = new Map(COUNTRY_EDITORIAL.map((c) => [c.dataCountryName, c.slug]));

  mkdirSync(OUT_DIR, { recursive: true });

  // ── Per-country analysis (lazy-loaded with the country page chunk) ──
  const countryEntries = COUNTRY_EDITORIAL.map((c) => {
    const analysis = renderCountryAnalysis(hist, c);
    const spread = renderSpreadSection(hist, c);
    return `  ${JSON.stringify(c.slug)}: ${JSON.stringify(analysis + spread)},`;
  }).join("\n");

  writeFileSync(
    resolve(OUT_DIR, "countryAnalysis.ts"),
    `${HEADER}export const COUNTRY_ANALYSIS_HTML: Record<string, string> = {\n${countryEntries}\n};\n\nexport function getCountryAnalysis(slug: string): string {\n  return COUNTRY_ANALYSIS_HTML[slug] ?? "";\n}\n`,
    "utf-8"
  );

  // ── Home market summary (small, ships in the main chunk) ──
  writeFileSync(
    resolve(OUT_DIR, "homeSummary.ts"),
    `${HEADER}export const HOME_SUMMARY_HTML = ${JSON.stringify(renderHomeMarketSummary(hist))};\n`,
    "utf-8"
  );

  // ── Daily market report (lazy-loaded with its own page) ──
  writeFileSync(
    resolve(OUT_DIR, "marketReport.ts"),
    `${HEADER}export const MARKET_REPORT_HTML = ${JSON.stringify(renderMarketReport(hist, slugByCountry))};\n`,
    "utf-8"
  );

  // A country page is only worth indexing if we can actually deliver prices
  // for it. Montenegro and North Macedonia are absent from the upstream feed,
  // so their pages promise "prices today" they cannot show — Google reads that
  // as thin content. They stay reachable, but noindex and out of the sitemap.
  let latestCountries: string[] = [];
  try {
    const latest = JSON.parse(readFileSync(resolve(DATA_DIR, "latest.json"), "utf-8"));
    latestCountries = (latest.countries ?? []).map((c: { country: string }) => c.country);
  } catch {
    /* leave empty; every country then falls back to history-only checks */
  }

  const indexable = COUNTRY_EDITORIAL.filter(
    (c) => latestCountries.includes(c.dataCountryName) || hist.byCountry.has(c.dataCountryName)
  ).map((c) => c.slug);

  const excluded = COUNTRY_EDITORIAL.filter((c) => !indexable.includes(c.slug)).map((c) => c.slug);
  if (excluded.length) {
    console.log(`  ↳ noindex (no price data available): ${excluded.join(", ")}`);
  }

  writeFileSync(
    resolve(OUT_DIR, "indexableCountries.ts"),
    `${HEADER}/** Country slugs we can show real price data for. Others are noindexed. */\nexport const INDEXABLE_COUNTRY_SLUGS: string[] = ${JSON.stringify(indexable, null, 2)};\n\nexport function isCountryIndexable(slug: string): boolean {\n  return INDEXABLE_COUNTRY_SLUGS.includes(slug);\n}\n`,
    "utf-8"
  );

  // ── Shared metadata (freshness, coverage) used by both renderers ──
  const meta = {
    asOf,
    dataAgeDays,
    stale,
    staleAfterDays: STALE_AFTER_DAYS,
    historyOk: hist.ok,
    startDate: hist.startDate,
    endDate: hist.endDate,
    startLabel: hist.startLabel,
    endLabel: hist.endLabel,
    daysObserved: hist.daysObserved,
    countriesAnalysed: hist.byCountry.size,
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(
    resolve(OUT_DIR, "analysisMeta.ts"),
    `${HEADER}export type AnalysisMeta = {\n  asOf: string;\n  dataAgeDays: number;\n  stale: boolean;\n  staleAfterDays: number;\n  historyOk: boolean;\n  startDate: string;\n  endDate: string;\n  startLabel: string;\n  endLabel: string;\n  daysObserved: number;\n  countriesAnalysed: number;\n  generatedAt: string;\n};\n\nexport const ANALYSIS_META: AnalysisMeta = ${JSON.stringify(meta, null, 2)};\n`,
    "utf-8"
  );

  console.log(
    `✓ Generated analysis: ${hist.daysObserved} days, ${hist.byCountry.size} countries, data as_of ${asOf || "unknown"}${stale ? ` (STALE by ${dataAgeDays}d)` : ""}`
  );
}

main();
