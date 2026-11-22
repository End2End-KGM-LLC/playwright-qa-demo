import { defineConfig, devices, type Project } from '@playwright/test';
import { AUTH_FILE, env } from './config/environments';

const browserDevices: Record<string, (typeof devices)[string]> = {
  chromium: devices['Desktop Chrome'],
  firefox: devices['Desktop Firefox'],
  webkit: devices['Desktop Safari'],
};

const e2eProjects: Project[] = env.browsers.map((browser) => {
  const device = browserDevices[browser];
  if (!device) {
    throw new Error(`Unknown browser "${browser}" in BROWSERS. Use chromium, firefox or webkit.`);
  }
  return {
    name: `e2e-${browser}`,
    testDir: './tests/e2e',
    dependencies: ['setup'],
    use: { ...device, storageState: AUTH_FILE },
  };
});

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? env.ciRetries : 0,
  workers: process.env.CI ? 2 : undefined,
  grepInvert: env.allowDestructive ? undefined : /@destructive/,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.baseURL,
    // The app under test marks elements with data-test="..."; getByTestId() reads it.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testDir: './fixtures',
      testMatch: /.*\.setup\.ts/,
    },
    ...e2eProjects,
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: env.apiBaseURL },
    },
  ],
});
