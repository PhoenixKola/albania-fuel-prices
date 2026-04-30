import { Link } from "react-router-dom";
import type { LatestEurope } from "../models/fuel";
import { getCountryPageBySlug } from "../config/countryPages";

type Props = {
  slug: string;
  data: LatestEurope | null;
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

export default function CountryFuelPricesPage({ slug, data, loading, setCountry }: Props) {
  const page = getCountryPageBySlug(slug);

  if (!page) {
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

  const row = data?.countries.find((country) => country.country === page.dataCountryName) ?? null;
  const albania = data?.countries.find((country) => country.country === "Albania") ?? null;
  const hasAnyPrice = !!row && [row.gasoline95_eur, row.diesel_eur, row.lpg_eur].some((value) => typeof value === "number");

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{page.label} fuel prices</h1>
      <p className="contentBody">
        This country page gives a practical snapshot of available fuel prices in {page.label}. It is designed for users comparing Albania with nearby Balkan and European markets, not for predicting one exact station pump price.
      </p>

      <section className="contentSection">
        <h2 className="contentHeading">Today&apos;s available prices</h2>
        {loading ? <p className="contentBody">Loading latest fuel data...</p> : null}
        {!loading && !hasAnyPrice ? (
          <p className="contentBody">
            We currently do not have complete public price values for {page.label} in the latest dataset. Data coverage depends on upstream source publication and may change over time.
          </p>
        ) : null}
        {!loading && hasAnyPrice ? (
          <ul className="contentList">
            {renderPrice("Petrol (95)", row?.gasoline95_eur ?? null)}
            {renderPrice("Diesel", row?.diesel_eur ?? null)}
            {renderPrice("LPG", row?.lpg_eur ?? null)}
          </ul>
        ) : null}
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Price context for {page.label}</h2>
        <p className="contentBody">{page.context}</p>
        <p className="contentBody">{page.compareHint}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">How {page.label} compares with Albania</h2>
        <ul className="contentList">
          <li>{compareNote(albania?.gasoline95_eur ?? null, row?.gasoline95_eur ?? null, "Petrol")}</li>
          <li>{compareNote(albania?.diesel_eur ?? null, row?.diesel_eur ?? null, "Diesel")}</li>
          <li>{compareNote(albania?.lpg_eur ?? null, row?.lpg_eur ?? null, "LPG")}</li>
        </ul>
        <p className="contentBody">
          If you want to switch the dashboard to this country, use the <Link className="inlineLink" to="/" onClick={() => setCountry(page.dataCountryName)}>homepage fuel tool</Link> and select {page.label} from the country picker.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Data transparency and limitations</h2>
        <p className="contentBody">
          Prices on this page are informational averages from public datasets and may change after publication. They are useful for comparison and planning, but users should still verify local or official sources before making purchasing decisions.
        </p>
        <p className="contentBody">
          Read more in <Link className="inlineLink" to="/methodology">Methodology</Link> and the <Link className="inlineLink" to="/europe-fuel-comparison">Europe fuel comparison guide</Link>.
        </p>
      </section>
    </article>
  );
}
