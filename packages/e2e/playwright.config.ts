import { defineConfig, devices } from '@playwright/test';

/**
 * Runs against the static Storybook build (`bun run storybook:build` first).
 * Each story is loaded in isolation via iframe.html, so these tests cover the
 * component library without needing an app.
 *
 * PW_CHROMIUM_PATH lets environments with a pre-installed browser skip the
 * download (e.g. /opt/pw-browsers/chromium in cloud sandboxes).
 */
const executablePath = process.env.PW_CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:6007',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], ...(executablePath ? { launchOptions: { executablePath } } : {}) },
    },
  ],
  webServer: {
    command: 'http-server ../ui/storybook-static -p 6007 -s',
    url: 'http://127.0.0.1:6007/iframe.html',
    reuseExistingServer: !process.env.CI,
  },
});
