import type { RoadRoute, RoadStatus } from "../../models/road";
import { statusTone } from "../../utils/roadReality";

const TILE_SIZE = 256;

function lonToTileX(lon: number, zoom: number) {
  return ((lon + 180) / 360) * 2 ** zoom;
}

function latToTileY(lat: number, zoom: number) {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom;
}

function routeZoom(route: RoadRoute) {
  const lats = route.geometry.map((point) => point.lat);
  const lons = route.geometry.map((point) => point.lon);
  const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lons) - Math.min(...lons));
  if (span > 1.7) return 8;
  if (span > 0.85) return 9;
  if (span > 0.35) return 10;
  return 11;
}

function normalizedGeometry(route: RoadRoute) {
  const xs = route.geometry.map((point) => point.lon);
  const ys = route.geometry.map((point) => point.lat);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(0.04, maxX - minX);
  const spanY = Math.max(0.04, maxY - minY);
  return route.geometry.map((point) => ({
    ...point,
    x: 10 + ((point.lon - minX) / spanX) * 80,
    y: 88 - ((point.lat - minY) / spanY) * 76,
  }));
}

function segmentStatus(route: RoadRoute, index: number): RoadStatus {
  return route.routeSections[Math.min(index, route.routeSections.length - 1)]?.status ?? route.overallStatus;
}

export default function RoadRouteMap({ route }: { route: RoadRoute }) {
  const zoom = routeZoom(route);
  const center = route.geometry.reduce((sum, point) => ({ lat: sum.lat + point.lat, lon: sum.lon + point.lon }), { lat: 0, lon: 0 });
  center.lat /= route.geometry.length;
  center.lon /= route.geometry.length;
  const centerX = lonToTileX(center.lon, zoom);
  const centerY = latToTileY(center.lat, zoom);
  const tileX = Math.floor(centerX);
  const tileY = Math.floor(centerY);
  const points = normalizedGeometry(route);
  const tiles = [];
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) tiles.push({ x: tileX + x, y: tileY + y });
  }
  const osmUrl = `https://www.openstreetmap.org/#map=${zoom}/${center.lat.toFixed(4)}/${center.lon.toFixed(4)}`;

  return (
    <figure className="roadMap" aria-label={`Schematic map of ${route.title}`}>
      <div className="roadMapTiles" aria-hidden="true">
        {tiles.map((tile) => (
          <img
            key={`${tile.x}-${tile.y}`}
            src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
            alt=""
            loading="lazy"
            style={{
              left: `calc(50% + ${((tile.x - centerX) * TILE_SIZE).toFixed(2)}px)`,
              top: `calc(50% + ${((tile.y - centerY) * TILE_SIZE).toFixed(2)}px)`,
            }}
          />
        ))}
      </div>
      <div className="roadMapShade" aria-hidden="true" />
      <svg className="roadMapRoute" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1];
          return <line key={`${point.label}-${next.label}`} className={`roadMapSegment roadStatus-${statusTone(segmentStatus(route, index))}`} x1={point.x} y1={point.y} x2={next.x} y2={next.y} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {points.map((point, index) => (
        <span key={point.label} className={`roadMapPoint ${index === 0 || index === points.length - 1 ? "roadMapPointMajor" : ""}`} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
          <i aria-hidden="true" /><span>{point.label}</span>
        </span>
      ))}
      <div className="roadMapLegend" aria-label="Map status legend">
        <span className={`roadStatus-${statusTone(route.overallStatus)}`}><i />{route.overallStatus}</span>
        <small>Schematic corridor</small>
      </div>
      <figcaption>
        <a href={osmUrl} target="_blank" rel="noopener noreferrer">Open map ↗</a>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>
      </figcaption>
    </figure>
  );
}
