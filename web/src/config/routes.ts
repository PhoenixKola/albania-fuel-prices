/**
 * Central route configuration — single source of truth for all public routes,
 * their SEO metadata, JSON-LD types, and prerender/sitemap eligibility.
 */

export type RouteConfig = {
  path: string;
  title: string;
  description: string;
  priority: number;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  jsonLdType: "WebSite" | "WebPage" | "Article" | "FAQPage" | "ContactPage";
  noindex?: boolean;
};

export const SITE_URL = "https://karburantisot.com";
export const SITE_NAME = "Fuel Today";
export const PUBLISHER_ID = "ca-pub-2653462201538649";

export const STATIC_ROUTES: RouteConfig[] = [
  {
    path: "/",
    title: "Fuel Today Albania & Europe | Petrol, Diesel and LPG Prices",
    description:
      "Compare today's fuel prices in Albania and Europe, understand why prices move, estimate road-trip costs, and review transparent methodology before you travel.",
    priority: 1.0,
    changefreq: "daily",
    jsonLdType: "WebSite",
  },
  {
    path: "/stations",
    title: "Nearby Fuel Stations | Fuel Today",
    description:
      "Find nearby fuel stations and use location-based context alongside country-level fuel price comparisons for Albania and Europe.",
    priority: 0.8,
    changefreq: "daily",
    jsonLdType: "WebPage",
  },
  {
    path: "/compare",
    title: "Compare Fuel Prices Across Countries | Fuel Today",
    description:
      "Build a country watchlist and compare petrol, diesel, and LPG prices across Albania and Europe for practical trip and budget planning.",
    priority: 0.8,
    changefreq: "daily",
    jsonLdType: "WebPage",
  },
  {
    path: "/rankings",
    title: "Europe Fuel Price Rankings | Fuel Today",
    description:
      "Explore Europe fuel price rankings by fuel type and understand where Albania sits relative to nearby and western European markets.",
    priority: 0.8,
    changefreq: "daily",
    jsonLdType: "WebPage",
  },
  {
    path: "/about",
    title: "About Fuel Today (Karburanti Sot)",
    description:
      "Learn why Fuel Today exists, who maintains it, data principles, editorial approach, and how corrections are handled for Albania and European fuel prices.",
    priority: 0.8,
    changefreq: "monthly",
    jsonLdType: "WebPage",
  },
  {
    path: "/contact",
    title: "Contact Fuel Today",
    description:
      "Contact Fuel Today for data corrections, partnerships, or website feedback related to Albania and European fuel price comparisons.",
    priority: 0.8,
    changefreq: "monthly",
    jsonLdType: "ContactPage",
  },
  {
    path: "/methodology",
    title: "Methodology | How Fuel Today Collects and Updates Data",
    description:
      "Review data sources, update frequency, fuel definitions, and limitations behind Fuel Today's Albania and Europe fuel price comparison data.",
    priority: 0.8,
    changefreq: "monthly",
    jsonLdType: "Article",
  },
  {
    path: "/how-fuel-prices-work",
    title: "How Fuel Prices Work in Albania and Europe | Fuel Today",
    description:
      "Understand how crude oil, refining, taxes, transport, FX rates, and local demand shape petrol, diesel, and LPG prices across the Balkans and Europe.",
    priority: 0.8,
    changefreq: "monthly",
    jsonLdType: "Article",
  },
  {
    path: "/europe-fuel-comparison",
    title: "Europe Fuel Comparison with Albania | Fuel Today",
    description:
      "Compare Albania fuel prices with Kosovo, Montenegro, North Macedonia, Greece, Italy, Croatia, Portugal, Switzerland, and the United Kingdom.",
    priority: 0.9,
    changefreq: "monthly",
    jsonLdType: "Article",
  },
  {
    path: "/road-trip-fuel-guide",
    title: "Road Trip Fuel Cost Guide from Albania | Fuel Today",
    description:
      "Estimate road trip fuel costs from Albania with practical route examples, consumption assumptions, and cross-border petrol and diesel price context.",
    priority: 0.9,
    changefreq: "monthly",
    jsonLdType: "Article",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Fuel Today",
    description:
      "Read the Fuel Today privacy policy, including data usage, local storage behavior, advertising disclosures, and contact details.",
    priority: 0.4,
    changefreq: "yearly",
    jsonLdType: "WebPage",
  },
  {
    path: "/terms",
    title: "Terms of Use | Fuel Today",
    description:
      "Review Fuel Today terms of use, informational data limitations, acceptable usage, and liability boundaries for fuel price guidance.",
    priority: 0.4,
    changefreq: "yearly",
    jsonLdType: "WebPage",
  },
  {
    path: "/daily-challenge",
    title: "Daily Challenge — 5 Fuel Price Questions | Fuel Today",
    description:
      "Test yourself with today's 5 fuel price questions. Same questions for everyone, refreshes daily. Compare petrol and diesel prices across Europe.",
    priority: 0.8,
    changefreq: "daily",
    jsonLdType: "WebPage",
  },
  {
    path: "/fuel-quiz",
    title: "Fuel Price Quiz — Which Country Has Cheaper Fuel? | Fuel Today",
    description:
      "Test your knowledge of European fuel prices. Guess which country has cheaper petrol or diesel using live market data. Track your score and streak.",
    priority: 0.8,
    changefreq: "weekly",
    jsonLdType: "WebPage",
  },
  {
    path: "/editorial-policy",
    title: "Editorial Policy | Fuel Today",
    description:
      "Read how Fuel Today selects, produces, and maintains fuel price content — including data sourcing standards, editorial independence, accuracy principles, and corrections policy.",
    priority: 0.5,
    changefreq: "yearly",
    jsonLdType: "WebPage",
  },
  {
    path: "/disclaimer",
    title: "Disclaimer | Fuel Today",
    description:
      "Read the Fuel Today disclaimer: fuel price data is informational only, trip estimates are approximate, and no financial advice is provided.",
    priority: 0.4,
    changefreq: "yearly",
    jsonLdType: "WebPage",
  },
];

export function getRouteConfig(path: string): RouteConfig | undefined {
  return STATIC_ROUTES.find((r) => r.path === path);
}

export function getAllPrerenderPaths(): string[] {
  return STATIC_ROUTES.map((r) => r.path);
}
