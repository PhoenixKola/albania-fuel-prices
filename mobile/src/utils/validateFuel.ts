import type { LatestEurope } from "../types/fuel";
export function validFuelPayload(data: unknown): data is LatestEurope {
  if (!data || typeof data !== "object") return false;
  const d = data as LatestEurope;
  const date = (v: unknown) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v && Date.parse(v) <= Date.now();
  return d.region === "Europe" && d.unit === "EUR_per_liter" && date(d.as_of) && typeof d.source === "string" && typeof d.source_url === "string" && typeof d.fetched_at_utc === "string" && Number.isFinite(Date.parse(d.fetched_at_utc)) && Array.isArray(d.countries) && d.countries.length >= 20 && new Set(d.countries.map(r => r?.country)).size === d.countries.length && d.countries.every(r => r && typeof r.country === "string" && r.country.trim() && [r.gasoline95_eur,r.diesel_eur,r.lpg_eur].every(v => v === null || typeof v === "number" && Number.isFinite(v) && v >= 0.1 && v <= 10) && [r.source,r.source_url].every(v => v === undefined || typeof v === "string") && [r.source_as_of,r.last_observed_at].every(v => v === undefined || date(v)) && (r.provenance === undefined || ["historical-fallback","date-unverified"].includes(r.provenance)));
}
