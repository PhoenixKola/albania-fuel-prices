import { useEffect } from "react";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function ContactPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.contactTitle}</h1>
      <p className="contentBody">{t.contactIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.contactEmailTitle}</h2>
        <p className="contentBody">
          <a href={`mailto:${t.contactEmailValue}`} className="inlineLink">
            {t.contactEmailValue}
          </a>
        </p>
        <p className="contentBody">{t.contactEmailNote}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.contactTopicsTitle}</h2>
        <ul className="contentList">
          <li>{t.contactTopic1}</li>
          <li>{t.contactTopic2}</li>
          <li>{t.contactTopic3}</li>
          <li>{t.contactTopic4}</li>
          <li>{t.contactTopic5}</li>
        </ul>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.contactResponseTitle}</h2>
        <p className="contentBody">{t.contactResponseP1}</p>
        <p className="contentBody">{t.contactResponseP2}</p>
      </section>
    </article>
  );
}
