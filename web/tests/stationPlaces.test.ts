import assert from "node:assert/strict";
import { test } from "node:test";
import places from "../src/data/albaniaPlaces.json";
import { normalizePlace, searchPlaces } from "../src/utils/stationPlaces";
import { locationErrorCode, stationErrorCode } from "../src/utils/stationErrors";

test("Albanian place search covers the bundled data with accent and punctuation folding", () => {
  assert.ok(places.places.length > 4000);
  assert.equal(normalizePlace("Durrës"), "durres");
  assert.ok(searchPlaces(places.places, "Shkoder").some((place) => place.name === "Shkodër"));
  assert.ok(searchPlaces(places.places, "Korce").some((place) => place.name === "Korçë"));
  assert.ok(searchPlaces(places.places, "Durres").some((place) => place.name === "Durrës"));
  assert.equal(searchPlaces(places.places, "Durres")[0].name, "Durrës");
});

test("location and provider failures map to stable translation codes", () => {
  assert.equal(locationErrorCode(1), "denied");
  assert.equal(locationErrorCode(2), "unavailable");
  assert.equal(locationErrorCode(3), "timeout");
  assert.equal(stationErrorCode(new Error("429")), "busy");
  assert.equal(stationErrorCode(new Error("503")), "provider");
  assert.equal(stationErrorCode(new Error("Invalid station response")), "invalid");
});
