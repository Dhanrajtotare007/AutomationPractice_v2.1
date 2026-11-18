import { test as base, expect, type Page } from '@playwright/test';

export const test = base.extend<{ consoleGuard: void }>({
  // Fails any test that logs an uncaught error to the console.
  consoleGuard: [
    async ({ page }: { page: Page }, use) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          const text = message.text();
          if (/favicon|Download the React DevTools|net::ERR_ABORTED/i.test(text)) return;
          errors.push(text);
        }
      });
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
      await use();
      expect(errors, 'console errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Open a practice module and wait for it to render. */
export async function openModule(page: Page, slug: string) {
  await page.goto(`/testing/${slug}`);
  await expect(page.getByTestId('practice-panel')).toBeVisible();
  await expect(page.getByTestId('module-title')).toBeVisible();
}

/** Collect every test id currently rendered on the page. */
export async function renderedTestIds(page: Page): Promise<string[]> {
  return page.$$eval('[data-testid]', (nodes) => nodes.map((node) => node.getAttribute('data-testid') ?? ''));
}
