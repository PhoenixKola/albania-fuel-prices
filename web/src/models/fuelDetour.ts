import { compareCountries, type Comparison } from "./countryComparison";
import type { FuelType, LatestEurope } from "./fuel";

export type DetourInput = {
  home: "Albania" | "Greece" | "Kosovo";
  alternate: "Albania" | "Greece" | "Kosovo";
  fuel: FuelType;
  litres: number;
  extraKm: number;
  consumption: number;
};

export const DEFAULT_DETOUR: DetourInput = {
  home: "Albania", alternate: "Greece", fuel: "diesel",
  litres: 50, extraKm: 10, consumption: 7,
};

export type DetourResult = {
  comparison: Comparison;
  extraLitres: number;
  extraFuelCost: number;
  grossDifference: number;
  netDifference: number;
};

export function validDetourInput(input: DetourInput): boolean {
  const countries = [input.home, input.alternate];
  return countries.includes("Albania") && countries.every((country) => ["Albania", "Greece", "Kosovo"].includes(country))
    && input.home !== input.alternate && ["gasoline95", "diesel", "lpg"].includes(input.fuel)
    && Number.isFinite(input.litres) && input.litres > 0 && input.litres <= 200
    && Number.isFinite(input.extraKm) && input.extraKm >= 0 && input.extraKm <= 1000
    && Number.isFinite(input.consumption) && input.consumption > 0 && input.consumption <= 50;
}

/** Positive net means the alternate market is cheaper after extra-driving fuel.
 * This is reference-price arithmetic, never a station or travel recommendation. */
export function calculateFuelDetour(input: DetourInput, data: LatestEurope | null, now = new Date()): DetourResult | null {
  if (!validDetourInput(input)) return null;
  const comparison = compareCountries(data, input.home, input.alternate, input.fuel, input.litres, now);
  if (!comparison) return null;
  const extraLitres = input.extraKm * input.consumption / 100;
  const extraFuelCost = extraLitres * comparison.priceA;
  const grossDifference = comparison.differencePerLitre * input.litres;
  return { comparison, extraLitres, extraFuelCost, grossDifference, netDifference: grossDifference - extraFuelCost };
}

export function parseDetourSearch(search: string): { input: DetourInput; invalid: boolean } {
  const params = new URLSearchParams(search);
  if ([...params.keys()].length === 0) return { input: DEFAULT_DETOUR, invalid: false };
  const input = {
    home: params.get("home") ?? DEFAULT_DETOUR.home,
    alternate: params.get("alternate") ?? DEFAULT_DETOUR.alternate,
    fuel: params.get("fuel") ?? DEFAULT_DETOUR.fuel,
    litres: Number(params.get("litres")),
    extraKm: Number(params.get("extraKm")),
    consumption: Number(params.get("consumption")),
  } as DetourInput;
  return validDetourInput(input) ? { input, invalid: false } : { input: DEFAULT_DETOUR, invalid: true };
}

export function detourSearch(input: DetourInput): string {
  if (!validDetourInput(input)) return "";
  return `?${new URLSearchParams({ home: input.home, alternate: input.alternate, fuel: input.fuel,
    litres: String(input.litres), extraKm: String(input.extraKm), consumption: String(input.consumption) })}`;
}
