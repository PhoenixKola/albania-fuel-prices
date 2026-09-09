import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1,
  timeout: 30000, reporter: "list",
  use: { browserName: "chromium", headless: true, viewport: { width: 1366, height: 900 }, screenshot: "only-on-failure" },
  webServer: { command: "npx tsx --tsconfig tsconfig.app.json scripts/test-server.ts", url: "http://127.0.0.1:4175", reuseExistingServer: false, timeout: 120000 },
});
