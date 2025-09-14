import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:4000',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox',  use: { browserName: 'firefox' } },
    { name: 'webkit',   use: { browserName: 'webkit' } },
  ],
  // Start the API for tests; note the path fix: ../../services/api
  webServer: {
    command:
      'sh -c "cd ../../services/api && DATABASE_URL=postgres://postgres:postgres@localhost:5433/appdb npx tsx src/index.ts"',
    url: 'http://localhost:4000/health',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
