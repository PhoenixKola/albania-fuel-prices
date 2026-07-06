import { useMemo } from "react";
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

export default function EuropeChoroplethMap({ data, fuelType, currentCountry, onOpen }: Props) {
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
        return { feature: f as Feature<Geometry>, atlasName, dataName, value: byCountry.get(dataName) ?? null };
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
          <div className="cardSubtle">Darker countries are more expensive. Russia is kept in the table but hidden here so the map stays readable.</div>
        </div>
        <div className="choroplethScale">
          <span>{model.min.toFixed(3)}</span>
          <span className="choroplethGradient" />
          <span>{model.max.toFixed(3)} EUR/L</span>
        </div>
      </div>

      <div className="choroplethMapWrap">
        <svg className="choroplethMap" viewBox={`0 0 ${W} ${H}`} role="img">
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
        </svg>
      </div>
    </section>
  );
}
