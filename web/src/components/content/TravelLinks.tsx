import type { Lang } from "../../models/i18n";
import { travelLabels } from "../../config/travelLabels";

export function TravelLinks({ lang }: { lang: Lang }) {
  const c = travelLabels[lang];
  return <nav className="travelLinks" aria-label={c.related}>
    <a className="editorialAction editorialActionPrimary" href="/trip-cost-calculator">{c.openCalculator} →</a>
    <a className="editorialAction" href="/albania-car-rental-guide">{c.openGuide} →</a>
  </nav>;
}

