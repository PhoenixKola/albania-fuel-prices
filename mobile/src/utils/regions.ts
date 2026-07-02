/**
 * The dataset is branded "Europe" but includes a small set of global
 * reference markets (see ingest/run.ts GLOBAL_ESTIMATES_BASE and
 * utils/countryFallbacks.ts). Every Europe-scoped statistic (average, rank)
 * must exclude these, otherwise "Europe average" silently includes
 * Australia and Brazil.
 */
export const GLOBAL_MARKETS = new Set([
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "India",
  "Japan",
  "Mexico",
  "South Korea",
  "United States",
]);

export function isEuropeanCountry(country: string): boolean {
  return !GLOBAL_MARKETS.has(country);
}
