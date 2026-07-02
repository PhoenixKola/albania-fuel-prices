type Props = {
  values: Array<number | null>;
  width?: number;
  height?: number;
  /** "up" | "down" | "flat" — colors the line; defaults to neutral accent */
  tone?: "up" | "down" | "flat";
};

const TONE_COLORS: Record<string, string> = {
  up: "var(--trend-up)",
  down: "var(--trend-down)",
  flat: "var(--trend-flat)",
};

/**
 * Dependency-free SVG sparkline. Null gaps are skipped; the fill fades to
 * transparent so it works on any card background.
 */
export default function Sparkline({ values, width = 96, height = 28, tone = "flat" }: Props) {
  const points = values
    .map((v, i) => ({ v, i }))
    .filter((p): p is { v: number; i: number } => typeof p.v === "number" && Number.isFinite(p.v));

  if (points.length < 2) return null;

  const min = Math.min(...points.map((p) => p.v));
  const max = Math.max(...points.map((p) => p.v));
  const span = max - min || 1;
  const pad = 2;

  const x = (i: number) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);

  const line = points.map((p, idx) => `${idx === 0 ? "M" : "L"}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L${x(last.i).toFixed(1)},${height} L${x(first.i).toFixed(1)},${height} Z`;
  const color = TONE_COLORS[tone];
  const gradientId = `spark-${tone}`;

  return (
    <svg
      className="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(last.i)} cy={y(last.v)} r="2.1" fill={color} />
    </svg>
  );
}
