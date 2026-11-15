import type { Lang } from "../models/i18n";
import { getIso2ForCountry } from "./countryFlag";

const albanianRegions = new Intl.DisplayNames(["sq"], { type: "region" });
// Keep public navigation localized even in browsers with reduced ICU data.
const sqRegions: Record<string, string> = { AL: "Shqipëri", XK: "Kosovë", GR: "Greqi", IT: "Itali", HR: "Kroaci", PT: "Portugali", CH: "Zvicër", GB: "Mbretëria e Bashkuar", ME: "Mali i Zi", MK: "Maqedonia e Veriut" };
export function countryLabel(country: string, lang: Lang): string {
  const iso = getIso2ForCountry(country);
  return lang === "sq" && iso ? sqRegions[iso.toUpperCase()] ?? albanianRegions.of(iso) ?? country : country;
}
