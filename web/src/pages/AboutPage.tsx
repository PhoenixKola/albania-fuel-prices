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
          Unlike most price-comparison sites, our entire data pipeline is public: the collection
          scripts, the processing code, and every day of price history are published in an{" "}
          <a
            href="https://github.com/PhoenixKola/albania-fuel-prices"
            target="_blank"
            rel="noopener noreferrer"
            className="inlineLink"
          >
            open-source repository on GitHub
          </a>
          . Anyone can inspect exactly how the numbers on this site are produced, or download the
          raw dataset and verify them independently.
        </p>
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
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Data and editorial principles</h2>
        <p className="contentBody">
          We follow a set of principles in how we handle data and write content:
        </p>
        <ul className="contentList">
          <li><strong>Accuracy first:</strong> Data is sourced from established public fuel price aggregators. We do not invent, estimate, or round values.</li>
          <li><strong>Transparency:</strong> Every page explains where data comes from, how it is processed, and what its limitations are. We link to the <Link to="/methodology" className="inlineLink">methodology page</Link> frequently.</li>
          <li><strong>Original commentary:</strong> All editorial text is written in-house. We do not copy or paraphrase content from data sources. We use their data values and add our own context.</li>
          <li><strong>Clear limitations:</strong> We state clearly that prices are country-level references, not guaranteed station prices. We explain update timing and source freshness.</li>
          <li><strong>No false precision:</strong> We avoid implying that users will see these exact prices at the pump. The language always frames values as references, estimates, or guidance.</li>
        </ul>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">How corrections are handled</h2>
        <p className="contentBody">
          If you notice a price that appears incorrect, a broken feature, or misleading content, please report it via the <Link to="/contact" className="inlineLink">contact page</Link>. We verify all reports against upstream data sources before making changes. If the error is in our processing or display logic, we fix it and note the correction. If the error originates from the upstream source, we note the discrepancy and monitor for source updates.
        </p>
        <p className="contentBody">
          We do not alter data values to match user expectations — we display what the source reports and explain any discrepancies transparently.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Useful links</h2>
        <ul className="contentList">
          <li><Link to="/methodology" className="inlineLink">Methodology</Link> — full data pipeline explanation</li>
          <li><Link to="/privacy" className="inlineLink">Privacy Policy</Link> — how we handle your information</li>
          <li><Link to="/terms" className="inlineLink">Terms of Use</Link> — data limitations and acceptable use</li>
          <li><Link to="/europe-fuel-comparison" className="inlineLink">Europe fuel comparison</Link> — regional price analysis</li>
          <li><Link to="/contact" className="inlineLink">Contact</Link> — reach us with corrections or feedback</li>
        </ul>
      </section>
    </article>
  );
}
