export type CountryPrices = {
  country: string;
  gasoline95_eur: number | null;
  diesel_eur: number | null;
  lpg_eur: number | null;
};

export type LatestEurope = {
  region: string;
  as_of: string;
  source: string;
  source_url: string;
  fetched_at_utc: string;
  unit: string;
  countries: CountryPrices[];
};

export type FuelType = "gasoline95" | "diesel" | "lpg";
export const FUEL_TYPES: FuelType[] = ["gasoline95", "diesel", "lpg"];