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

  const narrative = `From ${hist.startLabel} to ${hist.endLabel} we collected ${primary.daysObserved} ${FUEL_SHORT[primary.fuel]} observations for ${label}. Over that record the price ${trendWord(primary.changePct.all)} ${pct(primary.changePct.all)}, ranging from ${eur3(primary.min)} on ${formatDate(primary.minDate)} to ${eur3(primary.max)} on ${formatDate(primary.maxDate)}. The last recorded ${eur3(primary.current)} was above ${primary.percentile}% of observations; equal observations are excluded.${streakSentence}`;

  return `
        <section class="contentSection">
          <h2 class="contentHeading">${label} fuel price history and analysis</h2>
          <p class="contentBody">${narrative}</p>
          ${chart}
          <div class="verdictBox">
            <p class="verdictLabel">Historical position: ${esc(verdict.label)}</p>
            <p class="contentBody contentBodyNoMargin">${esc(verdict.detail)}</p>
          </div>
          <div class="tableScroll">
          <table class="contentTable">
            <caption class="tableCaption">${label} fuel prices measured over ${primary.daysObserved} days (${hist.startLabel} – ${hist.endLabel}). Prices in EUR per liter.</caption>
            <thead>
              <tr>
                <th scope="col">Fuel</th>
                <th scope="col">Last observed</th>
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
          <p class="contentBodyMuted">These are our collection-day observations, not verified upstream publication dates. Repeated source values may appear on multiple days. See <a href="/methodology">how we collect and compute this</a>.</p>
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
          <p class="contentBody">On the last matched observation (${formatDate(series[series.length - 1].date)}), diesel in ${label} was ${eur3(Math.abs(current))} per liter ${dearer ? "more expensive than" : "cheaper than"} in Albania. Across ${series.length} matched collection dates, the average gap was ${eur3(Math.abs(avg))} per liter ${avg > 0 ? "in Albania's favour" : `in ${country.label}'s favour`}, and the widest gap recorded was ${eur3(Math.abs(widest.value))} on ${formatDate(widest.date)}.</p>
          ${chart}
          <p class="contentBody">At those dated national reference prices, the difference for 50 litres would be about ${eur(Math.abs(current) * 50)}. This is an illustration, not a recommendation to detour or delay refuelling; actual pumps, route and consumption differ. Check the <a href="/compare">comparison tool</a> before travel.</p>
        </section>`;
}

// ─── Home page: market summary ──────────────────────────────────────────────

function albanianDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function albanianVerdict(percentile: number): { label: string; detail: string } {
  const label = percentile <= 15 ? "Pranë fundit të poshtëm" : percentile <= 40 ? "Në pjesën e poshtme" : percentile < 60 ? "Në mes të intervalit" : percentile < 85 ? "Në pjesën e sipërme" : "Pranë fundit të sipërm";
  return { label, detail: `${percentile}% e vëzhgimeve të regjistruara ishin rreptësisht më të ulëta. Kjo përshkruan të kaluarën, nuk parashikon çmimin e ardhshëm.` };
}

export function renderHomeMarketSummary(hist: HistoryContext, lang: "en" | "sq" = "en"): string {
  if (!hist.ok) return "";
  const alb = hist.byCountry.get("Albania")?.fuels.diesel;
  if (!alb) return "";

  const ranked = rankToday(hist, "diesel", inEurope);
  const albRank = ranked.findIndex((r) => r.country === "Albania") + 1;
  const avgSeries = regionAverageSeries(hist, "diesel", inEurope);
  const euAvg = avgSeries.length ? avgSeries[avgSeries.length - 1].value : null;
  const verdict = lang === "sq" ? albanianVerdict(alb.percentile) : fillUpVerdict(alb);
  const startLabel = lang === "sq" ? albanianDate(hist.startDate) : hist.startLabel;
  const endLabel = lang === "sq" ? albanianDate(hist.endDate) : hist.endLabel;

  const chart = renderLineChart({
    points: avgSeries,
    title: lang === "sq"
      ? `Çmimi mesatar evropian i naftës, ${startLabel} deri më ${endLabel}`
      : `European average diesel price, ${startLabel} to ${endLabel}`,
    formatDate: lang === "sq" ? (iso) => albanianDate(iso).split(" ").slice(0, 2).join(" ") : undefined,
  });

  const vsAvg = euAvg ? alb.current - euAvg : null;

  if (lang === "sq") return `
        <section class="contentSection">
          <h2 class="contentHeading">Leximi i fundit në një paragraf</h2>
          <p class="contentBody">Në vëzhgimin e fundit të mbledhur më ${endLabel}, nafta në Shqipëri ishte ${eur3(alb.current)} për litër, ${pct(alb.changePct.d30)} kundrejt vëzhgimit rreth 30 ditë më parë dhe ${pct(alb.changePct.all)} që prej ${startLabel}.${albRank ? ` Kjo e vendos Shqipërinë në vendin e ${albRank} ndër ${ranked.length} tregjet evropiane të ndjekura.` : ""}${vsAvg != null ? ` Mesatarja e tregjeve të ndjekura ishte ${eur3(euAvg!)}, ${eur3(Math.abs(vsAvg))} ${vsAvg > 0 ? "nën" : "mbi"} vlerën e Shqipërisë.` : ""}</p>
          <div class="verdictBox">
            <p class="verdictLabel">Pozicioni historik: ${esc(verdict.label)}</p>
            <p class="contentBody contentBodyNoMargin">${esc(verdict.detail)}</p>
          </div>
          ${chart}
          <p class="contentBodyMuted">Llogaritur nga ${hist.daysObserved} vëzhgime sipas ditës së mbledhjes, jo domosdoshmërisht sipas ditës së publikimit nga burimi. Shihni <a href="/market-report">raportin e tregut</a>.</p>
        </section>`;

  return `
        <section class="contentSection">
          <h2 class="contentHeading">Latest collected market reading</h2>
          <p class="contentBody">In the last collection-day observation (${endLabel}), Albanian diesel was ${eur3(alb.current)} per litre, ${pct(alb.changePct.d30)} against the observation around 30 days earlier and ${pct(alb.changePct.all)} since ${startLabel}.${albRank ? ` That put Albania ${ordinal(albRank)} of ${ranked.length} tracked European markets, cheapest first.` : ""}${vsAvg != null ? ` The tracked-market average was ${eur3(euAvg!)}, ${eur3(Math.abs(vsAvg))} ${vsAvg > 0 ? "below" : "above"} the Albanian value.` : ""}</p>
          <div class="verdictBox">
            <p class="verdictLabel">Historical position: ${esc(verdict.label)}</p>
            <p class="contentBody contentBodyNoMargin">${esc(verdict.detail)}</p>
          </div>
          ${chart}
          <p class="contentBodyMuted">Computed from ${hist.daysObserved} collection-day observations, which can repeat an unchanged source value. See the <a href="/market-report">market report</a>.</p>
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
      <article class="contentPage marketReportArticle">
        <h1 class="contentPageTitle">European Fuel Market Report — ${hist.endLabel}</h1>
        <p class="contentBody">An analysis of ${hist.daysObserved} collection-day fuel observations from ${hist.startLabel} to ${hist.endLabel}. A collected value may repeat when its source has not published a new price. The dates below are collection dates, not verified upstream publication dates.</p>

        <section class="contentSection reportLeadSection" id="market-summary">
          <h2 class="contentHeading">Market summary</h2>
          <p class="contentBody">On the last collection date, the average diesel reference price across ${ranked.length} tracked European markets was ${eur3(euAvg ?? 0)} per litre${euChange != null ? `, ${euChange >= 0 ? "up" : "down"} ${pct(Math.abs(euChange))} against the observation around 30 collection days earlier` : ""}. ${slugLink(slugByCountry, cheapest.country)} had the lowest reference at ${eur3(cheapest.value)}, and ${slugLink(slugByCountry, dearest.country)} the highest at ${eur3(dearest.value)}. The ${eur3(dearest.value - cheapest.value)} per-litre gap illustrates about ${eur((dearest.value - cheapest.value) * 50)} over 50 litres; individual pump prices differ.</p>
          ${chart}
        </section>

        <section class="contentSection" id="market-movers">
          <h2 class="contentHeading">Recorded market movement</h2>
          <p class="contentBody">Thirty-day movement shows where the latest diesel reading has materially changed, with the exact value beside every direction.</p>
          <div class="reportPairGrid">
            <div class="reportPanel">
              <h3>Biggest fallers</h3>
              <div class="tableScroll">
              <table class="contentTable">
                <thead><tr><th scope="col">Country</th><th scope="col">30-day change</th><th scope="col">Last observed</th></tr></thead>
                <tbody>${fallers.map(moverRow).join("") || '<tr><td colspan="3">No market fell over the past 30 days.</td></tr>'}
                </tbody>
              </table>
              </div>
            </div>
            <div class="reportPanel">
              <h3>Biggest risers</h3>
              <div class="tableScroll">
              <table class="contentTable">
                <thead><tr><th scope="col">Country</th><th scope="col">30-day change</th><th scope="col">Last observed</th></tr></thead>
                <tbody>${risers.map(moverRow).join("") || '<tr><td colspan="3">No market rose over the past 30 days.</td></tr>'}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </section>

        <section class="contentSection" id="market-volatility">
          <h2 class="contentHeading">Which markets move the most?</h2>
          <p class="contentBody">Volatility here is the standard deviation of percentage changes between collected readings. It describes variation in this sample, not future price predictability or the cause of any movement. Unchanged upstream values can reduce the measure.</p>
          <div class="reportPairGrid">
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
          </div>
        </section>

        <section class="contentSection" id="market-rankings">
          <h2 class="contentHeading">Full European diesel table</h2>
          <p class="contentBody">Tracked markets ranked by the last collected reference price, cheapest first. "Observations below" is the share of recorded readings strictly below that value; ties are not counted. Each market may have a different source date.</p>
          <div class="tableScroll">
          <table class="contentTable">
            <thead>
              <tr>
                <th scope="col">#</th><th scope="col">Country</th><th scope="col">Last observed</th>
                <th scope="col">30-day</th><th scope="col">Observed range</th><th scope="col">Observations below</th>
              </tr>
            </thead>
            <tbody>${rankRows}
            </tbody>
          </table>
          </div>
        </section>

        <section class="contentSection" id="market-methodology">
          <h2 class="contentHeading">How this report is produced</h2>
          <p class="contentBody">Figures are computed from ${hist.daysObserved} collection-day records since ${hist.startLabel}. Older records did not verify upstream publication dates, so repeated values are possible. The <a href="/methodology">methodology</a> explains the source and calculations; do not treat this report as live pump pricing or a forecast.</p>
        </section>
      </article>`;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
