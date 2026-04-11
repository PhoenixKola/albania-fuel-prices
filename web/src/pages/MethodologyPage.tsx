import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

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
    </article>
  );
}
