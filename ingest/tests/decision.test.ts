import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyEurope, compareEurope, hasNewerKosovoReading, type PriceRow } from "../decision";

const now = new Date("2026-10-23T12:00:00Z");
const rows: PriceRow[] = Array.from({ length: 22 }, (_, index) => ({ country: index === 0 ? "Albania" : `Market ${index}`, gasoline95_eur: 2.143, diesel_eur: 2.394, lpg_eur: null }));
const previous = { as_of: "2026-10-19", countries: [...rows, { country: "Kosovo", gasoline95_eur: 1.4, diesel_eur: 1.6, lpg_eur: null }] };

test("same publication and normalized prices ignore row, property and Kosovo provenance order", () => {
  const shuffled = rows.slice().reverse().map((row) => ({ diesel_eur: row.diesel_eur, country: ` ${row.country} `, lpg_eur: row.lpg_eur, gasoline95_eur: row.gasoline95_eur, source: "different-provider" }));
  assert.deepEqual(compareEurope(previous.countries, shuffled), []);
  assert.equal(classifyEurope(previous, { as_of: previous.as_of, countries: shuffled }, now).status, "UNCHANGED");
});

test("a one-thousandth EUR/L change with the same date is quarantined; newer date can be accepted", () => {
  const changed = rows.map((row) => row.country === "Albania" ? { ...row, diesel_eur: 2.395 } : row);
  const conflict = classifyEurope(previous, { as_of: previous.as_of, countries: changed }, now);
  assert.equal(conflict.status, "SOURCE_DATE_CONFLICT");
  assert.deepEqual(conflict.changes, [{ country: "Albania", fuel: "diesel_eur", previous: 2.394, incoming: 2.395 }]);
  assert.equal(classifyEurope(previous, { as_of: "2026-10-22", countries: changed }, now).status, "UPDATED");
});

test("invalid, regressing and future dates, duplicate rows and excessive precision fail closed", () => {
  for (const date of ["2026-10-18", "2026-10-24", "invalid"]) assert.throws(() => classifyEurope(previous, { as_of: date, countries: rows }, now));
  assert.throws(() => compareEurope(previous.countries, rows.concat(rows[0])), /duplicate/);
  assert.throws(() => compareEurope(previous.countries, rows.map((row) => row.country === "Albania" ? { ...row, diesel_eur: 2.3944 } : row)), /precision/);
  assert.equal(compareEurope(previous.countries, rows.map((row) => row.country === "Albania" ? { ...row, lpg_eur: 0.75 } : row)).length, 1);
});

test("a separately dated Kosovo reading can advance without changing Europe's publication", () => {
  const old = { source_as_of: "2026-10-12" };
  assert.equal(hasNewerKosovoReading(old, { source_as_of: "2026-10-20" }, now), true);
  assert.equal(hasNewerKosovoReading(old, { source_as_of: "2026-10-12" }, now), false);
  assert.equal(hasNewerKosovoReading(old, { source_as_of: "2026-10-24" }, now), false);
  assert.equal(hasNewerKosovoReading(old, null, now), false);
  assert.equal(classifyEurope(previous, { as_of: previous.as_of, countries: rows }, now).status, "UNCHANGED");
});
