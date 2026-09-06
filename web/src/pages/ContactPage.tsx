import { Link } from "react-router-dom";
import type { Lang } from "../models/i18n";
import { editorialCopy } from "../config/editorialCopy";
import { EditorialCallout, EditorialSection, EditorialShell } from "../components/content/EditorialLayout";

const EMAIL = "fenixkola@gmail.com";

export default function ContactPage({ lang }: { lang: Lang }) {
  const copy = editorialCopy[lang];
  const page = copy.contact;
  return (
    <EditorialShell
      variant="dossier"
      eyebrow={page.eyebrow}
      title={page.title}
      lede={page.lede}
      status={page.status}
      sections={page.sections.map(({ id, title }) => ({ id, label: title }))}
      contentsLabel={copy.contents}
      heroAside={<div className="contactSignal"><span>{lang === "sq" ? "Adresa e kontaktit" : "Contact address"}</span><strong>{EMAIL}</strong><small>{lang === "sq" ? "Përgjigje tipike: 2–3 ditë pune" : "Typical response: 2–3 business days"}</small></div>}
      actions={<><a className="editorialAction editorialActionPrimary" href={`mailto:${EMAIL}?subject=Karburanti%20Sot%20enquiry`}>{page.emailAction}<span aria-hidden="true">→</span></a><Link className="editorialAction" to="/methodology">{page.methodCta}</Link></>}
    >
      {page.sections.map((section, index) => (
        <EditorialSection key={section.id} id={section.id} index={String(index + 1).padStart(2, "0")} title={section.title}>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          {section.id === "correction" ? <EditorialCallout label={lang === "sq" ? "Minimumi i dobishëm" : "Useful minimum"}>{lang === "sq" ? "Shteti · karburanti · vlera e shfaqur · data · burimi" : "Country · fuel · displayed value · date · source"}</EditorialCallout> : null}
          {section.id === "privacy" ? <p><Link to="/privacy">{page.privacyCta}</Link></p> : null}
        </EditorialSection>
      ))}
    </EditorialShell>
  );
}
