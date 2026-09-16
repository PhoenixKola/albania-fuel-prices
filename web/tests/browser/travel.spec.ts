import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tripSearch, defaultTrip } from "../../src/utils/trip";

const origin = "https://karburantisot.com";
const fixture = {
  as_of: "2026-09-08", region: "Europe", unit: "EUR/L", source: "Test price feed", source_url: "https://example.org/prices",
  fetched_at_utc: "2026-09-08T12:00:00Z", countries: [
    { country: "Albania", gasoline95_eur: 1.9, diesel_eur: 2, lpg_eur: null },
    { country: "Greece", gasoline95_eur: 1.8, diesel_eur: 1.5, lpg_eur: 0.8 },
  ],
};
// Every external request is intercepted; these tests cannot request a real ad or book a rental.
async function isolate(page: Page, options: { blockedAds?: boolean; noFx?: boolean; noPrices?: boolean; stale?: boolean; advertising?: boolean | null } = {}) {
  const counters = { adScripts: 0, bannerScripts: 0, adsenseScripts: 0, analytics: 0, errors: [] as string[] };
  if (options.advertising !== null) {
    await page.addInitScript((advertising) => localStorage.setItem("karburanti-privacy-v1", JSON.stringify({ version: 1, necessary: true, advertising })), options.advertising ?? false);
  }
  page.on("pageerror", (error) => counters.errors.push(error.message));
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if ([origin, "http://127.0.0.1:4175"].includes(url.origin)) {
      const response = await route.fetch({ url: `http://127.0.0.1:4175${url.pathname}${url.search}` });
      return route.fulfill({ response });
    }
    if (url.hostname === "raw.githubusercontent.com" && url.pathname.endsWith("latest.json")) {
      if (options.noPrices) return route.abort();
      return route.fulfill({ json: { ...fixture, as_of: options.stale ? "2020-01-01" : fixture.as_of } });
    }
    if (url.hostname === "cdn.jsdelivr.net") return options.noFx ? route.abort() : route.fulfill({ json: { date: "2026-09-08", eur: { all: 100, usd: 1.1 } } });
    if (url.hostname.includes("googlesyndication.com")) { counters.adsenseScripts++; return route.abort(); }
    if (url.hostname === "pl31351771.profitableratecpmnetwork.com") {
      counters.adScripts++;
      if (options.blockedAds) return route.abort();
      return route.fulfill({ contentType: "text/javascript", body: `
        var node = document.getElementById('container-d3a677f82e7972dbdc5767166cde992f');
        if (node) { var creative = document.createElement('div'); creative.dataset.testAd = 'filled'; creative.textContent = 'Test Native Banner'; creative.style.minHeight = '90px'; node.appendChild(creative); }
      ` });
    }
    if (url.hostname === "www.highrevenueformat.com") {
      counters.bannerScripts++;
      if (options.blockedAds) return route.abort();
      return route.fulfill({ contentType: "text/javascript", body: `
        var creative = document.createElement('div'); creative.dataset.testBanner = 'filled';
        creative.textContent = 'Test 300×250 Banner'; creative.style.width = '300px'; creative.style.height = '250px';
        document.body.appendChild(creative);
      ` });
    }
    if (url.hostname === "static.cloudflareinsights.com") { counters.analytics++; return route.fulfill({ contentType: "text/javascript", body: "" }); }
    return route.abort();
  });
  return counters;
}
test("homepage and Albania price page expose the travel entry points and bounded ad placements", async ({ page }) => {
  const counters = await isolate(page, { advertising: true });
  await page.goto(origin);
  await expect(page.locator(".homeExperience .travelLinks")).toBeVisible();
  await expect(page.locator(".homeExperience .adsterraPlacement")).toHaveCount(1);
  await page.locator(".homeExperience .travelLinks").getByRole("link", { name: "Calculate my trip", exact: false }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Trip fuel cost calculator");
  await page.goto(`${origin}/fuel-prices/albania`);
  await expect(page.locator('[data-rental-placement="albania"]')).toBeVisible();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(2);
  await expect(page.locator(".travelLinks").getByRole("link", { name: "Read the rental guide", exact: false })).toHaveAttribute("href", "/albania-car-rental-guide");
  await page.screenshot({ path: "test-results/albania-travel-placement.png", fullPage: true });
  expect(counters.errors).toEqual([]);
});

test("homepage search paths and cockpit anchor stay accessible and hash-aware", async ({ page }) => {
  const counters = await isolate(page);
  await page.goto(origin);
  await expect(page).toHaveTitle("Fuel Prices Today in Albania & Europe | Petrol, Diesel & LPG");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
  await expect(page.locator(".homeHeroQuickLinks")).toContainText("Albania fuel prices");
  await page.getByRole("link", { name: "Enter the cockpit", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/#price-tool`);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  const targetTop = await page.locator("#price-tool").evaluate((element) => element.getBoundingClientRect().top);
  const headerBottom = await page.locator(".navbar").evaluate((element) => element.getBoundingClientRect().bottom);
  expect(targetTop).toBeGreaterThanOrEqual(headerBottom - 2);
  await page.goBack();
  await expect(page).toHaveURL(`${origin}/`);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);

  await page.goto(`${origin}/#price-tool`);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  expect(counters.errors).toEqual([]);
});

test("polished travel UI follows the active theme and keeps compact CTAs", async ({ page }) => {
  const counters = await isolate(page);
  await page.goto(`${origin}/trip-cost-calculator`);
  await expect(page.locator(".travelHeroArt")).toHaveCSS("color", "rgb(8, 123, 88)");
  await expect(page.locator(".tripResults")).toHaveCSS("color", "rgb(16, 35, 29)");
  const lightResult = await page.locator(".tripResults").evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(lightResult).not.toContain("rgb(18, 54, 40)");

  const cta = page.locator(".travelLinks .editorialAction").first();
  await expect(cta).toHaveCSS("border-radius", "9px");
  expect((await cta.boundingBox())?.height).toBeLessThanOrEqual(42);
  await cta.focus();
  await expect(cta).toHaveCSS("outline-style", "solid");

  await page.getByRole("button", { name: "Tools", exact: true }).click();
  await expect(page.locator("#nav-tools-links").getByRole("link", { name: "Trip Calculator", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await expect(page.locator(".travelHeroArt")).toHaveCSS("color", "rgb(196, 246, 225)");
  await expect(page.locator(".tripResults")).toHaveCSS("color", "rgb(239, 255, 246)");
  const darkResult = await page.locator(".tripResults").evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(darkResult).toContain("rgb(18, 54, 40)");
  await expect(page.locator(".travelLinks .editorialActionPrimary")).toHaveCSS("color", "rgb(6, 32, 25)");
  await expect(page.locator(".travelLinks .editorialActionPrimary")).toHaveCSS("background-color", "rgb(97, 239, 189)");
  await expect(page.locator(".travelLinks .editorialAction:not(.editorialActionPrimary)")).toHaveCSS("color", "rgb(237, 248, 243)");
  await expect(page.locator(".travelExample .editorialAction")).toHaveCSS("color", "rgb(237, 248, 243)");

  await page.goto(`${origin}/fuel-prices/albania`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Albania fuel prices today");
  await expect(page.locator(".countryDecisionGrid")).toContainText("€100.00");
  await expect(page.locator(".countryDecisionGrid")).toContainText("Kosovo");
  expect(counters.errors).toEqual([]);
});

test("station search states its real data scope and exposes one page heading", async ({ page }) => {
  const counters = await isolate(page);
  await page.goto(`${origin}/stations`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fuel stations near me");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator("body")).toContainText("does not report each station's current pump price");
  expect(counters.errors).toEqual([]);
});

test("calculator: defaults, multi-country return, validation, sharing and canonical", async ({ page }) => {
  const counters = await isolate(page);
  await page.goto(`${origin}/trip-cost-calculator`);
  await expect(page.locator(".tripTotal")).toHaveText("€14.00");
  await page.getByRole("button", { name: "Add country" }).click();
  await page.locator(".tripLeg").nth(1).getByRole("combobox", { name: "Country", exact: true }).click();
  await page.getByRole("option", { name: "Greece", exact: true }).click();
  await page.getByLabel("One-way distance (km)").nth(1).fill("200");
  await page.getByLabel("Include the return journey").check();
  await expect(page.locator(".tripTotal")).toHaveText("€70.00");
  await expect(page.locator(".tripAll")).toContainText("7,000");
  await page.getByLabel("Consumption (L/100 km)").fill("");
  await expect(page.getByRole("button", { name: "Copy trip link" })).toBeDisabled();
  await expect(page.locator("#trip-validation")).toBeVisible();
  await page.getByLabel("Consumption (L/100 km)").fill("7");
  await page.getByRole("button", { name: "Copy trip link" }).click();
  const url = await page.getByLabel("Trip link", { exact: true }).inputValue();
  await page.goto(url);
  await expect(page.locator(".tripTotal")).toHaveText("€70.00");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}/trip-cost-calculator`);
  await page.goto(`${origin}/trip-cost-calculator?trip=broken`);
  await expect(page.getByText("This trip link could not be read", { exact: false })).toBeVisible();
  await expect(page.locator(".tripTotal")).toHaveText("€14.00");
  expect(counters.errors).toEqual([]);
});

test("homepage and comparison country pickers use the shared accessible menu", async ({ page }) => {
  const counters = await isolate(page);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(origin);
  const country = page.locator(".fuelHeroCard").getByRole("combobox");
  await country.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await country.click();
  await expect(page.getByRole("option", { name: "Greece", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await page.getByRole("button", { name: /Dark mode|Light mode/ }).click();
  await country.click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.getByRole("option", { name: "Greece", exact: true }).click();
  await expect(country).toContainText("Greece");
  await page.goto(`${origin}/compare`);
  const compare = page.locator(".watchlistAddPanel").getByRole("combobox");
  await compare.click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await expect(compare).toHaveAttribute("aria-expanded", "false");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(counters.errors).toEqual([]);
});

test("styled dropdowns support typeahead, keyboard selection, dismissal and inset arrows", async ({ page }) => {
  await isolate(page);
  await page.goto(`${origin}/trip-cost-calculator`);
  const country = page.getByRole("combobox", { name: "Country", exact: true });
  await country.focus();
  await page.keyboard.press("ArrowDown");
  await expect(country).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("option", { name: "Albania", exact: true })).toBeInViewport();
  await page.keyboard.press("End");
  await expect(page.getByRole("option").last()).toHaveAttribute("data-active", "true");
  await expect(page.getByRole("option").last()).toBeInViewport();
  await page.keyboard.press("Home");
  await expect(page.getByRole("option").first()).toHaveAttribute("data-active", "true");
  await page.keyboard.type("gree");
  await expect(page.getByRole("option", { name: "Greece", exact: true })).toHaveAttribute("data-active", "true");
  await page.keyboard.press("Enter");
  await expect(country).toHaveText("Greece");
  await expect(page.locator(".tripTotal")).toHaveText("€10.50");
  await country.click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  await expect(country).toHaveText("Greece");
  await expect(country).toBeFocused();
  await country.click();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(page.getByRole("listbox")).toHaveCount(0);
  const fuel = page.getByRole("combobox", { name: "Fuel type", exact: true });
  await fuel.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Home");
  await page.keyboard.press("Tab");
  await expect(fuel).toHaveText("Petrol 95");
  await expect(page.getByLabel("Include the return journey")).toBeFocused();
  await expect(page.locator(".tripTotal")).toHaveText("€12.60");
  const inset = await fuel.evaluate((element) => element.getBoundingClientRect().right - element.querySelector("svg")!.getBoundingClientRect().right);
  expect(inset).toBeGreaterThanOrEqual(16);
});

test("dropdown options can be selected by touch on a narrow screen", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 360, height: 900 } });
  const page = await context.newPage();
  await isolate(page);
  await page.goto(`${origin}/trip-cost-calculator`);
  const country = page.getByRole("combobox", { name: "Country", exact: true });
  await country.tap();
  await page.getByRole("option", { name: "Greece", exact: true }).tap();
  await expect(country).toHaveText("Greece");
  const fuel = page.getByRole("combobox", { name: "Fuel type", exact: true });
  await fuel.tap();
  await page.getByRole("option", { name: "Petrol 95", exact: true }).tap();
  await expect(fuel).toHaveText("Petrol 95");
  await expect(page.locator(".tripTotal")).toHaveText("€12.60");
  await context.close();
});

test("missing price and FX, stale dates and offline data stay explicit", async ({ page }) => {
  const counters = await isolate(page, { noFx: true, stale: true });
  await page.goto(`${origin}/trip-cost-calculator`);
  await expect(page.locator(".tripTotal")).toHaveText("€14.00");
  await expect(page.getByText("ALL conversion unavailable", { exact: false })).toBeVisible();
  await expect(page.getByText("These reference prices may be out of date", { exact: false }).first()).toBeVisible();
  await page.getByRole("combobox", { name: "Fuel type", exact: true }).click();
  await page.getByRole("option", { name: "LPG", exact: true }).click();
  await expect(page.locator(".tripTotal")).toHaveText("—");
  await expect(page.locator(".tripBreakdown")).toContainText("Price unavailable");
  await expect(page.getByText("A full budget needs a price", { exact: false })).toBeVisible();
  expect(counters.errors).toEqual([]);
});

test("offline feed does not prevent route planning", async ({ page }) => {
  const counters = await isolate(page, { noPrices: true, noFx: true });
  await page.goto(`${origin}/trip-cost-calculator`);
  await expect(page.getByText("Prices could not be loaded", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Add country" }).click();
  await expect(page.locator(".tripLeg")).toHaveCount(2);
  await expect(page.locator(".tripTotal")).toHaveText("—");
  expect(counters.errors).toEqual([]);
});

test("first visit, decline, accept and footer preference changes gate Adsterra", async ({ page }) => {
  const counters = await isolate(page, { advertising: null });
  await page.goto(origin);
  await expect(page.getByRole("dialog", { name: "Privacy choices" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close privacy choices" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Continue without advertising" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close privacy choices" })).toBeFocused();
  await page.screenshot({ path: "test-results/privacy-choices-desktop-light.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { document.documentElement.dataset.theme = "dark"; });
  await page.screenshot({ path: "test-results/privacy-choices-mobile-dark.png", fullPage: false });
  expect(counters.adScripts).toBe(0);
  expect(counters.bannerScripts).toBe(0);
  await page.getByRole("button", { name: "Continue without advertising" }).click();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(0);
  expect(counters.adScripts).toBe(0);
  expect(counters.bannerScripts).toBe(0);

  const privacyControl = page.getByRole("button", { name: "Privacy & cookies" });
  await privacyControl.click();
  await page.getByRole("button", { name: "Allow advertising" }).click();
  await expect(privacyControl).toBeFocused();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(1);
  await page.locator(".adsterraPlacement").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-test-ad='filled']")).toHaveText("Test Native Banner");
  expect(counters.adScripts).toBe(1);
  expect(counters.bannerScripts).toBe(0);

  await page.getByRole("button", { name: "Privacy & cookies" }).click();
  await page.getByRole("button", { name: "Continue without advertising" }).click();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(0);
  expect(counters.adScripts).toBe(1);
  expect(counters.bannerScripts).toBe(0);
  expect(counters.errors).toEqual([]);
});

test("SPA navigation keeps one unit of each format and respects short and excluded pages", async ({ page }) => {
  const counters = await isolate(page, { advertising: true });
  await page.goto(origin);
  await expect(page.locator(".adsterraPlacement")).toHaveCount(1);
  await page.locator(".adsterraPlacement").scrollIntoViewIfNeeded();
  await expect.poll(() => counters.adScripts).toBe(1);
  await page.locator('a[href="/fuel-prices/albania"]').first().click();
  await expect(page).toHaveURL(`${origin}/fuel-prices/albania`);
  await expect(page.locator(".adsterraPlacement")).toHaveCount(2);
  await page.locator('[data-ad-format="native"]').scrollIntoViewIfNeeded();
  await expect.poll(() => counters.adScripts).toBe(2);
  await page.locator(".adsterraBannerPlacement").scrollIntoViewIfNeeded();
  await expect.poll(() => counters.bannerScripts).toBe(1);
  await expect(page.frameLocator(".adsterraBannerSlot iframe").locator("[data-test-banner]")).toBeVisible();
  await expect(page.locator("#container-d3a677f82e7972dbdc5767166cde992f")).toHaveCount(1);
  await expect(page.locator('script[data-adsterra-native="true"]')).toHaveCount(1);
  await page.locator('a[href="/fuel-prices/greece"]').first().click();
  await expect(page).toHaveURL(`${origin}/fuel-prices/greece`);
  await expect(page.locator(".adsterraPlacement")).toHaveCount(2);
  await page.evaluate(() => document.querySelector('[data-ad-format="native"]')?.scrollIntoView());
  await expect.poll(() => counters.adScripts).toBe(3);
  await page.evaluate(() => document.querySelector(".adsterraBannerPlacement")?.scrollIntoView());
  await expect.poll(() => counters.bannerScripts).toBe(2);
  await expect(page.locator("#container-d3a677f82e7972dbdc5767166cde992f")).toHaveCount(1);
  await expect(page.locator(".adsterraBannerSlot iframe")).toHaveCount(1);
  await page.getByRole("button", { name: "Tools", exact: true }).click();
  await page.locator("#nav-tools-links").getByRole("link", { name: "Trip Calculator" }).click();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(1);
  await expect(page.locator(".adsterraBannerSlot iframe")).toHaveCount(0);
  expect(counters.bannerScripts).toBe(2);
  await page.locator(".brand").click();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(1);
  await expect.poll(() => counters.adScripts).toBeGreaterThanOrEqual(4);
  await page.locator('footer a[href="/privacy"]').first().click();
  await expect(page).toHaveURL(`${origin}/privacy`);
  await expect(page.locator(".adsterraPlacement")).toHaveCount(0);
  expect(counters.analytics).toBe(1);
  expect(counters.adsenseScripts).toBe(0);
  expect(counters.errors).toEqual([]);
});

test("blocked Adsterra collapses quietly and leaves the page usable", async ({ page }) => {
  const counters = await isolate(page, { blockedAds: true, advertising: true });
  await page.goto(`${origin}/albania-car-rental-guide`);
  await expect(page.locator(".adsterraPlacement")).toHaveCount(2);
  await page.locator('[data-ad-format="native"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-ad-format="native"]')).toHaveAttribute("data-state", "empty");
  await page.locator('[data-ad-format="banner"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-ad-format="banner"]')).toHaveAttribute("data-state", "empty");
  await expect(page.locator(".adsterraPlacement:visible")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(counters.adScripts).toBe(1);
  expect(counters.bannerScripts).toBe(1);
  expect(counters.errors).toEqual([]);
});

test("both ad formats need consent and stop after revocation", async ({ page }) => {
  const counters = await isolate(page, { advertising: false });
  await page.goto(`${origin}/albania-car-rental-guide`);
  await expect(page.locator(".adsterraPlacement")).toHaveCount(0);
  expect(counters.adScripts + counters.bannerScripts).toBe(0);
  await page.getByRole("button", { name: "Privacy & cookies" }).click();
  await page.getByRole("button", { name: "Allow advertising" }).click();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(2);
  await page.locator('[data-ad-format="native"]').scrollIntoViewIfNeeded();
  await page.locator('[data-ad-format="banner"]').scrollIntoViewIfNeeded();
  await expect.poll(() => counters.adScripts).toBe(1);
  await expect.poll(() => counters.bannerScripts).toBe(1);
  await page.getByRole("button", { name: "Privacy & cookies" }).click();
  await page.getByRole("button", { name: "Continue without advertising" }).click();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(0);
  await expect(page.locator(".adsterraBannerSlot iframe")).toHaveCount(0);
  expect(counters.errors).toEqual([]);
});

test("local previews do not load ad or analytics scripts", async ({ page }) => {
  const counters = await isolate(page, { advertising: true });
  await page.goto("http://127.0.0.1:4175/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".adsterraPlacement")).toHaveCount(0);
  expect(counters.adScripts).toBe(0); expect(counters.bannerScripts).toBe(0); expect(counters.analytics).toBe(0);
});

test("public language picker restores and persists Albanian on desktop and mobile", async ({ page }) => {
  const counters = await isolate(page);
  await page.goto(`${origin}/trip-cost-calculator`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Trip fuel cost calculator");
  await page.getByRole("button", { name: "Switch to Albanian" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Llogaritësi i kostos së karburantit");
  await expect(page.locator("html")).toHaveAttribute("lang", "sq");
  await page.getByRole("button", { name: "Privatësia & cookies" }).click();
  await expect(page.getByRole("dialog", { name: "Zgjedhjet e privatësisë" })).toBeVisible();
  await page.getByRole("button", { name: "Mbyll zgjedhjet e privatësisë" }).click();
  const referral = page.locator('[data-rental-placement="calculator"]');
  await expect(referral).toContainText("Mund të marrim komision");
  await expect(referral.locator("a")).toHaveAttribute("rel", "sponsored noopener");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "sq");
  await page.goto(`${origin}/road-status/shkoder-theth`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kushtet dhe statusi i rrugëve në Shqipëri");
  await expect(page.getByRole("button", { name: "Kontrollo itinerarin", exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Shiko burimin", exact: false }).first()).toBeVisible();
  await page.setViewportSize({ width: 360, height: 900 });
  await page.locator(".hamburgerBtn").click();
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(counters.errors).toEqual([]);
});

test("disabled-ad visual matrix stays responsive across priority routes and themes", async ({ page }) => {
  const counters = await isolate(page, { advertising: false });
  await page.goto(origin);
  const paths = ["/", "/fuel-prices/albania", "/fuel-prices/greece", "/trip-cost-calculator", "/road-status", "/road-status/tirana-theth", "/stations", "/albania-car-rental-guide", "/road-trip-fuel-guide", "/how-fuel-prices-work", "/europe-fuel-comparison", "/privacy"];
  for (const width of [390, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"]) {
      for (const path of paths) {
        await page.evaluate((value) => localStorage.setItem("theme", value), theme);
        await page.goto(`${origin}${path}`);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.locator(".adsterraPlacement")).toHaveCount(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }
    }
  }
  expect(counters.adsenseScripts).toBe(0);
  expect(counters.errors).toEqual([]);
});

test("private Albanian render fixtures retain translated content and fit both screen sizes", async ({ page }) => {
  await isolate(page);
  for (const width of [360, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://127.0.0.1:4175/qa-sq-trip-cost-calculator.html");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Llogaritësi i kostos së karburantit");
    await expect(page.getByRole("combobox", { name: "Vendi", exact: true })).toContainText("Shqipëri");
    await expect(page.locator(".tripMetrics")).toContainText("Karburanti i nevojshëm");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/calculator-sq-${width}.png`, fullPage: true });
    await page.goto("http://127.0.0.1:4175/qa-sq-albania-car-rental-guide.html");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Marrja e një makine me qira në Shqipëri");
    await expect(page.locator(".rentalReferral")).toContainText("Mund të marrim komision");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await expect(readFile(resolve("dist/qa-sq-trip-cost-calculator.html"))).rejects.toThrow();
});

for (const width of [360, 768, 1366]) test(`layout, theme and keyboard controls at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await isolate(page);
  await page.goto(`http://127.0.0.1:4175/trip-cost-calculator${tripSearch(defaultTrip())}`);
  await expect(page.locator(".tripTotal")).toHaveText("€14.00");
  await page.getByLabel("One-way distance (km)").focus();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("300");
  await expect(page.locator(".tripTotal")).toHaveText("€42.00");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/calculator-${width}-light.png`, fullPage: true });
  await page.getByRole("combobox", { name: "Country", exact: true }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.screenshot({ path: `test-results/dropdown-country-${width}-light.png`, animations: "disabled" });
  await page.keyboard.press("Escape");
  const themeButton = page.getByRole("button", { name: "Toggle theme", exact: true });
  if (await themeButton.isVisible()) await themeButton.click();
  else {
    await page.getByRole("button", { name: "Toggle menu" }).click();
    await page.getByRole("button", { name: /Dark mode|Light mode/ }).click();
  }
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({ path: `test-results/calculator-${width}-dark.png`, fullPage: true });
  await page.getByRole("combobox", { name: "Fuel type", exact: true }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.screenshot({ path: `test-results/dropdown-fuel-${width}-dark.png`, animations: "disabled" });
  await page.keyboard.press("Escape");
  await page.goto("http://127.0.0.1:4175/albania-car-rental-guide");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Renting a car in Albania");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/rental-guide-${width}.png`, fullPage: true });
});

test("built pages work without JavaScript and expose canonical, schema, sitemap and current data", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const latest = JSON.parse(await readFile(resolve("../data/latest.json"), "utf8"));
  const sitemap = await readFile(resolve("dist/sitemap.xml"), "utf8");
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    const file = url.pathname.startsWith("/assets/") ? `dist${url.pathname}` : `dist${url.pathname}.html`;
    try { return route.fulfill({ path: resolve(file) }); } catch { return route.abort(); }
  });
  for (const path of ["/trip-cost-calculator", "/albania-car-rental-guide"]) {
    await page.goto(`${origin}${path}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}${path}`);
    await expect(page.locator("body")).toContainText(latest.as_of);
    const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
    expect(schema.url).toBe(`${origin}${path}`);
    expect(sitemap).toContain(`${origin}${path}`);
    if (await page.locator(".rentalReferral").count()) {
      await expect(page.locator(".rentalReferral a")).toHaveAttribute("rel", "sponsored noopener");
      await expect(page.locator(".rentalReferral")).toContainText("may earn a commission");
    }
  }
  const roadPath = "/road-status/tirana-korce";
  await page.goto(`${origin}${roadPath}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Albania Road Conditions & Route Status");
  await expect(page.locator("body")).toContainText("Tirana → Korçë");
  await expect(page.locator("body")).toContainText("Albanian State Police");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}${roadPath}`);
  const roadSchema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(roadSchema.url).toBe(`${origin}${roadPath}`);
  expect(sitemap).toContain(`${origin}${roadPath}`);

  await page.goto(`${origin}/road-status/tirana-durres`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(sitemap).not.toContain(`${origin}/road-status/tirana-durres`);
  await context.close();
});

test("Road Reality restores and changes curated route URLs with sourced status details", async ({ page }) => {
  const counters = await isolate(page);
  await page.goto(`${origin}/road-status/shkoder-theth`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Albania Road Conditions & Route Status");
  await expect(page.getByRole("heading", { level: 2, name: "Shkodër → Theth" })).toBeVisible();
  await expect(page.locator(".roadStatusBadgeLarge")).toHaveText(/UNKNOWN/);
  await expect(page.getByText("No route-specific current authority statement", { exact: false })).toBeVisible();
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", `${origin}/road-status/shkoder-theth`);
  await expect(page.getByRole("link", { name: "Calculate fuel cost" })).toHaveAttribute("href", "/trip-cost-calculator");
  await expect(page.locator('[data-rental-placement="roadTrip"]')).toBeVisible();
  await expect(page.getByText("Report a newer condition", { exact: true })).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/safe to drive|definitely open|safe road/i);
  await expect(page.getByText("Check route displays the latest stored source review.", { exact: false })).toBeVisible();
  const reviewedBefore = await page.locator(".roadMetricTimestamp").textContent();
  await page.getByRole("button", { name: "Check route", exact: false }).click();
  await expect(page.locator(".roadMetricTimestamp")).toHaveText(reviewedBefore ?? "");
  await page.reload();
  await expect(page.locator(".roadMetricTimestamp")).toHaveText(reviewedBefore ?? "");

  const from = page.getByRole("combobox", { name: "From", exact: true });
  await from.focus();
  await page.keyboard.press("t");
  await page.keyboard.press("Enter");
  await expect(from).toHaveText("Tirana");
  const to = page.getByRole("combobox", { name: "To", exact: true });
  await to.click();
  await page.getByRole("option", { name: "Korçë", exact: true }).click();
  await page.getByRole("button", { name: "Check route", exact: false }).click();
  await expect(page).toHaveURL(`${origin}/road-status/tirana-korce`);
  await expect(page.locator(".roadStatusBadgeLarge")).toHaveText(/RESTRICTED/);
  await expect(page.getByRole("link", { name: "View source", exact: false }).first()).toHaveAttribute("href", /asp\.gov\.al\/bllokohet-levizja/);
  await expect(page.getByText("Source review ·", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Check official sources", exact: false })).toHaveAttribute("href", /asp\.gov\.al/);
  expect(counters.errors).toEqual([]);
});

test("Road Reality map tiles cover the responsive viewport and every marker is labelled", async ({ page }) => {
  const counters = await isolate(page);
  await page.goto(`${origin}/road-status/shkoder-koman`);
  const map = page.locator(".roadMap");
  const assertCoverage = async () => {
    await expect.poll(() => map.evaluate((element) => Math.abs(Number((element as HTMLElement).dataset.mapWidth) - element.clientWidth))).toBeLessThanOrEqual(1);
    const coverage = await map.evaluate((element) => {
      const frame = element.getBoundingClientRect();
      const tiles = [...element.querySelectorAll<HTMLImageElement>(".roadMapTiles img")].map((tile) => tile.getBoundingClientRect());
      const markers = [...element.querySelectorAll<HTMLElement>(".roadMapPoint")].map((marker) => marker.getBoundingClientRect());
      return {
        left: Math.min(...tiles.map((tile) => tile.left)) <= frame.left,
        right: Math.max(...tiles.map((tile) => tile.right)) >= frame.right,
        top: Math.min(...tiles.map((tile) => tile.top)) <= frame.top,
        bottom: Math.max(...tiles.map((tile) => tile.bottom)) >= frame.bottom,
        markersInside: markers.every((marker) => marker.left >= frame.left && marker.right <= frame.right && marker.top >= frame.top && marker.bottom <= frame.bottom),
      };
    });
    expect(coverage).toEqual({ left: true, right: true, top: true, bottom: true, markersInside: true });
  };
  await assertCoverage();
  const markers = map.locator(".roadMapPoint");
  await expect(markers).toHaveCount(3);
  for (let index = 0; index < await markers.count(); index++) await expect(markers.nth(index).locator("span")).toBeVisible();
  await page.setViewportSize({ width: 360, height: 900 });
  await assertCoverage();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(counters.errors).toEqual([]);
});

test("Road Reality metrics, sections and warning are responsive and theme-aware on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  const counters = await isolate(page);
  await page.goto(`${origin}/road-status/tirana-bovilla`);
  await expect(page.locator(".roadMap")).toBeVisible();
  await expect(page.getByRole("link", { name: /OpenStreetMap contributors/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const lightPanel = await page.locator(".roadResultCard").evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(lightPanel).toBe("rgb(255, 254, 250)");
  await expect(page.locator(".roadResultFacts > div")).toHaveCount(5);
  const metricRows = await page.locator(".roadResultFacts > div").evaluateAll((items) => [...new Set(items.map((item) => Math.round(item.getBoundingClientRect().top)))]);
  expect(metricRows).toHaveLength(2);
  await expect(page.locator(".roadSectionCard")).toHaveCount(3);
  await expect(page.locator(".roadSectionCard").first().locator(".roadStatusBadge")).toHaveText(/UNKNOWN/);
  await expect(page.locator(".roadSectionCard").first()).toContainText("No recent section-specific authority notice found.");
  await expect(page.locator(".roadDisclaimer")).toContainText("Before you drive");
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await page.getByRole("button", { name: /Dark mode/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".roadResultCard")).toHaveCSS("background-color", "rgb(11, 28, 24)");
  await page.screenshot({ path: "test-results/road-reality-mobile-dark.png", fullPage: true });
  expect(counters.errors).toEqual([]);
});

test("priority landing pages ship unique metadata, one H1 and slashless canonicals", async () => {
  const pages = [
    { path: "/", file: "dist/index.html", title: "Fuel Prices Today in Albania & Europe | Petrol, Diesel & LPG" },
    { path: "/fuel-prices/albania", file: "dist/fuel-prices/albania.html", title: "Fuel Prices in Albania Today | Petrol, Diesel & LPG" },
    { path: "/fuel-prices/croatia", file: "dist/fuel-prices/croatia.html", title: "Croatia Fuel Prices Today | Petrol, Diesel & LPG per Litre" },
    { path: "/fuel-prices/greece", file: "dist/fuel-prices/greece.html", title: "Greece Fuel Prices Today | Petrol & Diesel per Litre" },
    { path: "/fuel-prices/portugal", file: "dist/fuel-prices/portugal.html", title: "Portugal Fuel Prices Today | Petrol & Diesel per Litre" },
    { path: "/insights", file: "dist/insights.html", title: "Albania Fuel Price Analysis & Balkan Market Insights" },
    { path: "/stations", file: "dist/stations.html", title: "Fuel Stations Near Me | Map, Distance & Opening Hours" },
  ];
  const titles = new Set<string>();
  for (const entry of pages) {
    const html = await readFile(resolve(entry.file), "utf8");
    expect(html.match(/<h1\b/g)?.length).toBe(1);
    expect(html.match(/<link rel="canonical"/g)?.length).toBe(1);
    expect(html.match(/<meta name="description"/g)?.length).toBe(1);
    const renderedTitle = html.match(/<title>(.*?)<\/title>/)?.[1].replaceAll("&amp;", "&");
    expect(renderedTitle).toBe(entry.title);
    expect(html).toContain(`<link rel="canonical" href="${origin}${entry.path === "/" ? "" : entry.path}"`);
    titles.add(entry.title);
  }
  expect(titles.size).toBe(pages.length);
  const sitemap = await readFile(resolve("dist/sitemap.xml"), "utf8");
  expect(sitemap).not.toMatch(/<loc>[^<]+\/<\/loc>/);
});
