import { Link } from "react-router-dom";
import type { Lang } from "../models/i18n";
import { editorialCopy } from "../config/editorialCopy";

const EMAIL = "fenixkola@gmail.com";

/**
 * Contact is a conversion page, not a document: the first step has to be fast,
 * so the address and the mail action sit in the hero rather than behind a
 * table of contents. Topics become scannable cards because a visitor is
 * matching their request to a category, not reading prose in order.
 */
export default function ContactPage({ lang }: { lang: Lang }) {
  const copy = editorialCopy[lang];
  const page = copy.contact;
  const sq = lang === "sq";

  const byId = Object.fromEntries(page.sections.map((section) => [section.id, section]));
  const topics = byId.topics;
  const correction = byId.correction;
  const response = byId.response;
  const privacy = byId.privacy;

  const checklist = sq
    ? ["Shteti dhe lloji i karburantit", "Vlera e shfaqur në faqe", "Vlera që besoni se është e saktë", "Data e vëzhgimit", "Lidhje ose dokument burimor"]
    : ["Country and fuel type", "The value shown on the site", "The value you believe is correct", "The date you observed it", "A source link or document"];

  return (
    <main className="contactPage">
      <header className="contactHero">
        <div className="contactHeroCopy">
          <p className="contactEyebrow"><i aria-hidden="true" />{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="contactLede">{page.lede}</p>
        </div>

        <div className="contactCard">
          <span className="contactCardLabel">{sq ? "Shkruaj drejtpërdrejt" : "Write to us directly"}</span>
          <a className="contactEmail" href={`mailto:${EMAIL}?subject=Karburanti%20Sot%20enquiry`}>{EMAIL}</a>
          <a className="contactMailButton" href={`mailto:${EMAIL}?subject=Karburanti%20Sot%20enquiry`}>
            {page.emailAction}<span aria-hidden="true">→</span>
          </a>
          <dl className="contactFacts">
            <div><dt>{sq ? "Përgjigje tipike" : "Typical reply"}</dt><dd>{sq ? "2–3 ditë pune" : "2–3 business days"}</dd></div>
            <div><dt>{sq ? "Gabime në të dhëna" : "Data issues"}</dt><dd>{sq ? "1 ditë pune" : "1 business day"}</dd></div>
            <div><dt>{sq ? "Inboksi" : "Inbox"}</dt><dd>{page.status}</dd></div>
          </dl>
        </div>
      </header>

      {topics ? (
        <section className="contactTopics" aria-labelledby="contact-topics">
          <h2 id="contact-topics">{topics.title}</h2>
          <p>{topics.paragraphs[0]}</p>
          <ul>
            {(topics.bullets ?? []).map((item) => (
              <li key={item}><span aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="contactSplit">
        {correction ? (
          <section className="contactPanel contactPanelAccent" aria-labelledby="contact-correction">
            <h2 id="contact-correction">{correction.title}</h2>
            {correction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <ol className="contactChecklist">
              {checklist.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </section>
        ) : null}

        <div className="contactStack">
          {response ? (
            <section className="contactPanel" aria-labelledby="contact-response">
              <h2 id="contact-response">{response.title}</h2>
              {response.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ) : null}

          {privacy ? (
            <section className="contactPanel contactPanelQuiet" aria-labelledby="contact-privacy">
              <h2 id="contact-privacy">{privacy.title}</h2>
              {privacy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="contactPanelLinks">
                <Link to="/privacy">{page.privacyCta}</Link>
                <Link to="/methodology">{page.methodCta}</Link>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
