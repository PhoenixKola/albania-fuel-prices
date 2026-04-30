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
  rankingsGuidance:
    "Rankings show relative fuel price levels across countries for the selected fuel type. They are useful for spotting market differences quickly, but local station prices can still vary.",

  sourceUpdatedLabel: "Updated",
  sourceCardSubtitle: "Source information and how these fuel figures should be interpreted.",
  sourceCardInterpretationNote:
    "The figures on this page should be read as a practical comparison of public fuel data, not as a guarantee of the exact pump price at every station. Local stations, taxes, reporting times, and exchange-rate effects can all change the final price users see.",
  sourceCardMethodologyNote:
    "Methodology: the site compares country-level fuel prices and presents them in a simpler format for travel planning, comparison, and rough cost estimation. These numbers are most useful as market guidance rather than as a promise for one exact station.",
  sourceUrlLabel: "URL",

  // Navigation & Footer
  navHome: "Home",
  navStations: "Stations",
  navCompare: "Compare",
  navRankings: "Rankings",
  navAbout: "About",
  navContact: "Contact",
  navGuides: "Guides",
  navPrivacy: "Privacy Policy",
  navTerms: "Terms of Use",
  footerTagline: "Independent fuel price data for drivers and travelers across Europe.",
  footerCopyright: (year: number) => `© ${year} Karburanti Sot. All rights reserved.`,

  // About page
  aboutTitle: "About Karburanti Sot",
  aboutIntro:
    "Karburanti Sot is an independent fuel price information service that collects, compares, and explains public fuel pricing data across Albania and the wider European region. The project was started to give drivers, commuters, and cross-border travelers a straightforward way to compare fuel costs without needing to visit many separate third-party and industry sources.",
  aboutMissionTitle: "Our mission",
  aboutMissionP1:
    "Fuel prices vary significantly from country to country in Europe, sometimes by more than 50 percent for the same fuel type. Those differences matter: they affect household budgets, road-trip plans, logistics costs, and cross-border commuting decisions. Unfortunately, publicly available price data is fragmented across multiple third-party feeds, statistics references, and industry sources — each with its own format, update schedule, and reporting method.",
  aboutMissionP2:
    "Karburanti Sot brings that fragmented information together in one place. The goal is not simply to list numbers, but to add context: which country is cheapest right now, how large the price gap is, what exchange-rate effects look like for travelers paying in different currencies, and how nearby stations compare to the national average.",
  aboutDataTitle: "Where the data comes from",
  aboutDataP1:
    "Fuel price data is collected from publicly available third-party fuel price sources and may be supplemented with official or statistical references where available. The site fetches data programmatically and converts it into a consistent format so that values can be compared side by side across countries.",
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
    "Advertising may use cookies and similar identifiers for personalized or non-personalized ads, depending on your consent status and local legal requirements. For users in the EEA, UK, and Switzerland, consent signals are managed through a certified CMP or Google Privacy & messaging flow (provider details and links can be added by the site owner). You can reset or limit ad personalization through your browser or device privacy settings.",
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
    "Karburanti Sot is a free, publicly accessible fuel price comparison service. It collects public fuel price data from third-party and industry sources across Europe, converts that data into a consistent format, and presents it with editorial context to help drivers and travelers make informed decisions.",
  termsAccuracyTitle: "Data accuracy and limitations",
  termsAccuracyP1:
    "The fuel prices displayed on this site are sourced from publicly available datasets. While we make reasonable efforts to ensure accuracy and timeliness, we cannot guarantee that every price shown matches the exact pump price at any specific fuel station at any given time.",
  termsAccuracyP2:
    "Country-level figures represent broad reference values from available datasets, not individual station prices. Local taxes, promotions, brand-specific pricing, and reporting delays can all cause differences between displayed values and actual station prices.",
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

  // Guide navigation
  navMethodology: "Methodology",
  navHowPricesWork: "How Fuel Prices Work",
  navEuropeComparison: "Europe Fuel Comparison",
  navRoadTripGuide: "Road Trip Fuel Guide",
  footerGuidesHeading: "Guides",

  // ── Stations page editorial ──
  stationsEditorialTitle: "Why nearby station prices differ from national averages",
  stationsEditorialP1:
    "National average fuel prices are useful as a market-level reference, but the price you actually pay at a pump depends on local factors. Independent stations may price more aggressively than branded chains, city-centre locations often charge a premium because of higher property costs, and motorway stations are frequently the most expensive because of captive demand.",
  stationsEditorialP2:
    "Tax regimes can also vary at a sub-national level in some countries. Regional surcharges, local environmental levies, or even the timing of a station's last wholesale delivery can all create gaps between the reported national average and the number on the pump display. Seasonal demand shifts — higher diesel consumption in winter for heating in certain Balkan countries, or increased petrol usage during summer travel season — add further variation.",
  stationsEditorialP3:
    "Using the nearby stations tool alongside the country-level data on the home page gives you both a macro view and a micro view. The macro view tells you roughly where fuel sits in a given country; the micro view tells you what the nearest pump is actually charging. Combining both is the most practical approach for day-to-day fueling decisions.",
  stationsEditorialTipTitle: "Practical tip",
  stationsEditorialTip:
    "If you are driving near a national border, check both the country average and nearby stations on each side. In the Balkans especially, a 10-minute detour across a border can sometimes save 10–20 cents per liter on a fill-up, which adds up over a full tank.",

  // ── Compare page editorial ──
  compareEditorialTitle: "How to use country comparisons effectively",
  compareEditorialP1:
    "Comparing fuel prices across countries is not just about finding the cheapest number in a table. Exchange rates, local purchasing power, tax structures, and even data reporting schedules all affect how meaningful a direct comparison is. A country with a nominally lower price in EUR may still feel expensive to its residents if local wages are also lower.",
  compareEditorialP2:
    "The watchlist feature is designed for drivers and travelers who regularly cross borders or plan road trips that span multiple countries. By keeping a small set of countries in your comparison list, you can quickly spot when price gaps widen or narrow — which is useful for choosing where to refuel along a cross-border route.",
  compareEditorialP3:
    "When reading the comparison, pay attention to the fuel type selected. Diesel and petrol prices do not always move in the same direction. Some countries tax diesel more lightly than petrol to support commercial transport, while others have equalized or even reversed that pattern. LPG availability and pricing is even more varied, with some countries actively subsidizing autogas and others offering very few stations.",
  compareEditorialTipTitle: "Cross-border tip",
  compareEditorialTip:
    "If you are planning a multi-country drive through the Balkans or Central Europe, refueling strategy matters. Fill up in countries where prices are consistently lower and carry only enough fuel in expensive countries to reach the next cheap refueling point. The comparison tool makes this strategy visible at a glance.",

  // ── Rankings page editorial ──
  rankingsEditorialTitle: "Understanding fuel price rankings across Europe",
  rankingsEditorialP1:
    "European fuel prices span a wide range. At the top of the ranking you will typically find countries with high excise duties and VAT — often in Scandinavia and Western Europe — while at the bottom you will find countries with lower taxes, state subsidies, or domestic refining capacity that keeps costs down.",
  rankingsEditorialP2:
    "Tax is the single biggest factor in cross-country price differences. In many EU countries, more than half of the pump price is made up of excise duty and VAT. When you see a country like the Netherlands or Finland near the top of the diesel ranking, it is rarely because crude oil costs more there — it is because the government takes a larger share of every liter sold.",
  rankingsEditorialP3:
    "Subsidies and price controls work in the opposite direction. Some countries cap retail fuel prices or provide direct subsidies to keep costs politically manageable. These interventions can shift a country's ranking significantly, but they also tend to be temporary — which means rankings can change quickly when a subsidy is removed or a cap is adjusted.",
  rankingsEditorialP4:
    "The ranking table is most useful when you compare it over time. A country that moves from the middle of the table to the top may be introducing new carbon taxes, while a country that drops may be responding to domestic pressure with short-term subsidies. Reading the direction of movement, not just the current position, gives you a deeper understanding of the fuel market.",

  // ── Methodology page (standalone) ──
  methodologyPageTitle: "Methodology: How Karburanti Sot Collects and Presents Fuel Price Data",
  methodologyPageIntro:
    "Transparency about how data is collected, processed, and displayed is essential for any site that helps people make real-world decisions based on numbers. This page explains every step of the data pipeline behind Karburanti Sot, from the original public sources through to the final figures shown on screen.",

  methodologySourcesTitle: "Data sources",
  methodologySourcesP1:
    "Karburanti Sot pulls fuel price data from publicly available third-party fuel price sources and may supplement coverage with official or statistical references where available. These sources publish data at different intervals — some weekly, some bi-weekly, and some monthly — depending on each publisher's reporting schedule.",
  methodologySourcesP2:
    "The specific sources used can change over time as providers update their reporting formats or APIs. When a source changes, the site's data pipeline is updated to match. The goal is to keep a transparent, timely, and comparable public feed for each covered country.",

  methodologyProcessTitle: "Data processing",
  methodologyProcessP1:
    "Raw data from different countries arrives in different formats, units, and currencies. The processing pipeline normalizes everything into a consistent format: fuel prices are expressed per liter, and a common reference currency (EUR) is used for cross-country comparisons. Local-currency values are also preserved and displayed when the user selects the local-currency mode.",
  methodologyProcessP2:
    "No manual adjustments, estimates, or editorial rounding are applied to the underlying price values. The numbers shown are the values reported by the upstream source, converted if necessary using the current exchange rate.",

  methodologyFxTitle: "Exchange rate conversions",
  methodologyFxP1:
    "When comparing fuel prices across countries with different currencies, the site fetches exchange rates from a public FX API. These rates are mid-market indicative rates, not bank buy/sell rates. This means that the EUR-equivalent prices shown for countries like Albania (ALL), Serbia (RSD), or North Macedonia (MKD) are close approximations, not guaranteed conversion values.",
  methodologyFxP2:
    "Exchange rates are refreshed regularly, but because FX markets move continuously, a small lag between the displayed rate and the real-time market rate is normal. This is acceptable for the site's purpose — showing relativefuel cost comparisons — but should not be used for financial transactions.",

  methodologyAccuracyTitle: "Accuracy and limitations",
  methodologyAccuracyP1:
    "Country-level fuel prices represent broad reference values from available datasets. They do not reflect the exact pump price at any specific station. Several factors can cause the price at a station near you to differ from the displayed figure: local competition, brand markups, time-of-day pricing, promotions, and how recently the station received a wholesale delivery.",
  methodologyAccuracyP2:
    "The \"Nearby Stations\" feature uses a different data source (map/location APIs) and may show prices that are more current for a specific location but less consistent in format than the country-level data. Both views are useful for different purposes: country data for broad comparisons, station data for immediate local decisions.",

  methodologyUpdateTitle: "Update frequency",
  methodologyUpdateP1:
    "Data is refreshed automatically based on a schedule aligned with how often upstream sources publish. For countries that publish weekly, the site will typically show new data within hours of a publication. For countries with more infrequent reporting, the data may remain static for longer periods. The \"last updated\" timestamp on every page tells you exactly when the most recent data was fetched.",

  methodologyEditorialTitle: "Editorial layer",
  methodologyEditorialP1:
    "Beyond raw data, the site adds editorial context. The daily summary on the home page highlights cheapest and most expensive countries, the price spread, and practical observations. The FAQ section answers common questions. Guide pages explain broader topics like how fuel prices are formed, how to compare countries fairly, and how to plan a road trip with fuel costs in mind.",
  methodologyEditorialP2:
    "The editorial content is written by humans and updated when market conditions or the site's data coverage changes. It is intended to help non-expert users interpret the data, not to provide financial or investment advice.",

  methodologyOpenTitle: "Open approach",
  methodologyOpenP1:
    "The underlying fuel price data comes from public sources and the site does not gate it behind a paywall or registration. The methodology described on this page is intended to be transparent so users can judge for themselves how much weight to give the figures. If you have questions about a specific data source or want to suggest improvements, the contact page is open.",

  // ── How Fuel Prices Work page ──
  howPricesTitle: "How Fuel Prices Work: From Crude Oil to the Pump",
  howPricesIntro:
    "Fuel prices are not arbitrary. They follow a chain that starts with crude oil extraction, passes through refining and distribution, and ends at the pump with taxes and margins added on top. Understanding this chain helps you interpret the price differences you see between countries, fuel types, and time periods on this site.",

  howPricesCrudeTitle: "Crude oil: The starting point",
  howPricesCrudeP1:
    "Global crude oil prices set the floor for all refined fuel products. Crude is traded on international commodity markets — primarily as Brent (the European benchmark) and WTI (the US benchmark). When crude prices rise, pump prices tend to follow with a lag of one to three weeks, depending on how much refined product is already in the supply chain.",
  howPricesCrudeP2:
    "Crude oil prices are influenced by geopolitical events, OPEC+ production decisions, global demand patterns (seasonal driving, industrial activity), currency movements (oil is priced in USD), and inventory levels. A single event — such as a production cut or a pipeline disruption — can move prices across every country covered on this site.",

  howPricesRefiningTitle: "Refining: Turning crude into petrol and diesel",
  howPricesRefiningP1:
    "Crude oil is processed in refineries into different products: petrol (gasoline), diesel, kerosene, LPG, heating oil, and others. The refining margin — the difference between the cost of crude and the wholesale price of refined products — fluctuates based on refinery capacity, maintenance schedules, and seasonal demand. Diesel and petrol are refined in different proportions, which is why their prices do not always move in lockstep.",
  howPricesRefiningP2:
    "Europe imports refined products as well as crude oil, which means that refining capacity in the Middle East, the US Gulf, and Asia can also affect European pump prices. When global refining capacity is tight, the refining margin widens and pump prices rise even if crude prices stay flat.",

  howPricesDistributionTitle: "Distribution and wholesale",
  howPricesDistributionP1:
    "Refined fuel is transported from refineries to regional storage depots and then to individual stations via pipelines, tanker trucks, or rail. Distribution costs vary by geography: landlocked countries or regions far from major refining centers face higher transport costs, which adds to the retail price.",
  howPricesDistributionP2:
    "Wholesale prices — the cost a station pays to stock fuel — reflect the refined product price plus distribution costs plus a small wholesale margin. Stations buy at wholesale and add their own retail margin on top.",

  howPricesTaxTitle: "Taxes: The biggest variable between countries",
  howPricesTaxP1:
    "In most European countries, taxes make up 40–60% of the final pump price. The two main components are excise duty (a fixed amount per liter, set by national law) and VAT (a percentage of the final price including excise). The EU sets minimum excise rates, but member states are free to go higher — and many do.",
  howPricesTaxP2:
    "This is the primary reason why the same fuel can cost €1.30/L in one country and €1.90/L in another. The difference is not mainly in crude oil or refining — it is in the tax wedge. Countries that prioritize revenue from fuel taxes (like the Netherlands, Finland, or Italy) sit near the top of the rankings, while countries with lower tax burdens (like Bulgaria, Poland, or several Balkan states) sit near the bottom.",
  howPricesTaxP3:
    "Some countries also apply special levies: carbon taxes, strategic reserve contributions, or road maintenance surcharges. These are less visible to consumers but still affect the pump price.",

  howPricesRetailTitle: "Retail margins and station-level pricing",
  howPricesRetailP1:
    "The retail margin is what the station owner keeps after paying for wholesale fuel, distribution, and taxes. It is typically small — a few cents per liter — but varies by competition, location, and brand. Motorway stations, which have less competition, charge higher margins. Urban stations in competitive areas may operate on very thin margins to attract volume.",
  howPricesRetailP2:
    "This is why the nearby stations tool on this site can show prices that differ from the country average. The country average smooths out all the local variation; the station price reflects the specific competitive and cost dynamics of that location.",

  howPricesSeasonalTitle: "Seasonal and demand patterns",
  howPricesSeasonalP1:
    "Fuel prices tend to follow seasonal patterns. Petrol demand rises in summer (driving season), which can push petrol prices up. Diesel demand tends to rise in winter in countries where diesel is also used for heating. These seasonal swings are layered on top of the global crude price movements.",
  howPricesSeasonalP2:
    "Holiday weekends, back-to-school periods, and major travel events can also create short-term demand spikes. If you are planning a road trip during a high-demand period, expect slightly higher prices at stations along popular routes.",

  howPricesSummaryTitle: "Putting it all together",
  howPricesSummaryP1:
    "The pump price you see is roughly: crude oil cost + refining margin + distribution costs + excise duty + VAT + retail margin. When you compare countries on this site, most of the difference comes from the tax component. When you compare stations within a country, most of the difference comes from the retail margin and local competitive dynamics.",

  // ── Europe Fuel Comparison page ──
  europeCompTitle: "Fuel Prices Across Europe: A Country-by-Country Comparison Guide",
  europeCompIntro:
    "Europe has some of the widest fuel price variation of any continent. A liter of diesel can cost nearly twice as much in Scandinavia as it does in parts of the Balkans. This guide explains why those differences exist, which countries are typically cheapest and most expensive, and how to use this information practically.",

  europeCompWhyTitle: "Why fuel prices vary so much across Europe",
  europeCompWhyP1:
    "The base cost of fuel — crude oil and refining — is broadly similar for all European countries because they draw on the same global commodity market. The differences come almost entirely from three factors: taxes (the dominant factor), local distribution costs, and government interventions like subsidies or price caps.",
  europeCompWhyP2:
    "The EU sets minimum excise duty rates for petrol and diesel, but each member state chooses its own rate above that floor. Non-EU countries in the Balkans and Eastern Europe have even more flexibility and often set lower rates. This tax disparity is the main driver of the price ranking you see on this site.",

  europeCompRegionsTitle: "Regional patterns",
  europeCompRegionsP1:
    "Scandinavian and Northwestern European countries (Netherlands, Finland, Denmark, Sweden, Norway) typically have the highest pump prices due to aggressive fuel taxation and environmental levies. The Nordic countries use high fuel taxes as part of a broader climate policy to discourage fossil fuel consumption.",
  europeCompRegionsP2:
    "Southern European countries (Spain, Portugal, Greece) tend to fall in the mid-range, with moderate excise rates and VAT.",
  europeCompRegionsP3:
    "Central and Eastern European countries (Poland, Hungary, Czech Republic, Romania, Bulgaria) generally have lower fuel prices due to lower excise rates and sometimes lower distribution costs.",
  europeCompRegionsP4:
    "Balkan countries (Albania, Kosovo, North Macedonia, Serbia, Bosnia, Montenegro) often have some of the lowest prices in Europe, though with more variation between them. Some, like Kosovo, have particularly low prices due to minimal taxation, while others are moderately taxed.",

  europeCompDieselVsPetrolTitle: "Diesel vs. petrol: Not always what you expect",
  europeCompDieselVsPetrolP1:
    "Historically, many European countries taxed diesel more lightly than petrol to support the transport and agriculture sectors. This gave diesel a consistent price advantage at the pump. However, that trend has been slowly reversing. Environmental concerns about diesel particulates and NO₂ emissions have led some countries to equalize or even reverse the tax differential.",
  europeCompDieselVsPetrolP2:
    "As a result, in some countries diesel is now more expensive than petrol at the pump — something that surprises many drivers. The ranking page on this site lets you switch between petrol, diesel, and LPG to see exactly where each fuel type stands in the European pricing hierarchy.",

  europeCompLpgTitle: "LPG: The overlooked alternative",
  europeCompLpgP1:
    "Autogas (LPG) is significantly cheaper than petrol or diesel in countries that promote it, such as Poland, Turkey, and Italy. However, LPG availability varies enormously. Some countries have dense LPG station networks, while others have almost none. If your vehicle runs on LPG, checking the rankings by fuel type is especially useful before a cross-border trip.",

  europeCompBorderTitle: "Border effects and refueling strategies",
  europeCompBorderP1:
    "Price differences at national borders create practical opportunities for drivers. In border regions, it is common to see drivers crossing to the cheaper side for cheaper fuel. Classic examples include Luxembourg (cheap fuel surrounded by more expensive neighbors), Slovenia vs. Italy, and Kosovo vs. neighboring countries.",
  europeCompBorderP2:
    "The compare tool on this site is designed to make border strategies visible. By keeping your home country and its neighbors in the watchlist, you can see at a glance whether a cross-border refueling run is worthwhile on any given day.",

  europeCompExchangeTitle: "Exchange rate effects for travelers",
  europeCompExchangeP1:
    "If you are traveling from a Eurozone country to a non-Euro country (or vice versa), exchange rates add another layer. A country might look cheap in EUR terms, but the actual cost you pay depends on the exchange rate your bank or card issuer applies. The site shows both EUR and local-currency prices when available, which helps you plan for the actual cash or card cost.",

  europeCompSummaryTitle: "How to use this information",
  europeCompSummaryP1:
    "For daily commuters, the most relevant data is your own country's price and the nearby station view. For road-trip planners, the country comparison and rankings tell you where to fill up cheaply and where to avoid refueling if possible. For anyone interested in energy policy, the data reveals how government choices translate directly into what drivers pay.",

  // ── Road Trip Fuel Guide page ──
  roadTripTitle: "Road Trip Fuel Cost Guide: How to Estimate and Reduce Your Fuel Expenses",
  roadTripIntro:
    "Planning a road trip across one or more countries? Fuel is usually one of the biggest variable costs of a drive, and it pays to estimate it in advance. This guide explains how to calculate fuel costs for any trip, how to factor in cross-border price differences, and practical tips for keeping your fuel bill as low as possible.",

  roadTripCalcTitle: "How the trip calculator works",
  roadTripCalcP1:
    "The estimated fuel cost for a trip is calculated using three inputs: the distance you plan to drive (in kilometers), your vehicle's fuel consumption (in liters per 100 km), and the fuel price per liter. The formula is simple: (distance ÷ 100) × consumption × price per liter = estimated fuel cost.",
  roadTripCalcP2:
    "The trip tool on the home page applies this formula using the displayed fuel price for your selected country and fuel type. If your route crosses multiple countries, you can estimate each segment separately by changing the country selection.",

  roadTripConsumptionTitle: "Understanding fuel consumption",
  roadTripConsumptionP1:
    "Your vehicle's fuel consumption — expressed in liters per 100 km (L/100km) in Europe — is the most important personal variable. Manufacturer-stated consumption figures are measured under standardized test conditions and are almost always optimistic. Real-world consumption is typically 10–30% higher, depending on driving conditions.",
  roadTripConsumptionP2:
    "Factors that increase real-world consumption include: driving at higher speeds (especially above 120 km/h), frequent acceleration and braking in city traffic, running air conditioning, driving in hilly or mountainous terrain, carrying heavy loads or a roof box, and driving with underinflated tires.",
  roadTripConsumptionP3:
    "For a realistic estimate, use your vehicle's trip computer average if available. If not, add 15–20% to the manufacturer's combined figure. A car rated at 6.0 L/100km will likely average 7.0–7.5 L/100km on a mixed highway-and-city trip.",

  roadTripCrossBorderTitle: "Cross-border refueling strategy",
  roadTripCrossBorderP1:
    "On a multi-country drive, the cheapest approach is to fill your tank in the country with the lowest fuel price and carry as little fuel as possible through expensive countries. The country comparison and ranking tools on this site make this strategy easy to plan.",
  roadTripCrossBorderP2:
    "For example, if you are driving from Germany through Austria to Slovenia and then into Italy, you might notice that fuel is cheapest in Austria or Slovenia. The optimal strategy would be to fill up before entering Italy, where prices are typically higher due to higher excise duties.",
  roadTripCrossBorderP3:
    "Keep in mind that some countries have legal limits on how much fuel you can carry in portable containers across borders. Stick to filling your vehicle's built-in tank and avoid carrying jerry cans across EU borders unless you have checked the regulations.",

  roadTripPaymentTitle: "Payment and currency tips",
  roadTripPaymentP1:
    "In Eurozone countries, paying at the pump is straightforward. In non-Euro countries (Albania, Serbia, North Macedonia, Bosnia, etc.), you will need local currency or a card that handles foreign transactions well. Most fuel stations in Europe accept major credit and debit cards, but some smaller rural stations in the Balkans may be cash-only.",
  roadTripPaymentP2:
    "If paying by card in a non-Euro country, choose to pay in the local currency rather than accepting the station's dynamic currency conversion. Your bank's exchange rate is almost always better than the rate offered at the pump.",

  roadTripSavingsTitle: "Practical tips to reduce fuel costs",
  roadTripSavingsP1:
    "Drive at moderate speeds. Fuel consumption increases roughly exponentially with speed. Dropping from 130 km/h to 110 km/h can reduce consumption by 15–20%.",
  roadTripSavingsP2:
    "Maintain steady speed. Use cruise control on highways when possible. Avoid unnecessary acceleration and hard braking.",
  roadTripSavingsP3:
    "Check tire pressure before the trip. Underinflated tires increase rolling resistance and fuel consumption. Check your vehicle's recommended pressure (usually on a sticker inside the driver's door frame).",
  roadTripSavingsP4:
    "Remove unnecessary weight and drag. Roof boxes, bike racks, and heavy items in the trunk all increase consumption. Remove them if not needed for the trip.",
  roadTripSavingsP5:
    "Plan refueling stops. Use the rankings and country comparison data on this site to identify the cheapest refueling points along your route. Even a few cents per liter add up over a full tank.",

  roadTripExampleTitle: "Example: Estimating a Balkans road trip",
  roadTripExampleP1:
    "Suppose you are driving from Tirana, Albania to Thessaloniki, Greece — roughly 300 km. Your car consumes 7.5 L/100km in real-world conditions. Based on the current Albanian diesel price shown on this site:",
  roadTripExampleP2:
    "Fuel needed: (300 ÷ 100) × 7.5 = 22.5 liters. At a diesel price of approximately €1.45/L (Albania), the estimated fuel cost is about €32.60. If the Greek leg averages €1.60/L, the cost for the same distance in Greece would be about €36.00. This €3.40 difference on a 300 km segment shows why cross-border price awareness matters.",
  roadTripExampleP3:
    "For a longer multi-country road trip, these differences compound. A 2,000 km drive through five countries could see fuel cost differences of €30–50 depending on where you choose to fill up.",

  roadTripSummaryTitle: "Summary",
  roadTripSummaryP1:
    "Fuel cost estimation is not complicated, but being aware of consumption realities, cross-border price differences, and refueling strategy can save meaningful money on any road trip. Use the tools on this site — country comparison, rankings, trip calculator, and nearby stations — to plan your refueling stops before you leave.",

  // 404 page
  notFoundTitle: "Page not found",
  notFoundSubtitle: "404 — This page doesn't exist",
  notFoundMessage:
    "The page you're looking for isn't here. It may have been moved, or you may have followed an incorrect link. Return to the home page to continue comparing fuel prices.",
  notFoundButtonHome: "Back to home",
} as const;