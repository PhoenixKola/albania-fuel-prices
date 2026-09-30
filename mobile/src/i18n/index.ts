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
  rankingsExpensiveSubtitle: (fuel: string) => string;
  yourRank: (n: number) => string;

  compareTitle: string;
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
  stationsNearbyGettingLocation: string;
  stationsNearbyOpen: string;
  stationsNearbyOpenNow: string;
  stationsNearbyHoursUnknown: string;
  stationsTryWiderRadius: string;
  tapToSwitch: string;
  quickSwitchEmpty: string;
  unlockTitle: (m: number) => string;
  unlockStations: string;
  unlockCompare: string;
  unlockRankings: string;
  watchVideo: string;
  continueWithout: string;
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

  scopeEurope: string;
  scopeWorld: string;
  rankingsCheapSubtitle: (fuel: string) => string;
  rankingsFavoritesTitle: string;
  rankingsFavoritesSubtitle: (fuel: string) => string;
  rankingsAroundYouTitle: string;
  rankingsAroundYouSubtitle: string;
  yourRankInFavorites: (n: number) => string;
  notInFavoritesRank: string;
  addFavoritesToUseFavoritesRanking: string;
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

  // Compare sets, alerts and quick-switch labels
  best: string;
  setNamePlaceholder: string;
  save: string;
  noSavedSets: string;
  spread: string;
  current: string;
  searchAllCountries: string;
  priceAlert: string;
  saveAlert: string;
  keepCurrent: string;
  loading: string;
  fxUnavailable: string;
  searchStations: string;
  stationSearchPlaceholder: string;
  filters: string;
  favoriteOnly: string;
  directions: string;
  withinRadius: (radius: number) => string;
  noStationMatches: string;
  clearFilters: string;
  selectedCountries: string;
  sevenDays: string;
  thirtyDays: string;
  trendComparison: string;
  trendMovedUp: (country: string) => string;
  trendMovedDown: (country: string) => string;
  trendHeldSteady: string;
  saveTwoCountries: string;
  compareLimitHint: (n: number) => string;
  manageFavorites: string;
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
  // Stations
  nearestStation: string;
  closestMatch: string;
  unnamedStation: string;
  straightLine: string;
  hoursOpen24: string;
  hoursClosedNow: string;
  hoursClosesAt: (time: string) => string;
  hoursOpensAt: (time: string) => string;
  hoursListedNote: string;
  stationsSourceNote: string;
  stationsWithin: (count: number, km: number) => string;
  stationsMatches: (count: number) => string;
  otherStations: string;
  stationsUpdatedAt: (time: string) => string;
  stationsSavedList: (time: string) => string;
  stationsLookingWithin: (km: number) => string;
  locationPrimerTitle: string;
  locationPrimerBody: string;
  allowLocation: string;
  stationsLoadFailedTitle: string;
  noStationsWithin: (km: number) => string;
  searchWithinKm: (km: number) => string;
  filtersA11y: (active: number) => string;
  filterShow: string;
  openNowFilterDetail: string;
  favoriteFilterDetail: string;
  searchRadius: string;
  radiusLockedDetail: string;
  done: string;
  directionsTo: (name: string) => string;
  saveStationA11y: (name: string) => string;
  unsaveStationA11y: (name: string) => string;
  removeFilterA11y: (name: string) => string;
  byListedHours: string;
  savedStation: string;
  // Compare
  compareKicker: (fuel: string, count: number) => string;
  cheapestIn: (country: string) => string;
  costsMore: (country: string, amount: string) => string;
  samePriceEverywhere: string;
  tankEstimate: (amount: string) => string;
  addOneMore: string;
  compareEmptyTitle: string;
  compareEmptyBody: (max: number) => string;
  quickPicks: string;
  moreThanCheapest: (amount: string) => string;
  europeRank: (rank: number, total: number) => string;
  noWeekData: string;
  fuelNotReported: (fuel: string) => string;
  removeMarketA11y: (country: string) => string;
  removedMarket: (country: string) => string;
  undo: string;
  marketsCount: (count: number, max: number) => string;
  unlockMoreMarkets: string;
  unlockMoreDetail: string;
  allSlotsUsed: (max: number) => string;
  hiddenMarkets: (count: number) => string;
  removeHidden: string;
  added: string;
  noCountryResults: string;
  savedComparisons: string;
  saveThisComparison: string;
  setNameReplaces: string;
  openSetA11y: (name: string) => string;
  deleteSetA11y: (name: string) => string;
  setTrimmed: (count: number) => string;
  setSaved: (name: string) => string;
  setUnavailable: string;
  trendNoData: string;
  trendChangeOver: (amount: string, days: number) => string;
  trendPeriodA11y: (days: number) => string;
  secondaryPriceA11y: (amount: string) => string;
  selectFuel: string;
  // Rankings
  yourMarket: string;
  rankOfEurope: (total: number) => string;
  rankOfFavorites: (total: number) => string;
  notRanked: (fuel: string) => string;
  notInFavorites: string;
  addToFavorites: string;
  removeFromFavorites: string;
  vsCheapest: (amount: string, country: string) => string;
  cheapestInScope: string;
  jumpToPosition: string;
  scopeLabel: string;
  orderCheapestFirst: string;
  orderExpensiveFirst: string;
  orderSwitchHint: string;
  orderLockedHint: string;
  ladderEurope: string;
  ladderFavorites: string;
  marketsInScope: (count: number) => string;
  rankRowA11y: (rank: number, total: number, country: string, price: string) => string;
  setAsMyMarket: string;
  addToCompare: string;
  inCompare: string;
  marketSet: (country: string) => string;
  addedToCompare: (country: string) => string;
  favoritesRankNote: string;
  // System messages
  alertSavedTitle: string;
  alertSavedBody: (fuel: string, country: string, direction: "below" | "above", amount: string) => string;
  alertFiredTitle: string;
  alertFiredBody: (fuel: string, country: string, direction: "below" | "above", amount: string) => string;
  noEmailTitle: string;
  noEmailBody: (email: string) => string;
  storeUnavailableTitle: string;
  storeUnavailableBody: string;
  feedbackSubject: string;
  feedbackBody: string;
  tabHomeShort: string;
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
    rankingsExpensiveSubtitle: (fuel: string) => `Most expensive countries for ${fuel}`,
    yourRank: (n: number) => `Your country rank: #${n}`,

    compareTitle: "Compare",
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
    stationsNearbyGettingLocation: "Getting location…",
    stationsNearbyOpen: "Open",
    stationsNearbyOpenNow: "Open now",
    stationsNearbyHoursUnknown: "Hours not listed",
    stationsTryWiderRadius: "Try a wider radius or refresh the station list.",
    tapToSwitch: "Tap a country to switch instantly.",
    quickSwitchEmpty: "Add favorites to switch countries in one tap.",
    unlockTitle: (m: number) => `Unlock bonus for ${m} min`,
    unlockStations: "Stations radius: unlock 30km + 50km",
    unlockCompare: "Compare: unlock up to 5 countries",
    unlockRankings: "Rankings: show most expensive too",
    watchVideo: "Watch video",
    continueWithout: "No thanks",
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

    scopeEurope: "Europe",
    scopeWorld: "World",
    rankingsCheapSubtitle: (fuel: string) => `Cheapest countries for ${fuel}`,
    rankingsFavoritesTitle: "Favorites ranking",
    rankingsFavoritesSubtitle: (fuel: string) => `Your favorites ranked by ${fuel}`,
    rankingsAroundYouTitle: "Around you",
    rankingsAroundYouSubtitle: "Your position with neighbors",
    yourRankInFavorites: (n: number) => `Your favorites rank: #${n}`,
    notInFavoritesRank: "Your country is not in your favorites list.",
    addFavoritesToUseFavoritesRanking: "Add at least 2 favorites to use Favorites ranking.",
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
    best: "Best",
    setNamePlaceholder: "Name",
    save: "Save",
    noSavedSets: "No saved sets yet.",
    spread: "Spread",
    current: "Current",
    searchAllCountries: "Search all countries",
    priceAlert: "Price alert",
    saveAlert: "Save alert",
    keepCurrent: "Keep current",
    loading: "Loading…",
    fxUnavailable: "FX unavailable",
    searchStations: "Search stations",
    stationSearchPlaceholder: "Search name or brand",
    filters: "Filters",
    favoriteOnly: "Favorites",
    directions: "Directions",
    withinRadius: (radius: number) => `Within ${radius} km`,
    noStationMatches: "No stations match these filters.",
    clearFilters: "Clear filters",
    selectedCountries: "Selected countries",
    sevenDays: "7 days",
    thirtyDays: "30 days",
    trendComparison: "Price movement",
    trendMovedUp: (country: string) => `${country} rose the most in this period.`,
    trendMovedDown: (country: string) => `${country} fell the most in this period.`,
    trendHeldSteady: "Prices were broadly stable in this period.",
    saveTwoCountries: "Select at least two countries to save this set.",
    compareLimitHint: (n: number) => `Compare up to ${n} countries in this session.`,
    manageFavorites: "Manage favorites",
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
    nearestStation: "Nearest station",
    closestMatch: "Closest match",
    unnamedStation: "Fuel station",
    straightLine: "straight-line distance",
    hoursOpen24: "Open 24 hours",
    hoursClosedNow: "Closed now",
    hoursClosesAt: (time: string) => `closes ${time}`,
    hoursOpensAt: (time: string) => `opens ${time}`,
    hoursListedNote: "Based on listed opening hours",
    stationsSourceNote:
      "Stations and opening hours come from OpenStreetMap and may miss holidays or temporary closures. Distances are straight-line, not driving routes.",
    stationsWithin: (count: number, km: number) => `${count} ${count === 1 ? "station" : "stations"} within ${km} km`,
    stationsMatches: (count: number) => `${count} ${count === 1 ? "match" : "matches"}`,
    otherStations: "More nearby",
    stationsUpdatedAt: (time: string) => `Updated ${time}`,
    stationsSavedList: (time: string) => `Saved list from ${time}`,
    stationsLookingWithin: (km: number) => `Looking for stations within ${km} km…`,
    locationPrimerTitle: "Find fuel near you",
    locationPrimerBody: "Allow location to list stations around you by distance. Your position is used only to look up nearby stations.",
    allowLocation: "Allow location",
    stationsLoadFailedTitle: "Couldn’t load stations",
    noStationsWithin: (km: number) => `No stations within ${km} km`,
    searchWithinKm: (km: number) => `Search within ${km} km`,
    filtersA11y: (active: number) => (active ? `Filters, ${active} active` : "Filters"),
    filterShow: "Show",
    openNowFilterDetail: "Hides stations without listed hours",
    favoriteFilterDetail: "Only stations you starred",
    searchRadius: "Search radius",
    radiusLockedDetail: "Unlock for 30 min with a short video",
    done: "Done",
    directionsTo: (name: string) => `Directions to ${name}`,
    saveStationA11y: (name: string) => `Save ${name} to favorites`,
    unsaveStationA11y: (name: string) => `Remove ${name} from favorites`,
    removeFilterA11y: (name: string) => `Remove filter: ${name}`,
    byListedHours: "according to listed hours",
    savedStation: "Saved",
    compareKicker: (fuel: string, count: number) => `${fuel} · ${count} ${count === 1 ? "market" : "markets"}`,
    cheapestIn: (country: string) => `${country} is cheapest`,
    costsMore: (country: string, amount: string) => `${country} costs ${amount} more per litre`,
    samePriceEverywhere: "Same price in every selected market",
    tankEstimate: (amount: string) => `≈ ${amount} more for a 50 L tank (estimate)`,
    addOneMore: "Add one more market to see the price gap.",
    compareEmptyTitle: "Compare fuel prices",
    compareEmptyBody: (max: number) => `Pick up to ${max} markets to see which is cheaper, by how much, and how prices are moving.`,
    quickPicks: "Quick picks",
    moreThanCheapest: (amount: string) => `${amount} more than the cheapest`,
    europeRank: (rank: number, total: number) => `#${rank} of ${total} in Europe`,
    noWeekData: "No weekly data",
    fuelNotReported: (fuel: string) => `${fuel} not reported`,
    removeMarketA11y: (country: string) => `Remove ${country} from comparison`,
    removedMarket: (country: string) => `${country} removed`,
    undo: "Undo",
    marketsCount: (count: number, max: number) => `${count} of ${max} markets`,
    unlockMoreMarkets: "Compare up to 5 markets",
    unlockMoreDetail: "Watch a short video to add 2 more slots for 30 min.",
    allSlotsUsed: (max: number) => `All ${max} slots in use`,
    hiddenMarkets: (count: number) =>
      `${count} saved ${count === 1 ? "market is" : "markets are"} hidden until extras are unlocked again.`,
    removeHidden: "Remove hidden",
    added: "Added",
    noCountryResults: "No countries match your search.",
    savedComparisons: "Saved comparisons",
    saveThisComparison: "Save this comparison",
    setNameReplaces: "A saved comparison with this name will be replaced.",
    openSetA11y: (name: string) => `Open ${name}`,
    deleteSetA11y: (name: string) => `Delete ${name}`,
    setTrimmed: (count: number) => `Opened the first ${count} markets`,
    setSaved: (name: string) => `Saved “${name}”`,
    setUnavailable: "None of these markets are in the current data.",
    trendNoData: "Not enough price history to compare movement yet.",
    trendChangeOver: (amount: string, days: number) => `${amount} over ${days} days`,
    trendPeriodA11y: (days: number) => `Show last ${days} days`,
    secondaryPriceA11y: (amount: string) => `also ${amount}`,
    selectFuel: "Fuel type",
    yourMarket: "Your market",
    rankOfEurope: (total: number) => `of ${total} in Europe`,
    rankOfFavorites: (total: number) => `of ${total} favorites`,
    notRanked: (fuel: string) => `No ${fuel} price is reported here, so it has no rank.`,
    notInFavorites: "Not in your favorites, so it isn’t ranked here.",
    addToFavorites: "Add to favorites",
    removeFromFavorites: "Remove from favorites",
    vsCheapest: (amount: string, country: string) => `${amount} more than ${country}, the cheapest`,
    cheapestInScope: "Cheapest in this ranking",
    jumpToPosition: "Jump to my position",
    scopeLabel: "Ranking scope",
    orderCheapestFirst: "Cheapest first",
    orderExpensiveFirst: "Most expensive first",
    orderSwitchHint: "Reverses the order of the ladder",
    orderLockedHint: "Most expensive first unlocks for 30 min with a short video.",
    ladderEurope: "Europe ladder",
    ladderFavorites: "Favorites ladder",
    marketsInScope: (count: number) => `${count} ${count === 1 ? "market" : "markets"}`,
    rankRowA11y: (rank: number, total: number, country: string, price: string) => `Rank ${rank} of ${total}, ${country}, ${price} per litre`,
    setAsMyMarket: "Set as my market",
    addToCompare: "Add to compare",
    inCompare: "Already in compare",
    marketSet: (country: string) => `${country} is now your market`,
    addedToCompare: (country: string) => `${country} added to compare`,
    favoritesRankNote: "Ranked only among your favorites, not all of Europe.",
    alertSavedTitle: "Price alert saved",
    alertSavedBody: (fuel: string, country: string, direction: "below" | "above", amount: string) =>
      `${fuel} in ${country}: we’ll notify you when it is ${direction === "below" ? "at or below" : "at or above"} ${amount}/L.`,
    alertFiredTitle: "Fuel price alert",
    alertFiredBody: (fuel: string, country: string, direction: "below" | "above", amount: string) =>
      `${fuel} in ${country} is now ${direction === "below" ? "at or below" : "at or above"} ${amount}/L.`,
    noEmailTitle: "No email app found",
    noEmailBody: (email: string) => `Please send your feedback to ${email}.`,
    storeUnavailableTitle: "Couldn’t open the store",
    storeUnavailableBody: "Open Google Play and search for Karburanti Sot.",
    feedbackSubject: "Feedback for Karburanti Sot",
    feedbackBody: "Hi! I have feedback:\n\n",
    tabHomeShort: "Home",
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
    rankingsExpensiveSubtitle: (fuel: string) => `Shtetet më të shtrenjta për ${fuel}`,
    yourRank: (n: number) => `Renditja e shtetit: #${n}`,

    compareTitle: "Krahaso",
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
    stationsNearbyGettingLocation: "Po merret vendndodhja…",
    stationsNearbyOpen: "Hap",
    stationsNearbyOpenNow: "Hapur tani",
    stationsNearbyHoursUnknown: "Orari s’është i shënuar",
    stationsTryWiderRadius: "Provo një rreze më të gjerë ose rifresko listën.",
    tapToSwitch: "Prek një shtet për ta ndërruar menjëherë.",
    quickSwitchEmpty: "Shto të preferuarat që t’i ndërroni shtetet me një prekje.",
    unlockTitle: (m: number) => `Zhblloko bonus për ${m} min`,
    unlockStations: "Rrezja e pikave: zhblloko 30km + 50km",
    unlockCompare: "Krahasimi: zhblloko deri në 5 shtete",
    unlockRankings: "Renditja: shfaq edhe më të shtrenjtat",
    watchVideo: "Shiko video",
    continueWithout: "Jo faleminderit",
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

    scopeEurope: "Europa",
    scopeWorld: "Bota",
    rankingsCheapSubtitle: (fuel: string) => `Shtetet më të lira për ${fuel}`,
    rankingsFavoritesTitle: "Renditja e të preferuarave",
    rankingsFavoritesSubtitle: (fuel: string) => `Të preferuarat sipas ${fuel}`,
    rankingsAroundYouTitle: "Rreth jush",
    rankingsAroundYouSubtitle: "Pozicioni juaj me fqinjët",
    yourRankInFavorites: (n: number) => `Renditja në të preferuarat: #${n}`,
    notInFavoritesRank: "Shteti juaj nuk është në listën e të preferuarave.",
    addFavoritesToUseFavoritesRanking: "Shto të paktën 2 të preferuara për këtë renditje.",
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
    best: "Më i miri",
    setNamePlaceholder: "Emri",
    save: "Ruaj",
    noSavedSets: "Ende nuk ka grupe të ruajtura.",
    spread: "Diferenca",
    current: "Aktual",
    searchAllCountries: "Kërko të gjitha shtetet",
    priceAlert: "Njoftim çmimi",
    saveAlert: "Ruaj njoftimin",
    keepCurrent: "Ruaj aktualin",
    loading: "Po ngarkohet…",
    fxUnavailable: "Kursi s'disponohet",
    searchStations: "Kërko pika",
    stationSearchPlaceholder: "Kërko emër ose markë",
    filters: "Filtrat",
    favoriteOnly: "Të preferuarat",
    directions: "Udhëzimet",
    withinRadius: (radius: number) => `Brenda ${radius} km`,
    noStationMatches: "Asnjë pikë nuk përputhet me filtrat.",
    clearFilters: "Pastro filtrat",
    selectedCountries: "Shtetet e zgjedhura",
    sevenDays: "7 ditë",
    thirtyDays: "30 ditë",
    trendComparison: "Lëvizja e çmimeve",
    trendMovedUp: (country: string) => `${country} u rrit më shumë në këtë periudhë.`,
    trendMovedDown: (country: string) => `${country} u ul më shumë në këtë periudhë.`,
    trendHeldSteady: "Çmimet mbetën përgjithësisht të qëndrueshme.",
    saveTwoCountries: "Zgjidh të paktën dy shtete për ta ruajtur grupin.",
    compareLimitHint: (n: number) => `Krahaso deri në ${n} shtete në këtë sesion.`,
    manageFavorites: "Menaxho të preferuarat",
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
    nearestStation: "Pika më e afërt",
    closestMatch: "Përputhja më e afërt",
    unnamedStation: "Pikë karburanti",
    straightLine: "distancë në vijë ajrore",
    hoursOpen24: "Hapur 24 orë",
    hoursClosedNow: "Mbyllur tani",
    hoursClosesAt: (time: string) => `mbyllet në ${time}`,
    hoursOpensAt: (time: string) => `hapet në ${time}`,
    hoursListedNote: "Sipas orarit të shënuar",
    stationsSourceNote:
      "Pikat dhe oraret vijnë nga OpenStreetMap dhe mund të mos përfshijnë festat ose mbylljet e përkohshme. Distancat janë në vijë ajrore, jo sipas rrugës.",
    stationsWithin: (count: number, km: number) => `${count} ${count === 1 ? "pikë" : "pika"} brenda ${km} km`,
    stationsMatches: (count: number) => `${count} ${count === 1 ? "rezultat" : "rezultate"}`,
    otherStations: "Të tjera afër",
    stationsUpdatedAt: (time: string) => `Përditësuar ${time}`,
    stationsSavedList: (time: string) => `Lista e ruajtur nga ${time}`,
    stationsLookingWithin: (km: number) => `Po kërkojmë pika brenda ${km} km…`,
    locationPrimerTitle: "Gjej karburant pranë teje",
    locationPrimerBody: "Lejo vendndodhjen për të parë pikat përreth, sipas distancës. Pozicioni yt përdoret vetëm për të kërkuar pikat afër.",
    allowLocation: "Lejo vendndodhjen",
    stationsLoadFailedTitle: "Pikat nuk u ngarkuan",
    noStationsWithin: (km: number) => `Asnjë pikë brenda ${km} km`,
    searchWithinKm: (km: number) => `Kërko brenda ${km} km`,
    filtersA11y: (active: number) => (active ? `Filtrat, ${active} aktivë` : "Filtrat"),
    filterShow: "Shfaq",
    openNowFilterDetail: "Fsheh pikat pa orar të shënuar",
    favoriteFilterDetail: "Vetëm pikat me yll",
    searchRadius: "Rrezja e kërkimit",
    radiusLockedDetail: "Zhblloko për 30 min me një video të shkurtër",
    done: "U krye",
    directionsTo: (name: string) => `Udhëzime për te ${name}`,
    saveStationA11y: (name: string) => `Ruaj ${name} te të preferuarat`,
    unsaveStationA11y: (name: string) => `Hiq ${name} nga të preferuarat`,
    removeFilterA11y: (name: string) => `Hiq filtrin: ${name}`,
    byListedHours: "sipas orarit të shënuar",
    savedStation: "E ruajtur",
    compareKicker: (fuel: string, count: number) => `${fuel} · ${count} ${count === 1 ? "treg" : "tregje"}`,
    cheapestIn: (country: string) => `${country} ka çmimin më të ulët`,
    costsMore: (country: string, amount: string) => `${country} kushton ${amount} më shumë për litër`,
    samePriceEverywhere: "I njëjti çmim në të gjitha tregjet e zgjedhura",
    tankEstimate: (amount: string) => `≈ ${amount} më shumë për një depozitë 50 L (vlerësim)`,
    addOneMore: "Shto edhe një treg për të parë diferencën e çmimit.",
    compareEmptyTitle: "Krahaso çmimet e karburantit",
    compareEmptyBody: (max: number) => `Zgjidh deri në ${max} tregje për të parë cili është më i lirë, sa më i lirë dhe si lëvizin çmimet.`,
    quickPicks: "Zgjedhje të shpejta",
    moreThanCheapest: (amount: string) => `${amount} më shumë se më i liri`,
    europeRank: (rank: number, total: number) => `#${rank} nga ${total} në Europë`,
    noWeekData: "Pa të dhëna javore",
    fuelNotReported: (fuel: string) => `${fuel} nuk raportohet`,
    removeMarketA11y: (country: string) => `Hiq ${country} nga krahasimi`,
    removedMarket: (country: string) => `${country} u hoq`,
    undo: "Zhbëj",
    marketsCount: (count: number, max: number) => `${count} nga ${max} tregje`,
    unlockMoreMarkets: "Krahaso deri në 5 tregje",
    unlockMoreDetail: "Shiko një video të shkurtër për 2 vende më shumë për 30 min.",
    allSlotsUsed: (max: number) => `Të ${max} vendet janë në përdorim`,
    hiddenMarkets: (count: number) =>
      count === 1
        ? "1 treg i ruajtur është i fshehur derisa të zhbllokohen sërish shtesat."
        : `${count} tregje të ruajtura janë të fshehura derisa të zhbllokohen sërish shtesat.`,
    removeHidden: "Hiq të fshehurat",
    added: "Shtuar",
    noCountryResults: "Asnjë shtet nuk përputhet me kërkimin.",
    savedComparisons: "Krahasimet e ruajtura",
    saveThisComparison: "Ruaj këtë krahasim",
    setNameReplaces: "Krahasimi i ruajtur me këtë emër do të zëvendësohet.",
    openSetA11y: (name: string) => `Hap ${name}`,
    deleteSetA11y: (name: string) => `Fshi ${name}`,
    setTrimmed: (count: number) => `U hapën ${count} tregjet e para`,
    setSaved: (name: string) => `U ruajt “${name}”`,
    setUnavailable: "Asnjë nga këto tregje nuk është në të dhënat aktuale.",
    trendNoData: "Ende s’ka histori të mjaftueshme çmimesh për të krahasuar lëvizjen.",
    trendChangeOver: (amount: string, days: number) => `${amount} në ${days} ditë`,
    trendPeriodA11y: (days: number) => `Shfaq ${days} ditët e fundit`,
    secondaryPriceA11y: (amount: string) => `gjithashtu ${amount}`,
    selectFuel: "Lloji i karburantit",
    yourMarket: "Tregu yt",
    rankOfEurope: (total: number) => `nga ${total} në Europë`,
    rankOfFavorites: (total: number) => `nga ${total} të preferuarat`,
    notRanked: (fuel: string) => `Këtu nuk raportohet çmim për ${fuel}, ndaj s’ka renditje.`,
    notInFavorites: "Nuk është te të preferuarat, ndaj nuk renditet këtu.",
    addToFavorites: "Shto te të preferuarat",
    removeFromFavorites: "Hiq nga të preferuarat",
    vsCheapest: (amount: string, country: string) => `${amount} më shumë se ${country}, më i liri`,
    cheapestInScope: "Më i liri në këtë renditje",
    jumpToPosition: "Shko te pozicioni im",
    scopeLabel: "Fusha e renditjes",
    orderCheapestFirst: "Më të lirat së pari",
    orderExpensiveFirst: "Më të shtrenjtat së pari",
    orderSwitchHint: "Kthen renditjen e shkallës",
    orderLockedHint: "“Më të shtrenjtat së pari” zhbllokohet për 30 min me një video të shkurtër.",
    ladderEurope: "Shkalla e Europës",
    ladderFavorites: "Shkalla e të preferuarave",
    marketsInScope: (count: number) => `${count} ${count === 1 ? "treg" : "tregje"}`,
    rankRowA11y: (rank: number, total: number, country: string, price: string) => `Vendi ${rank} nga ${total}, ${country}, ${price} për litër`,
    setAsMyMarket: "Vendose si tregun tim",
    addToCompare: "Shto te krahasimi",
    inCompare: "Është tashmë në krahasim",
    marketSet: (country: string) => `${country} është tani tregu yt`,
    addedToCompare: (country: string) => `${country} u shtua te krahasimi`,
    favoritesRankNote: "Renditur vetëm mes të preferuarave, jo në gjithë Europën.",
    alertSavedTitle: "Alarmi i çmimit u ruajt",
    alertSavedBody: (fuel: string, country: string, direction: "below" | "above", amount: string) =>
      `${fuel} në ${country}: do të njoftohesh kur çmimi të jetë ${direction === "below" ? "në ose nën" : "në ose mbi"} ${amount}/L.`,
    alertFiredTitle: "Alarm për çmimin e karburantit",
    alertFiredBody: (fuel: string, country: string, direction: "below" | "above", amount: string) =>
      `${fuel} në ${country} tani është ${direction === "below" ? "në ose nën" : "në ose mbi"} ${amount}/L.`,
    noEmailTitle: "Nuk u gjet aplikacion email-i",
    noEmailBody: (email: string) => `Të lutem dërgoje komentin te ${email}.`,
    storeUnavailableTitle: "Dyqani nuk u hap",
    storeUnavailableBody: "Hap Google Play dhe kërko Karburanti Sot.",
    feedbackSubject: "Koment për Karburanti Sot",
    feedbackBody: "Përshëndetje! Kam një koment:\n\n",
    tabHomeShort: "Kreu",
  },
};
