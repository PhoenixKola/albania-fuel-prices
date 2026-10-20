/** City-centre search points, already used as geographic context by the web Road Reality data. */
export const STATION_CITIES = [
  { id: "tirana", en: "Tirana", sq: "Tiranë", lat: 41.3275, lon: 19.8187 },
  { id: "durres", en: "Durrës", sq: "Durrës", lat: 41.3231, lon: 19.4414 },
  { id: "shkoder", en: "Shkodër", sq: "Shkodër", lat: 42.0683, lon: 19.5126 },
  { id: "vlore", en: "Vlorë", sq: "Vlorë", lat: 40.4661, lon: 19.4914 },
  { id: "sarande", en: "Sarandë", sq: "Sarandë", lat: 39.8753, lon: 20.0048 },
  { id: "korce", en: "Korçë", sq: "Korçë", lat: 40.6186, lon: 20.7808 },
] as const;

export type StationCity = (typeof STATION_CITIES)[number];
