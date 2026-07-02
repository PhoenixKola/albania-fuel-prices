import { useMemo } from "react";
import type { TDict } from "../../locales";
import type { FuelType } from "../../models/fuel";
import type { Trends } from "../../models/trends";
import { getTrendSeries, getWeeklyDeltaEur } from "../../models/trends";
import { FUEL_TYPES } from "../../models/fuel";
import { fuelLabel } from "../../utils/fuel";

type Props = {
  t: TDict;
  trends: Trends | null;
  country: string;
  fuelType: FuelType;
  setFuelType: (v: FuelType) => void;
};

const W = 640;
const H = 180;
const PAD_X = 8;
const PAD_Y = 14;

function shortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * 30-day price chart for the selected country + fuel, drawn with plain SVG.
 * Renders nothing at all when trend data is unavailable.
 */
export default function TrendCard({ t, trends, country, fuelType, setFuelType }: Props) {
  const series = getTrendSeries(trends, country, fuelType);
  const weeklyDelta = getWeeklyDeltaEur(trends, country, fuelType);

  const chart = useMemo(() => {
    if (!series || !trends) return null;
    const points = series
      .map((v, i) => ({ v, i }))
      .filter((p): p is { v: number; i: number } => typeof p.v === "number" && Number.isFinite(p.v));
    if (points.length < 2) return null;

    const min = Math.min(...points.map((p) => p.v));
    const max = Math.max(...points.map((p) => p.v));
    const span = max - min || max * 0.02 || 1;

    const x = (i: number) => PAD_X + (i / (series.length - 1)) * (W - PAD_X * 2);
    const y = (v: number) => PAD_Y + (1 - (v - min) / span) * (H - PAD_Y * 2);

    const line = points.map((p, idx) => `${idx === 0 ? "M" : "L"}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
    const first = points[0];
    const last = points[points.length - 1];
    const area = `${line} L${x(last.i).toFixed(1)},${H} L${x(first.i).toFixed(1)},${H} Z`;

    return {
      line,
      area,
      min,
      max,
      last: last.v,
      lastX: x(last.i),
      lastY: y(last.v),
      firstDate: trends.dates[first.i],
      lastDate: trends.dates[last.i],
    };
  }, [series, trends]);

  if (!chart) return null;

  const tone = weeklyDelta == null || Math.abs(weeklyDelta) < 0.0005 ? "flat" : weeklyDelta < 0 ? "down" : "up";
  const deltaLabel =
    weeklyDelta == null
      ? null
      : Math.abs(weeklyDelta) < 0.0005
        ? t.trendFlatWeek
        : `${weeklyDelta > 0 ? "+" : "−"}${Math.abs(weeklyDelta).toFixed(3)} EUR/L ${t.trendWeekSuffix}`;

  return (
    <div className="card trendCard">
      <div className="cardHeader cardHeaderRow">
        <div>
          <div className="cardTitle">{t.trendTitle}</div>
          <div className="cardSubtle">
            {country} · {shortDate(chart.firstDate)} – {shortDate(chart.lastDate)}
          </div>
        </div>
        <div className="segRow">
          {FUEL_TYPES.map((ft) => (
            <button
              key={ft}
              type="button"
              className={`seg ${ft === fuelType ? "segActive" : ""}`}
              onClick={() => setFuelType(ft)}
            >
              {fuelLabel(t, ft)}
            </button>
          ))}
        </div>
      </div>

      <div className="body">
        <div className="trendStatsRow">
          <div className="trendStat">
            <span className="trendStatLabel">{t.trendCurrent}</span>
            <span className="trendStatValue">{chart.last.toFixed(3)} EUR/L</span>
          </div>
          <div className="trendStat">
            <span className="trendStatLabel">{t.trendLow}</span>
            <span className="trendStatValue">{chart.min.toFixed(3)}</span>
          </div>
          <div className="trendStat">
            <span className="trendStatLabel">{t.trendHigh}</span>
            <span className="trendStatValue">{chart.max.toFixed(3)}</span>
          </div>
          {deltaLabel ? (
            <div className={`trendDeltaPill trendDelta-${tone}`}>{deltaLabel}</div>
          ) : null}
        </div>

        <svg
          className="trendChart"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`${country} ${fuelLabel(t, fuelType)} ${t.trendTitle}`}
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.20" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={chart.area} fill="url(#trendFill)" />
          <path
            d={chart.line}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={chart.lastX} cy={chart.lastY} r="3.4" fill="var(--primary)" />
        </svg>
      </div>
    </div>
  );
}
