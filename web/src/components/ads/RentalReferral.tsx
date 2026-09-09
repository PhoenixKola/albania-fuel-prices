import type { Lang } from "../../models/i18n";
import { monetization, type MonetizationConfig, type RentalPlacement } from "../../config/monetization";
import { travelCopy } from "../../config/travelCopy";
export default function RentalReferral({ lang, placement, config = monetization }: { lang: Lang; placement: RentalPlacement; config?: MonetizationConfig }) {
  const href = config.rentalLinks[placement];
  if (!href) return null;
  const c = travelCopy[lang];
  return <aside className="rentalReferral" aria-label={c.affiliateLabel} data-rental-placement={placement}>
    <div><span className="travelEyebrow">{c.affiliateLabel} · DiscoverCars</span><h2>{c.affiliateTitle}</h2><p>{c.affiliateText}</p></div>
    <a className="btn btn-primary" href={href} target="_blank" rel="sponsored noopener">{c.affiliateCta} ↗</a>
    <p className="rentalDisclosure">{c.disclosure}</p>
  </aside>;
}
