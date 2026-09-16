# Web performance audit

Measured on 17 September 2026 with Chromium at 1366 × 900 against a local Vite preview. `node scripts/perf-probe.mjs` creates a fresh browser context for each route, blocks third-party requests, and records first-party transferred bytes, JavaScript transfer, LCP, CLS, long tasks, and attempted map tiles. These are reproducible local diagnostics, not field Core Web Vitals or an estimate of production ad load.

| Direct route | Before transfer | After transfer | Before CLS | After CLS | After LCP |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 337 KB | 211 KB | 0 | 0.004 | 448 ms |
| `/fuel-prices/albania` | 399 KB | 274 KB | 0.004 | 0 | 312 ms |
| `/trip-cost-calculator` | 348 KB | 219 KB | 0.443 | 0 | 92 ms |
| `/road-status` | 347 KB | 219 KB | 0.422 | 0.0001 | 336 ms |
| `/road-status/tirana-theth` | 347 KB | 219 KB | 0.422 | 0.0001 | 348 ms |
| `/stations` | 410 KB | 210 KB | 0.420 | 0 | 280 ms |
| `/albania-car-rental-guide` | 344 KB | 219 KB | 0.443 | 0 | 76 ms |

The biggest transfer reduction is replacing the 134 KB rendered PNG logo with a 5 KB WebP. The original PNG stays as a source asset. The stations page now imports the large `opening_hours` parser only after a lookup needs it. Rankings loads its choropleth only when it nears the viewport. Road Reality delays map tiles until the map nears the viewport and requests fewer off-screen tiles (30 to 12 attempted tiles in this probe). Images have intrinsic dimensions and asynchronous decoding. The Inter request uses a variable weight range instead of separate static weights.

The large direct-load CLS came from the SPA briefly showing a short Suspense skeleton and footer over useful prerendered content, then replacing both with the complete page. Direct visits now retain prerendered content until the initial route chunk is ready; the footer is within the same Suspense boundary. The static page includes a lightweight navigation shell so that JavaScript-disabled visitors can navigate and the first layout better matches the application.

## Remaining work and limits

The main JavaScript entry is still about 517 KB raw / 165 KB gzip and triggers Vite's 500 KB warning. The country page is about 204 KB raw / 37 KB gzip. Further code splitting is possible but would need careful direct-load and prerender checks. The map and `opening_hours` chunks remain large, but they are now conditional downloads. All measurements block third parties; live Adsterra creative weight and external map tile latency depend on providers and geography. Recheck field Core Web Vitals and Cloudflare Web Analytics after release before making another performance tradeoff.

To repeat the synthetic probe after `npm run build`, serve `dist` on port 4180 (`npx vite preview --host 127.0.0.1 --port 4180`) and run `node scripts/perf-probe.mjs`. Set `PERF_ORIGIN` for another origin. Set `PERF_TRACE_SHIFTS=1` to include layout-shift sources.
