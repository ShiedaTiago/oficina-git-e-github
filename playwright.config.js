const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  outputDir: 'test-results',
  use: { browserName: 'chromium', headless: true },
  projects: [
    {
      name: 'desktop',
      testMatch: /workshop\.spec\.js/,
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      testMatch: /workshop\.spec\.js/,
      use: { viewport: { width: 390, height: 844 }, isMobile: true },
    },
    {
      name: 'offline',
      testMatch: /offline\.spec\.js/,
      use: { viewport: { width: 1280, height: 800 } },
    },
  ],
});
