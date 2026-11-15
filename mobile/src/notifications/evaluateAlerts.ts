import type { FuelType, LatestEurope } from "../types/fuel";
import { getFuelPrice } from "../utils/fuel";
import { validFuelPayload } from "../utils/validateFuel";
export type PriceAlertRule = {
  id: string;
  country: string;
  fuelType: FuelType;
  direction: "below" | "above";
  targetEur: number;
  createdAtUtc: string;
  lastTriggeredKey?: string;
};

export function evaluatePriceAlerts(data: LatestEurope, rules: PriceAlertRule[], now = new Date()) {
  if (!validFuelPayload(data)) return { next: rules, triggered: [] as PriceAlertRule[] };
  const byCountry = new Map(data.countries.map((row) => [row.country, row]));
  const triggered: PriceAlertRule[] = [];
  const next = rules.map((rule) => {
    const market = byCountry.get(rule.country);
    if (!market || market.provenance === "historical-fallback" || market.provenance === "date-unverified" ||
        (market.country === "Kosovo" && !market.source_as_of)) return rule;
    const readingDate = market.source_as_of ?? data.as_of;
    const publishedAt = new Date(`${readingDate}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(readingDate) || !Number.isFinite(publishedAt.getTime()) || publishedAt.toISOString().slice(0,10) !== readingDate || publishedAt.getTime() > now.getTime() || now.getTime() - publishedAt.getTime() > 3 * 86400000) return rule;
    const price = getFuelPrice(market, rule.fuelType);
    if (price == null) return rule;
    const hit = rule.direction === "below" ? price <= rule.targetEur : price >= rule.targetEur;
    const triggerKey = `${readingDate}_${price.toFixed(3)}`;
    if (!hit || rule.lastTriggeredKey === triggerKey) return rule;
    const updated = { ...rule, lastTriggeredKey: triggerKey };
    triggered.push(updated);
    return updated;
  });
  return { next, triggered };
}
