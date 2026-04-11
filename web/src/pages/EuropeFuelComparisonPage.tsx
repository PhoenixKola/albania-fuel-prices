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
    </article>
  );
}
