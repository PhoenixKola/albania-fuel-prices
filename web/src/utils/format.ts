export function formatEurPerLiter(v: number | null) {
  if (v == null) return "—";
  return `${v.toFixed(3)} €/L`;
}

export function formatAllPerLiter(vEur: number | null, allPerEur: number) {
  if (vEur == null) return "—";
  const v = vEur * allPerEur;
  return `${Math.round(v)} ALL/L`;
}

export function formatMoneyEUR(v: number | null) {
  if (v == null) return "—";
  return `€${v.toFixed(2)}`;
}

export function formatMoneyALL(v: number | null) {
  if (v == null) return "—";
  return `${Math.round(v)} ALL`;
}

export function safeLocaleDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export function relativeTimeFromIso(iso: string) {
  const d = new Date(iso);
  const t = d.getTime();
  if (Number.isNaN(t)) return "";
  const diffMs = Date.now() - t;
  const s = Math.max(0, Math.floor(diffMs / 1000));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const days = Math.floor(h / 24);
  if (days > 0) return `${days}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return `${s}s ago`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}