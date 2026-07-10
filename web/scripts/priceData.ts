/**
 * Build-time fuel price data for the prerender step.
 *
 * Reads the committed data files (data/latest.json, data/trends.json) and
 * renders static HTML fragments (price tables, trend summaries) that get baked
 * into the prerendered pages. This is what makes the crawlable HTML actually
 * contain the prices the page titles promise.
 *
 * Every renderer degrades to an empty string or "n/a" instead of throwing —
 * a data glitch must never fail the daily build.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTRY_EDITORIAL } from "../src/config/countryContent";
import { isEuropeanCountry } from "../src/utils/regions";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../../data");

/** Used for the indicative ALL/L column when the FX fetch fails. */
const FALLBACK_ALL_PER_EUR = 98;

export type FuelPrices = {
  petrol: number | null;
  diesel: number | null;
  lpg: number | null;
};

type TrendSeries = {
  gasoline95: (number | null)[];
  diesel: (number | null)[];
  lpg: (number | null)[];
};

export type PriceContext = {
  /** False when the data files could not be read; renderers return "". */
  ok: boolean;
  /** ISO date the prices refer to, e.g. "2026-07-06". */
  asOf: string;
  /** Human-readable form, e.g. "6 July 2026". */
  asOfLabel: string;
  source: string;
  sourceUrl: string;
  /** Indicative ALL per EUR rate for the Albania page, null = omit column. */
  allPerEur: number | null;
  prices: Map<string, FuelPrices>;
  trendDates: string[];
  trends: Record<string, TrendSeries>;
};

// ─── Loading ────────────────────────────────────────────────────────────────

export async function loadPriceContext(): Promise<PriceContext> {
  const empty: PriceContext = {
    ok: false,
    asOf: "",
    asOfLabel: "",
    source: "",
    sourceUrl: "",
    allPerEur: null,
    prices: new Map(),
    trendDates: [],
    trends: {},
  };

  let latest: {
    as_of?: string;
    source?: string;
    source_url?: string;
    countries?: { country: string; gasoline95_eur: number | null; diesel_eur: number | null; lpg_eur: number | null }[];
  };
  try {
    latest = JSON.parse(readFileSync(resolve(DATA_DIR, "latest.json"), "utf-8"));
  } catch (err) {
    console.warn("⚠ priceData: could not read data/latest.json — prerendering without price tables.", err);
    return empty;
  }
  if (!latest.as_of || !Array.isArray(latest.countries)) {
    console.warn("⚠ priceData: data/latest.json has unexpected shape — prerendering without price tables.");
    return empty;
  }

  const prices = new Map<string, FuelPrices>();
  for (const c of latest.countries) {
    prices.set(c.country, {
      petrol: c.gasoline95_eur ?? null,
      diesel: c.diesel_eur ?? null,
      lpg: c.lpg_eur ?? null,
    });
  }

  let trendDates: string[] = [];
  let trends: Record<string, TrendSeries> = {};
  try {
    const t = JSON.parse(readFileSync(resolve(DATA_DIR, "trends.json"), "utf-8"));
    if (Array.isArray(t.dates) && t.countries) {
      trendDates = t.dates;
      trends = t.countries;
    }
  } catch {
    console.warn("⚠ priceData: could not read data/trends.json — trend summaries omitted.");
  }

  return {
    ok: true,
    asOf: latest.as_of,
    asOfLabel: formatDate(latest.as_of),
    source: latest.source ?? "public fuel price aggregators",
    sourceUrl: latest.source_url ?? "",
    allPerEur: await fetchAllPerEur(),
    prices,
    trendDates,
    trends,
  };
}

/** Indicative ALL/EUR rate; falls back to a committed constant offline. */
async function fetchAllPerEur(): Promise<number> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const r = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json",
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (!r.ok) throw new Error(`${r.status}`);
    const json = (await r.json()) as { eur?: { all?: number } };
    const rate = json.eur?.all;
    if (typeof rate === "number" && rate > 50 && rate < 250) return rate;
    throw new Error("rate out of plausible range");
  } catch {
    console.warn(`⚠ priceData: FX fetch failed — using fallback ${FALLBACK_ALL_PER_EUR} ALL/EUR.`);
    return FALLBACK_ALL_PER_EUR;
  }
}

// ─── Formatting helpers ─────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export function fmtEur(value: number | null): string {
  return value == null ? "n/a" : `€${value.toFixed(2)}`;
}

function fmtAll(valueEur: number | null, allPerEur: number | null): string {
  if (valueEur == null || allPerEur == null) return "n/a";
  return `${Math.round(valueEur * allPerEur)} ALL`;
}

/** 30-day change from the first to the last non-null point of a series. */
function seriesChange(series: (number | null)[] | undefined): { from: number; to: number; pct: number } | null {
  if (!series) return null;
  const values = series.filter((v): v is number => v != null);
  if (values.length < 2) return null;
  const from = values[0];
  const to = values[values.length - 1];
  if (from === 0) return null;
  return { from, to, pct: ((to - from) / from) * 100 };
}

function fmtChange(change: { pct: number } | null): string {
  if (!change) return "—";
  if (Math.abs(change.pct) < 0.05) return "unchanged";
  const sign = change.pct > 0 ? "+" : "−";
  return `${sign}${Math.abs(change.pct).toFixed(1)}%`;
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const FUEL_ROWS: { key: keyof FuelPrices; trendKey: keyof TrendSeries; label: string; shortName: string }[] = [
  { key: "petrol", trendKey: "gasoline95", label: "Petrol (Gasoline 95)", shortName: "petrol" },
  { key: "diesel", trendKey: "diesel", label: "Diesel", shortName: "diesel" },
  { key: "lpg", trendKey: "lpg", label: "LPG (Autogas)", shortName: "LPG" },
];

// ─── Renderers ──────────────────────────────────────────────────────────────

/**
 * Price table + trend summary for one country page. Rendered as the first
 * section under the H1 so the "prices today" promise is met immediately.
 */
export function renderCountryPriceSection(
  ctx: PriceContext,
  country: { dataCountryName: string; label: string }
): string {
  if (!ctx.ok) return "";
  const prices = ctx.prices.get(country.dataCountryName);

  if (!prices) {
    return `
        <section class="contentSection">
          <h2 class="contentHeading">Current fuel prices in ${esc(country.label)}</h2>
          <p class="contentBody">Our upstream data source does not currently publish daily country-level averages for ${esc(country.label)}, so a live price table is not shown on this page. The market context and travel guidance below still apply. For live figures in neighboring markets, see the <a href="/rankings">Europe fuel price rankings</a>.</p>
        </section>`;
  }

  const showAll = country.dataCountryName === "Albania" && ctx.allPerEur != null;
  const trend = ctx.trends[country.dataCountryName];

  const rows = FUEL_ROWS.map((fuel) => {
    const change = seriesChange(trend?.[fuel.trendKey]);
    const allCell = showAll ? `<td>${fmtAll(prices[fuel.key], ctx.allPerEur)}</td>` : "";
    return `
            <tr>
              <th scope="row">${fuel.label}</th>
              <td>${fmtEur(prices[fuel.key])}</td>${allCell}
              <td>${fmtChange(change)}</td>
            </tr>`;
  }).join("");

  return `
        <section class="contentSection">
          <h2 class="contentHeading">Current fuel prices in ${esc(country.label)} (${ctx.asOfLabel})</h2>
          <table class="contentTable">
            <thead>
              <tr>
                <th scope="col">Fuel type</th>
                <th scope="col">Price (EUR/L)</th>${showAll ? `\n                <th scope="col">≈ Price (ALL/L)</th>` : ""}
                <th scope="col">30-day change</th>
              </tr>
            </thead>
            <tbody>${rows}
            </tbody>
          </table>
          <p class="contentBody">${renderTrendSentence(ctx, country)}</p>
          <p class="contentBodyMuted">Country-level average as of ${ctx.asOfLabel}, sourced from ${esc(ctx.source)}${showAll ? ". ALL values are indicative conversions at a mid-market exchange rate" : ""}. Individual station prices vary — see <a href="/methodology">our methodology</a>.</p>
        </section>`;
}

/** One-sentence 30-day trend summary, unique per country, changes daily. */
export function renderTrendSentence(
  ctx: PriceContext,
  country: { dataCountryName: string; label: string }
): string {
  const trend = ctx.trends[country.dataCountryName];
  if (!trend) return "";

  const parts: string[] = [];
  for (const fuel of FUEL_ROWS) {
    const change = seriesChange(trend[fuel.trendKey]);
    if (!change) continue;
    if (Math.abs(change.pct) < 0.05) {
      parts.push(`${fuel.shortName} held steady at ${fmtEur(change.to)}`);
    } else {
      const dir = change.pct > 0 ? "rose" : "fell";
      parts.push(
        `${fuel.shortName} ${dir} from ${fmtEur(change.from)} to ${fmtEur(change.to)} (${fmtChange(change)})`
      );
    }
  }
  if (!parts.length) return "";
  return `Over the past 30 days in ${esc(country.label)}, ${parts.join(", ")} per liter.`;
}

/** Homepage snapshot: all 10 covered countries, sorted cheapest petrol first. */
export function renderHomeSnapshot(ctx: PriceContext): string {
  if (!ctx.ok) return "";

  const covered = COUNTRY_EDITORIAL
    .map((c) => ({ c, p: ctx.prices.get(c.dataCountryName) }))
    .filter((x) => x.p)
    .sort((a, b) => (a.p!.petrol ?? Infinity) - (b.p!.petrol ?? Infinity));
  if (!covered.length) return "";

  const rows = covered
    .map(
      ({ c, p }) => `
            <tr>
              <th scope="row"><a href="/fuel-prices/${c.slug}">${esc(c.label)}</a></th>
              <td>${fmtEur(p!.petrol)}</td>
              <td>${fmtEur(p!.diesel)}</td>
              <td>${fmtEur(p!.lpg)}</td>
            </tr>`
    )
    .join("");

  return `
        <section class="contentSection">
          <h2 class="contentHeading">Today's fuel prices at a glance (${ctx.asOfLabel})</h2>
          <table class="contentTable">
            <thead>
              <tr>
                <th scope="col">Country</th>
                <th scope="col">Petrol (EUR/L)</th>
                <th scope="col">Diesel (EUR/L)</th>
                <th scope="col">LPG (EUR/L)</th>
              </tr>
            </thead>
            <tbody>${rows}
            </tbody>
          </table>
          <p class="contentBodyMuted">Prices last updated ${ctx.asOfLabel}. Sorted by petrol price, cheapest first. Click a country for the full market breakdown, 30-day trend, and border-crossing advice.</p>
        </section>`;
}

/** Full European ranking table for the /rankings page. */
export function renderRankingsTable(ctx: PriceContext): string {
  if (!ctx.ok) return "";

  const europe = [...ctx.prices.entries()]
    .filter(([name]) => isEuropeanCountry(name))
    .filter(([, p]) => p.petrol != null)
    .sort((a, b) => a[1].petrol! - b[1].petrol!);
  if (!europe.length) return "";

  const covered = new Map(COUNTRY_EDITORIAL.map((c) => [c.dataCountryName, c.slug]));

  const rows = europe
    .map(([name, p], i) => {
      const slug = covered.get(name);
      const label = slug ? `<a href="/fuel-prices/${slug}">${esc(name)}</a>` : esc(name);
      return `
            <tr${name === "Albania" ? ' class="contentTableHighlight"' : ""}>
              <td>${i + 1}</td>
              <th scope="row">${label}</th>
              <td>${fmtEur(p.petrol)}</td>
              <td>${fmtEur(p.diesel)}</td>
            </tr>`;
    })
    .join("");

  return `
        <section class="contentSection">
          <h2 class="contentHeading">European fuel price ranking (${ctx.asOfLabel})</h2>
          <p class="contentBody">All covered European markets ranked by petrol price, cheapest first. Diesel is shown alongside for comparison.</p>
          <table class="contentTable">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Country</th>
                <th scope="col">Petrol (EUR/L)</th>
                <th scope="col">Diesel (EUR/L)</th>
              </tr>
            </thead>
            <tbody>${rows}
            </tbody>
          </table>
          <p class="contentBodyMuted">Country-level averages as of ${ctx.asOfLabel}, in EUR per liter. Non-eurozone prices converted at mid-market rates.</p>
        </section>`;
}

/** Real-number Albania-vs-neighbors deltas for the /compare page. */
export function renderComparePairs(ctx: PriceContext): string {
  if (!ctx.ok) return "";
  const albania = ctx.prices.get("Albania");
  if (!albania) return "";

  const partners = ["Kosovo", "Greece", "Italy", "Montenegro", "North Macedonia"]
    .map((name) => ({ name, p: ctx.prices.get(name) }))
    .filter((x): x is { name: string; p: FuelPrices } => x.p != null);
  if (!partners.length) return "";

  const covered = new Map(COUNTRY_EDITORIAL.map((c) => [c.dataCountryName, c.slug]));

  const rows = partners
    .map(({ name, p }) => {
      const slug = covered.get(name);
      const label = slug ? `<a href="/fuel-prices/${slug}">${esc(name)}</a>` : esc(name);
      const delta = (theirs: number | null, ours: number | null): string => {
        if (theirs == null || ours == null) return "n/a";
        const d = theirs - ours;
        const sign = d > 0 ? "+" : d < 0 ? "−" : "±";
        return `${sign}€${Math.abs(d).toFixed(2)}`;
      };
      return `
            <tr>
              <th scope="row">${label}</th>
              <td>${fmtEur(p.petrol)} (${delta(p.petrol, albania.petrol)})</td>
              <td>${fmtEur(p.diesel)} (${delta(p.diesel, albania.diesel)})</td>
            </tr>`;
    })
    .join("");

  return `
        <section class="contentSection">
          <h2 class="contentHeading">Albania vs neighbors today (${ctx.asOfLabel})</h2>
          <p class="contentBody">Live differences against Albania's current averages of ${fmtEur(albania.petrol)}/L petrol and ${fmtEur(albania.diesel)}/L diesel. A positive delta means fuel there costs more than in Albania.</p>
          <table class="contentTable">
            <thead>
              <tr>
                <th scope="col">Country</th>
                <th scope="col">Petrol (vs Albania)</th>
                <th scope="col">Diesel (vs Albania)</th>
              </tr>
            </thead>
            <tbody>${rows}
            </tbody>
          </table>
        </section>`;
}

/** Short live-price line for meta descriptions, or "" when unavailable. */
export function priceMetaPrefix(ctx: PriceContext, dataCountryName: string): string {
  if (!ctx.ok) return "";
  const p = ctx.prices.get(dataCountryName);
  if (!p || p.petrol == null || p.diesel == null) return "";
  return `Petrol ${fmtEur(p.petrol)}/L, diesel ${fmtEur(p.diesel)}/L as of ${ctx.asOfLabel}. `;
}
