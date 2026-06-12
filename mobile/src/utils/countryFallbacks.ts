import type { CountryPrices, LatestEurope } from "../types/fuel";

const FALLBACK_COUNTRIES: CountryPrices[] = [
  { country: "Australia", gasoline95_eur: 1.057, diesel_eur: 1.246, lpg_eur: 0.383 },
  { country: "Brazil", gasoline95_eur: 1.134, diesel_eur: 1.175, lpg_eur: null },
  { country: "Canada", gasoline95_eur: 1.24, diesel_eur: 1.285, lpg_eur: 0.788 },
  { country: "China", gasoline95_eur: 1.144, diesel_eur: 1.025, lpg_eur: null },
  { country: "India", gasoline95_eur: 0.977, diesel_eur: 0.882, lpg_eur: 0.6 },
  { country: "Japan", gasoline95_eur: 0.914, diesel_eur: 0.857, lpg_eur: null },
  { country: "Kosovo", gasoline95_eur: 1.3, diesel_eur: 1.488, lpg_eur: null },
  { country: "Mexico", gasoline95_eur: 1.399, diesel_eur: 1.34, lpg_eur: null },
  { country: "South Korea", gasoline95_eur: 1.321, diesel_eur: 1.318, lpg_eur: 0.717 },
  { country: "United States", gasoline95_eur: 1.024, diesel_eur: 1.193, lpg_eur: null }
];

export function withCountryFallbacks(data: LatestEurope): LatestEurope {
  const existing = new Set(data.countries.map((country) => country.country.toLowerCase()));
  const missing = FALLBACK_COUNTRIES.filter((country) => !existing.has(country.country.toLowerCase()));
  if (!missing.length) return data;

  return {
    ...data,
    countries: [...data.countries, ...missing].sort((a, b) => a.country.localeCompare(b.country))
  };
}
