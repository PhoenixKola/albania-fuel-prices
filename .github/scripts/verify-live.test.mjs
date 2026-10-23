import { test } from "node:test";
import assert from "node:assert/strict";
import { assessLive, parseLiveMarkers } from "./verify-live.mjs";

const now = new Date("2026-10-23T12:00:00Z");
const sha = "a".repeat(40);
const live = { asOf: "2026-10-19", buildDate: "2026-10-21", buildSha: sha };

test("four-day-old publication is healthy when repo and deployed build agree", () => {
  assert.deepEqual(assessLive({ live, repoAsOf: "2026-10-19", now }), { status: "HEALTHY", ageDays: 4, legacy: false });
});

test("older deployed publication and missing web/data commit are deployment failures", () => {
  assert.throws(() => assessLive({ live, repoAsOf: "2026-10-20", now }), /Deployment lag: live publication/);
  assert.throws(() => assessLive({ live, repoAsOf: "2026-10-19", relevantChanges: true, now }), /Deployment lag: web\/data/);
  assert.equal(assessLive({ live, repoAsOf: "2026-10-19", relevantChanges: false, now }).status, "HEALTHY");
});

test("legacy marker is temporarily compatible only when its date covers relevant changes", () => {
  assert.equal(assessLive({ live: { ...live, buildSha: null }, repoAsOf: "2026-10-19", legacyCovered: true, now }).status, "HEALTHY");
  assert.throws(() => assessLive({ live: { ...live, buildSha: null }, repoAsOf: "2026-10-19", now }), /lacks build-sha/);
});

test("missing, future and invalid markers fail while a newer live snapshot is treated as a race", () => {
  assert.deepEqual(parseLiveMarkers('<meta name="data-as-of" content="2026-10-19" /><meta name="build-date" content="2026-10-21" /><meta name="build-sha" content="abc" />'), { asOf: "2026-10-19", buildDate: "2026-10-21", buildSha: "abc" });
  assert.throws(() => assessLive({ live: { ...live, asOf: null }, repoAsOf: "2026-10-19", now }), /data-as-of/);
  assert.throws(() => assessLive({ live: { ...live, buildDate: "2026-10-24" }, repoAsOf: "2026-10-19", now }), /Impossible build-date/);
  assert.throws(() => assessLive({ live: { ...live, buildSha: "bad" }, repoAsOf: "2026-10-19", now }), /Invalid build-sha/);
  assert.equal(assessLive({ live: { ...live, asOf: "2026-10-20" }, repoAsOf: "2026-10-19", now }).status, "RACE");
});
