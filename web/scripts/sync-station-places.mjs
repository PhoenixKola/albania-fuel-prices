import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Run from web/: node scripts/sync-station-places.mjs
// The mobile GeoNames AL extract is the single curated source; the web copy is lazy-loaded.
copyFileSync(fileURLToPath(new URL("../../mobile/src/data/albaniaPlaces.json", import.meta.url)), fileURLToPath(new URL("../src/data/albaniaPlaces.json", import.meta.url)));
