import { Link } from "react-router-dom";
import type { TDict } from "../locales";
import NearbyStationsCard from "../components/meta/NearbyStationsCard";

type Props = {
  t: TDict;
  radiusM: number;
  setRadiusM: (v: number) => void;
};

export default function StationsPage({ t, radiusM, setRadiusM }: Props) {
  return (
    <>
      <div className="pageHeader">
        <h1 className="pageHeaderTitle">{t.navStations}</h1>
        <p className="pageHeaderSub">{t.nearbyGuidance}</p>
      </div>
      <NearbyStationsCard t={t} radiusM={radiusM} setRadiusM={setRadiusM} />

      <article className="contentPage">
        <section className="contentSection">
          <h2 className="contentHeading">{t.stationsEditorialTitle}</h2>
          <p className="contentBody">{t.stationsEditorialP1}</p>
          <p className="contentBody">{t.stationsEditorialP2}</p>
          <p className="contentBody">{t.stationsEditorialP3}</p>
        </section>
        <section className="contentSection">
          <h3 className="contentHeading">{t.stationsEditorialTipTitle}</h3>
          <p className="contentBody">{t.stationsEditorialTip}</p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">How to use this page</h2>
          <p className="contentBody">
            The nearby stations feature uses your device&apos;s geolocation (if you grant permission) to find fuel stations within a chosen radius. You can select 2 km, 5 km, or 10 km depending on how far you are willing to drive. The tool queries OpenStreetMap data for fuel station locations and displays them sorted by distance from your position.
          </p>
          <p className="contentBody">
            Each station result shows the station name (if mapped), approximate distance, and opening hours when available in the map data. You can use the station name and location to look up detailed directions in your preferred navigation app.
          </p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Station data vs country averages</h2>
          <p className="contentBody">
            The country-level fuel prices shown on the <Link className="inlineLink" to="/">homepage</Link> and <Link className="inlineLink" to="/rankings">rankings page</Link> represent national average reference values from public data aggregators. Individual stations near you may price above or below this average depending on competition, location, brand, and delivery timing.
          </p>
          <p className="contentBody">
            This page does NOT show real-time pump prices for each station — that would require each station to publish its current price digitally, which most stations in Albania and the Balkans do not do. Instead, use the station finder as a location tool, and the country-level prices as a reasonable estimate of what you will pay.
          </p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Privacy and location</h2>
          <p className="contentBody">
            Your location data is used only in your browser to calculate distances to nearby stations. It is sent to the Overpass API (OpenStreetMap) to find stations in your area. Your location is never sent to our servers, stored in any database, or shared with advertisers.
          </p>
          <p className="contentBody">
            If you deny location permission or your device does not support geolocation, this tool simply will not display results. It is entirely optional — the rest of the site (country comparisons, rankings, guides) works without any location data.
          </p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Limitations of station data</h2>
          <p className="contentBody">
            The station data comes from OpenStreetMap, a community-maintained map. This means coverage varies by region: urban areas in Western Europe tend to have excellent station mapping, while rural areas in the Balkans may have incomplete coverage. Some stations may appear in the results that have since closed, changed brand, or modified their opening hours.
          </p>
          <p className="contentBody">
            Opening hours shown are based on community-contributed data and may not reflect recent changes. Always verify critical information (especially for late-night or holiday refueling) before making a special trip to a station.
          </p>
        </section>

        <section className="contentSection">
          <h2 className="contentHeading">Related tools</h2>
          <ul className="contentList">
            <li><Link className="inlineLink" to="/">Homepage fuel dashboard</Link> — country-level price data</li>
            <li><Link className="inlineLink" to="/rankings">Rankings</Link> — which countries are cheapest and most expensive</li>
            <li><Link className="inlineLink" to="/road-trip-fuel-guide">Road trip guide</Link> — plan refueling stops on multi-country drives</li>
            <li><Link className="inlineLink" to="/methodology">Methodology</Link> — how data is collected and what station data means</li>
          </ul>
        </section>
      </article>
    </>
  );
}
