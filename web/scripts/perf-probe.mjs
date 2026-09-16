import { chromium } from "@playwright/test";

const origin = process.env.PERF_ORIGIN || "http://127.0.0.1:4180";
const paths = ["/", "/fuel-prices/albania", "/trip-cost-calculator", "/road-status", "/road-status/tirana-theth", "/stations", "/albania-car-rental-guide"];
const browser = await chromium.launch({ headless: true });
try {
  for (const path of paths) {
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: "block" });
    await context.route("**/*", (route) => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__perf = { lcp: 0, cls: 0, longTasks: 0, shifts: [] };
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__perf.lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) { window.__perf.cls += entry.value; window.__perf.shifts.push({ value: entry.value, sources: entry.sources?.map((source) => ({ tag: source.node?.tagName, className: source.node?.className, previous: source.previousRect, current: source.currentRect })) }); } }).observe({ type: "layout-shift", buffered: true });
      try { new PerformanceObserver((list) => { window.__perf.longTasks += list.getEntries().length; }).observe({ type: "longtask", buffered: true }); } catch { /* unsupported */ }
    });
    await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const metrics = await page.evaluate((traceShifts) => {
      const resources = performance.getEntriesByType("resource");
      const navigation = performance.getEntriesByType("navigation")[0];
      const firstParty = resources.filter((entry) => entry.name.startsWith(location.origin));
      return {
        requests: firstParty.length + 1,
        transferBytes: Math.round(firstParty.reduce((sum, entry) => sum + entry.transferSize, 0) + navigation.transferSize),
        jsBytes: Math.round(firstParty.filter((entry) => entry.name.endsWith(".js")).reduce((sum, entry) => sum + entry.transferSize, 0)),
        lcpMs: Math.round(window.__perf.lcp), cls: Number(window.__perf.cls.toFixed(4)), longTasks: window.__perf.longTasks,
        domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
        mapTileRequests: resources.filter((entry) => entry.name.includes("tile.openstreetmap.org")).length,
        ...(traceShifts ? { shifts: window.__perf.shifts } : {}),
      };
    }, Boolean(process.env.PERF_TRACE_SHIFTS));
    console.log(JSON.stringify({ path, ...metrics }));
    await context.close();
  }
} finally { await browser.close(); }
