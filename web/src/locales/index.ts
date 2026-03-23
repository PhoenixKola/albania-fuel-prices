import type { Lang } from "../models/i18n";
import { en } from "./en";
import { sq } from "./sq";

export type TDict = {
  title: string;
  subtitleAsOf: (d: string) => string;
  subtitleLoading: string;
  region: (r: string) => string;
  selectCountry: string;
  gasoline95: string;
  diesel: string;
  lpg: string;
  updated: (s: string) => string;
  source: string;
  open: string;
  refresh: string;
  refreshing: string;
  couldntLoad: string;
  tryAgain: string;
  hint: string;
  langEN: string;
  langSQ: string;

  currency: string;
  eurPerL: string;
  allPerL: string;
  exchangeRate: string;
  estimated: string;
  localEstimate: string;
  pickCity: string;
  cityBias: string;
  estimateNote: string;

  watchlist: string;
  addToWatchlist: string;
  remove: string;
  compare: string;
  openCountry: string;
  emptyWatchlist: string;

  rankings: string;
  cheapest: string;
  mostExpensive: string;
  fuelType: string;

  tools: string;
  tabFill: string;
  tabBudget: string;
  tabTrip: string;
  liters: string;
  cost: string;
  budget: string;
  youGet: string;
  distanceKm: string;
  consumption: string;
  litersNeeded: string;

  copy: string;
  copied: string;
  share: string;
  shareTextTitle: string;
  currencyMode: string;
  currencyEUR: string;
  currencyLocal: string;

  stationsNearbyTitle: string;
  stationsUseMyLocation: string;
  stationsGettingLocation: string;
  stationsRadius: string;
  stations2km: string;
  stations5km: string;
  stations10km: string;
  stationsFound: (n: number) => string;
  stationsOpen: string;
  stationsOpenNow: string;
  stationsClosed: string;
  stationsHoursUnknown: string;
  stationsRefresh: string;
  stationsNone: string;
  stationsShowing: (shown: number, total: number) => string;
  stationsShowMore: string;
  stationsShowAll: string;
  stationsCollapse: string;

  heroTitle: string;
  heroSubtitle: string;
  heroLiveFallback: string;
  heroUpdatedAt: (s: string) => string;

  editorialTitle: string;
  editorialEmpty: string;
  editorialLead: string;
  editorialCheapestPetrol: string;
  editorialMostExpensivePetrol: string;
  editorialPetrolSpread: string;
  editorialCheapestDiesel: string;
  editorialMostExpensiveDiesel: string;
  editorialDieselSpread: string;
  notAvailable: string;

  methodologyTitle: string;
  methodologyParagraph1: string;
  methodologyParagraph2: string;
  methodologyParagraph3: string;
  methodologyFuelSource: string;
  methodologyFxSource: string;
  methodologyUpdatePattern: string;
  methodologyFuelSourceDefault: string;
  methodologyFxSourceDefault: string;
  methodologyUpdateFrequencyDefault: string;

  faqTitle: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;
  faqQ5: string;
  faqA5: string;
  faqQ6: string;
  faqA6: string;

  watchlistGuidance: string;
  nearbyGuidance: string;

  sourceUpdatedLabel: string;
  sourceCardSubtitle: string;
  sourceCardInterpretationNote: string;
  sourceCardMethodologyNote: string;
  sourceUrlLabel: string;
};

export const i18n = {
  en: en satisfies TDict,
  sq: sq satisfies TDict,
} satisfies Record<Lang, TDict>;