import { spawn, execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { travelStaticContent } from "./travelPrerender";
import { readMonetizationConfig } from "../src/config/monetization";
import type { PriceContext } from "./priceData";
// Isolated browser fixture build. These fake IDs never enter dist or deployment.
const vite = resolve("node_modules/vite/bin/vite.js");
const env = { ...process.env, VITE_DEPLOY_ENV: "production", VITE_ADS_ENABLED: "true", VITE_ADS_CMP_PUBLISHED: "true",
  VITE_AD_SLOT_HOME: "1111111111", VITE_AD_SLOT_CONTENT: "2222222222", VITE_AD_SLOT_ARTICLE_END: "3333333333",
  VITE_RENTAL_URL: "https://www.discovercars.com/albania?a_aid=browser-fixture&chan=travel",
  VITE_RENTAL_URL_CALCULATOR: "", VITE_RENTAL_URL_GUIDE: "", VITE_RENTAL_URL_ROAD_TRIP: "", VITE_RENTAL_URL_ALBANIA: "",
  VITE_CF_ANALYTICS_TOKEN: "abcdef0123456789abcdef0123456789" };
execFileSync(process.execPath, [vite, "build", "--outDir", ".test-dist"], { env, stdio: "inherit", windowsHide: true });
// Private, script-free translated render fixtures. Never written into production dist.
const styles = readdirSync(".test-dist/assets").filter((name) => name.endsWith(".css")).map((name) => readFileSync(`.test-dist/assets/${name}`, "utf8")).join("\n");
const prices: PriceContext = { ok: true, asOf: "2026-09-08", asOfLabel: "8 September 2026", source: "Fixture", sourceUrl: "https://example.org", allPerEur: 100,
  prices: new Map([["Albania", { petrol: 1.9, diesel: 2, lpg: null }]]), trendDates: [], trends: {} };
for (const path of ["trip-cost-calculator", "albania-car-rental-guide"]) {
  const content = travelStaticContent(`/${path}`, prices, readMonetizationConfig(env), "sq");
  writeFileSync(`.test-dist/qa-sq-${path}.html`, `<!doctype html><html lang="sq" data-theme="light"><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><style>${styles}</style><body><div class="container">${content}</div></body></html>`);
}
const server = spawn(process.execPath, [vite, "preview", "--outDir", ".test-dist", "--host", "127.0.0.1", "--port", "4175", "--strictPort"], { env, stdio: "inherit", windowsHide: true });
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => { server.kill(); process.exit(0); });
server.on("exit", (code) => process.exit(code ?? 0));
