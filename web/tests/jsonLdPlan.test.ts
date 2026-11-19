import { test } from "node:test";
import assert from "node:assert/strict";
import { jsonLdAction } from "../src/utils/jsonLdPlan";

test("hydration keeps the prerendered structured data for the same URL", () => {
  assert.equal(jsonLdAction("/fuel-prices/albania", "/fuel-prices/albania", true), "keep");
  assert.equal(jsonLdAction("/fuel-prices/kosovo", "/fuel-prices/kosovo", false), "keep");
});

test("navigating away never carries another route's structured data", () => {
  assert.equal(jsonLdAction("/fuel-prices/kosovo", "/fuel-prices/greece", false), "clear");
  assert.equal(jsonLdAction("/fuel-prices/kosovo", "/fuel-prices/albania", true), "replace");
  assert.equal(jsonLdAction(null, "/compare", false), "clear");
});
