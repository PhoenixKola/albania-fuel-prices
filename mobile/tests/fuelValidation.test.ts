import { test } from "node:test";
import assert from "node:assert/strict";
import latest from "../../data/latest.json";
import { validFuelPayload } from "../src/utils/validateFuel";
test("valid cached snapshot survives while malformed network data is rejected", () => {
 assert.equal(validFuelPayload(latest), true);
 for (const broken of [null, {}, {...latest,countries:[null]}, {...latest,as_of:"2099-01-01"}, {...latest,countries:latest.countries.map(r=>({...r,diesel_eur:"2.1"}))}]) assert.equal(validFuelPayload(broken), false);
});
