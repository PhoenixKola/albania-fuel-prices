import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function AboutPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.aboutTitle}</h1>
      <p className="contentBody">{t.aboutIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.aboutMissionTitle}</h2>
        <p className="contentBody">{t.aboutMissionP1}</p>
        <p className="contentBody">{t.aboutMissionP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.aboutDataTitle}</h2>
        <p className="contentBody">{t.aboutDataP1}</p>
        <p className="contentBody">{t.aboutDataP2}</p>
        <p className="contentBody">{t.aboutDataP3}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.aboutEditorialTitle}</h2>
        <p className="contentBody">{t.aboutEditorialP1}</p>
        <p className="contentBody">{t.aboutEditorialP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.aboutWhoTitle}</h2>
        <p className="contentBody">{t.aboutWhoP1}</p>
        <p className="contentBody">
          {t.aboutWhoP2}{" "}
          <Link to="/contact" className="inlineLink">{t.navContact}</Link>
        </p>
      </section>
    </article>
  );
}
