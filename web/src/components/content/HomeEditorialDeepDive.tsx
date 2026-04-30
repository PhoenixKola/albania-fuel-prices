import { Link } from "react-router-dom";
import type { LatestEurope } from "../../models/fuel";

type Props = {
  data: LatestEurope | null;
};

function formatValue(value: number | null | undefined) {
  if (typeof value !== "number") return "not available";
  return `${value.toFixed(3)} EUR/L`;
}

function routeFuelCost(distanceKm: number, litersPer100: number, pricePerLiter: number | null | undefined) {
  if (typeof pricePerLiter !== "number") return null;
  const liters = (distanceKm / 100) * litersPer100;
  return liters * pricePerLiter;
}

export default function HomeEditorialDeepDive({ data }: Props) {
  const albania = data?.countries.find((country) => country.country === "Albania") ?? null;
  const kosovo = data?.countries.find((country) => country.country === "Kosovo") ?? null;
  const montenegro = data?.countries.find((country) => country.country === "Montenegro") ?? null;
  const northMacedonia = data?.countries.find((country) => country.country === "North Macedonia") ?? null;
  const greece = data?.countries.find((country) => country.country === "Greece") ?? null;

  const tiranaShkoder = routeFuelCost(100, 6.8, albania?.diesel_eur ?? null);
  const tiranaPristina = routeFuelCost(260, 6.8, albania?.diesel_eur ?? null);
  const tiranaOhrid = routeFuelCost(135, 7.2, albania?.gasoline95_eur ?? null);
  const tiranaPodgorica = routeFuelCost(160, 6.8, albania?.diesel_eur ?? null);

  return (
    <article className="contentPage">
      <section className="contentSection">
        <h2 className="contentHeading">Today&apos;s fuel prices in Albania</h2>
        <p className="contentBody">
          The dashboard above is built for practical decisions: commuting, delivery planning, and cross-border travel from Albania. Current Albania values in the latest dataset are petrol {formatValue(albania?.gasoline95_eur)}, diesel {formatValue(albania?.diesel_eur)}, and LPG {formatValue(albania?.lpg_eur)}.
        </p>
        <p className="contentBody">
          These values are a country-level reference, not a guarantee for every station. Pump prices can vary by city, chain, and update timing.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">How to read the fuel price data</h2>
        <p className="contentBody">
          Fuel Today normalizes country values into EUR per liter so Albania can be compared with eurozone and non-eurozone markets on one scale. Use the numbers for trend and spread analysis, then validate your exact station before buying fuel.
        </p>
        <p className="contentBody">
          For collection details, review the <Link className="inlineLink" to="/methodology">Methodology page</Link>. For market interpretation, read <Link className="inlineLink" to="/how-fuel-prices-work">How fuel prices work</Link>.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Why fuel prices change</h2>
        <p className="contentBody">
          Albanian and Balkan prices move with international crude benchmarks, refinery margins, transport costs, taxes, and exchange-rate pressure. Even when crude is stable, pump prices can shift because fiscal policy or regional logistics changed.
        </p>
        <p className="contentBody">
          Seasonal demand also matters: tourism-heavy periods in the region can increase distribution pressure and widen differences between neighboring markets.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Albania fuel prices compared with nearby countries</h2>
        <p className="contentBody">
          Nearby markets are often the most relevant benchmark for Albanian drivers. Latest visible comparisons in this dataset include Kosovo diesel {formatValue(kosovo?.diesel_eur)}, Montenegro diesel {formatValue(montenegro?.diesel_eur)}, North Macedonia diesel {formatValue(northMacedonia?.diesel_eur)}, and Greece diesel {formatValue(greece?.diesel_eur)}.
        </p>
        <p className="contentBody">
          Use the <Link className="inlineLink" to="/europe-fuel-comparison">Europe fuel comparison guide</Link> for interpretation, then open country pages such as <Link className="inlineLink" to="/fuel-prices/albania">Albania</Link>, <Link className="inlineLink" to="/fuel-prices/greece">Greece</Link>, and <Link className="inlineLink" to="/fuel-prices/italy">Italy</Link>.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Example driving costs from Albania</h2>
        <p className="contentBody">
          Example one-way fuel cost estimates using country-level reference prices:
        </p>
        <ul className="contentList">
          <li>Tirana to Shkoder (about 100 km): {tiranaShkoder ? `${tiranaShkoder.toFixed(2)} EUR` : "insufficient price data"}</li>
          <li>Tirana to Pristina (about 260 km): {tiranaPristina ? `${tiranaPristina.toFixed(2)} EUR` : "insufficient price data"}</li>
          <li>Tirana to Ohrid (about 135 km): {tiranaOhrid ? `${tiranaOhrid.toFixed(2)} EUR` : "insufficient price data"}</li>
          <li>Tirana to Podgorica (about 160 km): {tiranaPodgorica ? `${tiranaPodgorica.toFixed(2)} EUR` : "insufficient price data"}</li>
        </ul>
        <p className="contentBody">
          These are planning estimates, not exact trip invoices. For route-by-route advice, open the <Link className="inlineLink" to="/road-trip-fuel-guide">Road trip fuel guide</Link>.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">When are prices updated?</h2>
        <p className="contentBody">
          Update frequency depends on upstream publication schedules. Some sources update weekly, while others publish less frequently. The latest fetch timestamp appears on the page so users can check freshness before using the numbers.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Data source and methodology summary</h2>
        <p className="contentBody">
          Fuel Today aggregates public country-level fuel data and converts it into a comparable format for drivers in Albania and Europe. Prices are informational and may change after publication. Always verify with local stations or official sources before final decisions.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Frequently asked questions</h2>
        <h3 className="contentFaqQuestion">Are these real-time prices?</h3>
        <p className="contentFaqAnswer">
          No. The site publishes the most recent available public data, but does not claim real-time pump accuracy.
        </p>
        <h3 className="contentFaqQuestion">Can I use this for cross-border road trips?</h3>
        <p className="contentFaqAnswer">
          Yes, it is designed for planning and comparison. For final purchase decisions, validate station-level prices on your route.
        </p>
        <h3 className="contentFaqQuestion">Where can I verify methods and assumptions?</h3>
        <p className="contentFaqAnswer">
          See <Link className="inlineLink" to="/methodology">Methodology</Link> and <Link className="inlineLink" to="/about">About</Link> for transparency details.
        </p>
      </section>
    </article>
  );
}
