import type { CountryPrices, FuelType } from "../models/fuel";
import type { TDict } from "../locales";

export function fuelLabel(t: TDict, ft: FuelType) {
  if (ft === "gasoline95") return t.gasoline95;
  if (ft === "diesel") return t.diesel;
  return t.lpg;
}

export function getEurPrice(row: CountryPrices | null, ft: FuelType): number | null {
  if (!row) return null;
  if (ft === "gasoline95") return row.gasoline95_eur;
  if (ft === "diesel") return row.diesel_eur;
  return row.lpg_eur;
}