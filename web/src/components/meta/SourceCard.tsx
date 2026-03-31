import type { LatestEurope } from "../../models/fuel";
import type { TDict } from "../../locales";
import { relativeTimeFromIso, safeLocaleDateTime } from "../../utils/format";

type Props = {
  t: TDict;
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

export default function SourceCard({ t, data }: Props) {
  const rel = data?.fetched_at_utc ? relativeTimeFromIso(data.fetched_at_utc) : "";
  const updatedLabel = t.sourceUpdatedLabel;

  return (
    <div className="card">
      <div className="cardHeader cardHeaderRow">
        <div>
          <div className="cardTitle">{t.source}</div>
          <div className="cardSubtle">{t.sourceCardSubtitle}</div>
        </div>

        {data?.source_url ? (
          <a className="btn btn-ghost" href={data.source_url} target="_blank" rel="noreferrer">
            {t.open}
          </a>
        ) : null}
      </div>

      <div className="body">
        <p className="tinyNote" style={{ marginBottom: 12 }}>
          {t.sourceCardInterpretationNote}
        </p>

        <Row k={t.source} v={data?.source ?? "—"} />
        <div className="divider" />
        <Row k={t.sourceUrlLabel} v={data?.source_url ?? "—"} />
        <div className="divider" />
        <Row k={updatedLabel} v={data?.fetched_at_utc ? safeLocaleDateTime(data.fetched_at_utc) : "—"} />
        {rel ? <div className="tinyNote">{rel}</div> : null}

        <div className="divider" />

        <div className="tinyNote" style={{ lineHeight: 1.7 }}>
          {t.sourceCardMethodologyNote}
        </div>
      </div>
    </div>
  );
}