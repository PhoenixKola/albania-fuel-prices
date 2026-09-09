import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import type { LatestEurope } from "../src/models/fuel";
import type { PriceContext } from "./priceData";
import type { MonetizationConfig, RentalPlacement } from "../src/config/monetization";
import TripCostCalculatorPage from "../src/pages/TripCostCalculatorPage";
import AlbaniaCarRentalGuidePage from "../src/pages/AlbaniaCarRentalGuidePage";
import { TravelLinks } from "../src/components/content/TravelLinks";
import RentalReferral from "../src/components/ads/RentalReferral";
import type { Lang } from "../src/models/i18n";

export function travelStaticContent(path: string, ctx: PriceContext, config: MonetizationConfig, lang: Lang = "en"): string {
  const data: LatestEurope | null = ctx.ok ? {
    region: "Europe", as_of: ctx.asOf, source: ctx.source, source_url: ctx.sourceUrl,
    fetched_at_utc: `${ctx.asOf}T00:00:00Z`, unit: "EUR/L",
    countries: [...ctx.prices.entries()].map(([country, prices]) => ({ country, gasoline95_eur: prices.petrol, diesel_eur: prices.diesel, lpg_eur: prices.lpg })),
  } : null;
  const page = path === "/trip-cost-calculator"
    ? createElement(TripCostCalculatorPage, { lang, data, fxRates: ctx.allPerEur ? { ALL: ctx.allPerEur } : null, loading: false, config })
    : createElement(AlbaniaCarRentalGuidePage, { lang, data, config });
  return renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [path] }, page));
}

export function travelStaticLinks(placement: RentalPlacement | null, config: MonetizationConfig): string {
  return renderToStaticMarkup(createElement(TravelLinks, { lang: "en" })) +
    (placement ? renderToStaticMarkup(createElement(RentalReferral, { lang: "en", placement, config })) : "");
}
