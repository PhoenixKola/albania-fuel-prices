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
    "Price data for this comparison is temporarily unavailable. This section normally provides an editorial summary highlighting which countries have the cheapest and most expensive fuel, along with the current price spread across the region.",
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

  // Navigation & Footer
  navHome: "Home",
  navAbout: "About",
  navContact: "Contact",
  navPrivacy: "Privacy Policy",
  navTerms: "Terms of Use",
  footerTagline: "Independent fuel price data for drivers and travelers across Europe.",
  footerCopyright: (year: number) => `© ${year} Karburanti Sot. All rights reserved.`,

  // About page
  aboutTitle: "About Karburanti Sot",
  aboutIntro:
    "Karburanti Sot is an independent fuel price information service that collects, compares, and explains public fuel pricing data across Albania and the wider European region. The project was started to give drivers, commuters, and cross-border travelers a straightforward way to compare fuel costs without needing to visit dozens of separate government or industry sources.",
  aboutMissionTitle: "Our mission",
  aboutMissionP1:
    "Fuel prices vary significantly from country to country in Europe, sometimes by more than 50 percent for the same fuel type. Those differences matter: they affect household budgets, road-trip plans, logistics costs, and cross-border commuting decisions. Unfortunately, official price data is scattered across national energy agencies, statistics offices, and industry associations — each with its own format, update schedule, and reporting method.",
  aboutMissionP2:
    "Karburanti Sot brings that fragmented information together in one place. The goal is not simply to list numbers, but to add context: which country is cheapest right now, how large the price gap is, what exchange-rate effects look like for travelers paying in different currencies, and how nearby stations compare to the national average.",
  aboutDataTitle: "Where the data comes from",
  aboutDataP1:
    "The prices shown on this site come from publicly available data sources including government energy agencies, official statistics bureaus, and recognized industry datasets. The site fetches data programmatically and converts it into a consistent format so that values can be compared side by side across countries.",
  aboutDataP2:
    "Exchange-rate conversions use a public FX data source so that comparisons between countries with different currencies remain practical. All conversions are clearly labeled, and users are reminded that converted values are estimates rather than guaranteed pump prices.",
  aboutDataP3:
    "Update frequency depends on how often upstream sources publish new data. Some countries report weekly, others less frequently. The timestamp shown on each page tells you when the data was last refreshed.",
  aboutEditorialTitle: "Editorial approach",
  aboutEditorialP1:
    "Every data point on the site is accompanied by editorial context. Rather than showing only a raw table of numbers, the site explains what the numbers mean: which country has the cheapest petrol, how large the diesel spread is, and what factors — such as taxes, subsidies, or local market conditions — typically drive those differences.",
  aboutEditorialP2:
    "The methodology section on the home page explains the data pipeline in detail, and the FAQ covers the most common questions about accuracy, update timing, and the difference between national averages and individual station prices.",
  aboutWhoTitle: "Who maintains this project",
  aboutWhoP1:
    "Karburanti Sot is maintained by an independent developer based in Albania. The project is not affiliated with any fuel company, government agency, or advertising network. The site is funded through advertising, which allows it to remain free for all users.",
  aboutWhoP2:
    "If you have feedback, data corrections, or partnership inquiries, you can reach the maintainer through the contact page.",

  // Contact page
  contactTitle: "Contact Us",
  contactIntro:
    "Whether you have a question about the data, want to report an inaccuracy, or have a suggestion for improving the site, we welcome your message. We typically respond within a few business days.",
  contactEmailTitle: "Email",
  contactEmailValue: "fenixkola@gmail.com",
  contactEmailNote:
    "This is the best way to reach us for data corrections, feedback, or general inquiries. Please include as much detail as possible so we can help you quickly.",
  contactTopicsTitle: "Common topics we can help with",
  contactTopic1: "Reporting a price that looks incorrect or outdated for a specific country",
  contactTopic2: "Asking about data sources or methodology",
  contactTopic3: "Suggesting a new country or feature",
  contactTopic4: "Reporting a technical issue with the website or mobile app",
  contactTopic5: "Partnership or data-licensing inquiries",
  contactResponseTitle: "What to expect",
  contactResponseP1:
    "We read every message. For data corrections, we verify the report against our upstream sources before making changes. For feature requests, we add them to a public backlog and prioritize based on user demand.",
  contactResponseP2:
    "If your inquiry is urgent — for example, if we are displaying clearly wrong information — please mention that in the subject line and we will prioritize it.",

  // Privacy page
  privacyTitle: "Privacy Policy",
  privacyUpdated: "Last updated: March 2026",
  privacyIntro:
    "This Privacy Policy describes how Karburanti Sot (\"the Service\") handles information when you use our website and mobile applications. We are committed to transparency about what data we collect and how it is used.",
  privacyCollectTitle: "What data we collect",
  privacyCollectP1:
    "We do not ask for or collect personal information such as your name, email address, phone number, or precise location. The Service works without requiring you to create an account or log in.",
  privacyLocalTitle: "Data stored on your device",
  privacyLocalP1:
    "The Service stores a small number of preferences locally on your device (using browser local storage or on-device storage on mobile). These include your selected language, preferred country, currency mode, and theme preference. This data never leaves your device and is not transmitted to our servers.",
  privacyFetchTitle: "Data the Service fetches",
  privacyFetchP1:
    "The Service fetches publicly available fuel price data and exchange-rate data from remote sources. These network requests are standard HTTPS calls and do not contain personal user information.",
  privacyAdsTitle: "Advertising",
  privacyAdsP1:
    "The Service displays advertisements through Google AdSense (web) and Google AdMob (mobile). These third-party advertising services may automatically collect certain device and usage information to serve and measure ads, including:",
  privacyAdItem1: "IP address (used for network communication and approximate geographic targeting)",
  privacyAdItem2: "Basic device information such as device model, operating system version, and screen size",
  privacyAdItem3: "Ad performance and interaction data (impressions, clicks)",
  privacyAdItem4: "Cookies or mobile advertising identifiers, subject to your device and browser settings",
  privacyAdsP2:
    "We do not receive your personal advertising identifier directly. You can reset or limit ad personalization through your browser or device privacy settings.",
  privacyAnalyticsTitle: "Analytics",
  privacyAnalyticsP1:
    "The Service does not use a separate analytics product to track individual users. Any usage data collected is limited to what the advertising SDKs gather for ad measurement purposes.",
  privacySharingTitle: "Data sharing",
  privacySharingP1:
    "We do not sell personal data. Third-party ad providers may process the data described above for the purpose of delivering and measuring advertising, in accordance with their own privacy policies.",
  privacySecurityTitle: "Security",
  privacySecurityP1:
    "The Service does not use accounts or passwords. It downloads only public data and stores only local preferences on your device. All network communication uses HTTPS encryption.",
  privacyChildrenTitle: "Children's privacy",
  privacyChildrenP1:
    "The Service is intended for a general audience. It does not knowingly collect personal information from children under the age of 13.",
  privacyChangesTitle: "Changes to this policy",
  privacyChangesP1:
    "We may update this Privacy Policy from time to time. When we do, the \"Last updated\" date at the top of this page will be revised. We encourage you to review this page periodically.",
  privacyContactTitle: "Contact",
  privacyContactP1:
    "If you have questions about this Privacy Policy, you can reach us at fenixkola@gmail.com.",

  // Terms page
  termsTitle: "Terms of Use",
  termsUpdated: "Last updated: March 2026",
  termsIntro:
    "By accessing and using Karburanti Sot (\"the Service\"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use the Service.",
  termsServiceTitle: "Description of the Service",
  termsServiceP1:
    "Karburanti Sot is a free, publicly accessible fuel price comparison service. It collects public fuel price data from government and industry sources across Europe, converts that data into a consistent format, and presents it with editorial context to help drivers and travelers make informed decisions.",
  termsAccuracyTitle: "Data accuracy and limitations",
  termsAccuracyP1:
    "The fuel prices displayed on this site are sourced from publicly available datasets. While we make reasonable efforts to ensure accuracy and timeliness, we cannot guarantee that every price shown matches the exact pump price at any specific fuel station at any given time.",
  termsAccuracyP2:
    "Country-level figures represent national averages or official reported values, not individual station prices. Local taxes, promotions, brand-specific pricing, and reporting delays can all cause differences between displayed values and actual station prices.",
  termsAccuracyP3:
    "Exchange-rate conversions are based on public FX data and should be treated as estimates. The Service is not a financial advisory tool and should not be relied upon for currency trading or investment decisions.",
  termsUseTitle: "Acceptable use",
  termsUseP1:
    "You may use the Service for personal, non-commercial purposes such as trip planning, price comparison, and general information. You may not use automated tools to scrape, download, or redistribute the data in bulk without prior written permission.",
  termsIpTitle: "Intellectual property",
  termsIpP1:
    "The editorial content, design, code, and visual elements of the Service are the property of Karburanti Sot. The underlying fuel price data comes from public sources and remains subject to the terms of those original sources.",
  termsLinksTitle: "Third-party links and services",
  termsLinksP1:
    "The Service may contain links to third-party websites, such as fuel data sources or mapping services. We are not responsible for the content, accuracy, or privacy practices of those external sites.",
  termsAdsTitle: "Advertising",
  termsAdsP1:
    "The Service is funded through third-party advertising. Ads are clearly separated from editorial content and do not influence the fuel price data or comparisons shown on the site.",
  termsLiabilityTitle: "Limitation of liability",
  termsLiabilityP1:
    "The Service is provided \"as is\" without warranties of any kind, express or implied. To the fullest extent permitted by law, Karburanti Sot shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service or reliance on any information provided.",
  termsChangesTitle: "Changes to these terms",
  termsChangesP1:
    "We may update these Terms of Use from time to time. Continued use of the Service after changes are posted constitutes acceptance of the revised terms.",
  termsContactTitle: "Contact",
  termsContactP1:
    "If you have questions about these Terms of Use, please contact us at fenixkola@gmail.com.",

  // 404 page
  notFoundTitle: "Page not found",
  notFoundSubtitle: "404 — This page doesn't exist",
  notFoundMessage:
    "The page you're looking for isn't here. It may have been moved, or you may have followed an incorrect link. Return to the home page to continue comparing fuel prices.",
  notFoundButtonHome: "Back to home",
} as const;