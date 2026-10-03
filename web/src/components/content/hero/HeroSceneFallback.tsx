import type { HeroFocus, HeroMarker } from "./heroSceneTypes";

/**
 * Static 2D version of the route: nozzle → channel → road → destination.
 * Shown while the 3D scene loads and whenever WebGL is unavailable, so the
 * composition never depends on a GPU. Decorative; the board carries the data.
 */
export default function HeroSceneFallback({ width, height, focus, destination }: { width: number; height: number; focus: HeroFocus; destination: HeroMarker }) {
  if (width < 10 || height < 10) return null;
  const fx = focus.x * width;
  const fy = focus.y * height;
  const nearCx = fx - width * 0.16;
  const nearHalf = Math.min(width * 0.2, 260);
  const nearY = height + 4;
  const tipX = nearCx - nearHalf - width * 0.05;
  const tipY = Math.min(height * 0.7, fy + (height - fy) * 0.45);
  const joinX = nearCx - nearHalf * 0.35;
  const road = `M${nearCx - nearHalf},${nearY} L${fx - 3},${fy} L${fx + 3},${fy} L${nearCx + nearHalf},${nearY} Z`;
  const channel = `M${tipX},${tipY} C${tipX + 22},${tipY + 26} ${joinX - 40},${nearY - 70} ${joinX},${nearY - 18}`;
  const centre = `M${nearCx},${nearY} L${fx},${fy}`;
  const sign = { w: 92, h: 46 };

  return (
    <svg className="homeHeroFallback" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      <path className="homeHeroFallbackRoad" d={road} />
      <path className="homeHeroFallbackCentre" d={centre} />
      <path className="homeHeroFallbackChannel" d={channel} />
      <g transform={`translate(${tipX} ${tipY}) rotate(-32)`} className="homeHeroFallbackNozzle">
        <rect x={-72} y={-13} width={46} height={22} rx={10} />
        <rect x={-30} y={-6} width={30} height={7} rx={3} />
        <path d="M-64 7 l-14 30 h12 l12 -28" />
      </g>
      <circle className="homeHeroFallbackPulse" cx={tipX} cy={tipY} r={5} />
      <g transform={`translate(${fx - sign.w / 2} ${fy - sign.h - 18})`} className="homeHeroFallbackSign">
        <line x1={sign.w / 2} y1={sign.h} x2={sign.w / 2} y2={sign.h + 18} />
        <rect width={sign.w} height={sign.h} rx={7} />
        <text x={10} y={20}>{destination.code}</text>
        <text x={10} y={38} className="homeHeroFallbackPrice">{destination.price}</text>
      </g>
    </svg>
  );
}
