import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

let retries = 0;
if (process.env.CI) retries = 2;

let workers: number | undefined;
if (process.env.CI) workers = 1;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries,
  workers,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !isCI,
  },
});
