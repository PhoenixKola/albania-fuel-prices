import type { Currency } from "../models/currency";
import type { FxRates } from "./currency";
import { convertEur, getCurrencyForCountry, hasRate } from "./currency";
import { formatMoney } from "./money";

export function formatFuelPrice(
  countryName: string,
  eurPrice: number | null | undefined,
  mode: Currency,
  rates: FxRates | null
) {
  const localCurrency = getCurrencyForCountry(countryName);
  const canLocal = hasRate(localCurrency, rates);

  const effective: Currency = mode === "local" && canLocal ? "local" : "eur";

  if (effective === "eur") return formatMoney(eurPrice ?? null, "EUR");

  const local = convertEur(eurPrice ?? null, localCurrency, rates);
  return formatMoney(local, localCurrency);
}