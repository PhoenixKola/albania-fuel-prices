import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateTrip, defaultTrip, isPriceStale, parseTrip, positiveNumber, tripSearch } from "../src/utils/trip";
import type { CountryPrices } from "../src/models/fuel";
const prices: CountryPrices[] = [
  { country: "Albania", gasoline95_eur: 1.9, diesel_eur: 2, lpg_eur: null },
  { country: "Greece", gasoline95_eur: 1.8, diesel_eur: 1.5, lpg_eur: 0.8 },
];
test("default trip and country-by-country return journey", () => {
  assert.equal(calculateTrip(defaultTrip(), prices, 100).totalEur, 14);
  const result = calculateTrip({ ...defaultTrip(), legs: [{ country: "Albania", km: "100" }, { country: "Greece", km: "200" }], roundTrip: true }, prices, 100);
  assert.equal(result.liters, 42);
  assert.equal(result.totalEur, 70);
  assert.equal(result.totalAll, 7000);
  assert.deepEqual(result.legs.map((leg) => leg.cost), [28, 42]);
});
test("reject bad numbers, accept decimal comma, never show partial totals as complete", () => {
  for (const raw of ["", "0", "-1", "NaN", "Infinity", "1e3", "0x10", "10001", "1.2.3"]) assert.equal(positiveNumber(raw, 10000), null, raw);
  assert.equal(positiveNumber("7,5", 100), 7.5);
  assert.equal(calculateTrip({ ...defaultTrip(), consumption: "" }, prices, 100).totalEur, null);
  assert.equal(calculateTrip({ ...defaultTrip(), fuel: "lpg" }, prices, 100).totalEur, null);
  assert.equal(calculateTrip({ ...defaultTrip(), legs: [{ country: "Albania", km: "100" }, { country: "Missing", km: "100" }] }, prices, 100).totalEur, null);
  assert.equal(calculateTrip(defaultTrip(), [], 100).totalEur, null);
  for (const fx of [null, 0, -1, NaN, Infinity]) {
    const result = calculateTrip(defaultTrip(), prices, fx);
    assert.equal(result.totalAll, null); assert.equal(result.totalEur, 14);
  }
});
test("all fuel types use their own prices; invalid upstream prices stay unavailable", () => {
  assert.equal(calculateTrip({ ...defaultTrip(), fuel: "gasoline95" }, prices, null).totalEur, 13.299999999999999);
  for (const price of [null, 0, -1, NaN, Infinity]) assert.equal(calculateTrip(defaultTrip(), [{ ...prices[0], diesel_eur: price }], null).totalEur, null);
});
test("shared links restore only valid bounded trip inputs", () => {
  const input = { ...defaultTrip(), consumption: "7,5", roundTrip: true, legs: [{ country: "North Macedonia", km: "320" }, { country: "Greece", km: "200.5" }] };
  assert.deepEqual(parseTrip(tripSearch(input)), { input, invalid: false });
  assert.deepEqual(parseTrip("?utm_source=friend"), { input: defaultTrip(), invalid: false });
  for (const raw of ["null", "{}", "[]", "broken", JSON.stringify({ v: 1, ...input, fuel: "unknown" }), JSON.stringify({ v: 1, ...input, legs: [] }), JSON.stringify({ v: 1, ...input, legs: Array(9).fill(input.legs[0]) }), JSON.stringify({ v: 1, ...input, legs: [{ country: "<script>", km: "2" }] })]) {
    assert.deepEqual(parseTrip(`?${new URLSearchParams({ trip: raw })}`), { input: defaultTrip(), invalid: true });
  }
});
test("freshness uses source date and the existing three-day threshold", () => {
  const now = Date.parse("2026-09-09T18:00:00Z");
  assert.equal(isPriceStale("2026-09-06", 3, now), false);
  assert.equal(isPriceStale("2026-09-05", 3, now), true);
  assert.equal(isPriceStale("", 3, now), true);
});
