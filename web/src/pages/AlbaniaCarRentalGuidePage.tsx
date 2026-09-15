import { TravelLinks } from "../components/content/TravelLinks";
import type { Lang } from "../models/i18n";
import type { LatestEurope } from "../models/fuel";
import { RentalGuideSections, RentalGuideSources, RentalGuideHighlights, TravelHeader, TripExample } from "../components/content/TravelContent";
import RentalReferral from "../components/ads/RentalReferral";
import AdsterraNativeAd from "../components/ads/AdsterraNativeAd";
import type { MonetizationConfig } from "../config/monetization";
import RoadStatusLink from "../components/road/RoadStatusLink";

export default function AlbaniaCarRentalGuidePage({ lang, data, config }: { lang: Lang; data: LatestEurope | null; config?: MonetizationConfig }) {
  return <article className="travelPage">
    <TravelHeader lang={lang} guide /><RentalGuideHighlights lang={lang} /><TravelLinks lang={lang} />
    <RentalGuideSections lang={lang} end={2} />
    <AdsterraNativeAd location="rental-guide-after-selection-sections" />
    <TripExample lang={lang} data={data} />
    <RoadStatusLink lang={lang} />
    <RentalReferral lang={lang} placement="guide" config={config} />
    <RentalGuideSections lang={lang} start={2} />
    <RentalGuideSources lang={lang} /><TravelLinks lang={lang} />
  </article>;
}
