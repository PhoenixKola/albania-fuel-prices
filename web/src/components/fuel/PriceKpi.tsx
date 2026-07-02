import Icon from "../ui/Icon";
import Sparkline from "./Sparkline";

type Props = {
  label: string;
  value: string;
  secondary?: string;
  /** EUR change vs ~7 days ago, from trend data */
  weeklyDelta: number | null;
  sparkline: Array<number | null> | null;
  weeklyLabel: string;
  onCopy: () => void;
  copyLabel: string;
};

function WeeklyDelta({ v, suffix }: { v: number | null; suffix: string }) {
  if (v == null) return null;
  const flat = Math.abs(v) < 0.0005;
  const cls = flat ? "deltaFlat" : v > 0 ? "deltaUp" : "deltaDown";
  const text = flat ? "0.000" : `${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(3)}`;
  return (
    <span className={`delta ${cls}`} title={suffix}>
      {text}
    </span>
  );
}

export default function PriceKpi({ label, value, secondary, weeklyDelta, sparkline, weeklyLabel, onCopy, copyLabel }: Props) {
  const tone = weeklyDelta == null || Math.abs(weeklyDelta) < 0.0005 ? "flat" : weeklyDelta > 0 ? "up" : "down";

  return (
    <div className="kpiCard">
      <div className="kpiTop">
        <div className="kpiLabel">{label}</div>
        <div className="kpiRight">
          <WeeklyDelta v={weeklyDelta} suffix={weeklyLabel} />
          <button className="iconBtn" type="button" onClick={onCopy} title={copyLabel} aria-label={copyLabel}>
            <Icon name="copy" />
          </button>
        </div>
      </div>
      <div className="kpiValuePrice">{value}</div>
      <div className="kpiFooter">
        {secondary ? <div className="kpiSecondary">{secondary}</div> : null}
        {sparkline ? <Sparkline values={sparkline} tone={tone} /> : null}
      </div>
    </div>
  );
}
