import { expect, test } from './fixtures';
import { PRACTICE_MODULES } from '../shared/modules';

test.describe('responsive layout', () => {
  test('sidebar is usable as a drawer or inline column', async ({ page }) => {
    await page.goto('/testing');
    const sidebar = page.locator('#testing-sidebar');
    await expect(sidebar).toBeAttached();

    // Inline on wide screens (x === 0), off-canvas drawer on narrow ones.
    const box = await sidebar.boundingBox();
    const inline = Boolean(box && box.x === 0);
    if (!inline) {
      await page.getByTestId('header-sidebar-toggle').click();
      await expect.poll(async () => (await sidebar.boundingBox())?.x ?? -1).toBe(0);
    }

    await page.getByTestId('sidebar-checkbox').click();
    await expect(page).toHaveURL(/\/testing\/checkbox$/);
    await expect(page.getByTestId('module-checkbox')).toBeVisible();
  });

  test('sidebar module links work and the drawer closes after navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'drawer behaviour is covered by the overlay test');
    await page.goto('/testing');
    await page.getByTestId('sidebar-radio').click();
    await expect(page).toHaveURL(/\/testing\/radio$/);
    await expect(page.getByTestId('module-title')).toHaveText('Radio Button');
  });

  test('no horizontal overflow on any page', async ({ page }) => {
    const paths = ['/', '/testing', ...PRACTICE_MODULES.map((module) => `/testing/${module.slug}`), '/courses', '/contact', '/api-docs'];
    const failures: string[] = [];
    for (const path of paths) {
      await page.goto(path);
      await page.waitForTimeout(150);
      const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
      if (overflow > 1) failures.push(`${path} → ${overflow}px`);
    }
    expect(failures, `horizontal overflow:\n${failures.join('\n')}`).toEqual([]);
  });

  test('module practice panel is usable on a narrow viewport', async ({ page }) => {
    await page.goto('/testing/form');
    await expect(page.getByTestId('registration-form')).toBeVisible();
    await page.getByTestId('form-first-name').fill('Mobile');
    await expect(page.getByTestId('form-first-name')).toHaveValue('Mobile');
    await expect(page.getByTestId('tab-practice')).toBeVisible();
  });
});

test.describe('dark mode', () => {
  test('all modules render in dark mode without breaking layout', async ({ page }) => {
    await page.goto('/testing');
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    for (const module of PRACTICE_MODULES) {
      await page.goto(`/testing/${module.slug}`);
      await expect(page.getByTestId(`module-${module.slug}`)).toBeVisible();
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).not.toBe('rgb(248, 250, 252)');
    }
  });
});
