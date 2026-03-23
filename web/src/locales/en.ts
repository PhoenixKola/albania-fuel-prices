export const en = {
  title: "Europe Fuel Prices",
  subtitleAsOf: (d: string) => `As of ${d}`,
  subtitleLoading: "Loading latest data…",
  region: (r: string) => `Region: ${r}`,
  selectCountry: "Select a country",
  gasoline95: "Gasoline 95",
  diesel: "Diesel",
  lpg: "LPG",
  updated: (s: string) => `Fetched at: ${s}`,
  source: "Source",
  open: "Open",
  refresh: "Refresh",
  refreshing: "Refreshing…",
  couldntLoad: "Couldn’t load data",
  tryAgain: "Try again",
  hint: "National averages. Values come from the source and update automatically.",
  langEN: "EN",
  langSQ: "AL",

  currency: "Currency",
  eurPerL: "EUR / L",
  allPerL: "ALL / L",
  exchangeRate: "Exchange rate (ALL per 1 EUR)",
  estimated: "Estimated",
  localEstimate: "Local estimate (Albania)",
  pickCity: "Pick a city",
  cityBias: "Bias",
  estimateNote: "This is an estimate to feel more local (not official station prices).",

  watchlist: "Watchlist",
  addToWatchlist: "Add",
  remove: "Remove",
  compare: "Compare",
  openCountry: "Open",
  emptyWatchlist: "Add countries to compare quickly.",

  rankings: "Rankings",
  cheapest: "Cheapest",
  mostExpensive: "Most expensive",
  fuelType: "Fuel type",

  tools: "Quick tools",
  tabFill: "Fill-up",
  tabBudget: "Budget",
  tabTrip: "Trip",
  liters: "Liters",
  cost: "Cost",
  budget: "Budget",
  youGet: "You get",
  distanceKm: "Distance (km)",
  consumption: "Consumption (L/100km)",
  litersNeeded: "Liters needed",

  copy: "Copy",
  copied: "Copied",
  share: "Share",
  shareTextTitle: "Fuel prices summary",
  currencyMode: "Currency",
  currencyEUR: "EUR",
  currencyLocal: "Local",

  stationsNearbyTitle: "Stations nearby",
  stationsUseMyLocation: "Use my location",
  stationsGettingLocation: "Getting location…",
  stationsRadius: "Radius",
  stations2km: "2 km",
  stations5km: "5 km",
  stations10km: "10 km",
  stationsFound: (n: number) => `Found ${n} stations`,
  stationsOpen: "Open",
  stationsOpenNow: "Open now",
  stationsClosed: "Closed",
  stationsHoursUnknown: "Hours unknown",
  stationsRefresh: "Refresh",
  stationsNone: "No stations found nearby.",
  stationsShowing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
  stationsShowMore: "Show more",
  stationsShowAll: "Show all",
  stationsCollapse: "Collapse",

  heroTitle: "Fuel prices in Albania and Europe, explained clearly",
  heroSubtitle:
    "Karburanti Sot helps drivers compare fuel prices, estimate trip costs, and understand how pricing changes across countries. Instead of showing only raw numbers, the site adds context around price rankings, likely cost differences, exchange-rate effects, and practical travel use cases.",
  heroLiveFallback: "Live price tools and country comparisons",
  heroUpdatedAt: (s: string) => `Updated ${s}`,

  editorialTitle: "Today's fuel price summary",
  editorialEmpty:
    "Price data is not available yet. Once country price rows are connected, this section will turn live numbers into a short editorial summary with useful takeaways instead of showing only raw tables.",
  editorialLead:
    "This summary turns the current country data into a quick reading of the market. The goal is to help visitors understand where fuel is relatively cheap, where it is more expensive, and how large the price gap is across the countries shown on the page.",
  editorialCheapestPetrol: "Cheapest petrol",
  editorialMostExpensivePetrol: "Most expensive petrol",
  editorialPetrolSpread: "Petrol spread across listed countries",
  editorialCheapestDiesel: "Cheapest diesel",
  editorialMostExpensiveDiesel: "Most expensive diesel",
  editorialDieselSpread: "Diesel spread across listed countries",
  notAvailable: "n/a",

  methodologyTitle: "How the data is collected and interpreted",
  methodologyParagraph1:
    "Karburanti Sot displays public fuel price information and converts that data into simple comparisons for drivers and travelers. The site is meant to be practical, but it also explains what the figures mean, how country differences affect trip planning, and why estimates should be treated as guidance rather than guarantees for a specific station or route.",
  methodologyParagraph2:
    "Country rankings and comparisons are built from the fuel datasets made available to the app. When exchange-rate conversions are needed, the site uses a public FX source so that values can be displayed more consistently across regions. Because fuel markets change over time and data sources can update on different schedules, users should read the figures as the best currently available public estimate rather than a promise of the exact pump price they will see at a given location.",
  methodologyParagraph3:
    "Trip calculations are estimates. They depend on the route assumptions, chosen fuel type, displayed price data, and any conversion logic applied between currencies. Nearby station data can also vary because local prices, taxes, promotions, and reporting times are not always identical.",
  methodologyFuelSource: "Fuel source",
  methodologyFxSource: "FX source",
  methodologyUpdatePattern: "Update pattern",
  methodologyFuelSourceDefault: "Public fuel price sources used by the app",
  methodologyFxSourceDefault: "Public exchange-rate source used by the app",
  methodologyUpdateFrequencyDefault: "Data updates depend on the upstream public sources and the app refresh cycle",

  faqTitle: "Frequently asked questions",
  faqQ1: "How often are fuel prices updated?",
  faqA1:
    "Update frequency depends on the public data sources connected to the site and the app refresh cycle. Some values may refresh faster than others.",
  faqQ2: "Are the prices exact for every station?",
  faqA2:
    "No. Country-level and regional figures are best read as public market estimates or averages unless a station-specific source is shown.",
  faqQ3: "Why can nearby station prices differ from the country average?",
  faqA3:
    "Local taxes, promotions, competition, station brand, and data timing can all create differences between a station price and a broader country figure.",
  faqQ4: "How is the trip calculator estimate made?",
  faqA4:
    "The estimate uses the selected distance and fuel assumptions together with the displayed fuel price and any required currency conversion.",
  faqQ5: "Which exchange rates are used?",
  faqA5:
    "The site uses a public exchange-rate source when price comparison or trip estimation requires conversion between currencies.",
  faqQ6: "Does the website store my location?",
  faqA6:
    "Location use should be optional and only used when needed for nearby station features. It should never be required for basic country comparison tools.",

  watchlistGuidance:
    "Use the watchlist to keep a small comparison set of countries you care about most. This is helpful for quick side-by-side checks, but the values should still be read as general price guidance rather than a station-by-station guarantee.",
  nearbyGuidance:
    "Nearby stations are optional and meant as a local convenience layer on top of the country comparison. Station availability and opening-hour data may be incomplete or vary from what is shown at the pump.",

  sourceUpdatedLabel: "Updated",
  sourceCardSubtitle: "Source information and how these fuel figures should be interpreted.",
  sourceCardInterpretationNote:
    "The figures on this page should be read as a practical comparison of public fuel data, not as a guarantee of the exact pump price at every station. Local stations, taxes, reporting times, and exchange-rate effects can all change the final price users see.",
  sourceCardMethodologyNote:
    "Methodology: the site compares country-level fuel prices and presents them in a simpler format for travel planning, comparison, and rough cost estimation. These numbers are most useful as market guidance rather than as a promise for one exact station.",
  sourceUrlLabel: "URL",
} as const;