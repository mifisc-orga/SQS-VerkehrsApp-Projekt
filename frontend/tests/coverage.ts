/// <reference types="node" />

import {expect, test as base} from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Erweiterte Playwright-Testinstanz mit automatischer Coverage-Erfassung.
 */
export const test = base.extend({
    page: async ({ page }, runTest) => {
        await runTest(page);

        const coverage = await page.evaluate(() => (window as { __coverage__?: unknown }).__coverage__);

        if (coverage) {
            const dir = path.join(process.cwd(), '.nyc_output');
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, `coverage-${Date.now()}.json`), JSON.stringify(coverage));
        }
    },
});

export { expect };