import type { Currency } from "../../models/currency";
import Icon from "../ui/Icon";

type Props = {
  label: string;
  value: string;
  secondary?: string;
  delta: number | null;
  currency: Currency;
  onCopy: () => void;
  copyLabel: string;
};

function Delta({ v }: { v: number | null }) {
  if (v == null) return null;
  const cls = v > 0 ? "deltaUp" : v < 0 ? "deltaDown" : "deltaFlat";
  const sign = v > 0 ? "+" : "";
  return <span className={`delta ${cls}`}>{`${sign}${v.toFixed(3)}`}</span>;
}

export default function PriceKpi({ label, value, secondary, delta, onCopy, copyLabel }: Props) {
  return (
    <div className="kpiCard">
      <div className="kpiTop">
        <div className="kpiLabel">{label}</div>
        <div className="kpiRight">
          <Delta v={delta} />
          <button className="iconBtn" type="button" onClick={onCopy} title={copyLabel} aria-label={copyLabel}>
            <Icon name="copy" />
          </button>
        </div>
      </div>
      <div className="kpiValue">{value}</div>
      {secondary ? <div className="kpiSecondary">{secondary}</div> : null}
    </div>
  );
}