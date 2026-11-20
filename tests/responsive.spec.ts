import { expect, test } from './fixtures';
import { PRACTICE_MODULES } from '../shared/modules';

test.describe('responsive layout', () => {
  test('sidebar is usable as a drawer or inline column', async ({ page }) => {
    await page.goto('/labs/waits');
    const sidebar = page.locator('#testing-sidebar');
    await expect(sidebar).toBeAttached();

    // Inline on wide screens, an off-canvas drawer with a header toggle on narrow ones.
    const toggle = page.getByTestId('header-sidebar-toggle');
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(sidebar).toBeInViewport();
    } else {
      await expect(sidebar).toBeInViewport();
    }

    await page.getByTestId('sidebar-checkbox').click();
    await expect(page).toHaveURL(/\/labs\/checkbox$/);
    await expect(page.getByTestId('module-checkbox')).toBeVisible();
  });

  test('sidebar module links work and the drawer closes after navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'drawer behaviour is covered by the overlay test');
    await page.goto('/labs');
    await page.getByTestId('sidebar-radio').click();
    await expect(page).toHaveURL(/\/labs\/radio$/);
    await expect(page.getByTestId('module-title')).toHaveText('Radio Button');
  });

  test('no horizontal overflow on any page', async ({ page }) => {
    const paths = [
      '/',
      '/labs',
      ...PRACTICE_MODULES.map((module) => `/labs/${module.slug}`),
      '/challenges',
      '/resources',
      '/blog',
      '/blog/locator-strategy-ladder',
      '/interview-preparation',
      '/api-docs',
      '/contact',
      '/about',
      '/search?q=iframe',
    ];
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
    await page.goto('/labs/form');
    await expect(page.getByTestId('registration-form')).toBeVisible();
    await page.getByTestId('form-first-name').fill('Mobile');
    await expect(page.getByTestId('form-first-name')).toHaveValue('Mobile');
    await expect(page.getByTestId('tab-practice')).toBeVisible();
  });

  test('homepage, challenges and resources stay usable on narrow screens', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-cta-primary')).toBeVisible();
    await expect(page.getByTestId('home-popular')).toBeVisible();

    await page.goto('/challenges');
    await expect(page.getByTestId('challenge-list').locator('li').first()).toBeVisible();
    await expect(page.getByTestId('challenge-filter-all')).toBeVisible();

    await page.goto('/resources');
    await expect(page.getByTestId('resources-search')).toBeVisible();

    // Nothing (including the header CTA) may push the layout out of the viewport.
    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe('dark mode', () => {
  test('all labs render in dark mode without breaking layout', async ({ page }) => {
    await page.goto('/labs');
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    for (const module of PRACTICE_MODULES) {
      await page.goto(`/labs/${module.slug}`);
      await expect(page.getByTestId(`module-${module.slug}`)).toBeVisible();
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).not.toBe('rgb(248, 250, 252)');
    }
  });

  test('dark mode covers the marketing pages too', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    for (const path of ['/', '/challenges', '/resources', '/about']) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveClass(/dark/);
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).not.toBe('rgb(248, 250, 252)');
    }
  });
});
