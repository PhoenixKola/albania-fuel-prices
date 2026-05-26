import { useEffect } from "react";
import { Link } from "react-router-dom";
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

      <section className="contentSection">
        <h2 className="contentHeading">Fuel data transparency note</h2>
        <p className="contentBody">
          Fuel prices shown on this website are informational and may change after publication. They are intended for comparison and planning, not as a guaranteed quote for a specific station transaction.
        </p>
        <p className="contentBody">
          See <Link to="/methodology" className="inlineLink">Methodology</Link> for data handling details and <Link to="/contact" className="inlineLink">Contact</Link> if you need corrections.
        </p>
      </section>

      <section className="contentSection">
        <h2 className="contentHeading">Consent management and ad choices</h2>
        <p className="contentBody">
          This site may use Google AdSense on the web version to serve advertisements. Google and its advertising partners may use cookies or device identifiers to serve personalized or non-personalized ads depending on your region and consent status.
        </p>
        <p className="contentBody">
          For users in regions that require consent (including the European Economic Area, United Kingdom, and Switzerland), consent controls will be presented once a Google-certified Consent Management Platform is enabled through the AdSense interface.
        </p>
        <p className="contentBody">
          You can learn more about how Google uses data when you use partner sites and apps at{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            className="inlineLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s partner sites privacy page
          </a>.
        </p>
      </section>
    </article>
  );
}
