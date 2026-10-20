import type { CountryPrices, FuelType, LatestEurope } from "./fuel";

export type Comparison = {
  countryA: string;
  countryB: string;
  fuel: FuelType;
  litres: number;
  priceA: number;
  priceB: number;
  differencePerLitre: number;
  differenceForTank: number;
  direction: "a-higher" | "a-lower" | "equal";
  sourceDateA: string | null;
  sourceDateB: string | null;
  stale: boolean;
  provisional: boolean;
};

export function isValidSourceDate(value: unknown, now = new Date()): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value && parsed.getTime() <= now.getTime();
}

function price(row: CountryPrices | undefined, fuel: FuelType): number | null {
  const value = row?.[`${fuel}_eur` as const];
  return typeof value === "number" && Number.isFinite(value) && value >= 0.1 && value <= 10 ? value : null;
}

/** A reference-price comparison, not an estimate of a specific pump or route. */
export function compareCountries(
  data: LatestEurope | null,
  countryA: string,
  countryB: string,
  fuel: FuelType,
  litres = 50,
  now = new Date(),
): Comparison | null {
  if (!data || !isValidSourceDate(data.as_of, now) || !Number.isFinite(litres) || litres <= 0 || litres > 1000) return null;
  const a = data.countries.find((row) => row.country === countryA);
  const b = data.countries.find((row) => row.country === countryB);
  const aPrice = price(a, fuel);
  const bPrice = price(b, fuel);
  if (aPrice == null || bPrice == null) return null;

  // Input values are published to three decimals. Compare integer milli-EUR
  // so the direction and displayed EUR/L amount cannot disagree at a tie.
  const differenceMilli = Math.round(aPrice * 1000) - Math.round(bPrice * 1000);
  const sourceDateA = a?.provenance === "historical-fallback" || a?.provenance === "date-unverified"
    ? (isValidSourceDate(a.source_as_of, now) ? a.source_as_of : null)
    : (isValidSourceDate(a?.source_as_of, now) ? a.source_as_of : data.as_of);
  const sourceDateB = b?.provenance === "historical-fallback" || b?.provenance === "date-unverified"
    ? (isValidSourceDate(b.source_as_of, now) ? b.source_as_of : null)
    : (isValidSourceDate(b?.source_as_of, now) ? b.source_as_of : data.as_of);
  const dates = [sourceDateA, sourceDateB];
  const stale = dates.some((date) => !date || (now.getTime() - new Date(`${date}T00:00:00Z`).getTime()) > 3 * 86_400_000);

  return {
    countryA, countryB, fuel, litres,
    priceA: Math.round(aPrice * 1000) / 1000,
    priceB: Math.round(bPrice * 1000) / 1000,
    differencePerLitre: differenceMilli / 1000,
    differenceForTank: Math.round((differenceMilli * litres) / 10) / 100,
    direction: differenceMilli > 0 ? "a-higher" : differenceMilli < 0 ? "a-lower" : "equal",
    sourceDateA, sourceDateB, stale,
    provisional: !sourceDateA || !sourceDateB || sourceDateA !== sourceDateB,
  };
}

const labels = {
  en: { gasoline95: "petrol 95", diesel: "diesel", lpg: "LPG" },
  sq: { gasoline95: "benzinën 95", diesel: "naftën", lpg: "LPG-në" },
} as const;

export function comparisonSentence(result: Comparison | null, countryA: string, countryB: string, fuel: FuelType, lang: "en" | "sq" = "en"): string {
  const fuelName = labels[lang][fuel];
  if (!result) return lang === "sq"
    ? `Krahasimi i ${fuelName} mes ${countryA} dhe ${countryB} nuk disponohet për këtë lexim burimor.`
    : `The ${fuelName} comparison between ${countryA} and ${countryB} is unavailable for this source reading.`;
  const gap = `€${Math.abs(result.differencePerLitre).toFixed(3)}/L`;
  const tank = `€${Math.abs(result.differenceForTank).toFixed(2)}`;
  const dates = result.sourceDateA === result.sourceDateB && result.sourceDateA
    ? result.sourceDateA
    : `${result.sourceDateA ?? "?"} / ${result.sourceDateB ?? "?"}`;
  if (lang === "sq") {
    const direction = result.direction === "equal" ? `${countryA} dhe ${countryB} kanë të njëjtin çmim orientues` :
      result.direction === "a-higher" ? `${fuelName} kushton ${gap} më shumë në ${countryA} sesa në ${countryB}` : `${fuelName} kushton ${gap} më pak në ${countryA} sesa në ${countryB}`;
    return `${direction}${result.direction === "equal" ? "" : ` (rreth ${tank} për ${result.litres} L)`}. Data e burimit: ${dates}.${result.provisional ? " Datat e dy tregjeve nuk janë verifikuar si të njëjta." : ""} Këto janë vlera kombëtare orientuese; çmimet në pompa, rruga dhe devijimet mund të ndryshojnë koston reale.`;
  }
  const direction = result.direction === "equal" ? `${countryA} and ${countryB} have the same reference price` :
    result.direction === "a-higher" ? `${fuelName} costs ${gap} more in ${countryA} than in ${countryB}` : `${fuelName} costs ${gap} less in ${countryA} than in ${countryB}`;
  return `${direction}${result.direction === "equal" ? "" : ` (about ${tank} for ${result.litres} L)`}. Source date: ${dates}.${result.provisional ? " The market dates are not verified as matching." : ""} These are national reference values; pump prices, route and detours can change actual costs.`;
}
