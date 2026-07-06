import { useMemo } from "react";
import type { FuelType } from "../../models/fuel";
import type { Trends } from "../../models/trends";
import { getTrendSeries } from "../../models/trends";

type Props = {
  trends: Trends | null;
  countries: string[];
  fuelType: FuelType;
};

const W = 720;
const H = 220;
const PAD_X = 18;
const PAD_Y = 18;
const COLORS = ["#14b8a6", "#38bdf8", "#f59e0b", "#a78bfa", "#fb7185", "#22c55e"];

export default function CompareTrendChart({ trends, countries, fuelType }: Props) {
  const model = useMemo(() => {
    if (!trends || countries.length < 2) return null;

    const rows = countries
      .map((country, idx) => {
        const raw = getTrendSeries(trends, country, fuelType);
        const points =
          raw
            ?.map((value, i) => ({ value, i }))
            .filter((p): p is { value: number; i: number } => typeof p.value === "number" && Number.isFinite(p.value)) ??
          [];

        if (points.length < 2) return null;
        return { country, points, color: COLORS[idx % COLORS.length] };
      })
      .filter((row): row is { country: string; points: { value: number; i: number }[]; color: string } => !!row);

    if (rows.length < 2) return null;

    const values = rows.flatMap((row) => row.points.map((p) => p.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || max * 0.02 || 1;
    const maxIndex = trends.dates.length - 1 || 1;

    const x = (i: number) => PAD_X + (i / maxIndex) * (W - PAD_X * 2);
    const y = (value: number) => PAD_Y + (1 - (value - min) / span) * (H - PAD_Y * 2);

    return {
      min,
      max,
      rows: rows.map((row) => ({
        ...row,
        line: row.points.map((p, idx) => `${idx === 0 ? "M" : "L"}${x(p.i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" "),
        last: row.points[row.points.length - 1].value,
      })),
    };
  }, [trends, countries, fuelType]);

  if (!model) return null;

  return (
    <div className="compareTrendPanel">
      <div className="compareTrendHeader">
        <div>
          <div className="compareTrendTitle">30-day comparison</div>
          <div className="compareTrendSub">Your saved countries on the same price scale</div>
        </div>
        <div className="compareTrendRange">
          {model.min.toFixed(3)}–{model.max.toFixed(3)} EUR/L
        </div>
      </div>

      <svg className="compareTrendChart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img">
        <line x1={PAD_X} y1={H - PAD_Y} x2={W - PAD_X} y2={H - PAD_Y} className="compareTrendAxis" />
        {model.rows.map((row) => (
          <path
            key={row.country}
            d={row.line}
            fill="none"
            stroke={row.color}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="compareTrendLegend">
        {model.rows.map((row) => (
          <span key={row.country} className="compareTrendLegendItem">
            <span className="compareTrendSwatch" style={{ backgroundColor: row.color }} />
            {row.country}
            <strong>{row.last.toFixed(3)}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}
