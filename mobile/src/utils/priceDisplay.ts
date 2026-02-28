export type CurrencyMode = "eur" | "local";

import type { CountryPrices, FuelType } from "../types/fuel";
import type { FxRates } from "./currency";
import { getFuelPrice } from "./fuel";
import { getCurrencyForCountry, convertEur } from "./currency";
import { formatMoney, hasRate } from "./money";

export function formatFuelPrice(
  countryName: string,
  eurPrice: number | null | undefined,
  mode: CurrencyMode,
  rates: FxRates | null
) {
  const currency = getCurrencyForCountry(countryName);
  const canLocal = hasRate(currency, rates);
  const effectiveMode: CurrencyMode = mode === "local" && canLocal ? "local" : "eur";

  if (effectiveMode === "eur") return formatMoney(eurPrice ?? null, "EUR");

  const local = convertEur(eurPrice ?? null, currency, rates);
  return formatMoney(local, currency);
}

export function formatFuelPriceFromCountry(
  c: CountryPrices | null | undefined,
  fuelType: FuelType,
  mode: CurrencyMode,
  rates: FxRates | null
) {
  const eur = getFuelPrice(c ?? null, fuelType);
  const name = c?.country ?? "EUR";
  return formatFuelPrice(name, eur, mode, rates);
}