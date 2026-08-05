/**
 * GENERATED FILE — do not edit by hand.
 * Produced by scripts/generateAnalysis.ts from data/history.json on each build.
 */

/** Country slugs we can show real price data for. Others are noindexed. */
export const INDEXABLE_COUNTRY_SLUGS: string[] = [
  "albania",
  "kosovo",
  "greece",
  "italy",
  "croatia",
  "portugal",
  "switzerland",
  "united-kingdom"
];

export function isCountryIndexable(slug: string): boolean {
  return INDEXABLE_COUNTRY_SLUGS.includes(slug);
}
