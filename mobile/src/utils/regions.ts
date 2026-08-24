/**
 * Non-European markets that may appear in the feed. Kept as a guard so any
 * Europe-scoped statistic (average, rank) cannot silently include them.
 * The dataset itself no longer carries these: the synthetic "global
 * estimates" that used to be generated for them were removed in Aug 2026.
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
