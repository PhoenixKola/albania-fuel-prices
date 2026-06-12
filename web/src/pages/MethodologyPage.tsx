import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";
import AdBar from "../components/ads/AdBar";

type Props = { t: TDict };

export default function MethodologyPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.methodologyPageTitle}</h1>
      <p className="contentBody">{t.methodologyPageIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologySourcesTitle}</h2>
        <p className="contentBody">{t.methodologySourcesP1}</p>
        <p className="contentBody">{t.methodologySourcesP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyProcessTitle}</h2>
        <p className="contentBody">{t.methodologyProcessP1}</p>
        <p className="contentBody">{t.methodologyProcessP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyFxTitle}</h2>
        <p className="contentBody">{t.methodologyFxP1}</p>
        <p className="contentBody">{t.methodologyFxP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyAccuracyTitle}</h2>
        <p className="contentBody">{t.methodologyAccuracyP1}</p>
        <p className="contentBody">{t.methodologyAccuracyP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyUpdateTitle}</h2>
        <p className="contentBody">{t.methodologyUpdateP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyEditorialTitle}</h2>
        <p className="contentBody">{t.methodologyEditorialP1}</p>
        <p className="contentBody">{t.methodologyEditorialP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.methodologyOpenTitle}</h2>
        <p className="contentBody">
          {t.methodologyOpenP1}{" "}
          <Link to="/contact" className="inlineLink">{t.navContact}</Link>
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Data source and update summary</h2>
        <p className="contentBody">
          This website publishes informational country-level fuel prices sourced from public datasets and normalized for comparison use. Update timing depends on upstream publication schedules, so not every country changes at the same frequency.
        </p>
        <p className="contentBody">
          The timestamp shown in the tool indicates when the dataset was refreshed. It should be interpreted as data availability timing, not as a guarantee of real-time pump updates.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Global country estimates</h2>
        <p className="contentBody">
          Countries outside Europe (United States, Canada, Australia, Japan, China, India, Brazil, Mexico, South Korea) are shown as <strong>rough estimates</strong> for general reference. Base values were sourced from{" "}
          <a href="https://www.globalpetrolprices.com" target="_blank" rel="noreferrer" className="inlineLink">GlobalPetrolPrices.com</a>{" "}
          and converted to EUR/L. A small daily variation is applied to reflect typical market movement — these figures are not live data and should not be used for purchasing or travel decisions. They are provided solely to give a broad global context alongside European prices.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Fuel types and limitations</h2>
        <p className="contentBody">
          Petrol (95), diesel, and LPG are shown only when each value exists in the source. Missing fields are not guessed or interpolated. Local station offers, promotions, and micro-regional pricing are outside country-level scope.
        </p>
        <p className="contentBody">
          Before making travel or purchasing decisions, users should verify prices with local stations or official channels. For practical examples, see <Link to="/road-trip-fuel-guide" className="inlineLink">Road trip fuel guide</Link>.
        </p>
      </section>

      <AdBar adClient="ca-pub-2653462201538649" adSlot="5789581249" />
    </article>
  );
}
