import type { Lang } from "../models/i18n";
import { getIso2ForCountry } from "./countryFlag";

const albanianRegions = new Intl.DisplayNames(["sq"], { type: "region" });
export function countryLabel(country: string, lang: Lang): string {
  const iso = getIso2ForCountry(country);
  return lang === "sq" && iso ? albanianRegions.of(iso) ?? country : country;
}
