import { useState } from "react";

type Station = {
  id: string | number;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
};

type Props = {
  center: { lat: number; lon: number };
  stations: Station[];
  onSelect?: (station: Station) => void;
};

const TILE_SIZE = 256;

function lonToTileX(lon: number, zoom: number) {
  return ((lon + 180) / 360) * 2 ** zoom;
}

function latToTileY(lat: number, zoom: number) {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom;
}

export default function StationMapPreview({ center, stations, onSelect }: Props) {
  const [zoom, setZoom] = useState(13);
  const centerX = lonToTileX(center.lon, zoom);
  const centerY = latToTileY(center.lat, zoom);
  const tileX = Math.floor(centerX);
  const tileY = Math.floor(centerY);

  const tiles = [];
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      tiles.push({ x: tileX + x, y: tileY + y });
    }
  }

  const project = (lat: number, lon: number) => {
    const x = (lonToTileX(lon, zoom) - centerX) * TILE_SIZE;
    const y = (latToTileY(lat, zoom) - centerY) * TILE_SIZE;
    return { x: `calc(50% + ${x.toFixed(2)}px)`, y: `calc(50% + ${y.toFixed(2)}px)` };
  };

  return (
    <div className="stationMapPreview" aria-label="Nearby fuel station map">
      <div className="stationMapControls" aria-label="Station map zoom controls">
        <button type="button" onClick={() => setZoom((z) => Math.max(12, z - 1))} disabled={zoom <= 12}>-</button>
        <span>{zoom}</span>
        <button type="button" onClick={() => setZoom((z) => Math.min(16, z + 1))} disabled={zoom >= 16}>+</button>
      </div>

      <div className="stationMapTiles">
        {tiles.map((tile) => (
          <img
            key={`${tile.x}-${tile.y}`}
            className="stationMapTile"
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

      <span className="stationMapCenter" style={{ left: "50%", top: "50%" }} />

      {stations.slice(0, 30).map((station, index) => {
        const p = project(station.lat, station.lon);
        return (
          <button
            key={station.id}
            type="button"
            className="stationMapPin"
            style={{ left: p.x, top: p.y }}
            title={`${station.name} · ${station.distanceKm.toFixed(2)} km`}
            onClick={() => onSelect?.(station)}
          >
            {index + 1}
          </button>
        );
      })}

      <a className="stationMapAttribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
        © OpenStreetMap
      </a>
    </div>
  );
}
