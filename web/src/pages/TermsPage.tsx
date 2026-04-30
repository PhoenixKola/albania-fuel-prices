import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function TermsPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.termsTitle}</h1>
      <p className="contentBodyMuted">{t.termsUpdated}</p>
      <p className="contentBody">{t.termsIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsServiceTitle}</h2>
        <p className="contentBody">{t.termsServiceP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsAccuracyTitle}</h2>
        <p className="contentBody">{t.termsAccuracyP1}</p>
        <p className="contentBody">{t.termsAccuracyP2}</p>
        <p className="contentBody">{t.termsAccuracyP3}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsUseTitle}</h2>
        <p className="contentBody">{t.termsUseP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsIpTitle}</h2>
        <p className="contentBody">{t.termsIpP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsLinksTitle}</h2>
        <p className="contentBody">{t.termsLinksP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsAdsTitle}</h2>
        <p className="contentBody">{t.termsAdsP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsLiabilityTitle}</h2>
        <p className="contentBody">{t.termsLiabilityP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsChangesTitle}</h2>
        <p className="contentBody">{t.termsChangesP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.termsContactTitle}</h2>
        <p className="contentBody">{t.termsContactP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Informational use and local verification</h2>
        <p className="contentBody">
          Fuel prices and comparisons on this website are provided for informational planning only. They do not constitute a binding commercial offer and may differ from station-level prices at the time of purchase.
        </p>
        <p className="contentBody">
          Users are responsible for verifying local prices and official notices before acting on route or purchasing decisions. For transparency details, review <Link to="/methodology" className="inlineLink">Methodology</Link>.
        </p>
      </section>
    </article>
  );
}
