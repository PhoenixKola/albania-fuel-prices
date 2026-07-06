import { Link } from "react-router-dom";
import type { FuelType, LatestEurope } from "../models/fuel";
import type { Trends } from "../models/trends";
import type { TDict } from "../locales";
import { getCountryEditorial } from "../config/countryContent";
import AdBar from "../components/ads/AdBar";
import TrendCard from "../components/fuel/TrendCard";

type Props = {
  slug: string;
  t: TDict;
  data: LatestEurope | null;
  trends: Trends | null;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
  loading: boolean;
  setCountry: (country: string) => void;
};

function renderPrice(label: string, value: number | null) {
  if (typeof value !== "number") return null;

  return (
    <li>
      <strong>{label}:</strong> {value.toFixed(3)} EUR/L
    </li>
  );
}

function compareNote(albaniaPrice: number | null, countryPrice: number | null, label: string) {
  if (typeof albaniaPrice !== "number" || typeof countryPrice !== "number") {
    return `${label}: comparison unavailable because one of the values is missing.`;
  }

  const diff = countryPrice - albaniaPrice;
  const absDiff = Math.abs(diff).toFixed(3);
  if (Math.abs(diff) < 0.001) {
    return `${label}: currently very close to Albania.`;
  }

  if (diff > 0) {
    return `${label}: about ${absDiff} EUR/L higher than Albania.`;
  }

  return `${label}: about ${absDiff} EUR/L lower than Albania.`;
}

export default function CountryFuelPricesPage({ slug, t, data, trends, fuelType, setFuelType, loading, setCountry }: Props) {
  const editorial = getCountryEditorial(slug);

  if (!editorial) {
    return (
      <article className="contentPage">
        <h1 className="contentPageTitle">Country page not found</h1>
        <p className="contentBody">
          We could not match this country slug. You can go back to the <Link className="inlineLink" to="/">homepage</Link>
          , check the <Link className="inlineLink" to="/europe-fuel-comparison">Europe comparison guide</Link>, or read the <Link className="inlineLink" to="/methodology">methodology</Link>.
        </p>
      </article>
    );
  }

  const row = data?.countries.find((country) => country.country === editorial.dataCountryName) ?? null;
  const albania = data?.countries.find((country) => country.country === "Albania") ?? null;
  const hasAnyPrice = !!row && [row.gasoline95_eur, row.diesel_eur, row.lpg_eur].some((value) => typeof value === "number");

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{editorial.label} fuel prices today</h1>
      <p className="contentBody">
        This page provides a comprehensive overview of fuel prices in {editorial.label}, with practical comparison context for Albanian drivers and travelers. It combines the latest available data with market analysis, border advice, and refueling strategies.
      </p>

      {data?.source ? (
        <p className="contentBodyMuted">
          Data source: {data.source} | Last fetched: {data.fetched_at_utc ? new Date(data.fetched_at_utc).toLocaleDateString("en-GB", { dateStyle: "medium" }) : "recently"}
        </p>
      ) : null}

      <section className="contentSection">
        <h2 className="contentHeading">Current {editorial.label} fuel prices</h2>
        {loading ? <p className="contentBody">Loading latest fuel data...</p> : null}
        {!loading && !hasAnyPrice ? (
          <p className="contentBody">
            We currently do not have complete public price values for {editorial.label} in the latest dataset. Data coverage depends on upstream source publication and may change over time. The editorial content below remains relevant for understanding this market.
          </p>
        ) : null}
        {!loading && hasAnyPrice ? (
          <>
            <ul className="contentList">
              {renderPrice("Petrol (Gasoline 95)", row?.gasoline95_eur ?? null)}
              {renderPrice("Diesel", row?.diesel_eur ?? null)}
              {renderPrice("LPG (Autogas)", row?.lpg_eur ?? null)}
            </ul>
            <p className="contentBody">
              All prices are expressed in EUR per liter for consistent cross-country comparison. These represent country-level reference values from public data sources, not guaranteed prices at any specific station.
            </p>
          </>
        ) : null}
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{editorial.label} 30-day fuel price trend</h2>
        <p className="contentBody">
          Follow the recent movement for petrol, diesel, and LPG in {editorial.label}. The chart uses the same daily
          history file as the dashboard, so it updates automatically when new source data is published.
        </p>
        <div className="contentToolEmbed">
          <TrendCard
            t={t}
            trends={trends}
            country={editorial.dataCountryName}
            fuelType={fuelType}
            setFuelType={setFuelType}
          />
        </div>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{editorial.label} fuel market overview</h2>
        <p className="contentBody">{editorial.marketOverview}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">How {editorial.label} compares with Albania</h2>
        {!loading && hasAnyPrice ? (
          <ul className="contentList">
            <li>{compareNote(albania?.gasoline95_eur ?? null, row?.gasoline95_eur ?? null, "Petrol (95)")}</li>
            <li>{compareNote(albania?.diesel_eur ?? null, row?.diesel_eur ?? null, "Diesel")}</li>
            <li>{compareNote(albania?.lpg_eur ?? null, row?.lpg_eur ?? null, "LPG")}</li>
          </ul>
        ) : null}
        <p className="contentBody">{editorial.albaniaContext}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Travel routes and relevance</h2>
        <p className="contentBody">{editorial.travelRelevance}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Understanding petrol, diesel, and LPG in {editorial.label}</h2>
        <p className="contentBody">{editorial.fuelInterpretation}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Border crossing and refueling advice</h2>
        <p className="contentBody">{editorial.borderAdvice}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Data coverage and limitations</h2>
        <p className="contentBody">{editorial.dataLimitations}</p>
        <p className="contentBody">{editorial.sourceTransparency}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Frequently asked questions about {editorial.label} fuel prices</h2>
        {editorial.faqs.map((faq, i) => (
          <div key={i}>
            <h3 className="contentFaqQuestion">{faq.question}</h3>
            <p className="contentFaqAnswer">{faq.answer}</p>
          </div>
        ))}
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Explore more</h2>
        <p className="contentBody">
          Use the interactive fuel comparison tools on this site to dig deeper into {editorial.label} pricing:
        </p>
        <ul className="contentList">
          {editorial.relatedLinks.map((link) => (
            <li key={link.to}>
              <Link className="inlineLink" to={link.to}>{link.label}</Link>
            </li>
          ))}
          <li>
            <Link
              className="inlineLink"
              to="/"
              onClick={() => setCountry(editorial.dataCountryName)}
            >
              View {editorial.label} on the interactive dashboard
            </Link>
          </li>
        </ul>
      </section>

      <AdBar adClient="ca-pub-2653462201538649" adSlot="5789581249" />
    </article>
  );
}
