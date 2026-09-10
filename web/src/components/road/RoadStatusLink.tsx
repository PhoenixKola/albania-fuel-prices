import type { Lang } from "../../models/i18n";

const copy = {
  en: { eyebrow: "Road Reality", title: "Check the road before you drive", text: "Review sourced closures, restrictions, and verification dates for important routes in Albania.", cta: "Road conditions" },
  sq: { eyebrow: "Realiteti i rrugës", title: "Kontrollo rrugën para nisjes", text: "Shiko mbylljet, kufizimet dhe datat e verifikimit nga burimet për itineraret kryesore në Shqipëri.", cta: "Gjendja e rrugëve" },
};

export default function RoadStatusLink({ lang, featured = false }: { lang: Lang; featured?: boolean }) {
  const c = copy[lang];
  return (
    <aside className={`roadEntry${featured ? " roadEntryFeatured" : ""}`}>
      <span className="roadEntryIcon" aria-hidden="true"><i /><i /><i /></span>
      <div><span className="roadEntryEyebrow">{c.eyebrow}</span><strong>{c.title}</strong>{featured ? <p>{c.text}</p> : null}</div>
      <a href="/road-status">{c.cta}<span aria-hidden="true">→</span></a>
    </aside>
  );
}
