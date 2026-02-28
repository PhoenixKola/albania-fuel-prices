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
  stationsRefresh: string;
  stationsNone: string;
  stationsShowing: (shown: number, total: number) => string;
  stationsShowMore: string;
  stationsShowAll: string;
  stationsCollapse: string;
};

export const i18n = {
  en: en satisfies TDict,
  sq: sq satisfies TDict,
} satisfies Record<Lang, TDict>;