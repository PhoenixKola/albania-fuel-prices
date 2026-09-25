import type { Lang } from "../../models/i18n";

const copy = {
  en: { eyebrow: "Road Reality", title: "Check the road before you drive", cta: "Road conditions" },
  sq: { eyebrow: "Realiteti i rrugës", title: "Kontrollo rrugën para nisjes", cta: "Gjendja e rrugëve" },
};

export default function RoadStatusLink({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <aside className="roadEntry">
      <span className="roadEntryIcon" aria-hidden="true"><i /><i /><i /></span>
      <div><span className="roadEntryEyebrow">{c.eyebrow}</span><strong>{c.title}</strong></div>
      <a href="/road-status">{c.cta}<span aria-hidden="true">→</span></a>
    </aside>
  );
}
