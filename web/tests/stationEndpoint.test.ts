import assert from "node:assert/strict";
import { test } from "node:test";
import { inAlbaniaSnapshotArea, stationEndpoint, stationFallbackUrl } from "../src/utils/stationEndpoint";

test("Albanian locations use the snapshot; nearby foreign and German GPS use global lookup", () => {
  assert.equal(inAlbaniaSnapshotArea(41.3275, 19.8187), true);
  assert.equal(inAlbaniaSnapshotArea(42.21361, 19.43639), true);
  assert.equal(inAlbaniaSnapshotArea(42.44, 19.26), false);
  assert.equal(stationEndpoint(42.0683, 19.5126, 5000).source, "snapshot");
  assert.equal(stationEndpoint(52.52, 13.405, 5000).source, "global");
  const german = stationEndpoint(52.52, 13.405, 5000);
  assert.match(stationFallbackUrl(german.url, german.source) ?? "", /overpass-api\.de/);
  const albanian = stationEndpoint(41.3275, 19.8187, 5000);
  assert.equal(stationFallbackUrl(albanian.url, albanian.source), null);
});
