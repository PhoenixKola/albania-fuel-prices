const COUNTRY_TO_ISO2: Record<string, string> = {
  albania: "AL",
  andorra: "AD",
  austria: "AT",
  belarus: "BY",
  belgium: "BE",
  "bosnia and herzegovina": "BA",
  bulgaria: "BG",
  croatia: "HR",
  cyprus: "CY",
  "czech republic": "CZ",
  czechia: "CZ",
  denmark: "DK",
  estonia: "EE",
  finland: "FI",
  france: "FR",
  germany: "DE",
  greece: "GR",
  hungary: "HU",
  iceland: "IS",
  ireland: "IE",
  italy: "IT",
  kosovo: "XK",
  latvia: "LV",
  liechtenstein: "LI",
  lithuania: "LT",
  luxembourg: "LU",
  malta: "MT",
  moldova: "MD",
  montenegro: "ME",
  netherlands: "NL",
  "the netherlands": "NL",
  "north macedonia": "MK",
  norway: "NO",
  poland: "PL",
  portugal: "PT",
  romania: "RO",
  russia: "RU",
  "san marino": "SM",
  serbia: "RS",
  slovakia: "SK",
  slovenia: "SI",
  spain: "ES",
  sweden: "SE",
  switzerland: "CH",
  turkey: "TR",
  turkiye: "TR",
  ukraine: "UA",
  "united kingdom": "GB"
};

function normalizeCountryName(country: string) {
  return country
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function iso2ToFlagEmoji(iso2?: string) {
  if (!iso2 || iso2.length !== 2) return "";
  return iso2
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export function getFlagForCountry(country: string) {
  const normalized = normalizeCountryName(country);
  const iso2 = COUNTRY_TO_ISO2[normalized];
  if (!iso2) return "";
  return iso2ToFlagEmoji(iso2);
}