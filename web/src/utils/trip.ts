import type { CountryPrices, FuelType } from "../models/fuel";
import { getEurPrice } from "./fuel";

export type TripLeg = { country: string; km: string };
export type TripInput = { legs: TripLeg[]; consumption: string; fuel: FuelType; roundTrip: boolean };
export const MAX_LEGS = 8;
export const defaultTrip = (): TripInput => ({ legs: [{ country: "Albania", km: "100" }], consumption: "7", fuel: "diesel", roundTrip: false });

export function positiveNumber(value: string, max: number): number | null {
  if (!/^\d+(?:[.,]\d+)?$/.test(value.trim())) return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && n > 0 && n <= max ? n : null;
}

export function calculateTrip(input: TripInput, countries: CountryPrices[], allPerEur: number | null) {
  const consumption = positiveNumber(input.consumption, 100);
  const valid = consumption !== null && input.legs.length > 0 && input.legs.length <= MAX_LEGS &&
    input.legs.every((leg) => leg.country.length > 0 && positiveNumber(leg.km, 10000) !== null);
  const legs = input.legs.map((leg) => {
    const km = positiveNumber(leg.km, 10000);
    const distance = km === null ? null : km * (input.roundTrip ? 2 : 1);
    const liters = distance === null || consumption === null ? null : distance * consumption / 100;
    const row = countries.find((country) => country.country === leg.country);
    const rawPrice = row ? getEurPrice(row, input.fuel) : null;
    const price = rawPrice !== null && Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : null;
    return { country: leg.country, distance, liters, price, cost: liters === null || price === null ? null : liters * price };
  });
  const complete = valid && legs.every((leg) => leg.cost !== null);
  const totalEur = complete ? legs.reduce((sum, leg) => sum + leg.cost!, 0) : null;
  const rate = allPerEur !== null && Number.isFinite(allPerEur) && allPerEur > 0 ? allPerEur : null;
  return {
    valid, complete, legs,
    distance: valid ? legs.reduce((sum, leg) => sum + leg.distance!, 0) : null,
    liters: valid ? legs.reduce((sum, leg) => sum + leg.liters!, 0) : null,
    totalEur,
    totalAll: totalEur !== null && rate !== null ? totalEur * rate : null,
  };
}

// Versioned, bounded, public trip inputs only; no location or personal data.
export function parseTrip(search: string): { input: TripInput; invalid: boolean } {
  const raw = new URLSearchParams(search).get("trip");
  if (raw === null) return { input: defaultTrip(), invalid: false };
  try {
    if (raw.length > 3000) throw new Error("oversized");
    const value = JSON.parse(raw);
    if (value.v !== 1 || !Array.isArray(value.legs) || value.legs.length < 1 || value.legs.length > MAX_LEGS ||
      typeof value.consumption !== "string" || positiveNumber(value.consumption, 100) === null ||
      !["gasoline95", "diesel", "lpg"].includes(value.fuel) || typeof value.roundTrip !== "boolean" ||
      !value.legs.every((leg: TripLeg) => leg && typeof leg.country === "string" && /^[\p{L} .'-]{1,80}$/u.test(leg.country) &&
        typeof leg.km === "string" && positiveNumber(leg.km, 10000) !== null)) throw new Error("invalid");
    return { input: { legs: value.legs.map((leg: TripLeg) => ({ country: leg.country, km: leg.km })), consumption: value.consumption, fuel: value.fuel, roundTrip: value.roundTrip }, invalid: false };
  } catch {
    return { input: defaultTrip(), invalid: true };
  }
}

export function tripSearch(input: TripInput): string {
  return `?${new URLSearchParams({ trip: JSON.stringify({ v: 1, ...input }) })}`;
}

export function isPriceStale(asOf: string, thresholdDays: number, now = Date.now()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) return true;
  const time = Date.parse(`${asOf}T00:00:00Z`);
  return !Number.isFinite(time) || Math.floor((now - time) / 86400000) > thresholdDays;
}
