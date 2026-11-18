import { expect, test } from './fixtures';
import { PRIMARY_NAV } from '../src/config/navigation';
import { PRACTICE_MODULES } from '../shared/modules';

test.describe('navigation', () => {
  test('every primary nav item resolves to a page without a 404', async ({ page }) => {
    for (const item of PRIMARY_NAV) {
      await page.goto(item.to);
      await expect(page.getByTestId('main-content')).toBeVisible();
      await expect(page.getByTestId('not-found')).toHaveCount(0);
      expect(page.url()).toContain(item.to === '/' ? '/' : item.to);
    }
  });

  test('footer links and programme pages render', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'Contact' })).toBeVisible();
    await expect(page.getByTestId('home-page')).toBeVisible();

    await page.goto('/blog/stop-using-sleeps');
    await expect(page.getByTestId('blog-article')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stop using sleeps');

    await page.goto('/unknown-route');
    await expect(page.getByTestId('not-found')).toBeVisible();
  });

  test('hamburger menu works on mobile and theme toggle persists', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByTestId('hamburger-menu').click();
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
    await page.getByTestId('mobile-nav-courses').click();
    await expect(page).toHaveURL(/\/courses$/);
    await expect(page.getByTestId('mobile-menu')).toHaveCount(0);

    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('header search navigates to the search page with results', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('header-search-input').fill('shadow dom');
    await page.getByTestId('header-search-input').press('Enter');
    await expect(page).toHaveURL(/\/search\?q=shadow%20dom/);
    await expect(page.getByTestId('search-result').first()).toBeVisible();
  });

  test('sidebar navigates to all 15 modules and highlights the active one', async ({ page }) => {
    await page.goto('/testing');
    for (const module of PRACTICE_MODULES) {
      await page.getByTestId(`sidebar-${module.slug}`).click();
      await expect(page).toHaveURL(new RegExp(`/testing/${module.slug}$`));
      await expect(page.getByTestId(`module-${module.slug}`)).toBeVisible();
      const classes = await page.getByTestId(`sidebar-${module.slug}`).getAttribute('class');
      expect(classes).toContain('sidebar-link-active');
      await expect(page.getByTestId('module-title')).toHaveText(module.title);
    }
  });

  test('sidebar collapse toggle keeps navigation usable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/testing');
    await page.getByTestId('sidebar-collapse-toggle').click();
    await expect(page.locator('#testing-sidebar')).toHaveAttribute('data-collapsed', 'true');
    await page.getByTestId('sidebar-collapse-toggle').click();
    await expect(page.locator('#testing-sidebar')).toHaveAttribute('data-collapsed', 'false');
  });
});
