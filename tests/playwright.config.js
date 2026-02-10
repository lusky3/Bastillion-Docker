import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:9080',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'echo "Docker Compose should be running"',
    port: 9080,
    reuseExistingServer: true,
  },
});
