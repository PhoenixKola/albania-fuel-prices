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
  const zoom = 13;
  const centerX = lonToTileX(center.lon, zoom);
  const centerY = latToTileY(center.lat, zoom);
  const tileX = Math.floor(centerX);
  const tileY = Math.floor(centerY);
  const fracX = centerX - tileX;
  const fracY = centerY - tileY;

  const tiles = [];
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      tiles.push({ x: tileX + x, y: tileY + y, dx: x, dy: y });
    }
  }

  const project = (lat: number, lon: number) => {
    const x = (lonToTileX(lon, zoom) - centerX) * TILE_SIZE + 1.5 * TILE_SIZE;
    const y = (latToTileY(lat, zoom) - centerY) * TILE_SIZE + 1.5 * TILE_SIZE;
    return { x: `${(x / (TILE_SIZE * 3)) * 100}%`, y: `${(y / (TILE_SIZE * 3)) * 100}%` };
  };

  return (
    <div className="stationMapPreview" aria-label="Nearby fuel station map">
      <div
        className="stationMapTiles"
        style={{
          transform: `translate(${-fracX * TILE_SIZE}px, ${-fracY * TILE_SIZE}px)`,
        }}
      >
        {tiles.map((tile) => (
          <img
            key={`${tile.x}-${tile.y}`}
            className="stationMapTile"
            src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
            alt=""
            loading="lazy"
            style={{
              left: `${(tile.dx + 1) * TILE_SIZE}px`,
              top: `${(tile.dy + 1) * TILE_SIZE}px`,
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
