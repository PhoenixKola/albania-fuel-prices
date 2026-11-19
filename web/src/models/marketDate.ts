import type { CountryPrices, LatestEurope } from "./fuel";
import { isValidSourceDate } from "./countryComparison";

export type MarketDate =
  | { status: "verified"; date: string }
  | { status: "observed"; date: string }
  | { status: "unknown" };

type Lang = "en" | "sq";

/** A fallback or date-unverified market never inherits the feed-wide date. */
export function isUnverifiedMarket(row: CountryPrices | null | undefined): boolean {
  return row?.provenance === "historical-fallback" || row?.provenance === "date-unverified";
}

export function marketDate(row: CountryPrices | null | undefined, globalAsOf: string | null | undefined): MarketDate {
  if (isValidSourceDate(row?.source_as_of)) return { status: "verified", date: row.source_as_of };
  if (isUnverifiedMarket(row)) {
    return isValidSourceDate(row?.last_observed_at) ? { status: "observed", date: row.last_observed_at } : { status: "unknown" };
  }
  return isValidSourceDate(globalAsOf) ? { status: "verified", date: globalAsOf } : { status: "unknown" };
}

export function formatMarketDate(iso: string, lang: Lang, month: "short" | "long" = "short"): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang === "sq" ? "sq-AL" : "en-GB", { day: "numeric", month, year: "numeric", timeZone: "UTC" });
}

const words = {
  en: { priceDate: "Price date", observed: "Observed", unverified: "Unverified", publicationUnverified: "publication unverified", unverifiedSource: "Previously collected value; source unverified" },
  sq: { priceDate: "Data e çmimit", observed: "Vëzhguar", unverified: "E paverifikuar", publicationUnverified: "publikimi i paverifikuar", unverifiedSource: "Vlerë e mbledhur më parë; burimi i paverifikuar" },
} as const;

export function describeMarketDate(info: MarketDate, lang: Lang, month: "short" | "long" = "short") {
  const w = words[lang];
  if (info.status === "verified") {
    const date = formatMarketDate(info.date, lang, month);
    return { label: w.priceDate, value: date, badge: date, plain: date, unverified: false };
  }
  if (info.status === "observed") {
    const date = formatMarketDate(info.date, lang, month);
    return { label: w.observed, value: `${date} · ${w.publicationUnverified}`, badge: `${w.observed} ${date}`, plain: `${w.observed} ${date}; ${w.publicationUnverified}`, unverified: true };
  }
  return { label: w.priceDate, value: w.unverified, badge: w.unverified, plain: w.unverified, unverified: true };
}

/** The feed-wide source describes only markets that actually came from it. */
export function marketSource(row: CountryPrices | null | undefined, data: LatestEurope | null | undefined, lang: Lang) {
  if (row?.source) return { name: row.source, url: row.source_url ?? null };
  if (isUnverifiedMarket(row)) return { name: words[lang].unverifiedSource, url: null };
  return { name: data?.source ?? null, url: data?.source_url ?? null };
}
