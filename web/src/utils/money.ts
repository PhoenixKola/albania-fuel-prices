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
    return `${(Math.round(v * 100) / 100).toFixed(2)} ${currency}`;
  }
}