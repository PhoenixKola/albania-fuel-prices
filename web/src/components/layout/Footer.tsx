import { Link } from "react-router-dom";
import type { TDict } from "../../locales";

type Props = {
  t: TDict;
};

export default function Footer({ t }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div className="footerTop">
          <div className="footerBrand">
            <div className="footerSiteName">{t.title}</div>
            <p className="footerTagline">{t.footerTagline}</p>
          </div>

          <nav className="footerNav" aria-label="Footer navigation">
            <Link to="/" className="footerLink">{t.navHome}</Link>
            <Link to="/about" className="footerLink">{t.navAbout}</Link>
            <Link to="/contact" className="footerLink">{t.navContact}</Link>
            <Link to="/privacy" className="footerLink">{t.navPrivacy}</Link>
            <Link to="/terms" className="footerLink">{t.navTerms}</Link>
          </nav>

          <nav className="footerNav" aria-label="Guide navigation">
            <span className="footerNavHeading">{t.footerGuidesHeading}</span>
            <Link to="/methodology" className="footerLink">{t.navMethodology}</Link>
            <Link to="/how-fuel-prices-work" className="footerLink">{t.navHowPricesWork}</Link>
            <Link to="/europe-fuel-comparison" className="footerLink">{t.navEuropeComparison}</Link>
            <Link to="/road-trip-fuel-guide" className="footerLink">{t.navRoadTripGuide}</Link>
          </nav>
        </div>

        <div className="footerBottom">
          <p className="footerCopyright">{t.footerCopyright(year)}</p>
        </div>
      </div>
    </footer>
  );
}
