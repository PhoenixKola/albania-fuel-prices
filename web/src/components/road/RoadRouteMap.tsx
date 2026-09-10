import { useEffect, useMemo, useRef, useState } from "react";
import type { RoadRoute, RoadStatus } from "../../models/road";
import { statusTone } from "../../utils/roadReality";

const TILE_SIZE = 256;
const MIN_ZOOM = 7;
const MAX_ZOOM = 12;
const MAP_PADDING = 54;
const TILE_OVERSCAN = 1;

type MapSize = { width: number; height: number };
type ProjectedPoint = RoadRoute["geometry"][number] & { x: number; y: number };

function project(lat: number, lon: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const sin = Math.sin((clampedLat * Math.PI) / 180);
  return {
    x: ((lon + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function fitViewport(route: RoadRoute, size: MapSize) {
  const base = route.geometry.map((point) => project(point.lat, point.lon, 0));
  const minX = Math.min(...base.map((point) => point.x));
  const maxX = Math.max(...base.map((point) => point.x));
  const minY = Math.min(...base.map((point) => point.y));
  const maxY = Math.max(...base.map((point) => point.y));
  const usableWidth = Math.max(80, size.width - MAP_PADDING * 2);
  const usableHeight = Math.max(80, size.height - MAP_PADDING * 2);
  const scale = Math.min(usableWidth / Math.max(0.0001, maxX - minX), usableHeight / Math.max(0.0001, maxY - minY));
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.floor(Math.log2(scale))));
  const projected = route.geometry.map((point) => ({ ...point, ...project(point.lat, point.lon, zoom) }));
  const bounds = {
    minX: Math.min(...projected.map((point) => point.x)),
    maxX: Math.max(...projected.map((point) => point.x)),
    minY: Math.min(...projected.map((point) => point.y)),
    maxY: Math.max(...projected.map((point) => point.y)),
  };
  const originX = (bounds.minX + bounds.maxX) / 2 - size.width / 2;
  const originY = (bounds.minY + bounds.maxY) / 2 - size.height / 2;
  return {
    zoom,
    originX,
    originY,
    centerLat: route.geometry.reduce((sum, point) => sum + point.lat, 0) / route.geometry.length,
    centerLon: route.geometry.reduce((sum, point) => sum + point.lon, 0) / route.geometry.length,
    points: projected.map((point) => ({ ...point, x: point.x - originX, y: point.y - originY })) as ProjectedPoint[],
  };
}

function segmentStatus(route: RoadRoute, index: number): RoadStatus {
  return route.routeSections[Math.min(index, route.routeSections.length - 1)]?.status ?? route.overallStatus;
}

export default function RoadRouteMap({ route }: { route: RoadRoute }) {
  const mapRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState<MapSize>({ width: 560, height: 480 });

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      if (width > 0 && height > 0) setSize((current) => current.width === width && current.height === height ? current : { width, height });
    });
    observer.observe(map);
    return () => observer.disconnect();
  }, []);

  const viewport = useMemo(() => fitViewport(route, size), [route, size]);
  const tiles = useMemo(() => {
    const minTileX = Math.floor(viewport.originX / TILE_SIZE) - TILE_OVERSCAN;
    const maxTileX = Math.floor((viewport.originX + size.width) / TILE_SIZE) + TILE_OVERSCAN;
    const minTileY = Math.floor(viewport.originY / TILE_SIZE) - TILE_OVERSCAN;
    const maxTileY = Math.floor((viewport.originY + size.height) / TILE_SIZE) + TILE_OVERSCAN;
    const result: Array<{ x: number; y: number; left: number; top: number }> = [];
    for (let y = minTileY; y <= maxTileY; y++) {
      for (let x = minTileX; x <= maxTileX; x++) {
        result.push({ x, y, left: x * TILE_SIZE - viewport.originX, top: y * TILE_SIZE - viewport.originY });
      }
    }
    return result;
  }, [size, viewport]);
  const osmUrl = `https://www.openstreetmap.org/#map=${viewport.zoom}/${viewport.centerLat.toFixed(4)}/${viewport.centerLon.toFixed(4)}`;

  return (
    <figure ref={mapRef} className="roadMap" aria-label={`Map of ${route.title}`} data-map-width={size.width} data-map-height={size.height}>
      <div className="roadMapTiles" aria-hidden="true">
        {tiles.map((tile) => (
          <img
            key={`${viewport.zoom}-${tile.x}-${tile.y}`}
            src={`https://tile.openstreetmap.org/${viewport.zoom}/${tile.x}/${tile.y}.png`}
            alt=""
            loading="lazy"
            width={TILE_SIZE}
            height={TILE_SIZE}
            style={{ left: `${tile.left}px`, top: `${tile.top}px` }}
          />
        ))}
      </div>
      <div className="roadMapShade" aria-hidden="true" />
      <svg className="roadMapRoute" viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
        {viewport.points.slice(0, -1).map((point, index) => {
          const next = viewport.points[index + 1];
          return <line key={`${point.label}-${next.label}`} className={`roadMapSegment roadStatus-${statusTone(segmentStatus(route, index))}`} x1={point.x} y1={point.y} x2={next.x} y2={next.y} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {viewport.points.map((point, index) => (
        <span
          key={`${point.label}-${index}`}
          className={`roadMapPoint${index === 0 ? " roadMapPointStart" : ""}${index === viewport.points.length - 1 ? " roadMapPointEnd" : ""}`}
          style={{ left: `${point.x}px`, top: `${point.y}px` }}
        >
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
