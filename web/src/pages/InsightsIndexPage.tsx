import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublishedArticles } from "../config/articles";

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default function InsightsIndexPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const articles = getPublishedArticles();

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">Albania and Balkan fuel price analysis</h1>
      <p className="contentBody">
        Data-backed analysis of Albania and Balkan fuel prices: diesel and petrol trends,
        cross-border fill-up costs, taxes, LPG, and the lek-euro effect. Each article is written by
        the Karburanti Sot team and grounded in the daily price record behind this site.
      </p>

      <p className="contentBody">
        Start with <Link to="/fuel-prices/albania" className="inlineLink">today&apos;s Albania fuel prices</Link>,
        the <Link to="/market-report" className="inlineLink">current European market report</Link>, or
        the <Link to="/rankings" className="inlineLink">latest fuel price rankings</Link>.
      </p>

      {articles.map((a) => (
        <section key={a.slug} className="contentSection">
          <h2 className="contentHeading">
            <Link to={`/insights/${a.slug}`} className="inlineLink">{a.title}</Link>
          </h2>
          <p className="contentBodyMuted">
            {formatDate(a.datePublished)} · {a.readMinutes} min read
          </p>
          <p className="contentBody">{a.description}</p>
          <Link to={`/insights/${a.slug}`} className="inlineLink">Read the article →</Link>
        </section>
      ))}

      <section className="contentSection">
        <h2 className="contentHeading">More from Fuel Today</h2>
        <ul className="contentList">
          <li><Link to="/how-fuel-prices-work" className="inlineLink">How fuel prices work</Link> — from crude oil to the pump</li>
          <li><Link to="/europe-fuel-comparison" className="inlineLink">Europe fuel comparison</Link> — country-by-country context</li>
          <li><Link to="/road-trip-fuel-guide" className="inlineLink">Road trip fuel guide</Link> — estimate costs for specific routes</li>
          <li><Link to="/methodology" className="inlineLink">Methodology</Link> — where our data comes from</li>
        </ul>
      </section>
    </article>
  );
}
