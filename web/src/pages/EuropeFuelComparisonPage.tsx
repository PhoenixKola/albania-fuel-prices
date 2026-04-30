import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function EuropeFuelComparisonPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.europeCompTitle}</h1>
      <p className="contentBody">{t.europeCompIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.europeCompWhyTitle}</h2>
        <p className="contentBody">{t.europeCompWhyP1}</p>
        <p className="contentBody">{t.europeCompWhyP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.europeCompRegionsTitle}</h2>
        <p className="contentBody">{t.europeCompRegionsP1}</p>
        <p className="contentBody">{t.europeCompRegionsP2}</p>
        <p className="contentBody">{t.europeCompRegionsP3}</p>
        <p className="contentBody">{t.europeCompRegionsP4}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.europeCompDieselVsPetrolTitle}</h2>
        <p className="contentBody">{t.europeCompDieselVsPetrolP1}</p>
        <p className="contentBody">{t.europeCompDieselVsPetrolP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.europeCompLpgTitle}</h2>
        <p className="contentBody">{t.europeCompLpgP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.europeCompBorderTitle}</h2>
        <p className="contentBody">{t.europeCompBorderP1}</p>
        <p className="contentBody">{t.europeCompBorderP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.europeCompExchangeTitle}</h2>
        <p className="contentBody">{t.europeCompExchangeP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.europeCompSummaryTitle}</h2>
        <p className="contentBody">{t.europeCompSummaryP1}</p>
        <p className="contentBody">
          <Link to="/how-fuel-prices-work" className="inlineLink">{t.navHowPricesWork}</Link>
          {" · "}
          <Link to="/rankings" className="inlineLink">{t.navRankings}</Link>
          {" · "}
          <Link to="/road-trip-fuel-guide" className="inlineLink">{t.navRoadTripGuide}</Link>
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">How Albania compares with key countries</h2>
        <p className="contentBody">
          This website is built around Albania as the practical baseline, then expands outward to nearby and major European markets. The most useful comparison set for many users is Kosovo, Montenegro, North Macedonia, Greece, Italy, and Croatia.
        </p>
        <p className="contentBody">
          For broader context, Portugal, Switzerland, and the United Kingdom help show how far prices can diverge across Europe due to taxation, currency, and distribution structure differences.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Practical interpretation instead of raw ranking</h2>
        <p className="contentBody">
          A lower country average does not automatically mean your full trip will be cheaper. Border detours, tolls, city traffic, and payment-currency effects can offset part of the fuel advantage.
        </p>
        <p className="contentBody">
          Use country pages for context: <Link to="/fuel-prices/albania" className="inlineLink">Albania</Link>, <Link to="/fuel-prices/kosovo" className="inlineLink">Kosovo</Link>, <Link to="/fuel-prices/montenegro" className="inlineLink">Montenegro</Link>, <Link to="/fuel-prices/north-macedonia" className="inlineLink">North Macedonia</Link>, <Link to="/fuel-prices/greece" className="inlineLink">Greece</Link>, <Link to="/fuel-prices/italy" className="inlineLink">Italy</Link>, <Link to="/fuel-prices/croatia" className="inlineLink">Croatia</Link>, <Link to="/fuel-prices/portugal" className="inlineLink">Portugal</Link>, <Link to="/fuel-prices/switzerland" className="inlineLink">Switzerland</Link>, and <Link to="/fuel-prices/united-kingdom" className="inlineLink">United Kingdom</Link>.
        </p>
      </section>
    </article>
  );
}
