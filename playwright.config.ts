import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173/YT-Video-Selector/'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm dev --host 127.0.0.1 --port 4173 --strictPort',
    url: baseURL,
  },
})
