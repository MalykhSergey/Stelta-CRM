import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    retries: 0,
    use: {
        baseURL: 'http://127.0.0.1:3000',
        headless: true,
        viewport: { width: 1500, height: 900 },
        browserName: 'chromium',
        ignoreHTTPSErrors: true,
    },

});
