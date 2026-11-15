// Run after npm run build, with vite preview on port 4178. Headless smoke only.
import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.env.LOCALIZED_TEST_BASE_URL ?? "http://127.0.0.1:4178";
const sq = "/sq/cmimet-e-karburanteve-ne-shqiperi";
const en = "/fuel-prices/albania";
const latest = readFileSync(new URL("../../data/latest.json", import.meta.url), "utf8");
const browser = await chromium.launch();
mkdirSync("test-results", { recursive: true });
try {
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  assert.equal((await staticPage.goto(`${base}${sq}`)).status(), 200);
  assert.equal(await staticPage.locator("html").getAttribute("lang"), "sq");
  assert.equal(await staticPage.locator("h1").count(), 1);
  assert.match(await staticPage.locator("main").innerText(), /Naftë \(diesel\)/);
  assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute("href"), `https://karburantisot.com${sq}`);
  await noJs.close();

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  // Deterministic public-feed responses; the local page still runs its real route/layout code.
  await context.route("**/data/latest.json", route => route.fulfill({ contentType: "application/json", body: latest }));
  await context.route("**/v1/currencies/eur.json", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ date: new Date().toISOString().slice(0, 10), eur: { all: 100, usd: 1.1 } }) }));
  await context.addInitScript(() => { localStorage.setItem("lang", "en"); localStorage.setItem("theme", "dark"); });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${base}${sq}`);
  await page.getByRole("button", { name: "Lexo në anglisht", exact: true }).waitFor();
  await page.getByRole("button", { name: "Vazhdo pa reklama", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("lang"), "sq");
  assert.doesNotMatch(await page.locator("body").innerText(), /November|Current fuel prices|Country market briefing/);
  await page.screenshot({ path: "test-results/sq-desktop-dark.png", fullPage: true });
  await page.getByRole("button", { name: "Lexo në anglisht", exact: true }).click();
  await page.waitForURL(`**${en}`);
  await page.getByRole("button", { name: "Switch to Albanian", exact: true }).click();
  await page.waitForURL(`**${sq}`);
  await page.waitForFunction(() => document.documentElement.lang === "sq");
  assert.equal(await page.locator("html").getAttribute("lang"), "sq");
  assert.equal(await page.locator('link[hreflang="sq"]').getAttribute("href"), `https://karburantisot.com${sq}`);
  assert.equal(await page.locator('link[hreflang="en"]').getAttribute("href"), `https://karburantisot.com${en}`);
  for (const theme of ["dark", "light"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme}: mobile horizontal overflow`);
    await page.screenshot({ path: `test-results/sq-mobile-${theme}.png`, fullPage: true });
  }
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "200% text horizontal overflow");
  await page.locator('main a[href="/methodology"]').focus();
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("href")), "/methodology");
  assert.deepEqual(errors, []);
  await context.close();
  console.log("Passed: no-JS 200/Albanian content, desktop/mobile themes, URL language-switch round trip, 200% text, keyboard link focus and runtime errors.");
} finally { await browser.close(); }
