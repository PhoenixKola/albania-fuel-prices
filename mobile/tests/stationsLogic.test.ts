import assert from "node:assert/strict";
import { test } from "node:test";
import fixture from "./fixtures/v5-elements.json";
import { searchAlbaniaPlaces } from "../src/data/placeSearch";
import { acquireLocation, permissionStep } from "../src/utils/locationAcquisition";
import { shouldLocateOnFocus, validPosition } from "../src/utils/locationPolicy";
import { readStationCache } from "../src/utils/stationCache";
import { inAlbaniaSnapshotArea, requestStations } from "../src/utils/stationRequest";
import { parseStationSnapshot } from "../src/utils/stationSnapshot";

const position = (lat: number, lon: number, timestamp = Date.now(), accuracy = 30) => ({ timestamp, coords: { latitude: lat, longitude: lon, accuracy } });
const center = { lat: 42.0683, lon: 19.5126 };

test("permission states map to locate, explanation, or Settings", () => {
  assert.equal(permissionStep("granted", true), "locate");
  assert.equal(permissionStep("unknown", true), "prompt");
  assert.equal(permissionStep("denied", true), "prompt");
  assert.equal(permissionStep("denied", false), "settings");
});

test("foreground and tab focus do not loop GPS or replace a chosen place", () => {
  assert.equal(shouldLocateOnFocus(false, "granted", "device", false, 0), false);
  assert.equal(shouldLocateOnFocus(true, "granted", "device", false, 0), true);
  assert.equal(shouldLocateOnFocus(true, "granted", "device", true, 0), false);
  assert.equal(shouldLocateOnFocus(true, "granted", "city", true, 0), false);
  assert.equal(shouldLocateOnFocus(true, "granted", "lastKnown", true, 10_000, 70_001), true);
  assert.equal(shouldLocateOnFocus(true, "denied", "device", false, 0), false);
});

test("recent fix enforces age and accuracy; a fresh fix is not mislabelled", () => {
  const now = Date.now();
  assert.deepEqual(validPosition(position(42.2, 19.4, now - 1000, 40), true, now), { lat: 42.2, lon: 19.4 });
  assert.equal(validPosition(position(42.2, 19.4, now - 11 * 60_000), true, now), null);
  assert.equal(validPosition(position(42.2, 19.4, now, 3000), true, now), null);
  assert.equal(validPosition(position(999, 19.4), false, now), null);
});

test("services off and cold GPS timeout finish with actionable outcomes", async () => {
  const off = await acquireLocation({ servicesEnabled: async () => false, recent: async () => null, fresh: async () => null }, () => false, () => true, () => false);
  assert.equal(off.issue, "servicesOff");
  const cold = await acquireLocation({ servicesEnabled: async () => true, recent: async () => null, fresh: () => new Promise(() => {}) }, () => false, () => true, () => false, { services: 10, recent: 10, fresh: 15 });
  assert.equal(cold.issue, "noFix");
});

test("recent fix is offered before fresh GPS completes, then upgraded", async () => {
  let finishFresh!: (value: ReturnType<typeof position>) => void;
  const seen: string[] = [];
  const run = acquireLocation({ servicesEnabled: async () => true, recent: async () => position(42.2, 19.4), fresh: () => new Promise((resolve) => { finishFresh = resolve; }) },
    (_, source) => { seen.push(source); return true; }, () => true, () => seen.length > 0);
  await new Promise((resolve) => setTimeout(resolve, 5));
  assert.deepEqual(seen, ["lastKnown"]);
  finishFresh(position(42.201, 19.401));
  assert.equal((await run).issue, null);
  assert.deepEqual(seen, ["lastKnown", "device"]);
});

test("a manual place selection supersedes pending GPS without overwriting it", async () => {
  let current = true;
  let finishFresh!: (value: ReturnType<typeof position>) => void;
  const seen: string[] = [];
  const run = acquireLocation({ servicesEnabled: async () => true, recent: async () => null, fresh: () => new Promise((resolve) => { finishFresh = resolve; }) },
    (_, source) => { seen.push(source); return true; }, () => current, () => false);
  await new Promise((resolve) => setTimeout(resolve, 5));
  current = false;
  finishFresh(position(42.2, 19.4));
  assert.equal((await run).cancelled, true);
  assert.deepEqual(seen, []);
});

test("offline place search includes non-presets and ignores Albanian accents", () => {
  for (const name of ["Koplik", "Lezhe", "Puke"]) assert.ok(searchAlbaniaPlaces(name).length > 0, name);
  assert.equal(searchAlbaniaPlaces("x").length, 0);
  assert.ok(searchAlbaniaPlaces("Tirana").length > 0);
});

test("v5 node and way elements parse, sort by real distance, and permit empty results", () => {
  const stations = parseStationSnapshot(fixture, center);
  assert.equal(stations.length, 3);
  assert.equal(stations[0].id.startsWith("way:"), true);
  assert.equal(stations[2].id, "node:4548140893");
  assert.equal(stations[1].isOpen24Hours, true);
  assert.deepEqual(parseStationSnapshot({ elements: [] }, center), []);
  assert.throws(() => parseStationSnapshot({ message: "bad" }, center), /invalid-response/);
});

test("Albania snapshot and international GPS use appropriate endpoints", async () => {
  const urls: string[] = [];
  const fetcher = (async (url: string) => { urls.push(url); return { ok: true, json: async () => fixture } as Response; }) as typeof fetch;
  const signal = new AbortController().signal;
  assert.equal(inAlbaniaSnapshotArea(center), true);
  assert.equal(inAlbaniaSnapshotArea({ lat: 42.21361, lon: 19.43639 }), true); // Koplik
  assert.equal(inAlbaniaSnapshotArea({ lat: 42.44, lon: 19.26 }), false); // Podgorica
  assert.equal((await requestStations(center, 5000, signal, fetcher)).source, "snapshot");
  assert.ok(urls[0].startsWith("https://fuel-proxy.fenixkola.workers.dev?"));
  assert.equal((await requestStations({ lat: 52.52, lon: 13.405 }, 2000, signal, fetcher)).source, "global");
  assert.ok(urls[1].startsWith("https://overpass.private.coffee/"));
});

test("station request surfaces HTTP, network and abort failures; immediate retry is allowed", async () => {
  let calls = 0;
  const fetcher = (async () => { calls++; return calls === 1 ? { ok: false, status: 503 } as Response : { ok: true, json: async () => ({ elements: [] }) } as Response; }) as typeof fetch;
  const signal = new AbortController().signal;
  await assert.rejects(requestStations(center, 5000, signal, fetcher), /http-503/);
  assert.equal((await requestStations(center, 5000, signal, fetcher)).source, "snapshot");
  assert.equal(calls, 2);
  await assert.rejects(requestStations(center, 5000, signal, (async () => { throw new Error("offline"); }) as typeof fetch), /offline/);
  const aborted = new AbortController(); aborted.abort();
  await assert.rejects(requestStations(center, 5000, aborted.signal, (async (_, init) => { if (init?.signal?.aborted) throw new Error("aborted"); return {} as Response; }) as typeof fetch), /aborted/);
});

test("international search tries a second global provider after a failed first request", async () => {
  const urls: string[] = [];
  const fetcher = (async (input: RequestInfo | URL) => {
    urls.push(String(input));
    return urls.length === 1 ? { ok: false, status: 503 } as Response : { ok: true, json: async () => ({ elements: [] }) } as Response;
  }) as typeof fetch;
  const result = await requestStations({ lat: 52.52, lon: 13.405 }, 2000, new AbortController().signal, fetcher);
  assert.equal(result.source, "global");
  assert.match(urls[0], /overpass\.private\.coffee/);
  assert.match(urls[1], /overpass-api\.de/);
});

test("cache distinguishes current, stale and different centre/radius", () => {
  const now = Date.now();
  const raw = JSON.stringify({ savedAtUtc: new Date(now - 20 * 60_000).toISOString(), center, radiusM: 5000, stations: parseStationSnapshot(fixture, center), source: "snapshot" });
  assert.equal(readStationCache(raw, center, 5000, true, now), null);
  assert.equal(readStationCache(raw, center, 5000, false, now)?.stations.length, 3);
  assert.equal(readStationCache(raw, { lat: 42.3, lon: 19.5 }, 5000, false, now), null);
  assert.equal(readStationCache(raw, center, 2000, false, now), null);
});
