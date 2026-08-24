/**
 * Inline SVG charts for the prerendered HTML.
 *
 * Deliberately dependency-free and JavaScript-free: the chart ships as markup
 * inside the page, so it is visible to crawlers, to no-JS visitors, and in the
 * page source itself. Colors use the brand teal plus `currentColor`, which
 * keeps the charts readable in both light and dark themes.
 */

import type { Point } from "./historyStats";
import { formatDate } from "./historyStats";

const BRAND = "#14b8a6";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Short axis date, e.g. "14 Feb". */
function shortDate(iso: string): string {
  const full = formatDate(iso);
  const parts = full.split(" ");
  return parts.length === 3 ? `${parts[0]} ${parts[1].slice(0, 3)}` : full;
}

export type LineChartOptions = {
  points: Point[];
  /** Accessible description; also rendered as the SVG <title>. */
  title: string;
  /** Formats a value for the axis labels. */
  format?: (v: number) => string;
  width?: number;
  height?: number;
  /** Draw a dashed line at this value (e.g. the period average). */
  reference?: { value: number; label: string };
};

/**
 * Line chart with area fill, min/max markers and axis labels.
 * Returns "" when there is nothing meaningful to draw.
 */
export function renderLineChart(opts: LineChartOptions): string {
  const {
    points,
    title,
    format = (v) => `€${v.toFixed(2)}`,
    width = 760,
    height = 260,
    reference,
  } = opts;

  if (points.length < 2) return "";

  const padL = 58;
  const padR = 16;
  const padT = 18;
  const padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const values = points.map((p) => p.value);
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (reference) {
    lo = Math.min(lo, reference.value);
    hi = Math.max(hi, reference.value);
  }
  // Breathing room so the line never touches the frame.
  const span = hi - lo || Math.max(hi * 0.05, 0.01);
  lo -= span * 0.12;
  hi += span * 0.12;

  const x = (i: number) => padL + (i / (points.length - 1)) * plotW;
  const y = (v: number) => padT + plotH - ((v - lo) / (hi - lo)) * plotH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${(padT + plotH).toFixed(1)} L${padL},${(padT + plotH).toFixed(1)} Z`;

  let minI = 0;
  let maxI = 0;
  points.forEach((p, i) => {
    if (p.value < points[minI].value) minI = i;
    if (p.value > points[maxI].value) maxI = i;
  });

  const gridLines = [0, 0.25, 0.5, 0.75, 1]
    .map((f) => {
      const gy = (padT + f * plotH).toFixed(1);
      return `<line x1="${padL}" y1="${gy}" x2="${padL + plotW}" y2="${gy}" stroke="currentColor" stroke-opacity="0.12" stroke-width="1" />`;
    })
    .join("");

  const yLabels = [0, 0.5, 1]
    .map((f) => {
      const v = hi - f * (hi - lo);
      const gy = padT + f * plotH;
      return `<text x="${padL - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.6">${esc(format(v))}</text>`;
    })
    .join("");

  const midI = Math.floor((points.length - 1) / 2);
  const xLabels = [
    { i: 0, anchor: "start" },
    { i: midI, anchor: "middle" },
    { i: points.length - 1, anchor: "end" },
  ]
    .map(
      ({ i, anchor }) =>
        `<text x="${x(i).toFixed(1)}" y="${height - 8}" text-anchor="${anchor}" font-size="11" fill="currentColor" fill-opacity="0.6">${esc(shortDate(points[i].date))}</text>`
    )
    .join("");

  const refLine = reference
    ? `<line x1="${padL}" y1="${y(reference.value).toFixed(1)}" x2="${padL + plotW}" y2="${y(reference.value).toFixed(1)}" stroke="currentColor" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="4 4" />
       <text x="${padL + plotW}" y="${(y(reference.value) - 6).toFixed(1)}" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.6">${esc(reference.label)}</text>`
    : "";

  const marker = (i: number, kind: "low" | "high") => {
    const cx = x(i);
    const cy = y(points[i].value);
    const above = kind === "high";
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.5" fill="${BRAND}" />
      <text x="${cx.toFixed(1)}" y="${(above ? cy - 10 : cy + 18).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="currentColor" fill-opacity="0.85">${esc(format(points[i].value))}</text>`;
  };

  const gradId = `g${Math.abs(hashCode(title))}`;

  return `<div class="chartWrap">
  <svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${esc(title)}" class="priceChart" preserveAspectRatio="xMidYMid meet">
    <title>${esc(title)}</title>
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.28" />
        <stop offset="100%" stop-color="${BRAND}" stop-opacity="0.02" />
      </linearGradient>
    </defs>
    ${gridLines}
    ${refLine}
    <path d="${area}" fill="url(#${gradId})" />
    <path d="${line}" fill="none" stroke="${BRAND}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    ${marker(minI, "low")}
    ${marker(maxI, "high")}
    ${yLabels}
    ${xLabels}
  </svg>
</div>`;
}

/** Compact inline sparkline for table cells. */
export function renderSparkline(points: Point[], width = 96, height = 24): string {
  if (points.length < 2) return "";
  const values = points.map((p) => p.value);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const range = hi - lo || 1;
  const d = points
    .map((p, i) => {
      const px = (i / (points.length - 1)) * width;
      const py = height - ((p.value - lo) / range) * height;
      return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");
  const rising = values[values.length - 1] >= values[0];
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="sparkline" role="img" aria-label="${rising ? "Rising" : "Falling"} price trend"><path d="${d}" fill="none" stroke="${BRAND}" stroke-width="1.5" stroke-linejoin="round" /></svg>`;
}

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}
