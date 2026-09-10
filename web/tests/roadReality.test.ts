import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROAD_ROUTES, getRoadRoute } from "../src/data/roadRoutes";
import { ROAD_STATUSES } from "../src/models/road";
import { countRouteStatuses, roadFreshness, routeShareText } from "../src/utils/roadReality";
import { roadRouteDescription, roadRouteTitle } from "../src/utils/roadSeo";
import { buildRoadRealityPrerenderRoutes, renderRoadRealityStatic } from "../scripts/roadRealityPrerender";
import { readMonetizationConfig } from "../src/config/monetization";

test("Road Reality seeds a bounded, unique, conservatively sourced route set", () => {
  assert.ok(ROAD_ROUTES.length >= 15 && ROAD_ROUTES.length <= 20);
  assert.equal(ROAD_ROUTES.length, 19);
  assert.equal(new Set(ROAD_ROUTES.map((route) => route.slug)).size, ROAD_ROUTES.length);
  assert.deepEqual(ROAD_STATUSES, ["OPEN", "CAUTION", "RESTRICTED", "CLOSED", "UNKNOWN"]);

  const statusCounts = Object.fromEntries(ROAD_STATUSES.map((status) => [status, ROAD_ROUTES.filter((route) => route.overallStatus === status).length]));
  assert.deepEqual(statusCounts, { OPEN: 0, CAUTION: 0, RESTRICTED: 2, CLOSED: 0, UNKNOWN: 17 });

  for (const route of ROAD_ROUTES) {
    assert.equal(getRoadRoute(route.slug), route);
    assert.ok(route.routeSections.length >= 3);
    assert.ok(route.geometry.length >= 3);
    assert.match(route.lastCheckedAt, /^\d{4}-\d{2}-\d{2}T/);
    assert.ok(route.sources.length >= 3);
    assert.doesNotMatch(`${route.statusExplanation} ${route.notes.join(" ")}`, /safe to drive|definitely open|safe road|suitable for every rental car|no snow chains required/i);
    for (const source of route.sources) {
      assert.doesNotThrow(() => new URL(source.url));
      assert.match(source.url, /^https:\/\//);
      assert.ok(source.authority && source.checkedAt && source.geographicScope && source.note);
    }
    for (const section of route.routeSections) {
      assert.ok(section.sourceIds.length > 0);
      for (const sourceId of section.sourceIds) assert.ok(route.sources.some((source) => source.id === sourceId), `${route.slug}/${section.id} references ${sourceId}`);
    }
    if (route.overallStatus !== "UNKNOWN") {
      assert.ok(route.sources.some((source) => source.sourceType === "OFFICIAL_NOTICE" && source.derivedStatus === route.overallStatus));
    }
  }
});

test("freshness labels today, yesterday, recent, stale and invalid records centrally", () => {
  const now = new Date("2026-09-10T12:00:00Z");
  assert.deepEqual(roadFreshness("2026-09-10T01:00:00Z", now), { ageDays: 0, label: "Checked today", state: "fresh" });
  assert.deepEqual(roadFreshness("2026-09-09T01:00:00Z", now), { ageDays: 1, label: "Checked yesterday", state: "fresh" });
  assert.deepEqual(roadFreshness("2026-09-07T01:00:00Z", now), { ageDays: 3, label: "Checked 3 days ago", state: "recent" });
  assert.deepEqual(roadFreshness("2026-09-06T01:00:00Z", now), { ageDays: 4, label: "Stale · checked 4 days ago", state: "stale" });
  assert.deepEqual(roadFreshness("bad-date", now), { ageDays: null, label: "Unknown", state: "unknown" });
  assert.deepEqual(roadFreshness(null, now), { ageDays: null, label: "Unknown", state: "unknown" });
});

test("route-specific static pages contain useful provenance, safe wording, metadata and stable links", () => {
  const route = getRoadRoute("tirana-korce");
  assert.ok(route);
  const html = renderRoadRealityStatic(route);
  assert.match(html, /Albania Road Conditions &amp; Route Status/);
  assert.match(html, /Tirana → Korçë/);
  assert.match(html, /Albanian State Police/);
  assert.match(html, /Calculate fuel cost/);
  assert.match(html, /View source/);
  assert.doesNotMatch(html, /safe to drive|definitely open|safe road/i);
  assert.equal(countRouteStatuses(route).RESTRICTED, 1);
  assert.match(routeShareText(route, "https://karburantisot.com/road-status/tirana-korce"), /RESTRICTED/);
  assert.match(roadRouteTitle(route), /Tirana to Korçë Road Conditions/);
  assert.ok(roadRouteDescription(route).length >= 80 && roadRouteDescription(route).length <= 160);

  const pages = buildRoadRealityPrerenderRoutes();
  assert.equal(pages.length, ROAD_ROUTES.length + 1);
  assert.ok(pages.some((page) => page.path === "/road-status"));
  for (const item of ROAD_ROUTES) {
    const page = pages.find((candidate) => candidate.path === `/road-status/${item.slug}`);
    assert.ok(page);
    assert.equal(Boolean(page.noindex), !item.indexable);
  }
});

test("sitemap, affiliate fallback, analytics and disabled-ad guards remain wired to existing architecture", () => {
  const sitemapSource = readFileSync(resolve("scripts/generate-sitemap.ts"), "utf8");
  assert.match(sitemapSource, /ROAD_ROUTES\.filter\(\(route\) => route\.indexable\)/);
  assert.match(sitemapSource, /`\/road-status\/\$\{route\.slug\}`/);

  const affiliate = "https://www.discovercars.com/albania?a_aid=road-reality-test";
  const config = readMonetizationConfig({ VITE_RENTAL_URL: affiliate });
  assert.equal(config.rentalLinks.roadTrip, affiliate);
  assert.equal(config.adsEnabled, false);

  const provider = readFileSync(resolve("src/components/ads/MonetizationProvider.tsx"), "utf8");
  assert.equal(provider.match(/script\.src = "https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js"/g)?.length, 1);
  assert.match(provider, /querySelector\('script\[src\*="static\.cloudflareinsights\.com\/beacon\.min\.js"\]'\)/);
  assert.doesNotMatch(provider, /gtag|google-analytics\.com/);
});
