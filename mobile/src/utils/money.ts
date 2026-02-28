import type { FxRates } from "./currency";

export function formatMoney(v: number | null | undefined, currency: string) {
  if (v == null || !Number.isFinite(v)) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    const n = Math.round(v * 100) / 100;
    return `${n.toFixed(2)} ${currency}`;
  }
}

export function hasRate(currency: string, rates: FxRates | null) {
  if (currency === "EUR") return true;
  const r = rates?.[currency];
  return !!r && Number.isFinite(r);
}