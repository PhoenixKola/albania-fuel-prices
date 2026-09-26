export type Lang = "en" | "sq";

export type TDict = {
  title: string;
  subtitleAsOf: (d: string) => string;
  couldntLoad: string;
  tryAgain: string;
  refresh: string;
  refreshing: string;
  selectCountry: string;
  changeCountry: string;
  searchPlaceholder: string;
  close: string;
  selected: string;

  gasoline95: string;
  diesel: string;
  lpg: string;

  source: string;
  open: string;
  fetchedAt: (s: string) => string;

  langEN: string;
  langSQ: string;

  stationsTitle: string;
  rankingsTitle: string;
  rankingsSubtitle: (fuel: string) => string;
  rankingsExpensiveTitle: string;
  rankingsExpensiveSubtitle: (fuel: string) => string;
  yourRank: (n: number) => string;
  rankUnavailable: string;

  compareTitle: string;
  compareEmpty: string;
  compareSubtitle: (fuel: string) => string;
  addCountry: string;
  compareHint: string;
  maxCompareReached: string;
  remove: string;

  favoritesTitle: string;
  quickSwitch: string;
  edit: string;

  currency: string;
  currencyEUR: string;
  currencyLocal: string;

  share: string;

  cityEstimateTitle: string;
  city: string;
  bias: string;
  biasHint: string;
  estimate: string;
  approxNote: string;
  reset: string;
  lastUpdated: string;
  showingCached: string;

  stationsNearbyTitle: string;
  stationsNearbyNeedLocation: string;
  stationsNearbyUseMyLocation: string;
  stationsNearbyGettingLocation: string;
  stationsNearbyRefresh: string;
  stationsNearbyCached: string;
  stationsNearbyNone: string;
  stationsNearbyOpen: string;
  stationsNearbyOpenNow: string;
  stationsNearbyClosed: string;
  stationsNearbyHoursUnknown: string;
  radius: string;
  radius2km: string;
  radius5km: string;
  radius10km: string;
  stationsNearbyFound: (n: number) => string;
  stationsNearbyShowing: (shown: number, total: number) => string;
  stationsNearbyShowMore: string;
  stationsNearbyShowAll: string;
  stationsNearbyCollapse: string;
  stationsTryWiderRadius: string;
  tapToSwitch: string;
  quickSwitchEmpty: string;
  unlockTitle: (m: number) => string;
  unlockStations: string;
  unlockCompare: string;
  unlockRankings: string;
  watchVideo: string;
  continueWithout: string;
  maxCompareReachedN: (n: number) => string;
  radius30km: string;
  radius50km: string;
  rateTitle: string;
  rateBody: string;
  rateNow: string;
  rateLater: string;
  feedback: string;
  unlockRewards: string;
  unlockLater: string;
  rewardsEnabled: string;
  unlockMoreRankingsTitle: string;
  unlockMoreRankingsSubtitle: string;

  homeTitle: string;
  settingsTitle: string;
  settingsSubtitle: string;
  appearance: string;
  themeLight: string;
  themeDark: string;

  trendStableWeek: string;
  trendVsLastWeek: string;

  scopeEurope: string;
  scopeWorld: string;
  rankingsCheapTitle: string;
  rankingsCheapSubtitle: (fuel: string) => string;
  rankingsFavoritesTitle: string;
  rankingsFavoritesSubtitle: (fuel: string) => string;
  rankingsAroundYouTitle: string;
  rankingsAroundYouSubtitle: string;
  yourRankInFavorites: (n: number) => string;
  notInFavoritesRank: string;
  addFavoritesToUseFavoritesRanking: string;
  you: string;
  locked: string;
  unlocked: string;

  aboutSection: string;
  privacyPolicy: string;
  privacyPolicySubtitle: string;
  termsOfUse: string;
  termsOfUseSubtitle: string;
  shareApp: string;
  shareAppSubtitle: string;
  shareAppMessage: string;
  darkMode: string;
  darkModeOn: string;
  darkModeOff: string;
  language: string;
  extraFeaturesOn: string;
  dataSource: string;
  rateApp: string;
  rateAppSubtitle: string;
  feedbackSubtitle: string;
  feedbackSupport: string;
  toastThemeLight: string;
  toastThemeDark: string;
  toastLanguageChanged: string;
  toastCurrencyEUR: string;
  toastCurrencyLocal: string;
  toastRefreshing: string;
  toastOpeningFeedback: string;
  toastOpeningStore: string;
  toastRewardsUnlocked: string;
  toastRewardsLater: string;
  version: string;
  allCountries: string;
  favorites: string;
  homeVerified: string;
  allFuelPrices: string;
  homeEuropeAverage: string;

  // Compare sets, alerts and quick-switch labels
  best: string;
  savedSets: string;
  compareSetsTitle: string;
  saveCurrentSet: string;
  setNamePlaceholder: string;
  save: string;
  noSavedSets: string;
  spread: string;
  nearest: string;
  current: string;
  searchAllCountries: string;
  priceAlert: string;
  saveAlert: string;
  keepCurrent: string;
  loading: string;
  fxUnavailable: string;
  premiumInsights: string;
  searchStations: string;
  stationSearchPlaceholder: string;
  filters: string;
  openNowOnly: string;
  favoriteOnly: string;
  allStations: string;
  directions: string;
  withinRadius: (radius: number) => string;
  noStationMatches: string;
  clearFilters: string;
  locationAccess: string;
  compareOverview: string;
  bestValue: string;
  selectedCountries: string;
  differenceFromBest: string;
  sevenDays: string;
  thirtyDays: string;
  trendComparison: string;
  trendMovedUp: (country: string) => string;
  trendMovedDown: (country: string) => string;
  trendHeldSteady: string;
  saveTwoCountries: string;
  compareLimitHint: (n: number) => string;
  leaderboard: string;
  cheapestMode: string;
  expensiveMode: string;
  yourPosition: string;
  manageFavorites: string;
  toastCountrySelected: (country: string) => string;
  preferences: string;
  dataHealth: string;
  liveData: string;
  cachedData: string;
  themeSystem: string;
  followDeviceTheme: string;
  chooseLanguage: string;
  chooseCurrency: string;
  lastSync: string;
  openSource: string;
  appSupport: string;
  openSettings: string;
  locationPermissionDenied: string;
  locationPermissionDeniedHint: string;
  locationUnavailable: string;
  locationUnavailableHint: string;
  stationsLoadError: string;
  stationsTimeoutCached: string;
  linkUnavailable: string;
  dataUnavailable: string;
  // Home fuel deck
  monthsShort: string[];
  ordinalCheapest: (rank: number, total: number) => string;
  changeCountryA11y: (country: string) => string;
  saveMarketA11y: (country: string) => string;
  unsaveMarketA11y: (country: string) => string;
  pricesOf: (date: string) => string;
  freshSynced: string;
  freshChecking: string;
  freshStale: string;
  offlineCopy: (saved: string) => string;
  refreshFailed: string;
  loadingPrices: string;
  notReported: string;
  perLitre: string;
  aboveEuropeBy: (amount: string) => string;
  belowEuropeBy: (amount: string) => string;
  atEuropeAverage: string;
  outsideEuropeRank: string;
  weekChange: (amount: string) => string;
  weekFlat: string;
  localRateUnavailable: string;
  alertAction: string;
  alertBelowShort: (amount: string) => string;
  alertAboveShort: (amount: string) => string;
  alertBelow: string;
  alertAbove: string;
  alertRuleBelow: string;
  alertRuleAbove: string;
  alertTargetLabel: string;
  alertNow: (amount: string) => string;
  alertInvalid: string;
  shareAction: string;
  shareMessage: (fuel: string, country: string, price: string, date: string) => string;
  compareAction: string;
  compareMarketA11y: (country: string) => string;
  savedMarkets: string;
  savedMarketsEmpty: string;
  addMarket: string;
  marketPulse: string;
  movement: (days: number) => string;
  movementRange: (low: string, high: string) => string;
  movementMissing: string;
  positionInEurope: string;
  europeAverageIs: (amount: string) => string;
  cheapestShort: string;
  dearestShort: string;
  lastSyncAt: (when: string) => string;
  sourceIs: (source: string) => string;
  unlockExtras: string;
  extrasTitle: string;
  extrasDetail: string;
  extrasActive: (minutes: number) => string;
};

export const i18n: Record<Lang, TDict> = {
  en: {
    title: "Fuel Today",
    subtitleAsOf: (d: string) => `As of ${d}`,
    couldntLoad: "Couldn’t load data",
    tryAgain: "Try again",
    refresh: "Refresh",
    refreshing: "Refreshing…",
    selectCountry: "Country",
    changeCountry: "Search",
    searchPlaceholder: "Search country…",
    close: "Close",
    selected: "Selected",

    gasoline95: "Gasoline 95",
    diesel: "Diesel",
    lpg: "LPG",

    source: "Source",
    open: "Open",
    fetchedAt: (s: string) => `Fetched at: ${s}`,

    langEN: "EN",
    langSQ: "AL",

    stationsTitle: "Stations",
    rankingsTitle: "Rankings",
    rankingsSubtitle: (fuel: string) => `Cheapest countries for ${fuel}`,
    rankingsExpensiveTitle: "Most expensive",
    rankingsExpensiveSubtitle: (fuel: string) => `Most expensive countries for ${fuel}`,
    yourRank: (n: number) => `Your country rank: #${n}`,
    rankUnavailable: "Rank unavailable (missing data).",

    compareTitle: "Compare",
    compareEmpty: "Add countries to start comparing.",
    compareSubtitle: (fuel: string) => `Compare ${fuel} across 2–3 countries`,
    addCountry: "Add country",
    compareHint: "Pick 2–3 countries to compare.",
    maxCompareReached: "You can compare up to 3 countries.",
    remove: "Remove",

    favoritesTitle: "Favorites",
    quickSwitch: "Quick switch",
    edit: "Edit",

    currency: "Currency",
    currencyEUR: "EUR",
    currencyLocal: "Local",

    share: "Share",

    cityEstimateTitle: "City price estimate (Albania)",
    city: "City",
    bias: "Bias",
    biasHint: "Use bias if your city is usually a bit higher/lower than the base.",
    estimate: "Estimated price",
    approxNote: "Estimate only. Not official city data.",
    reset: "Reset",
    lastUpdated: "Last updated",
    showingCached: "Showing cached data",

    stationsNearbyTitle: "Stations nearby",
    stationsNearbyNeedLocation: "Location is needed to show nearby stations.",
    stationsNearbyUseMyLocation: "Use my location",
    stationsNearbyGettingLocation: "Getting location…",
    stationsNearbyRefresh: "Refresh",
    stationsNearbyCached: "Showing cached results",
    stationsNearbyNone: "No stations found nearby.",
    stationsNearbyOpen: "Open",
    stationsNearbyOpenNow: "Open now",
    stationsNearbyClosed: "Closed",
    stationsNearbyHoursUnknown: "Hours unknown",
    radius: "Radius",
    radius2km: "2 km",
    radius5km: "5 km",
    radius10km: "10 km",
    stationsNearbyFound: (n: number) => `Found ${n} stations`,
    stationsNearbyShowing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    stationsNearbyShowMore: "Show more",
    stationsNearbyShowAll: "Show all",
    stationsNearbyCollapse: "Collapse",
    stationsTryWiderRadius: "Try a wider radius or refresh the station list.",
    tapToSwitch: "Tap a country to switch instantly.",
    quickSwitchEmpty: "Add favorites to switch countries in one tap.",
    unlockTitle: (m: number) => `Unlock bonus for ${m} min`,
    unlockStations: "Stations radius: unlock 30km + 50km",
    unlockCompare: "Compare: unlock up to 5 countries",
    unlockRankings: "Rankings: show most expensive too",
    watchVideo: "Watch video",
    continueWithout: "No thanks",
    maxCompareReachedN: (n: number) => `You can compare up to ${n} countries.`,
    radius30km: "30 km",
    radius50km: "50 km",
    rateTitle: "Enjoying the app?",
    rateBody: "A quick rating helps a lot and supports future updates.",
    rateNow: "Rate now",
    rateLater: "Not now",
    feedback: "Feedback",
    unlockRewards: "Unlock rewards",
    unlockLater: "Unlock later",
    rewardsEnabled: "Rewards enabled",
    unlockMoreRankingsTitle: "Unlock more rankings",
    unlockMoreRankingsSubtitle: "Watch a rewarded ad to unlock more.",

    homeTitle: "Home",
    settingsTitle: "Settings",
    settingsSubtitle: "Customize your experience",
    appearance: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",

    trendStableWeek: "Stable this week",
    trendVsLastWeek: "vs last week",

    scopeEurope: "Europe",
    scopeWorld: "World",
    rankingsCheapTitle: "Cheapest",
    rankingsCheapSubtitle: (fuel: string) => `Cheapest countries for ${fuel}`,
    rankingsFavoritesTitle: "Favorites ranking",
    rankingsFavoritesSubtitle: (fuel: string) => `Your favorites ranked by ${fuel}`,
    rankingsAroundYouTitle: "Around you",
    rankingsAroundYouSubtitle: "Your position with neighbors",
    yourRankInFavorites: (n: number) => `Your favorites rank: #${n}`,
    notInFavoritesRank: "Your country is not in your favorites list.",
    addFavoritesToUseFavoritesRanking: "Add at least 2 favorites to use Favorites ranking.",
    you: "You",
    locked: "Locked",
    unlocked: "Unlocked",

    aboutSection: "About",
    privacyPolicy: "Privacy Policy",
    privacyPolicySubtitle: "How your data is handled",
    termsOfUse: "Terms of Use",
    termsOfUseSubtitle: "Rules for using the app",
    shareApp: "Share App",
    shareAppSubtitle: "Tell your friends about Karburanti Sot",
    shareAppMessage: "Compare fuel prices across Albania and Europe with Karburanti Sot:",
    darkMode: "Dark Mode",
    darkModeOn: "On",
    darkModeOff: "Off",
    language: "Language",
    extraFeaturesOn: "Extra ON",
    dataSource: "Data & Sources",
    rateApp: "Rate App",
    rateAppSubtitle: "Rate us on Google Play",
    feedbackSubtitle: "Send us your thoughts",
    feedbackSupport: "Feedback & Support",
    toastThemeLight: "Switched to light theme",
    toastThemeDark: "Switched to dark theme",
    toastLanguageChanged: "Language updated",
    toastCurrencyEUR: "Currency set to EUR",
    toastCurrencyLocal: "Currency set to local",
    toastRefreshing: "Refreshing data...",
    toastOpeningFeedback: "Opening feedback",
    toastOpeningStore: "Opening store",
    toastRewardsUnlocked: "Extra features unlocked",
    toastRewardsLater: "Maybe later",
    version: "Version",
    allCountries: "All",
    favorites: "Favorites",
    homeVerified: "Verified",
    allFuelPrices: "All fuel prices",
    homeEuropeAverage: "Europe average",
    best: "Best",
    savedSets: "Saved",
    compareSetsTitle: "Compare sets",
    saveCurrentSet: "Save current set",
    setNamePlaceholder: "Name",
    save: "Save",
    noSavedSets: "No saved sets yet.",
    spread: "Spread",
    nearest: "Nearest",
    current: "Current",
    searchAllCountries: "Search all countries",
    priceAlert: "Price alert",
    saveAlert: "Save alert",
    keepCurrent: "Keep current",
    loading: "Loading…",
    fxUnavailable: "FX unavailable",
    premiumInsights: "Live market intelligence",
    searchStations: "Search stations",
    stationSearchPlaceholder: "Search name or brand",
    filters: "Filters",
    openNowOnly: "Open now",
    favoriteOnly: "Favorites",
    allStations: "All stations",
    directions: "Directions",
    withinRadius: (radius: number) => `Within ${radius} km`,
    noStationMatches: "No stations match these filters.",
    clearFilters: "Clear filters",
    locationAccess: "Location access",
    compareOverview: "Comparison overview",
    bestValue: "Best value",
    selectedCountries: "Selected countries",
    differenceFromBest: "Extra vs best",
    sevenDays: "7 days",
    thirtyDays: "30 days",
    trendComparison: "Price movement",
    trendMovedUp: (country: string) => `${country} rose the most in this period.`,
    trendMovedDown: (country: string) => `${country} fell the most in this period.`,
    trendHeldSteady: "Prices were broadly stable in this period.",
    saveTwoCountries: "Select at least two countries to save this set.",
    compareLimitHint: (n: number) => `Compare up to ${n} countries in this session.`,
    leaderboard: "European leaderboard",
    cheapestMode: "Cheapest",
    expensiveMode: "Most expensive",
    yourPosition: "Your position",
    manageFavorites: "Manage favorites",
    toastCountrySelected: (country: string) => `${country} selected`,
    preferences: "Preferences",
    dataHealth: "Data health",
    liveData: "Live data",
    cachedData: "Cached data",
    themeSystem: "System",
    followDeviceTheme: "Follow device appearance",
    chooseLanguage: "Choose language",
    chooseCurrency: "Choose currency",
    lastSync: "Last sync",
    openSource: "Open source",
    appSupport: "Support & sharing",
    openSettings: "Open settings",
    locationPermissionDenied: "Location access is off",
    locationPermissionDeniedHint: "Enable location in device settings to find stations near you.",
    locationUnavailable: "Location unavailable",
    locationUnavailableHint: "We could not determine your location. Check your connection and try again.",
    stationsLoadError: "Stations could not be loaded. Pull to refresh or try again.",
    stationsTimeoutCached: "The station service timed out. Cached results are shown.",
    linkUnavailable: "This link is unavailable right now.",
    dataUnavailable: "Data unavailable",
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ordinalCheapest: (rank: number, total: number) => {
      const mod100 = rank % 100;
      const suffixes: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };
      const suffix = mod100 >= 11 && mod100 <= 13 ? "th" : suffixes[rank % 10] ?? "th";
      return `${rank}${suffix} cheapest of ${total}`;
    },
    changeCountryA11y: (country: string) => `${country}, change country`,
    saveMarketA11y: (country: string) => `Save ${country} to your markets`,
    unsaveMarketA11y: (country: string) => `Remove ${country} from your markets`,
    pricesOf: (date: string) => `Prices of ${date}`,
    freshSynced: "synced",
    freshChecking: "checking for updates",
    freshStale: "no newer publication",
    offlineCopy: (saved: string) => `Offline copy · saved ${saved}`,
    refreshFailed: "Couldn’t refresh",
    loadingPrices: "Loading prices…",
    notReported: "Not reported",
    perLitre: "per litre",
    aboveEuropeBy: (amount: string) => `${amount} above Europe average`,
    belowEuropeBy: (amount: string) => `${amount} below Europe average`,
    atEuropeAverage: "At the Europe average",
    outsideEuropeRank: "Not part of the European ranking",
    weekChange: (amount: string) => `${amount} this week`,
    weekFlat: "Unchanged this week",
    localRateUnavailable: "Local rate unavailable · showing EUR",
    alertAction: "Alert",
    alertBelowShort: (amount: string) => `Below ${amount}`,
    alertAboveShort: (amount: string) => `Above ${amount}`,
    alertBelow: "Below",
    alertAbove: "Above",
    alertRuleBelow: "Notify me when the price drops below",
    alertRuleAbove: "Notify me when the price rises above",
    alertTargetLabel: "Target price, EUR per litre",
    alertNow: (amount: string) => `Now ${amount}`,
    alertInvalid: "Enter a price above zero.",
    shareAction: "Share",
    shareMessage: (fuel: string, country: string, price: string, date: string) => `${fuel} in ${country}: ${price}\nPrices of ${date}`,
    compareAction: "Compare",
    compareMarketA11y: (country: string) => `Compare ${country} with other markets`,
    savedMarkets: "Saved markets",
    savedMarketsEmpty: "Save the markets you drive through",
    addMarket: "Add market",
    marketPulse: "Market pulse",
    movement: (days: number) => `Movement · last ${days} days`,
    movementRange: (low: string, high: string) => `Range ${low} – ${high}`,
    movementMissing: "Price history isn’t available for this market yet.",
    positionInEurope: "Position in Europe",
    europeAverageIs: (amount: string) => `Europe average ${amount}`,
    cheapestShort: "Cheapest",
    dearestShort: "Dearest",
    lastSyncAt: (when: string) => `Last sync ${when}`,
    sourceIs: (source: string) => `Source: ${source}`,
    unlockExtras: "Unlock extras",
    extrasTitle: "Extras",
    extrasDetail: "Watch a short ad to unlock bonus features for 30 minutes",
    extrasActive: (minutes: number) => `Unlocked · ${minutes} min left`,
  },
  sq: {
    title: "Karburanti Sot",
    subtitleAsOf: (d: string) => `Data: ${d}`,
    couldntLoad: "S’u arrit të ngarkohen të dhënat",
    tryAgain: "Provo përsëri",
    refresh: "Rifresko",
    refreshing: "Po rifreskohet…",
    selectCountry: "Shteti",
    changeCountry: "Kërko",
    searchPlaceholder: "Kërko shtet…",
    close: "Mbyll",
    selected: "Zgjedhur",

    gasoline95: "Benzinë 95",
    diesel: "Naftë",
    lpg: "LPG",

    source: "Burimi",
    open: "Hap",
    fetchedAt: (s: string) => `Marrë më: ${s}`,

    langEN: "EN",
    langSQ: "AL",

    stationsTitle: "Pikat",
    rankingsTitle: "Renditja",
    rankingsSubtitle: (fuel: string) => `Shtetet më të lira për ${fuel}`,
    rankingsExpensiveTitle: "Më të shtrenjtët",
    rankingsExpensiveSubtitle: (fuel: string) => `Shtetet më të shtrenjta për ${fuel}`,
    yourRank: (n: number) => `Renditja e shtetit: #${n}`,
    rankUnavailable: "Renditja s’është e mundur (mungojnë të dhënat).",

    compareTitle: "Krahaso",
    compareEmpty: "Shto shtete për të filluar krahasimin.",
    compareSubtitle: (fuel: string) => `Krahaso ${fuel} në 2–3 shtete`,
    addCountry: "Shto shtet",
    compareHint: "Zgjidh 2–3 shtete për krahasim.",
    maxCompareReached: "Mund të krahasosh deri në 3 shtete.",
    remove: "Hiqe",

    favoritesTitle: "Të preferuarat",
    quickSwitch: "Ndërrim i shpejtë",
    edit: "Ndrysho",

    currency: "Monedha",
    currencyEUR: "EUR",
    currencyLocal: "Vendase",

    share: "Ndaj",

    cityEstimateTitle: "Vlerësim çmimi sipas qytetit (Shqipëri)",
    city: "Qyteti",
    bias: "Korrigjim",
    biasHint: "Përdore nëse qyteti yt zakonisht është pak më lart/më poshtë.",
    estimate: "Çmimi i vlerësuar",
    approxNote: "Vetëm vlerësim. Jo të dhëna zyrtare qyteti.",
    reset: "Rivendos",
    lastUpdated: "Përditësuar",
    showingCached: "Po shfaqen të dhënat e ruajtura",

    stationsNearbyTitle: "Pikat e karburantit afër",
    stationsNearbyNeedLocation: "Duhet vendndodhja për të shfaqur pikat afër.",
    stationsNearbyUseMyLocation: "Përdor vendndodhjen time",
    stationsNearbyGettingLocation: "Po merret vendndodhja…",
    stationsNearbyRefresh: "Rifresko",
    stationsNearbyCached: "Po shfaqen rezultatet e ruajtura",
    stationsNearbyNone: "S’u gjetën pika karburanti afër.",
    stationsNearbyOpen: "Hap",
    stationsNearbyOpenNow: "Hapur tani",
    stationsNearbyClosed: "Mbyllur",
    stationsNearbyHoursUnknown: "Orari i panjohur",
    radius: "Rrezja",
    radius2km: "2 km",
    radius5km: "5 km",
    radius10km: "10 km",
    stationsNearbyFound: (n: number) => `U gjetën ${n} pika`,
    stationsNearbyShowing: (shown: number, total: number) => `Po shfaqen ${shown} nga ${total}`,
    stationsNearbyShowMore: "Shfaq më shumë",
    stationsNearbyShowAll: "Shfaq të gjitha",
    stationsNearbyCollapse: "Mbyll",
    stationsTryWiderRadius: "Provo nje radius me te gjere ose rifresko listen.",
    tapToSwitch: "Prek një shtet për ta ndërruar menjëherë.",
    quickSwitchEmpty: "Shto të preferuarat që t’i ndërroni shtetet me një prekje.",
    unlockTitle: (m: number) => `Zhblloko bonus për ${m} min`,
    unlockStations: "Rrezja e pikave: zhblloko 30km + 50km",
    unlockCompare: "Krahasimi: zhblloko deri në 5 shtete",
    unlockRankings: "Renditja: shfaq edhe më të shtrenjtat",
    watchVideo: "Shiko video",
    continueWithout: "Jo faleminderit",
    maxCompareReachedN: (n: number) => `Mund të krahasosh deri në ${n} shtete.`,
    radius30km: "30 km",
    radius50km: "50 km",
    rateTitle: "Po të pëlqen aplikacioni?",
    rateBody: "Një vlerësim i shpejtë na ndihmon shumë dhe mbështet përditësimet.",
    rateNow: "Vlerëso tani",
    rateLater: "Jo tani",
    feedback: "Sugjerim",
    unlockRewards: "Zhblloko shpërblimet",
    unlockLater: "Më vonë",
    rewardsEnabled: "Shpërblimet aktive",
    unlockMoreRankingsTitle: "Zhblloko më shumë renditje",
    unlockMoreRankingsSubtitle: "Shiko një reklamë për të zhbllokuar më shumë renditje.",

    homeTitle: "Kryefaqja",
    settingsTitle: "Cilësimet",
    settingsSubtitle: "Personalizo eksperiencën",
    appearance: "Pamja",
    themeLight: "E çelët",
    themeDark: "E errët",

    trendStableWeek: "Stabil këtë javë",
    trendVsLastWeek: "krahasuar me javën e kaluar",

    scopeEurope: "Europa",
    scopeWorld: "Bota",
    rankingsCheapTitle: "Më të lirat",
    rankingsCheapSubtitle: (fuel: string) => `Shtetet më të lira për ${fuel}`,
    rankingsFavoritesTitle: "Renditja e të preferuarave",
    rankingsFavoritesSubtitle: (fuel: string) => `Të preferuarat sipas ${fuel}`,
    rankingsAroundYouTitle: "Rreth jush",
    rankingsAroundYouSubtitle: "Pozicioni juaj me fqinjët",
    yourRankInFavorites: (n: number) => `Renditja në të preferuarat: #${n}`,
    notInFavoritesRank: "Shteti juaj nuk është në listën e të preferuarave.",
    addFavoritesToUseFavoritesRanking: "Shto të paktën 2 të preferuara për këtë renditje.",
    you: "Ju",
    locked: "E kyçur",
    unlocked: "E zhbllokuar",

    aboutSection: "Rreth aplikacionit",
    privacyPolicy: "Politika e Privatësisë",
    privacyPolicySubtitle: "Si trajtohen të dhënat e tua",
    termsOfUse: "Kushtet e Përdorimit",
    termsOfUseSubtitle: "Rregullat e përdorimit të aplikacionit",
    shareApp: "Ndaje aplikacionin",
    shareAppSubtitle: "Tregoju miqve për Karburanti Sot",
    shareAppMessage: "Krahaso çmimet e karburanteve në Shqipëri dhe Europë me Karburanti Sot:",
    darkMode: "Modaliteti i errët",
    darkModeOn: "Aktiv",
    darkModeOff: "Joaktiv",
    language: "Gjuha",
    extraFeaturesOn: "Extra ON",
    dataSource: "Të dhënat & Burimet",
    rateApp: "Vlerëso aplikacionin",
    rateAppSubtitle: "Vlerëso në Google Play",
    feedbackSubtitle: "Na dërgo mendimet e tua",
    feedbackSupport: "Sugjerime & Mbështetje",
    toastThemeLight: "Kalove në temën e çelët",
    toastThemeDark: "Kalove në temën e errët",
    toastLanguageChanged: "Gjuha u përditësua",
    toastCurrencyEUR: "Monedha u vendos në EUR",
    toastCurrencyLocal: "Monedha u vendos në vendase",
    toastRefreshing: "Po rifreskohen të dhënat...",
    toastOpeningFeedback: "Po hapet feedback",
    toastOpeningStore: "Po hapet dyqani",
    toastRewardsUnlocked: "Veçoritë extra u zhbllokuan",
    toastRewardsLater: "Ndoshta më vonë",
    version: "Versioni",
    allCountries: "Të gjitha",
    favorites: "Të preferuarat",
    homeVerified: "Verifikuar",
    allFuelPrices: "Të gjitha çmimet",
    homeEuropeAverage: "Mesatarja evropiane",
    best: "Më i miri",
    savedSets: "Të ruajtura",
    compareSetsTitle: "Grupet e krahasimit",
    saveCurrentSet: "Ruaj grupin aktual",
    setNamePlaceholder: "Emri",
    save: "Ruaj",
    noSavedSets: "Ende nuk ka grupe të ruajtura.",
    spread: "Diferenca",
    nearest: "Më e afërta",
    current: "Aktual",
    searchAllCountries: "Kërko të gjitha shtetet",
    priceAlert: "Njoftim çmimi",
    saveAlert: "Ruaj njoftimin",
    keepCurrent: "Ruaj aktualin",
    loading: "Po ngarkohet…",
    fxUnavailable: "Kursi s'disponohet",
    premiumInsights: "Inteligjencë e tregut në kohë reale",
    searchStations: "Kërko pika",
    stationSearchPlaceholder: "Kërko emër ose markë",
    filters: "Filtrat",
    openNowOnly: "Hapur tani",
    favoriteOnly: "Të preferuarat",
    allStations: "Të gjitha pikat",
    directions: "Udhëzimet",
    withinRadius: (radius: number) => `Brenda ${radius} km`,
    noStationMatches: "Asnjë pikë nuk përputhet me filtrat.",
    clearFilters: "Pastro filtrat",
    locationAccess: "Qasja në vendndodhje",
    compareOverview: "Përmbledhja e krahasimit",
    bestValue: "Vlera më e mirë",
    selectedCountries: "Shtetet e zgjedhura",
    differenceFromBest: "Mbi më të mirën",
    sevenDays: "7 ditë",
    thirtyDays: "30 ditë",
    trendComparison: "Lëvizja e çmimeve",
    trendMovedUp: (country: string) => `${country} u rrit më shumë në këtë periudhë.`,
    trendMovedDown: (country: string) => `${country} u ul më shumë në këtë periudhë.`,
    trendHeldSteady: "Çmimet mbetën përgjithësisht të qëndrueshme.",
    saveTwoCountries: "Zgjidh të paktën dy shtete për ta ruajtur grupin.",
    compareLimitHint: (n: number) => `Krahaso deri në ${n} shtete në këtë sesion.`,
    leaderboard: "Renditja evropiane",
    cheapestMode: "Më të lirat",
    expensiveMode: "Më të shtrenjtat",
    yourPosition: "Pozicioni yt",
    manageFavorites: "Menaxho të preferuarat",
    toastCountrySelected: (country: string) => `${country} u zgjodh`,
    preferences: "Preferencat",
    dataHealth: "Gjendja e të dhënave",
    liveData: "Të dhëna live",
    cachedData: "Të dhëna nga memoria",
    themeSystem: "Sistemi",
    followDeviceTheme: "Ndiq pamjen e pajisjes",
    chooseLanguage: "Zgjidh gjuhën",
    chooseCurrency: "Zgjidh monedhën",
    lastSync: "Sinkronizimi i fundit",
    openSource: "Hap burimin",
    appSupport: "Mbështetje & ndarje",
    openSettings: "Hap cilësimet",
    locationPermissionDenied: "Qasja në vendndodhje është çaktivizuar",
    locationPermissionDeniedHint: "Aktivizo vendndodhjen te cilësimet e pajisjes për të gjetur pikat pranë teje.",
    locationUnavailable: "Vendndodhja nuk disponohet",
    locationUnavailableHint: "Nuk mundëm ta përcaktonim vendndodhjen. Kontrollo lidhjen dhe provo përsëri.",
    stationsLoadError: "Pikat nuk mund të ngarkoheshin. Tërhiq për të rifreskuar ose provo përsëri.",
    stationsTimeoutCached: "Shërbimi i pikave nuk u përgjigj në kohë. Po shfaqen rezultatet e ruajtura.",
    linkUnavailable: "Kjo lidhje nuk është e disponueshme tani.",
    dataUnavailable: "Të dhënat nuk disponohen",
    monthsShort: ["jan", "shk", "mar", "pri", "maj", "qer", "korr", "gush", "sht", "tet", "nën", "dhj"],
    ordinalCheapest: (rank: number, total: number) => `Vendi ${rank} nga ${total} për çmim më të lirë`,
    changeCountryA11y: (country: string) => `${country}, ndrysho shtetin`,
    saveMarketA11y: (country: string) => `Ruaj ${country} te tregjet e tua`,
    unsaveMarketA11y: (country: string) => `Hiq ${country} nga tregjet e tua`,
    pricesOf: (date: string) => `Çmimet e ${date}`,
    freshSynced: "sinkronizuar",
    freshChecking: "po kontrollohet",
    freshStale: "pa publikim më të ri",
    offlineCopy: (saved: string) => `Kopje offline · ruajtur ${saved}`,
    refreshFailed: "Rifreskimi dështoi",
    loadingPrices: "Po ngarkohen çmimet…",
    notReported: "Nuk raportohet",
    perLitre: "për litër",
    aboveEuropeBy: (amount: string) => `${amount} mbi mesataren evropiane`,
    belowEuropeBy: (amount: string) => `${amount} nën mesataren evropiane`,
    atEuropeAverage: "Në mesataren evropiane",
    outsideEuropeRank: "Jashtë renditjes evropiane",
    weekChange: (amount: string) => `${amount} këtë javë`,
    weekFlat: "E pandryshuar këtë javë",
    localRateUnavailable: "Kursi lokal mungon · në EUR",
    alertAction: "Njoftim",
    alertBelowShort: (amount: string) => `Nën ${amount}`,
    alertAboveShort: (amount: string) => `Mbi ${amount}`,
    alertBelow: "Nën",
    alertAbove: "Mbi",
    alertRuleBelow: "Më njofto kur çmimi bie nën",
    alertRuleAbove: "Më njofto kur çmimi rritet mbi",
    alertTargetLabel: "Çmimi i synuar, EUR për litër",
    alertNow: (amount: string) => `Tani ${amount}`,
    alertInvalid: "Shkruaj një çmim mbi zero.",
    shareAction: "Shpërndaj",
    shareMessage: (fuel: string, country: string, price: string, date: string) => `${fuel} në ${country}: ${price}\nÇmimet e ${date}`,
    compareAction: "Krahaso",
    compareMarketA11y: (country: string) => `Krahaso ${country} me tregje të tjera`,
    savedMarkets: "Tregjet e ruajtura",
    savedMarketsEmpty: "Ruaj tregjet ku udhëton",
    addMarket: "Shto treg",
    marketPulse: "Pulsi i tregut",
    movement: (days: number) => `Lëvizja · ${days} ditët e fundit`,
    movementRange: (low: string, high: string) => `Intervali ${low} – ${high}`,
    movementMissing: "Historiku i çmimeve nuk disponohet ende për këtë treg.",
    positionInEurope: "Pozicioni në Evropë",
    europeAverageIs: (amount: string) => `Mesatarja evropiane ${amount}`,
    cheapestShort: "Më i liri",
    dearestShort: "Më i shtrenjti",
    lastSyncAt: (when: string) => `Sinkronizimi i fundit ${when}`,
    sourceIs: (source: string) => `Burimi: ${source}`,
    unlockExtras: "Zhblloko shtesat",
    extrasTitle: "Shtesat",
    extrasDetail: "Shiko një reklamë të shkurtër për të zhbllokuar veçori shtesë për 30 minuta",
    extrasActive: (minutes: number) => `Zhbllokuar · ${minutes} min mbetur`,
  },
};
