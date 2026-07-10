/**
 * Generate sitemap.xml from the central route config (src/config/routes.ts)
 * plus the country editorial pages — the same sources the prerender uses, so
 * the sitemap can never drift from what is actually deployed.
 *
 * lastmod is honest: price-bearing pages use the data's as_of date (their HTML
 * genuinely changes with each data refresh); editorial pages use a maintained
 * lastmod date. Nothing is stamped with "today" just because a build ran.
 *
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_ROUTES, SITE_URL } from "../src/config/routes";
import { COUNTRY_EDITORIAL } from "../src/config/countryContent";
import { getPublishedArticles } from "../src/config/articles";
import { loadPriceContext } from "./priceData";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");

type SitemapEntry = {
  path: string;
  priority: number;
  changefreq: string;
  lastmod: string;
};

async function main() {
  const ctx = await loadPriceContext();
  // Fallback only if the data files are unreadable; keeps the build alive.
  const dataLastmod = ctx.ok ? ctx.asOf : new Date().toISOString().split("T")[0];

  const entries: SitemapEntry[] = [
    ...STATIC_ROUTES.filter((r) => !r.noindex).map((r) => ({
      path: r.path,
      priority: r.priority,
      changefreq: r.changefreq,
      lastmod: r.priceBearing ? dataLastmod : r.lastmod ?? dataLastmod,
    })),
    ...COUNTRY_EDITORIAL.map((c) => ({
      path: `/fuel-prices/${c.slug}`,
      priority: 0.8,
      changefreq: "daily",
      lastmod: dataLastmod,
    })),
    ...getPublishedArticles().map((a) => ({
      path: `/insights/${a.slug}`,
      priority: 0.7,
      changefreq: "monthly" as const,
      lastmod: a.dateModified ?? a.datePublished,
    })),
  ];

  const urls = entries
    .map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.path === "/" ? "" : r.path}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  const outPath = resolve(DIST, "sitemap.xml");
  writeFileSync(outPath, sitemap, "utf-8");
  console.log(`✓ Generated sitemap.xml with ${entries.length} URLs → ${outPath}`);
}

await main();
