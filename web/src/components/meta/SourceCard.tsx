import type { LatestEurope } from "../../models/fuel";
import type { Lang } from "../../models/i18n";
import type { TDict } from "../../locales";
import { relativeTimeFromIso, safeLocaleDateTime } from "../../utils/format";

type Props = {
  t: TDict;
  lang: Lang;
  data: LatestEurope | null;
};

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="metaRow">
      <div className="metaKey">{k}</div>
      <div className="metaVal">{v}</div>
    </div>
  );
}

export default function SourceCard({ t, lang, data }: Props) {
  const rel = data?.fetched_at_utc ? relativeTimeFromIso(data.fetched_at_utc) : "";

  return (
    <div className="card">
      <div className="cardHeader cardHeaderRow">
        <div className="cardTitle">{t.source}</div>
        <a className="btn btn-ghost" href={data?.source_url ?? "#"} target="_blank" rel="noreferrer">
          {t.open}
        </a>
      </div>

      <div className="body">
        <Row k={t.source} v={data?.source ?? "—"} />
        <div className="divider" />
        <Row k="URL" v={data?.source_url ?? "—"} />
        <div className="divider" />
        <Row k={lang === "sq" ? "Përditësuar" : "Updated"} v={data?.fetched_at_utc ? safeLocaleDateTime(data.fetched_at_utc) : "—"} />
        {rel ? <div className="tinyNote">{rel}</div> : null}
      </div>
    </div>
  );
}