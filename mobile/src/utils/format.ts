export function formatPriceEur(v: number | null | undefined) {
  if (v == null) return "—";
  return `${v.toFixed(3)} €/L`;
}

export function formatBias(v: number) {
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(2)} €/L`;
}