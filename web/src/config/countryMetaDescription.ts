import type { LatestEurope } from "../models/fuel";
import { isValidSourceDate } from "../models/countryComparison";

/** One description model for the static head and client-side navigation. */
export function countryMetaDescription(base: string, country: string, data: LatestEurope | null): string {
  const row = data?.countries.find((item) => item.country === country);
  const petrol = row?.gasoline95_eur;
  const diesel = row?.diesel_eur;
  if (!row || typeof petrol !== "number" || typeof diesel !== "number" ||
      !Number.isFinite(petrol) || !Number.isFinite(diesel) ||
      petrol < 0.1 || petrol > 10 || diesel < 0.1 || diesel > 10 ||
      !isValidSourceDate(data?.as_of)) return base;
  const unverified = row.provenance === "historical-fallback" || row.provenance === "date-unverified";
  const sourceDate = isValidSourceDate(row.source_as_of) ? row.source_as_of : unverified ? null : data.as_of;
  const full = `Petrol €${petrol.toFixed(3)}/L, diesel €${diesel.toFixed(3)}/L; source ${sourceDate ?? "date unverified"}. ${base}`;
  if (full.length <= 158) return full;
  const cut = full.slice(0, 158);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}
