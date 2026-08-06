/**
 * HTML sections built from our own price history.
 *
 * Everything here is derived data — ranges, percentiles, volatility, records,
 * spreads — computed from observations this site has collected daily since
 * February 2026. None of it is available from the upstream price source, and
 * all of it changes as new data arrives.
 */

import {
  loadHistory,
  rankToday,
  biggestMovers,
  byVolatility,
  regionAverageSeries,
  spreadSeries,
  fillUpVerdict,
  trendWord,
  formatDate,
  eur,
  eur3,
  pct,
  FUEL_LABEL,
  FUEL_SHORT,
  type HistoryContext,
  type FuelKey,
  type FuelStats,
} from "./historyStats";
import { renderLineChart, renderSparkline } from "./charts";
import { isEuropeanCountry } from "../src/utils/regions";

export { loadHistory };
export type { HistoryContext };

const FUELS: FuelKey[] = ["gasoline95", "diesel", "lpg"];
const inEurope = (name: string) => isEuropeanCountry(name);

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Country name → country page slug, for internal linking. */
function slugLink(slugByCountry: Map<string, string>, name: string): string {
  const slug = slugByCountry.get(name);
  return slug ? `<a href="/fuel-prices/${slug}">${esc(name)}</a>` : esc(name);
}

// ─── Country page: the original-analysis block ──────────────────────────────

export function renderCountryAnalysis(
  hist: HistoryContext,
  country: { dataCountryName: string; label: string }
): string {
  if (!hist.ok) return "";
  const cs = hist.byCountry.get(country.dataCountryName);
  if (!cs) return "";

  // Prefer diesel as the headline fuel; fall back to whatever we have.
  const primary = cs.fuels.diesel ?? cs.fuels.gasoline95 ?? cs.fuels.lpg;
  if (!primary) return "";

  const label = esc(country.label);
  const verdict = fillUpVerdict(primary);

  const rows = FUELS.map((f) => {
    const s = cs.fuels[f];
    if (!s) return "";
    const vsAvg = ((s.current - s.average) / s.average) * 100;
    return `
            <tr>
              <th scope="row">${FUEL_LABEL[f]}</th>
              <td>${eur3(s.current)}</td>
              <td>${eur3(s.min)}</td>
              <td>${eur3(s.max)}</td>
              <td>${eur3(s.average)}</td>
              <td>${pct(vsAvg)}</td>
              <td>${pct(s.changePct.d30)}</td>
              <td>${renderSparkline(s.points)}</td>
            </tr>`;
  }).join("");

  const chart = renderLineChart({
    points: primary.points,
    title: `${country.label} ${FUEL_SHORT[primary.fuel]} price history, ${hist.startLabel} to ${hist.endLabel}`,
    reference: { value: primary.average, label: "period average" },
  });

  const streakSentence =
    primary.streak.days >= 3 && primary.streak.direction !== "flat"
      ? ` ${label} ${FUEL_SHORT[primary.fuel]} has now moved ${primary.streak.direction === "up" ? "higher" : "lower"} for ${primary.streak.days} consecutive readings.`
      : "";

  const narrative = `Since ${hist.startLabel} we have recorded ${primary.daysObserved} daily ${FUEL_SHORT[primary.fuel]} readings for ${label}. Over that period the price ${trendWord(primary.changePct.all)} ${pct(primary.changePct.all)}, ranging from a low of ${eur3(primary.min)} on ${formatDate(primary.minDate)} to a high of ${eur3(primary.max)} on ${formatDate(primary.maxDate)}. Today's ${eur3(primary.current)} is ${primary.percentile >= 50 ? `more expensive than ${primary.percentile}%` : `cheaper than ${100 - primary.percentile}%`} of the days in that record.${streakSentence}`;

  return `
        <section class="contentSection">
          <h2 class="contentHeading">${label} fuel price history and analysis</h2>
          <p class="contentBody">${narrative}</p>
          ${chart}
          <div class="verdictBox">
            <p class="verdictLabel">Refuelling verdict: ${esc(verdict.label)}</p>
            <p class="contentBody contentBodyNoMargin">${esc(verdict.detail)}</p>
          </div>
          <div class="tableScroll">
          <table class="contentTable">
            <caption class="tableCaption">${label} fuel prices measured over ${primary.daysObserved} days (${hist.startLabel} – ${hist.endLabel}). Prices in EUR per liter.</caption>
            <thead>
              <tr>
                <th scope="col">Fuel</th>
                <th scope="col">Today</th>
                <th scope="col">Period low</th>
                <th scope="col">Period high</th>
                <th scope="col">Average</th>
                <th scope="col">vs average</th>
                <th scope="col">30-day</th>
                <th scope="col">Trend</th>
              </tr>
            </thead>
            <tbody>${rows}
            </tbody>
          </table>
          </div>
          <p class="contentBodyMuted">Range, average, percentile and volatility figures are calculated by Karburanti Sot from our own daily observations — they are not published by the upstream price source. See <a href="/methodology">how we collect and compute this</a>.</p>
        </section>`;
}

/** Albania-vs-this-country spread history — only meaningful for non-Albania. */
export function renderSpreadSection(
  hist: HistoryContext,
  country: { dataCountryName: string; label: string }
): string {
  if (!hist.ok || country.dataCountryName === "Albania") return "";

  const fuel: FuelKey = "diesel";
  const series = spreadSeries(hist, fuel, country.dataCountryName, "Albania");
  if (series.length < 30) return "";

  const values = series.map((p) => p.value);
  const current = values[values.length - 1];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const widest = series.reduce((m, p) => (Math.abs(p.value) > Math.abs(m.value) ? p : m), series[0]);
  const label = esc(country.label);

  const dearer = current > 0;
  const chart = renderLineChart({
    points: series,
    title: `${country.label} minus Albania diesel price difference over time`,
    format: (v) => `${v >= 0 ? "+" : "−"}€${Math.abs(v).toFixed(2)}`,
    reference: { value: 0, label: "same price" },
  });

  return `
        <section class="contentSection">
          <h2 class="contentHeading">${label} vs Albania: how the gap has moved</h2>
          <p class="contentBody">Diesel in ${label} is currently ${eur3(Math.abs(current))} per liter ${dearer ? "more expensive than" : "cheaper than"} in Albania. Across the ${series.length} days we have tracked both markets, the average gap was ${eur3(Math.abs(avg))} per liter ${avg > 0 ? "in Albania's favour" : `in ${country.label}'s favour`}, and the widest gap recorded was ${eur3(Math.abs(widest.value))} on ${formatDate(widest.date)}.</p>
          ${chart}
          <p class="contentBody">On a 50-litre tank, today's difference is worth about ${eur(Math.abs(current) * 50)} — ${dearer ? `fill up in Albania before crossing into ${label}` : `worth waiting to refuel in ${label}`}. Use the <a href="/compare">comparison tool</a> to check this against other neighbouring markets before you travel.</p>
        </section>`;
}

// ─── Home page: market summary ──────────────────────────────────────────────

export function renderHomeMarketSummary(hist: HistoryContext): string {
  if (!hist.ok) return "";
  const alb = hist.byCountry.get("Albania")?.fuels.diesel;
  if (!alb) return "";

  const ranked = rankToday(hist, "diesel", inEurope);
  const albRank = ranked.findIndex((r) => r.country === "Albania") + 1;
  const avgSeries = regionAverageSeries(hist, "diesel", inEurope);
  const euAvg = avgSeries.length ? avgSeries[avgSeries.length - 1].value : null;
  const verdict = fillUpVerdict(alb);

  const chart = renderLineChart({
    points: avgSeries,
    title: `European average diesel price, ${hist.startLabel} to ${hist.endLabel}`,
  });

  const vsAvg = euAvg ? alb.current - euAvg : null;

  return `
        <section class="contentSection">
          <h2 class="contentHeading">Today's market in one paragraph</h2>
          <p class="contentBody">Albanian diesel stands at ${eur3(alb.current)} per liter today, ${pct(alb.changePct.d30)} over the past 30 days and ${pct(alb.changePct.all)} since we began recording on ${hist.startLabel}.${albRank ? ` That places Albania ${ordinal(albRank)} cheapest of the ${ranked.length} European markets we track.` : ""}${vsAvg != null ? ` The European average today is ${eur3(euAvg!)}, so Albanian drivers are paying ${eur3(Math.abs(vsAvg))} ${vsAvg > 0 ? "above" : "below"} the continental average.` : ""}</p>
          <div class="verdictBox">
            <p class="verdictLabel">Albania refuelling verdict: ${esc(verdict.label)}</p>
            <p class="contentBody contentBodyNoMargin">${esc(verdict.detail)}</p>
          </div>
          ${chart}
          <p class="contentBodyMuted">Computed from ${hist.daysObserved} days of our own price observations. Full breakdown in the <a href="/market-report">daily market report</a>.</p>
        </section>`;
}

// ─── Market report page ─────────────────────────────────────────────────────

export function renderMarketReport(
  hist: HistoryContext,
  slugByCountry: Map<string, string>
): string {
  if (!hist.ok) return "";

  const fuel: FuelKey = "diesel";
  const ranked = rankToday(hist, fuel, inEurope);
  if (!ranked.length) return "";

  const cheapest = ranked[0];
  const dearest = ranked[ranked.length - 1];
  const avgSeries = regionAverageSeries(hist, fuel, inEurope);
  const euAvg = avgSeries[avgSeries.length - 1]?.value;
  const euAvg30 = avgSeries[avgSeries.length - 31]?.value;
  const euChange = euAvg && euAvg30 ? ((euAvg - euAvg30) / euAvg30) * 100 : null;

  const fallers = biggestMovers(hist, fuel, inEurope, "down");
  const risers = biggestMovers(hist, fuel, inEurope, "up");
  const vol = byVolatility(hist, fuel, inEurope);
  const mostVolatile = vol.slice(0, 5);
  const leastVolatile = vol.slice(-5).reverse();

  const moverRow = (r: { country: string; changePct: number }) => `
            <tr>
              <th scope="row">${slugLink(slugByCountry, r.country)}</th>
              <td>${pct(r.changePct)}</td>
              <td>${eur3(hist.byCountry.get(r.country)?.fuels[fuel]?.current ?? 0)}</td>
            </tr>`;

  const volRow = (r: { country: string; volatilityPct: number }) => `
            <tr>
              <th scope="row">${slugLink(slugByCountry, r.country)}</th>
              <td>${r.volatilityPct.toFixed(2)}%</td>
              <td>${renderSparkline(hist.byCountry.get(r.country)?.fuels[fuel]?.points ?? [])}</td>
            </tr>`;

  const rankRows = ranked
    .map((r, i) => {
      const s = hist.byCountry.get(r.country)?.fuels[fuel];
      if (!s) return "";
      return `
            <tr${r.country === "Albania" ? ' class="contentTableHighlight"' : ""}>
              <td>${i + 1}</td>
              <th scope="row">${slugLink(slugByCountry, r.country)}</th>
              <td>${eur3(s.current)}</td>
              <td>${pct(s.changePct.d30)}</td>
              <td>${eur3(s.min)} – ${eur3(s.max)}</td>
              <td>${s.percentile}%</td>
            </tr>`;
    })
    .join("");

  const chart = renderLineChart({
    points: avgSeries,
    title: `European average diesel price over ${hist.daysObserved} days`,
  });

  return `
      <article class="contentPage">
        <h1 class="contentPageTitle">European Fuel Market Report — ${hist.endLabel}</h1>
        <p class="contentBody">An automatically generated analysis of the European diesel market, recomputed every day from ${hist.daysObserved} days of price observations collected by Karburanti Sot since ${hist.startLabel}. Unlike the raw price snapshots published elsewhere, every figure below — ranges, 30-day moves, volatility and percentile positions — is derived from our own historical record.</p>

        <section class="contentSection">
          <h2 class="contentHeading">Market summary</h2>
          <p class="contentBody">The average diesel price across the ${ranked.length} European markets we track is ${eur3(euAvg ?? 0)} per liter${euChange != null ? `, ${euChange >= 0 ? "up" : "down"} ${pct(Math.abs(euChange))} over the past 30 days` : ""}. ${slugLink(slugByCountry, cheapest.country)} is currently the cheapest market at ${eur3(cheapest.value)}, while ${slugLink(slugByCountry, dearest.country)} is the most expensive at ${eur3(dearest.value)} — a spread of ${eur3(dearest.value - cheapest.value)} per liter, or about ${eur((dearest.value - cheapest.value) * 50)} on a single 50-litre tank.</p>
          ${chart}
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Biggest fallers over 30 days</h2>
          <div class="tableScroll">
          <table class="contentTable">
            <thead><tr><th scope="col">Country</th><th scope="col">30-day change</th><th scope="col">Today</th></tr></thead>
            <tbody>${fallers.map(moverRow).join("") || '<tr><td colspan="3">No market fell over the past 30 days.</td></tr>'}
            </tbody>
          </table>
          </div>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Biggest risers over 30 days</h2>
          <div class="tableScroll">
          <table class="contentTable">
            <thead><tr><th scope="col">Country</th><th scope="col">30-day change</th><th scope="col">Today</th></tr></thead>
            <tbody>${risers.map(moverRow).join("") || '<tr><td colspan="3">No market rose over the past 30 days.</td></tr>'}
            </tbody>
          </table>
          </div>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Which markets move the most?</h2>
          <p class="contentBody">Volatility here is the standard deviation of daily percentage price moves across our full record — a measure of how unpredictable each market is from one day to the next. Stable markets are usually those with administered or slow-moving retail pricing; volatile ones tend to track wholesale costs closely.</p>
          <div class="tableScroll">
          <table class="contentTable">
            <caption class="tableCaption">Most volatile diesel markets</caption>
            <thead><tr><th scope="col">Country</th><th scope="col">Daily volatility</th><th scope="col">Trend</th></tr></thead>
            <tbody>${mostVolatile.map(volRow).join("")}
            </tbody>
          </table>
          </div>
          <div class="tableScroll">
          <table class="contentTable">
            <caption class="tableCaption">Most stable diesel markets</caption>
            <thead><tr><th scope="col">Country</th><th scope="col">Daily volatility</th><th scope="col">Trend</th></tr></thead>
            <tbody>${leastVolatile.map(volRow).join("")}
            </tbody>
          </table>
          </div>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Full European diesel table</h2>
          <p class="contentBody">Every market we track, ranked cheapest first. "Position in range" shows where today's price sits within everything we have recorded for that country: 0% means it is at its cheapest observed level, 100% its most expensive.</p>
          <div class="tableScroll">
          <table class="contentTable">
            <thead>
              <tr>
                <th scope="col">#</th><th scope="col">Country</th><th scope="col">Today</th>
                <th scope="col">30-day</th><th scope="col">Observed range</th><th scope="col">Position in range</th>
              </tr>
            </thead>
            <tbody>${rankRows}
            </tbody>
          </table>
          </div>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">How this report is produced</h2>
          <p class="contentBody">Every figure is recomputed on each build from the daily price record this site has been appending to since ${hist.startLabel} — ${hist.daysObserved} consecutive readings with no gaps. Raw daily prices originate from public aggregators as described in our <a href="/methodology">methodology</a>, which also documents exactly how each figure here is calculated; the analysis, ranges, volatility measures and interpretations are our own.</p>
        </section>
      </article>`;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
