import { useMemo, useState } from "react";
import { feature } from "topojson-client";
import { geoAzimuthalEqualArea, geoPath } from "d3-geo";
import countriesTopo from "world-atlas/countries-110m.json";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { LatestEurope, FuelType } from "../../models/fuel";
import { getEurPrice } from "../../utils/fuel";
import { isEuropeanCountry } from "../../utils/regions";

type Props = {
  data: LatestEurope | null;
  fuelType: FuelType;
  currentCountry?: string;
  onOpen: (country: string) => void;
};

const W = 760;
const H = 420;
const EUROPE_BOUNDS = {
  minLon: -25,
  maxLon: 46,
  minLat: 34,
  maxLat: 72,
};

const ATLAS_TO_DATA: Record<string, string> = {
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  Czechia: "Czechia",
  Netherlands: "The Netherlands",
  Russia: "Russia",
  Serbia: "Serbia",
  Slovakia: "Slovakia",
  Slovenia: "Slovenia",
  Turkey: "Türkiye",
  Ukraine: "Ukraine",
  "United Kingdom": "United Kingdom",
};

function colorFor(value: number | null, min: number, max: number) {
  if (value == null) return "rgba(148, 163, 184, 0.20)";
  const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  if (t < 0.25) return "#99f6e4";
  if (t < 0.5) return "#2dd4bf";
  if (t < 0.75) return "#0f766e";
  return "#134e4a";
}

function pointInEuropeWindow(point: number[]) {
  const [lon, lat] = point;
  return (
    lon >= EUROPE_BOUNDS.minLon &&
    lon <= EUROPE_BOUNDS.maxLon &&
    lat >= EUROPE_BOUNDS.minLat &&
    lat <= EUROPE_BOUNDS.maxLat
  );
}

function ringInEuropeWindow(ring: number[][]) {
  return ring.some(pointInEuropeWindow);
}

function keepEuropeanGeometry(geometry: Geometry): Geometry | null {
  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates.filter(ringInEuropeWindow);
    return rings.length ? { ...geometry, coordinates: rings } : null;
  }

  if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates
      .map((polygon) => polygon.filter(ringInEuropeWindow))
      .filter((polygon) => polygon.length > 0);
    return polygons.length ? { ...geometry, coordinates: polygons } : null;
  }

  return geometry;
}

export default function EuropeChoroplethMap({ data, fuelType, currentCountry, onOpen }: Props) {
  const [zoom, setZoom] = useState(1.15);
  const model = useMemo(() => {
    if (!data) return null;

    const byCountry = new Map(
      data.countries
        .filter((row) => isEuropeanCountry(row.country))
        .filter((row) => row.country !== "Russia")
        .map((row) => [row.country, getEurPrice(row, fuelType)])
    );

    const values = [...byCountry.values()].filter((value): value is number => typeof value === "number");
    if (!values.length) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const fc = feature(countriesTopo as any, (countriesTopo as any).objects.countries) as unknown as FeatureCollection;
    const europeFeatures = fc.features
      .map((f) => {
        const atlasName = String((f.properties as any)?.name ?? "");
        const dataName = ATLAS_TO_DATA[atlasName] ?? atlasName;
        if (!byCountry.has(dataName)) return null;

        const geometry = keepEuropeanGeometry(f.geometry as Geometry);
        if (!geometry) return null;

        return {
          feature: { ...(f as Feature<Geometry>), geometry },
          atlasName,
          dataName,
          value: byCountry.get(dataName) ?? null,
        };
      })
      .filter((row): row is { feature: Feature<Geometry>; atlasName: string; dataName: string; value: number | null } => !!row);

    const projection = geoAzimuthalEqualArea().rotate([-20, -52, 0]).fitExtent([[18, 18], [W - 18, H - 18]], {
      type: "FeatureCollection",
      features: europeFeatures.map((row) => row.feature),
    } as FeatureCollection);
    const path = geoPath(projection);

    return {
      min,
      max,
      rows: europeFeatures.map((row) => ({ ...row, d: path(row.feature) ?? "" })),
    };
  }, [data, fuelType]);

  if (!model) return null;

  return (
    <section className="card choroplethCard" aria-label="Europe fuel price map">
      <div className="choroplethHeader">
        <div>
          <div className="cardTitle">Europe price map</div>
          <div className="cardSubtle">Darker countries are more expensive. The map is cropped to Europe so the countries stay easy to click.</div>
        </div>
        <div className="choroplethHeaderTools">
          <div className="choroplethScale">
            <span>{model.min.toFixed(3)}</span>
            <span className="choroplethGradient" />
            <span>{model.max.toFixed(3)} EUR/L</span>
          </div>
          <div className="mapZoomControls" aria-label="Map zoom controls">
            <button type="button" onClick={() => setZoom((z) => Math.max(1, Number((z - 0.15).toFixed(2))))}>-</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(1.75, Number((z + 0.15).toFixed(2))))}>+</button>
          </div>
        </div>
      </div>

      <div className="choroplethMapWrap">
        <svg className="choroplethMap" viewBox={`0 0 ${W} ${H}`} role="img">
          <g transform={`translate(${W / 2} ${H / 2}) scale(${zoom}) translate(${-W / 2} ${-H / 2})`}>
            {model.rows.map((row) => {
              const active = row.dataName === currentCountry;
              return (
                <path
                  key={row.dataName}
                  d={row.d}
                  className={`choroplethCountry ${active ? "choroplethCountryActive" : ""}`}
                  fill={colorFor(row.value, model.min, model.max)}
                  onClick={() => onOpen(row.dataName)}
                >
                  <title>
                    {row.dataName}: {row.value == null ? "No data" : `${row.value.toFixed(3)} EUR/L`}
                  </title>
                </path>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
}
