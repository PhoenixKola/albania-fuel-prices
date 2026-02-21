import type { CountryPrices, FuelType } from "../types/fuel";

export function getFuelPrice(c: CountryPrices | null | undefined, fuelType: FuelType) {
  if (!c) return null;
  if (fuelType === "gasoline95") return c.gasoline95_eur;
  if (fuelType === "lpg") return c.lpg_eur;
  return c.diesel_eur;
}

export function fuelLabel(
  fuelType: FuelType,
  t: { gasoline95: string; diesel: string; lpg: string }
) {
  if (fuelType === "gasoline95") return t.gasoline95;
  if (fuelType === "lpg") return t.lpg;
  return t.diesel;
}