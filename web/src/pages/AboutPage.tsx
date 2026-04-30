import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function AboutPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.aboutTitle}</h1>
      <p className="contentBody">{t.aboutIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.aboutMissionTitle}</h2>
        <p className="contentBody">{t.aboutMissionP1}</p>
        <p className="contentBody">{t.aboutMissionP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.aboutDataTitle}</h2>
        <p className="contentBody">{t.aboutDataP1}</p>
        <p className="contentBody">{t.aboutDataP2}</p>
        <p className="contentBody">{t.aboutDataP3}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.aboutEditorialTitle}</h2>
        <p className="contentBody">{t.aboutEditorialP1}</p>
        <p className="contentBody">{t.aboutEditorialP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.aboutWhoTitle}</h2>
        <p className="contentBody">{t.aboutWhoP1}</p>
        <p className="contentBody">
          {t.aboutWhoP2}{" "}
          <Link to="/contact" className="inlineLink">{t.navContact}</Link>
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Who this website is for</h2>
        <p className="contentBody">
          Fuel Today is built for everyday drivers, commuters, logistics operators, and travelers who need a practical fuel-price comparison reference for Albania and Europe. It is especially useful when planning regional routes where fuel costs can change significantly across borders.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">What value this tool provides</h2>
        <p className="contentBody">
          The value is not just a number table. The site combines fuel data, route-oriented guides, and methodology notes so users can make better-informed decisions with clear limitations and transparent sourcing.
        </p>
        <p className="contentBody">
          For data policy details, see <Link to="/privacy" className="inlineLink">Privacy</Link> and <Link to="/terms" className="inlineLink">Terms</Link>.
        </p>
      </section>
    </article>
  );
}
