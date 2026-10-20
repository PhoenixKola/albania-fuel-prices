/** Country route metadata and links. Mutable price copy lives in countryPageContent.ts. */
export type CountryEditorial = {
  slug: string;
  label: string;
  dataCountryName: string;
  metaTitle: string;
  metaDescription: string;
  relatedLinks: { label: string; to: string }[];
};

export const COUNTRY_EDITORIAL: CountryEditorial[] = [
  {
    slug: "albania",
    label: "Albania",
    dataCountryName: "Albania",
    metaTitle: "Albania Fuel Prices | Petrol, Diesel & LPG per Litre",
    metaDescription:
      "Dated Albania petrol, diesel and LPG reference prices per litre, with EUR/ALL estimates, 50 L costs and fuel-specific Greece and Kosovo comparisons.",
    relatedLinks: [
      { label: "Calculate an Albania road trip", to: "/trip-cost-calculator" },
      { label: "Kosovo fuel prices", to: "/fuel-prices/kosovo" },
      { label: "Greece fuel prices", to: "/fuel-prices/greece" },
      { label: "Albania car rental guide", to: "/albania-car-rental-guide" },
      { label: "European rankings", to: "/rankings" },
    ]
  },
  {
    slug: "kosovo",
    label: "Kosovo",
    dataCountryName: "Kosovo",
    metaTitle: "Kosovo Fuel Prices | Petrol, Diesel & LPG | Fuel Today",
    metaDescription:
      "Kosovo petrol and diesel reference prices versus Albania, with a 50 L example and a clear warning when this market's source date is unverified.",
    relatedLinks: [
      { label: "Albania fuel prices", to: "/fuel-prices/albania" },
      { label: "Calculate the Tirana–Pristina trip", to: "/trip-cost-calculator" },
      { label: "Compare countries side by side", to: "/compare" },
      { label: "European fuel rankings", to: "/rankings" },
      { label: "Road trip fuel planning", to: "/road-trip-fuel-guide" },
    ]
  },
  {
    slug: "montenegro",
    label: "Montenegro",
    dataCountryName: "Montenegro",
    metaTitle: "Montenegro Fuel Prices | Petrol, Diesel & LPG | Fuel Today",
    metaDescription:
      "Montenegro fuel market context for Albanian drivers planning coastal Adriatic routes.",
    relatedLinks: [
      { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
      { label: "Road trip fuel guide", to: "/road-trip-fuel-guide" },
      { label: "Compare countries", to: "/compare" },
      { label: "Data methodology", to: "/methodology" },
      { label: "European rankings", to: "/rankings" },
    ]
  },
  {
    slug: "north-macedonia",
    label: "North Macedonia",
    dataCountryName: "North Macedonia",
    metaTitle: "North Macedonia Fuel Prices — Petrol, Diesel & LPG",
    metaDescription:
      "North Macedonia fuel market context for drivers heading east from Albania via Ohrid.",
    relatedLinks: [
      { label: "Compare countries", to: "/compare" },
      { label: "European rankings", to: "/rankings" },
      { label: "Road trip fuel guide", to: "/road-trip-fuel-guide" },
      { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
      { label: "Data methodology", to: "/methodology" },
    ]
  },
  {
    slug: "greece",
    label: "Greece",
    dataCountryName: "Greece",
    metaTitle: "Greece Fuel Prices | Petrol & Diesel vs Albania",
    metaDescription:
      "Dated Greece petrol, diesel and LPG reference prices per litre. Compare each fuel with Albania and calculate an illustrative 50 L difference.",
    relatedLinks: [
      { label: "Albania fuel prices", to: "/fuel-prices/albania" },
      { label: "Calculate an Albania–Greece trip", to: "/trip-cost-calculator" },
      { label: "Compare Albania vs Greece", to: "/compare" },
      { label: "European fuel rankings", to: "/rankings" },
      { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
    ]
  },
  {
    slug: "italy",
    label: "Italy",
    dataCountryName: "Italy",
    metaTitle: "Italy Fuel Prices | Petrol, Diesel & LPG vs Albania",
    metaDescription:
      "Dated Italy petrol, diesel and LPG reference prices per litre, with fuel-specific comparison to Albania and practical trip-budget context.",
    relatedLinks: [
      { label: "Compare Albania vs Italy", to: "/compare" },
      { label: "European fuel rankings", to: "/rankings" },
      { label: "Road trip fuel guide", to: "/road-trip-fuel-guide" },
      { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
      { label: "How fuel prices work", to: "/how-fuel-prices-work" },
    ]
  },
  {
    slug: "croatia",
    label: "Croatia",
    dataCountryName: "Croatia",
    metaTitle: "Croatia Fuel Prices | Petrol, Diesel & LPG per Litre",
    metaDescription:
      "Dated Croatia petrol, diesel and LPG reference prices per litre, with Albania comparison, historical movement and Adriatic trip planning links.",
    relatedLinks: [
      { label: "Albania fuel prices", to: "/fuel-prices/albania" },
      { label: "Italy fuel prices", to: "/fuel-prices/italy" },
      { label: "Calculate an Adriatic road trip", to: "/trip-cost-calculator" },
      { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
      { label: "European rankings", to: "/rankings" },
    ]
  },
  {
    slug: "portugal",
    label: "Portugal",
    dataCountryName: "Portugal",
    metaTitle: "Portugal Fuel Prices | Petrol, Diesel & LPG per Litre",
    metaDescription:
      "Dated Portugal petrol, diesel and LPG reference prices per litre, historical movement and a fuel-specific comparison with Albania.",
    relatedLinks: [
      { label: "Albania fuel prices", to: "/fuel-prices/albania" },
      { label: "Calculate a Portugal road trip", to: "/trip-cost-calculator" },
      { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
      { label: "European fuel rankings", to: "/rankings" },
      { label: "How fuel prices work", to: "/how-fuel-prices-work" },
    ]
  },
  {
    slug: "switzerland",
    label: "Switzerland",
    dataCountryName: "Switzerland",
    metaTitle: "Switzerland Fuel Prices | Petrol, Diesel & LPG | Fuel Today",
    metaDescription:
      "Swiss petrol, diesel and LPG reference prices with source-date context and fuel-specific comparisons against Albania.",
    relatedLinks: [
      { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
      { label: "How fuel prices work", to: "/how-fuel-prices-work" },
      { label: "European rankings", to: "/rankings" },
      { label: "Compare countries", to: "/compare" },
      { label: "Data methodology", to: "/methodology" },
    ]
  },
  {
    slug: "united-kingdom",
    label: "United Kingdom",
    dataCountryName: "United Kingdom",
    metaTitle: "UK Fuel Prices | Petrol, Diesel & LPG | Fuel Today",
    metaDescription:
      "UK fuel prices as a non-euro benchmark, and how they compare with Albania and the eurozone.",
    relatedLinks: [
      { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
      { label: "How fuel prices work", to: "/how-fuel-prices-work" },
      { label: "European rankings", to: "/rankings" },
      { label: "Compare countries", to: "/compare" },
      { label: "Data methodology", to: "/methodology" },
    ]
  }
];

export function getCountryEditorial(slug: string): CountryEditorial | undefined {
  return COUNTRY_EDITORIAL.find((country) => country.slug === slug);
}

export function getIndexableCountrySlugs(): string[] {
  return COUNTRY_EDITORIAL.map((country) => country.slug);
}
