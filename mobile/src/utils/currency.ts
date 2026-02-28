export type FxRates = Record<string, number>;

function norm(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const RAW: Record<string, string> = {
  Albania: "ALL",
  Andorra: "EUR",
  Austria: "EUR",
  Belgium: "EUR",
  Bosnia: "BAM",
  "Bosnia and Herzegovina": "BAM",
  Bulgaria: "BGN",
  Croatia: "EUR",
  Cyprus: "EUR",
  Czechia: "CZK",
  "Czech Republic": "CZK",
  Denmark: "DKK",
  Estonia: "EUR",
  Finland: "EUR",
  France: "EUR",
  Germany: "EUR",
  Greece: "EUR",
  Hungary: "HUF",
  Iceland: "ISK",
  Ireland: "EUR",
  Italy: "EUR",
  Kosovo: "EUR",
  Latvia: "EUR",
  Liechtenstein: "CHF",
  Lithuania: "EUR",
  Luxembourg: "EUR",
  Malta: "EUR",
  Moldova: "MDL",
  Monaco: "EUR",
  Montenegro: "EUR",
  Netherlands: "EUR",
  "North Macedonia": "MKD",
  Macedonia: "MKD",
  Norway: "NOK",
  Poland: "PLN",
  Portugal: "EUR",
  Romania: "RON",
  Serbia: "RSD",
  Slovakia: "EUR",
  Slovenia: "EUR",
  Spain: "EUR",
  Sweden: "SEK",
  Switzerland: "CHF",
  Turkey: "TRY",
  Ukraine: "UAH",
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