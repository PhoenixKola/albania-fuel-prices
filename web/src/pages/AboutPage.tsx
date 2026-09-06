import { Link } from "react-router-dom";
import type { Lang } from "../models/i18n";
import { editorialCopy } from "../config/editorialCopy";
import { ANALYSIS_META } from "../generated/analysisMeta";
import { EditorialCallout, EditorialMetrics, EditorialSection, EditorialShell } from "../components/content/EditorialLayout";

export default function AboutPage({ lang }: { lang: Lang }) {
  const copy = editorialCopy[lang];
  const page = copy.about;
  return (
    <EditorialShell
      variant="dossier"
      eyebrow={page.eyebrow}
      title={page.title}
      lede={page.lede}
      status={page.status}
      sections={page.sections.map(({ id, title }) => ({ id, label: title }))}
      contentsLabel={copy.contents}
      heroAside={<EditorialMetrics items={[
        { label: page.metrics[0], value: String(ANALYSIS_META.countriesAnalysed || 0), note: lang === "sq" ? "në Evropë" : "across Europe" },
        { label: page.metrics[1], value: String(ANALYSIS_META.daysObserved || 0), note: lang === "sq" ? "të ruajtura çdo ditë" : "recorded daily" },
        { label: page.metrics[2], value: lang === "sq" ? "Asnjë" : "None", note: lang === "sq" ? "te renditjet" : "on rankings" },
      ]} />}
      actions={<><Link className="editorialAction editorialActionPrimary" to="/methodology">{page.methodCta}</Link><Link className="editorialAction" to="/contact">{page.contactCta}</Link></>}
    >
      {page.sections.map((section, index) => (
        <EditorialSection key={section.id} id={section.id} index={String(index + 1).padStart(2, "0")} title={section.title}>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets ? <div className="editorialCardGrid">{section.bullets.map((item) => {
            const [title, ...rest] = item.split(":");
            return <div className="editorialCard" key={item}><b>{title}</b><p>{rest.join(":").trim()}</p></div>;
          })}</div> : null}
          {section.id === "corrections" ? <EditorialCallout label={lang === "sq" ? "Raporto me prova" : "Report with evidence"}>{lang === "sq" ? "Përfshi shtetin, karburantin, vlerën, datën dhe burimin." : "Include the country, fuel, displayed value, date, and source."}</EditorialCallout> : null}
        </EditorialSection>
      ))}
    </EditorialShell>
  );
}
