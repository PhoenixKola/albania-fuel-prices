import { Link } from "react-router-dom";
import type { Lang } from "../../models/i18n";
import { editorialCopy, type PolicyDocument } from "../../config/editorialCopy";
import { EditorialCallout, EditorialSection, EditorialShell } from "./EditorialLayout";

type Props = { lang: Lang; document: PolicyDocument };

export default function PolicyPage({ lang, document }: Props) {
  const copy = editorialCopy[lang];
  const nav = document.sections.map(({ id, title }) => ({ id, label: title }));

  return (
    <EditorialShell
      variant="dossier"
      eyebrow={document.eyebrow}
      title={document.title}
      lede={document.lede}
      updated={document.updated}
      sections={nav}
      contentsLabel={copy.contents}
      heroAside={<EditorialCallout label={document.calloutLabel} warning>{document.callout}</EditorialCallout>}
      actions={
        <>
          <Link className="editorialAction" to="/methodology">{lang === "sq" ? "Metodologjia" : "Methodology"}</Link>
          <Link className="editorialAction" to="/contact">{lang === "sq" ? "Kontakti" : "Contact"}</Link>
        </>
      }
    >
      {document.sections.map((section, index) => (
        <EditorialSection key={section.id} id={section.id} index={String(index + 1).padStart(2, "0")} title={section.title}>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets?.length ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
        </EditorialSection>
      ))}
    </EditorialShell>
  );
}
