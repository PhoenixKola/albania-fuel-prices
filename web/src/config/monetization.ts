export type RentalPlacement = "calculator" | "guide" | "roadTrip" | "albania";
export type MonetizationConfig = {
  adsterraEnabled: boolean; production: boolean;
  rentalLinks: Record<RentalPlacement, string | null>; analyticsToken: string;
};

export const ADSTERRA_NATIVE = {
  scriptUrl: "https://pl31351771.profitableratecpmnetwork.com/d3a677f82e7972dbdc5767166cde992f/invoke.js",
  containerId: "container-d3a677f82e7972dbdc5767166cde992f",
} as const;
export const ADSTERRA_BANNER = {
  key: "2faa9939eb0689d7a6d953b40a97a354",
  scriptUrl: "https://www.highrevenueformat.com/2faa9939eb0689d7a6d953b40a97a354/invoke.js",
  width: 300,
  height: 250,
} as const;
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
  const rental = (key: string) => validatedRentalUrl(str(key) || str("VITE_RENTAL_URL"));
  return {
    adsterraEnabled: str("VITE_ADSTERRA_ENABLED") === "true",
    production: str("VITE_DEPLOY_ENV") === "production",
    rentalLinks: { calculator: rental("VITE_RENTAL_URL_CALCULATOR"), guide: rental("VITE_RENTAL_URL_GUIDE"), roadTrip: rental("VITE_RENTAL_URL_ROAD_TRIP"), albania: rental("VITE_RENTAL_URL_ALBANIA") },
    analyticsToken: /^[a-f0-9]{32}$/i.test(str("VITE_CF_ANALYTICS_TOKEN")) ? str("VITE_CF_ANALYTICS_TOKEN") : "",
  };
}
export const monetization = readMonetizationConfig(import.meta.env ?? {});
export function isProductionHost(host: string): boolean { return host === "karburantisot.com" || host === "www.karburantisot.com"; }
export function adsterraAllowed(config: MonetizationConfig, hostname: string, advertisingAllowed: boolean): boolean {
  return config.production && config.adsterraEnabled && isProductionHost(hostname) && advertisingAllowed;
}
export function isAdsterraRoute(path: string): boolean {
  return ["/", "/albania-car-rental-guide", "/road-trip-fuel-guide", "/how-fuel-prices-work", "/europe-fuel-comparison",
    "/trip-cost-calculator", "/road-status", "/stations", "/compare", "/rankings", "/market-report", "/insights",
    "/methodology", "/about", "/fuel-quiz", "/daily-challenge"].includes(path) ||
    /^\/fuel-prices\/[^/]+$/.test(path) || /^\/road-status\/[^/]+$/.test(path) || /^\/insights\/[^/]+$/.test(path);
}
