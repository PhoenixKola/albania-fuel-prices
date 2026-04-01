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
            {/* <Link to="/stations" className="footerLink">{t.navStations}</Link>
            <Link to="/compare" className="footerLink">{t.navCompare}</Link>
            <Link to="/rankings" className="footerLink">{t.navRankings}</Link> */}
            <Link to="/about" className="footerLink">{t.navAbout}</Link>
            <Link to="/contact" className="footerLink">{t.navContact}</Link>
            <Link to="/privacy" className="footerLink">{t.navPrivacy}</Link>
            <Link to="/terms" className="footerLink">{t.navTerms}</Link>
          </nav>
        </div>

        <div className="footerBottom">
          <p className="footerCopyright">{t.footerCopyright(year)}</p>
        </div>
      </div>
    </footer>
  );
}
