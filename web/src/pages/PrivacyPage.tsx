import { useEffect } from "react";
import type { TDict } from "../locales";

type Props = { t: TDict };

export default function PrivacyPage({ t }: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <article className="contentPage">
      <h1 className="contentPageTitle">{t.privacyTitle}</h1>
      <p className="contentBodyMuted">{t.privacyUpdated}</p>
      <p className="contentBody">{t.privacyIntro}</p>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacyCollectTitle}</h2>
        <p className="contentBody">{t.privacyCollectP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacyLocalTitle}</h2>
        <p className="contentBody">{t.privacyLocalP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacyFetchTitle}</h2>
        <p className="contentBody">{t.privacyFetchP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacyAdsTitle}</h2>
        <p className="contentBody">{t.privacyAdsP1}</p>
        <ul className="contentList">
          <li>{t.privacyAdItem1}</li>
          <li>{t.privacyAdItem2}</li>
          <li>{t.privacyAdItem3}</li>
          <li>{t.privacyAdItem4}</li>
        </ul>
        <p className="contentBody">{t.privacyAdsP2}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacyAnalyticsTitle}</h2>
        <p className="contentBody">{t.privacyAnalyticsP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacySharingTitle}</h2>
        <p className="contentBody">{t.privacySharingP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacySecurityTitle}</h2>
        <p className="contentBody">{t.privacySecurityP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacyChildrenTitle}</h2>
        <p className="contentBody">{t.privacyChildrenP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacyChangesTitle}</h2>
        <p className="contentBody">{t.privacyChangesP1}</p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">{t.privacyContactTitle}</h2>
        <p className="contentBody">{t.privacyContactP1}</p>
      </section>
    </article>
  );
}
