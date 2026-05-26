import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function ContactPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.contactTitle}</h1>
      <p className="contentBody">{t.contactIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.contactEmailTitle}</h2>
        <p className="contentBody">
          <a href={`mailto:${t.contactEmailValue}`} className="inlineLink">
            {t.contactEmailValue}
          </a>
        </p>
        <p className="contentBody">{t.contactEmailNote}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.contactTopicsTitle}</h2>
        <ul className="contentList">
          <li>{t.contactTopic1}</li>
          <li>{t.contactTopic2}</li>
          <li>{t.contactTopic3}</li>
          <li>{t.contactTopic4}</li>
          <li>{t.contactTopic5}</li>
        </ul>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.contactResponseTitle}</h2>
        <p className="contentBody">{t.contactResponseP1}</p>
        <p className="contentBody">{t.contactResponseP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Before you contact us</h2>
        <p className="contentBody">
          For methodology and data limitations, please read <Link to="/methodology" className="inlineLink">Methodology</Link>. For legal and data-use policy details, see <Link to="/privacy" className="inlineLink">Privacy Policy</Link> and <Link to="/terms" className="inlineLink">Terms of Use</Link>.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">What to include in a correction request</h2>
        <p className="contentBody">
          If you are reporting a fuel-price discrepancy, please include as much of the following as possible:
        </p>
        <ul className="contentList">
          <li>The country and fuel type (e.g., &quot;Albania — Diesel&quot;)</li>
          <li>The value shown on our site and the value you believe is correct</li>
          <li>A source link or reference for the correct value (official government publication, station receipt, etc.)</li>
          <li>The date you observed the discrepancy</li>
        </ul>
        <p className="contentBody">
          This information allows us to verify the report against upstream data sources quickly and apply corrections if warranted.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Response expectations</h2>
        <p className="contentBody">
          We aim to respond to all messages within 2–3 business days. Data correction requests are prioritized — if a displayed price is clearly wrong, we will investigate within 24 hours of receiving the report.
        </p>
        <p className="contentBody">
          For feature requests and general suggestions, we add them to an internal backlog and prioritize based on user demand and implementation feasibility. We may not reply individually to every suggestion, but we read them all.
        </p>
      </section>
    </article>
  );
}
