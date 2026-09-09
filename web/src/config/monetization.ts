import { PUBLISHER_ID } from "./routes";
export type AdPlacement = "home" | "content" | "articleEnd";
export type RentalPlacement = "calculator" | "guide" | "roadTrip" | "albania";
export type MonetizationConfig = {
  adsEnabled: boolean; cmpPublished: boolean; production: boolean;
  client: string; slots: Record<AdPlacement, string>;
  rentalLinks: Record<RentalPlacement, string | null>; analyticsToken: string;
};
export function validatedRentalUrl(raw: string | undefined): string | null {
  if (!raw || /\s/.test(raw) || [...raw].some((char) => char.charCodeAt(0) < 32)) return null;
  try {
    const url = new URL(raw);
    // Direct-program tracking links only; preserve all partner attribution parameters.
    if (url.protocol !== "https:" || !["discovercars.com", "www.discovercars.com"].includes(url.hostname) ||
      url.username || url.password || url.port || !url.searchParams.get("a_aid")?.trim()) return null;
    if (/^(YOUR_|REPLACE_|EXAMPLE|TODO)/i.test(url.searchParams.get("a_aid")!)) return null;
    return raw;
  } catch { return null; }
}
export function readMonetizationConfig(env: Record<string, unknown>): MonetizationConfig {
  const str = (key: string) => typeof env[key] === "string" ? env[key] as string : "";
  const slot = (key: string) => /^\d{10}$/.test(str(key)) ? str(key) : "";
  const rental = (key: string) => validatedRentalUrl(str(key) || str("VITE_RENTAL_URL"));
  return {
    adsEnabled: str("VITE_ADS_ENABLED") === "true", cmpPublished: str("VITE_ADS_CMP_PUBLISHED") === "true",
    production: str("VITE_DEPLOY_ENV") === "production", client: PUBLISHER_ID,
    slots: { home: slot("VITE_AD_SLOT_HOME"), content: slot("VITE_AD_SLOT_CONTENT"), articleEnd: slot("VITE_AD_SLOT_ARTICLE_END") },
    rentalLinks: { calculator: rental("VITE_RENTAL_URL_CALCULATOR"), guide: rental("VITE_RENTAL_URL_GUIDE"), roadTrip: rental("VITE_RENTAL_URL_ROAD_TRIP"), albania: rental("VITE_RENTAL_URL_ALBANIA") },
    analyticsToken: /^[a-f0-9]{32}$/i.test(str("VITE_CF_ANALYTICS_TOKEN")) ? str("VITE_CF_ANALYTICS_TOKEN") : "",
  };
}
export const monetization = readMonetizationConfig(import.meta.env ?? {});
export function isProductionHost(host: string): boolean { return host === "karburantisot.com" || host === "www.karburantisot.com"; }
export function adsAllowed(config: MonetizationConfig, hostname: string, lang: string): boolean {
  // Albanian is not supported by AdSense. Referrals remain available in both languages.
  return config.production && config.adsEnabled && config.cmpPublished && isProductionHost(hostname) && lang === "en";
}
export function isAdRoute(path: string): boolean {
  return ["/", "/trip-cost-calculator", "/albania-car-rental-guide", "/road-trip-fuel-guide", "/how-fuel-prices-work", "/europe-fuel-comparison"].includes(path) || /^\/fuel-prices\/[^/]+$/.test(path);
}
