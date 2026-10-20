import assert from "node:assert/strict";
import test from "node:test";
import { calculateFuelDetour, DEFAULT_DETOUR, detourSearch, parseDetourSearch, validDetourInput } from "../src/models/fuelDetour";
import type { LatestEurope } from "../src/models/fuel";

const data: LatestEurope = {
  region: "Europe", as_of: "2026-10-12", source: "fixture", source_url: "https://example.com", fetched_at_utc: "2026-10-20T00:00:00Z", unit: "EUR/L",
  countries: [
    { country: "Albania", gasoline95_eur: 2, diesel_eur: 2.394, lpg_eur: .75, source_as_of: "2026-10-12" },
    { country: "Greece", gasoline95_eur: 2.2, diesel_eur: 2.115, lpg_eur: .9, source_as_of: "2026-10-12" },
    { country: "Kosovo", gasoline95_eur: 1.8, diesel_eur: 1.9, lpg_eur: null, provenance: "date-unverified" },
  ],
};
const now = new Date("2026-10-20T12:00:00Z");

test("subtracts user-entered extra-driving fuel from gross reference gap", () => {
  const result = calculateFuelDetour(DEFAULT_DETOUR, data, now);
  assert.ok(result);
  assert.equal(result.comparison.differencePerLitre, .279);
  assert.ok(Math.abs(result.grossDifference - 13.95) < 1e-8);
  assert.ok(Math.abs(result.extraLitres - .7) < 1e-8);
  assert.ok(Math.abs(result.extraFuelCost - 1.6758) < 1e-8);
  assert.equal(result.netDifference.toFixed(2), "12.27");
  assert.equal(result.comparison.stale, true);
});

test("fuel and direction can reverse the result", () => {
  assert.ok(calculateFuelDetour({ ...DEFAULT_DETOUR, fuel: "gasoline95" }, data, now)!.netDifference < 0);
  assert.ok(calculateFuelDetour({ ...DEFAULT_DETOUR, home: "Greece", alternate: "Albania" }, data, now)!.netDifference < 0);
  assert.equal(calculateFuelDetour({ ...DEFAULT_DETOUR, extraKm: 0 }, data, now)!.extraFuelCost, 0);
});

test("equal reference prices still account for the extra fuel, with no false saving", () => {
  const equalData = structuredClone(data);
  equalData.countries[1].diesel_eur = equalData.countries[0].diesel_eur;
  const result = calculateFuelDetour(DEFAULT_DETOUR, equalData, now);
  assert.ok(result);
  assert.equal(result.grossDifference, 0);
  assert.ok(result.netDifference < 0);
});

test("unverified dates and missing fuel stay explicit", () => {
  const kosovo = calculateFuelDetour({ ...DEFAULT_DETOUR, alternate: "Kosovo" }, data, now);
  assert.ok(kosovo?.comparison.provisional);
  assert.equal(kosovo.comparison.sourceDateB, null);
  assert.equal(calculateFuelDetour({ ...DEFAULT_DETOUR, alternate: "Kosovo", fuel: "lpg" }, data, now), null);
  assert.equal(calculateFuelDetour(DEFAULT_DETOUR, null, now), null);
  const mismatched = structuredClone(data);
  mismatched.countries[1].source_as_of = "2026-10-11";
  assert.equal(calculateFuelDetour(DEFAULT_DETOUR, mismatched, now)?.comparison.provisional, true);
});

test("rejects invalid bounds, unrelated pairs, and restores only valid shared links", () => {
  for (const input of [
    { ...DEFAULT_DETOUR, litres: 0 }, { ...DEFAULT_DETOUR, litres: 201 },
    { ...DEFAULT_DETOUR, extraKm: -1 }, { ...DEFAULT_DETOUR, extraKm: 1001 },
    { ...DEFAULT_DETOUR, consumption: NaN }, { ...DEFAULT_DETOUR, consumption: 0 },
    { ...DEFAULT_DETOUR, home: "Greece" as const, alternate: "Kosovo" as const },
  ]) { assert.equal(validDetourInput(input), false); assert.equal(calculateFuelDetour(input, data, now), null); }
  assert.deepEqual(parseDetourSearch(detourSearch(DEFAULT_DETOUR)), { input: DEFAULT_DETOUR, invalid: false });
  assert.equal(parseDetourSearch("?home=Greece&alternate=Kosovo&fuel=diesel&litres=50&extraKm=10&consumption=7").invalid, true);
});
