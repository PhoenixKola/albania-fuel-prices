import { expect, test } from "@playwright/test";

const origin = "https://karburantisot.com";
const station = { type: "way", id: 390046236, center: { lat: 42.0711832, lon: 19.5069972 }, tags: { amenity: "fuel", name: "Kastrati" } };

test("failed station request retries immediately, preserves empty/error distinction, and changes radius on mobile", async ({ page, context }) => {
  await page.addInitScript(() => localStorage.setItem("karburanti-privacy-v1", JSON.stringify({ version: 1, necessary: true, advertising: false })));
  await context.grantPermissions(["geolocation"], { origin });
  await context.setGeolocation({ latitude: 42.0683, longitude: 19.5126 });
  await page.setViewportSize({ width: 360, height: 780 });
  let stationRequests = 0;
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if ([origin, "http://127.0.0.1:4175"].includes(url.origin)) {
      const response = await route.fetch({ url: `http://127.0.0.1:4175${url.pathname}${url.search}` });
      return route.fulfill({ response });
    }
    if (url.hostname === "fuel-proxy.fenixkola.workers.dev") {
      stationRequests++;
      if (stationRequests === 1) return route.fulfill({ status: 503, body: "unavailable" });
      return route.fulfill({ json: { elements: [station] } });
    }
    return route.abort();
  });
  await page.goto(`${origin}/stations`);
  await expect(page.locator(".nearbyAlert")).toBeVisible();
  await expect(page.locator(".nearbyTable .mutedBox")).toHaveCount(0);
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.locator(".nearbyRow")).toHaveCount(1);
  expect(stationRequests).toBe(2);
  await page.getByRole("button", { name: /2 km/i }).click();
  await page.getByRole("button", { name: /10 km/i }).click();
  await expect(page.locator(".nearbyRow")).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("GPS outside Albania uses the global station path", async ({ page, context }) => {
  await page.addInitScript(() => localStorage.setItem("karburanti-privacy-v1", JSON.stringify({ version: 1, necessary: true, advertising: false })));
  await context.grantPermissions(["geolocation"], { origin });
  await context.setGeolocation({ latitude: 52.52, longitude: 13.405 });
  let globalRequests = 0;
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if ([origin, "http://127.0.0.1:4175"].includes(url.origin)) {
      const response = await route.fetch({ url: `http://127.0.0.1:4175${url.pathname}${url.search}` });
      return route.fulfill({ response });
    }
    if (url.hostname === "overpass.private.coffee") {
      globalRequests++;
      return route.fulfill({ json: { elements: [{ type: "node", id: 1, lat: 52.521, lon: 13.406, tags: { amenity: "fuel", name: "Berlin station" } }] } });
    }
    return route.abort();
  });
  await page.goto(`${origin}/stations`);
  await expect(page.locator(".nearbyRow")).toContainText("Berlin station");
  expect(globalRequests).toBe(1);
});
