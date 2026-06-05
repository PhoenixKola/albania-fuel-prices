import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function EditorialPolicyPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">Editorial Policy</h1>
      <p className="contentBody">
        Last updated: June 2026
      </p>
      <p className="contentBody">
        Karburanti Sot publishes fuel price data and editorial context to help drivers,
        commuters, and travelers make informed decisions. This page explains how we
        select, produce, and maintain that content.
      </p>

      <section className="contentSection">
        <h2 className="contentHeading">Our editorial mission</h2>
        <p className="contentBody">
          Our goal is to present publicly available fuel price data in a form that is
          accurate, transparent, and practically useful. We do not inflate or minimize
          price differences for any commercial reason. Every editorial comment —
          whether identifying the cheapest country or explaining why prices differ —
          is derived directly from the underlying data and publicly available market
          knowledge, not from commercial arrangements with fuel companies, governments,
          or advertisers.
        </p>
        <p className="contentBody">
          We write for drivers and travelers who need to make real-world decisions:
          where to refuel on a cross-border trip, how much a road trip will cost, and
          how Albania's prices compare with nearby countries. Content is written to be
          understandable by a general audience, not an expert one.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Data sourcing standards</h2>
        <p className="contentBody">
          All fuel price data displayed on this site comes from publicly available
          third-party sources. We do not manufacture or estimate price data. The
          sources used are programmatically fetched and normalized into a consistent
          format for comparison. The specific sources in use are described in the{" "}
          <Link to="/methodology" className="inlineLink">Methodology</Link> page.
        </p>
        <p className="contentBody">
          We do not accept sponsored data feeds or data contributions from fuel
          retailers, fuel companies, or government agencies in exchange for favorable
          presentation. If an upstream source is changed — for example, because a
          provider has stopped publishing, changed format, or been found unreliable —
          we will update the methodology page to reflect that change.
        </p>
        <p className="contentBody">
          Exchange-rate conversions are sourced from a public FX API. Converted values
          are labeled clearly and are treated as estimates, not guaranteed pump prices
          or financial rates.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Editorial independence</h2>
        <p className="contentBody">
          Karburanti Sot is funded through display advertising (Google AdSense and
          Google AdMob). Advertising revenue does not influence which countries are
          covered, how prices are presented, or what editorial commentary is written.
          Ads are visually separated from content and are never embedded within
          editorial text in a misleading way.
        </p>
        <p className="contentBody">
          We do not accept paid placements, sponsored articles, or native advertising.
          If a fuel company, travel service, or third party approaches us about
          commercial content, it is declined. Advertising on the site means buying
          display ad space through the standard Google advertising network — nothing
          more.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Accuracy standards</h2>
        <p className="contentBody">
          We present country-level fuel prices as public reference values, not as
          guarantees of the exact price at any specific station. The distinction
          between a national average and a station price is explained clearly on the
          home page, the methodology page, and within individual country guides. We
          believe users who understand this distinction make better decisions than
          users who are given a false sense of exactness.
        </p>
        <p className="contentBody">
          When a fuel type value is absent from our upstream source for a specific
          country, we display it as unavailable rather than interpolating or guessing.
          We do not fill data gaps with estimates that would mislead users about market
          conditions.
        </p>
        <p className="contentBody">
          Editorial descriptions of market conditions — such as "Albania has one of the
          lowest petrol prices in the region" or "tax accounts for over half the pump
          price in many EU countries" — are backed by the publicly available data
          visible on the site and well-documented public knowledge of fuel taxation in
          Europe. We do not make editorial claims that go beyond what the data
          supports.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Update frequency</h2>
        <p className="contentBody">
          Country-level fuel price data is updated as new data becomes available from
          upstream sources. Some countries publish weekly; others publish less
          frequently. The timestamp shown in the data tool reflects when the dataset
          was last refreshed. We do not back-date or delay publication.
        </p>
        <p className="contentBody">
          Editorial content — including country guides, comparison articles, and FAQ
          text — is reviewed and updated when market conditions, tax law, or upstream
          source coverage changes significantly. Page-level "last updated" dates are
          added to time-sensitive articles.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Corrections policy</h2>
        <p className="contentBody">
          We take data accuracy seriously. If you identify an error — a price that
          looks wrong for a specific country, a factual mistake in editorial content,
          or a broken data link — please contact us at{" "}
          <a href="mailto:fenixkola@gmail.com" className="inlineLink">fenixkola@gmail.com</a>.
          Include the country or page affected, the value you believe is incorrect, and
          any source you can point us to.
        </p>
        <p className="contentBody">
          We verify reports against our upstream sources before making changes. If an
          upstream source is reporting incorrectly, we note that in the correction
          record and may suppress the affected value until it is resolved. We do not
          silently overwrite incorrect values — changes are reflected in updated
          timestamps.
        </p>
        <p className="contentBody">
          For editorial errors — such as a factual claim about tax policy in a country
          that has since changed — we update the affected text and note the correction
          at the bottom of the relevant section. We do not delete corrections silently.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Content scope</h2>
        <p className="contentBody">
          Karburanti Sot covers petrol (95), diesel, and LPG prices for countries in
          and around Europe, with a particular focus on Albania and neighboring Balkan
          countries. Country coverage is determined by available public data, not by
          commercial relationships. We may add or remove countries as data availability
          changes.
        </p>
        <p className="contentBody">
          The site does not publish content on topics unrelated to fuel pricing, energy
          markets, transportation costs, or the practical topics a driver or traveler
          would find relevant. We do not publish news, opinion, or commentary on
          political topics except where they directly affect fuel price policy (for
          example, a tax change that alters pump prices).
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Contact</h2>
        <p className="contentBody">
          Questions about editorial decisions, data accuracy, corrections, or this
          policy can be sent to{" "}
          <a href="mailto:fenixkola@gmail.com" className="inlineLink">fenixkola@gmail.com</a>.
          For general inquiries, see the{" "}
          <Link to="/contact" className="inlineLink">{t.navContact}</Link> page.
        </p>
      </section>
    </article>
  );
}
