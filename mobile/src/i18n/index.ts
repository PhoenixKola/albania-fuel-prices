export type Lang = "en" | "sq";

export type TDict = {
  title: string;
  subtitleAsOf: (d: string) => string;
  subtitleLoading: string;
  fetching: string;
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
};

export const i18n: Record<Lang, TDict> = {
  en: {
    title: "Europe Fuel Prices",
    subtitleAsOf: (d: string) => `As of ${d}`,
    subtitleLoading: "Loading latest data…",
    fetching: "Fetching latest data…",
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
  },
  sq: {
    title: "Çmimet e Karburanteve në Europë",
    subtitleAsOf: (d: string) => `Data: ${d}`,
    subtitleLoading: "Po ngarkohen të dhënat…",
    fetching: "Po shkarkohen të dhënat…",
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
  },
};