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
  rankingsGuidance: string;

  sourceUpdatedLabel: string;
  sourceCardSubtitle: string;
  sourceCardInterpretationNote: string;
  sourceCardMethodologyNote: string;
  sourceUrlLabel: string;

  // Navigation & Footer
  navHome: string;
  navStations: string;
  navCompare: string;
  navRankings: string;
  navAbout: string;
  navContact: string;
  navPrivacy: string;
  navTerms: string;
  footerTagline: string;
  footerCopyright: (year: number) => string;

  // About page
  aboutTitle: string;
  aboutIntro: string;
  aboutMissionTitle: string;
  aboutMissionP1: string;
  aboutMissionP2: string;
  aboutDataTitle: string;
  aboutDataP1: string;
  aboutDataP2: string;
  aboutDataP3: string;
  aboutEditorialTitle: string;
  aboutEditorialP1: string;
  aboutEditorialP2: string;
  aboutWhoTitle: string;
  aboutWhoP1: string;
  aboutWhoP2: string;

  // Contact page
  contactTitle: string;
  contactIntro: string;
  contactEmailTitle: string;
  contactEmailValue: string;
  contactEmailNote: string;
  contactTopicsTitle: string;
  contactTopic1: string;
  contactTopic2: string;
  contactTopic3: string;
  contactTopic4: string;
  contactTopic5: string;
  contactResponseTitle: string;
  contactResponseP1: string;
  contactResponseP2: string;

  // Privacy page
  privacyTitle: string;
  privacyUpdated: string;
  privacyIntro: string;
  privacyCollectTitle: string;
  privacyCollectP1: string;
  privacyLocalTitle: string;
  privacyLocalP1: string;
  privacyFetchTitle: string;
  privacyFetchP1: string;
  privacyAdsTitle: string;
  privacyAdsP1: string;
  privacyAdItem1: string;
  privacyAdItem2: string;
  privacyAdItem3: string;
  privacyAdItem4: string;
  privacyAdsP2: string;
  privacyAnalyticsTitle: string;
  privacyAnalyticsP1: string;
  privacySharingTitle: string;
  privacySharingP1: string;
  privacySecurityTitle: string;
  privacySecurityP1: string;
  privacyChildrenTitle: string;
  privacyChildrenP1: string;
  privacyChangesTitle: string;
  privacyChangesP1: string;
  privacyContactTitle: string;
  privacyContactP1: string;

  // Terms page
  termsTitle: string;
  termsUpdated: string;
  termsIntro: string;
  termsServiceTitle: string;
  termsServiceP1: string;
  termsAccuracyTitle: string;
  termsAccuracyP1: string;
  termsAccuracyP2: string;
  termsAccuracyP3: string;
  termsUseTitle: string;
  termsUseP1: string;
  termsIpTitle: string;
  termsIpP1: string;
  termsLinksTitle: string;
  termsLinksP1: string;
  termsAdsTitle: string;
  termsAdsP1: string;
  termsLiabilityTitle: string;
  termsLiabilityP1: string;
  termsChangesTitle: string;
  termsChangesP1: string;
  termsContactTitle: string;
  termsContactP1: string;

  // 404 page
  notFoundTitle: string;
  notFoundSubtitle: string;
  notFoundMessage: string;
  notFoundButtonHome: string;

  // Guide navigation
  navMethodology: string;
  navHowPricesWork: string;
  navEuropeComparison: string;
  navRoadTripGuide: string;
  footerGuidesHeading: string;

  // Stations page editorial
  stationsEditorialTitle: string;
  stationsEditorialP1: string;
  stationsEditorialP2: string;
  stationsEditorialP3: string;
  stationsEditorialTipTitle: string;
  stationsEditorialTip: string;

  // Compare page editorial
  compareEditorialTitle: string;
  compareEditorialP1: string;
  compareEditorialP2: string;
  compareEditorialP3: string;
  compareEditorialTipTitle: string;
  compareEditorialTip: string;

  // Rankings page editorial
  rankingsEditorialTitle: string;
  rankingsEditorialP1: string;
  rankingsEditorialP2: string;
  rankingsEditorialP3: string;
  rankingsEditorialP4: string;

  // Methodology page
  methodologyPageTitle: string;
  methodologyPageIntro: string;
  methodologySourcesTitle: string;
  methodologySourcesP1: string;
  methodologySourcesP2: string;
  methodologyProcessTitle: string;
  methodologyProcessP1: string;
  methodologyProcessP2: string;
  methodologyFxTitle: string;
  methodologyFxP1: string;
  methodologyFxP2: string;
  methodologyAccuracyTitle: string;
  methodologyAccuracyP1: string;
  methodologyAccuracyP2: string;
  methodologyUpdateTitle: string;
  methodologyUpdateP1: string;
  methodologyEditorialTitle: string;
  methodologyEditorialP1: string;
  methodologyEditorialP2: string;
  methodologyOpenTitle: string;
  methodologyOpenP1: string;

  // How Fuel Prices Work page
  howPricesTitle: string;
  howPricesIntro: string;
  howPricesCrudeTitle: string;
  howPricesCrudeP1: string;
  howPricesCrudeP2: string;
  howPricesRefiningTitle: string;
  howPricesRefiningP1: string;
  howPricesRefiningP2: string;
  howPricesDistributionTitle: string;
  howPricesDistributionP1: string;
  howPricesDistributionP2: string;
  howPricesTaxTitle: string;
  howPricesTaxP1: string;
  howPricesTaxP2: string;
  howPricesTaxP3: string;
  howPricesRetailTitle: string;
  howPricesRetailP1: string;
  howPricesRetailP2: string;
  howPricesSeasonalTitle: string;
  howPricesSeasonalP1: string;
  howPricesSeasonalP2: string;
  howPricesSummaryTitle: string;
  howPricesSummaryP1: string;

  // Europe Fuel Comparison page
  europeCompTitle: string;
  europeCompIntro: string;
  europeCompWhyTitle: string;
  europeCompWhyP1: string;
  europeCompWhyP2: string;
  europeCompRegionsTitle: string;
  europeCompRegionsP1: string;
  europeCompRegionsP2: string;
  europeCompRegionsP3: string;
  europeCompRegionsP4: string;
  europeCompDieselVsPetrolTitle: string;
  europeCompDieselVsPetrolP1: string;
  europeCompDieselVsPetrolP2: string;
  europeCompLpgTitle: string;
  europeCompLpgP1: string;
  europeCompBorderTitle: string;
  europeCompBorderP1: string;
  europeCompBorderP2: string;
  europeCompExchangeTitle: string;
  europeCompExchangeP1: string;
  europeCompSummaryTitle: string;
  europeCompSummaryP1: string;

  // Road Trip Fuel Guide page
  roadTripTitle: string;
  roadTripIntro: string;
  roadTripCalcTitle: string;
  roadTripCalcP1: string;
  roadTripCalcP2: string;
  roadTripConsumptionTitle: string;
  roadTripConsumptionP1: string;
  roadTripConsumptionP2: string;
  roadTripConsumptionP3: string;
  roadTripCrossBorderTitle: string;
  roadTripCrossBorderP1: string;
  roadTripCrossBorderP2: string;
  roadTripCrossBorderP3: string;
  roadTripPaymentTitle: string;
  roadTripPaymentP1: string;
  roadTripPaymentP2: string;
  roadTripSavingsTitle: string;
  roadTripSavingsP1: string;
  roadTripSavingsP2: string;
  roadTripSavingsP3: string;
  roadTripSavingsP4: string;
  roadTripSavingsP5: string;
  roadTripExampleTitle: string;
  roadTripExampleP1: string;
  roadTripExampleP2: string;
  roadTripExampleP3: string;
  roadTripSummaryTitle: string;
  roadTripSummaryP1: string;
};

export const i18n = {
  en: en satisfies TDict,
  sq: sq satisfies TDict,
} satisfies Record<Lang, TDict>;