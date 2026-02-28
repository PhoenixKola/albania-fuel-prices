export type FxRates = Record<string, number>;

function norm(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const RAW: Record<string, string> = {
  Albania: "ALL",
  Austria: "EUR",
  Belgium: "EUR",
  Bulgaria: "BGN",
  Croatia: "EUR",
  "Czech Republic": "CZK",
  Czechia: "CZK",
  Denmark: "DKK",
  France: "EUR",
  Germany: "EUR",
  Greece: "EUR",
  Hungary: "HUF",
  Italy: "EUR",
  Netherlands: "EUR",
  Norway: "NOK",
  Poland: "PLN",
  Romania: "RON",
  Serbia: "RSD",
  Sweden: "SEK",
  Switzerland: "CHF",
  Turkey: "TRY",
  "United Kingdom": "GBP",
  UK: "GBP",
};

const MAP: Record<string, string> = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [norm(k), v]));

export function getCurrencyForCountry(country: string) {
  return MAP[norm(country)] ?? "EUR";
}

export function convertEur(eur: number | null | undefined, currency: string, rates: FxRates | null) {
  if (eur == null) return null;
  if (currency === "EUR") return eur;
  const r = rates?.[currency];
  if (!r || !Number.isFinite(r)) return null;
  return eur * r;
}

export function hasRate(currency: string, rates: FxRates | null) {
  if (currency === "EUR") return true;
  const r = rates?.[currency];
  return !!r && Number.isFinite(r);
}