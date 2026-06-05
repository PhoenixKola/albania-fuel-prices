/**
 * Generate sitemap.xml from the same route config used for prerendering.
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const SITE_URL = "https://karburantisot.com";

type SitemapEntry = {
  path: string;
  priority: number;
  changefreq: string;
};

const today = new Date().toISOString().split("T")[0];

const ROUTES: SitemapEntry[] = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/stations", priority: 0.8, changefreq: "daily" },
  { path: "/compare", priority: 0.8, changefreq: "daily" },
  { path: "/rankings", priority: 0.8, changefreq: "daily" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/contact", priority: 0.8, changefreq: "monthly" },
  { path: "/methodology", priority: 0.8, changefreq: "monthly" },
  { path: "/how-fuel-prices-work", priority: 0.8, changefreq: "monthly" },
  { path: "/europe-fuel-comparison", priority: 0.9, changefreq: "monthly" },
  { path: "/road-trip-fuel-guide", priority: 0.9, changefreq: "monthly" },
  { path: "/privacy", priority: 0.4, changefreq: "yearly" },
  { path: "/terms", priority: 0.4, changefreq: "yearly" },
  { path: "/daily-challenge", priority: 0.8, changefreq: "daily" },
  { path: "/fuel-quiz", priority: 0.8, changefreq: "weekly" },
  { path: "/editorial-policy", priority: 0.5, changefreq: "yearly" },
  { path: "/disclaimer", priority: 0.4, changefreq: "yearly" },
  // Country pages (all indexable with rich content)
  { path: "/fuel-prices/albania", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/kosovo", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/montenegro", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/north-macedonia", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/greece", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/italy", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/croatia", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/portugal", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/switzerland", priority: 0.8, changefreq: "weekly" },
  { path: "/fuel-prices/united-kingdom", priority: 0.8, changefreq: "weekly" },
];

function generateSitemap(): string {
  const urls = ROUTES.map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path === "/" ? "" : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

const sitemap = generateSitemap();
const outPath = resolve(DIST, "sitemap.xml");
writeFileSync(outPath, sitemap, "utf-8");
console.log(`✓ Generated sitemap.xml with ${ROUTES.length} URLs → ${outPath}`);
