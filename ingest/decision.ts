import { validSourceDate } from "./sourceDate";

export type PriceRow = { country: string; gasoline95_eur: number | null; diesel_eur: number | null; lpg_eur: number | null };
export const FUELS = ["gasoline95_eur", "diesel_eur", "lpg_eur"] as const;
export type PriceChange = { country: string; fuel: string; previous: number | null | "missing"; incoming: number | null | "missing" };

function countryKey(name: string) { return name.replace(/\s+/g, " ").trim().toLocaleLowerCase("en"); }

/** Source tables publish at most three decimal places in EUR/L. Extra precision is rejected, never rounded away. */
function milliEuro(value: number | null): number | null {
  if (value === null) return null;
  if (!Number.isFinite(value) || value < 0.1 || value > 10) throw new Error(`Invalid EUR/L price ${value}`);
  const scaled = value * 1000;
  if (Math.abs(scaled - Math.round(scaled)) > 1e-7) throw new Error(`Unexpected EUR/L precision ${value}`);
  return Math.round(scaled);
}

export function canonicalEurope(rows: PriceRow[]) {
  if (!Array.isArray(rows)) throw new Error("Malformed country table");
  const table = new Map<string, { country: string; values: (number | null)[] }>();
  for (const row of rows) {
    if (!row || typeof row.country !== "string") throw new Error("Malformed country row");
    const key = countryKey(row.country);
    if (!key || table.has(key)) throw new Error(`Invalid or duplicate country: ${row.country}`);
    const values = FUELS.map((fuel) => milliEuro(row[fuel]));
    if (key !== "kosovo") table.set(key, { country: row.country.replace(/\s+/g, " ").trim(), values });
  }
  if (table.size < 20 || !table.has("albania")) throw new Error("Source table lacks sufficient valid European prices");
  if ([...table.values()].filter((row) => row.values[0] !== null || row.values[1] !== null).length < 20 ||
      table.get("albania")!.values.slice(0, 2).every((value) => value === null)) throw new Error("Source table lacks sufficient numeric petrol/diesel prices");
  return table;
}

export function compareEurope(previous: PriceRow[], incoming: PriceRow[]): PriceChange[] {
  const before = canonicalEurope(previous);
  const after = canonicalEurope(incoming);
  const changes: PriceChange[] = [];
  for (const key of [...new Set([...before.keys(), ...after.keys()])].sort()) {
    const old = before.get(key);
    const next = after.get(key);
    FUELS.forEach((fuel, index) => {
      const a = old ? old.values[index] : "missing";
      const b = next ? next.values[index] : "missing";
      if (a !== b) changes.push({ country: next?.country ?? old!.country, fuel, previous: a === "missing" ? a : a === null ? null : a / 1000, incoming: b === "missing" ? b : b === null ? null : b / 1000 });
    });
  }
  return changes;
}

export function classifyEurope(previous: { as_of: string; countries: PriceRow[] }, incoming: { as_of: string; countries: PriceRow[] }, now = new Date()) {
  if (!validSourceDate(previous.as_of, now) || !validSourceDate(incoming.as_of, now)) throw new Error("Invalid source publication date");
  if (canonicalEurope(incoming.countries).size < canonicalEurope(previous.countries).size - 2) throw new Error("Source table lost too many countries; manual review required");
  const changes = compareEurope(previous.countries, incoming.countries);
  if (incoming.as_of < previous.as_of) throw new Error(`Source date ${incoming.as_of} predates published snapshot ${previous.as_of}`);
  return { status: incoming.as_of > previous.as_of ? "UPDATED" as const : changes.length ? "SOURCE_DATE_CONFLICT" as const : "UNCHANGED" as const, changes };
}

export function hasNewerKosovoReading(
  previous: { source_as_of?: string; last_observed_at?: string } | undefined,
  incoming: { source_as_of?: string } | null,
  now = new Date(),
) {
  const nextDate = incoming?.source_as_of;
  return !!nextDate && validSourceDate(nextDate, now) && nextDate > (previous?.source_as_of ?? previous?.last_observed_at ?? "0000-00-00");
}
