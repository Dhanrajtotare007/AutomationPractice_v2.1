import { expect, test } from './fixtures';
import { PRIMARY_NAV } from '../src/config/navigation';
import { PRACTICE_MODULES } from '../shared/modules';
import { PRACTICE_CATEGORIES, CHALLENGES } from '../shared/practice';

test.describe('navigation', () => {
  test('every primary nav item resolves to a page without a 404', async ({ page }) => {
    for (const item of PRIMARY_NAV) {
      await page.goto(item.to);
      await expect(page.getByTestId('main-content')).toBeVisible();
      await expect(page.getByTestId('not-found')).toHaveCount(0);
      expect(page.url()).toContain(item.to === '/' ? '/' : item.to);
    }
  });

  test('footer links and the 404 page render', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'Contact & support' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'All practice labs →' })).toBeVisible();
    await expect(page.getByTestId('home-page')).toBeVisible();

    await page.goto('/blog/stop-using-sleeps');
    await expect(page.getByTestId('blog-article')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stop using sleeps');

    await page.goto('/unknown-route');
    await expect(page.getByTestId('not-found')).toBeVisible();
  });

  test('homepage shows the brand, hero CTAs and every required section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Practice \| Learn by Automating/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Master Automation Testing Through Practice');
    await expect(page.getByRole('banner').getByTestId('brand-link')).toContainText('Automation');
    await expect(page.getByRole('banner').getByTestId('brand-link')).toContainText('Learn by automating.');

    await expect(page.getByTestId('hero-cta-primary')).toContainText('Explore Practice Labs');
    await expect(page.getByTestId('hero-cta-secondary')).toContainText('Start Practicing');

    // Six practice areas, six popular labs, three journey levels.
    await expect(page.getByTestId('home-areas').locator('article')).toHaveCount(PRACTICE_CATEGORIES.length);
    await expect(page.getByTestId('home-popular').locator('article')).toHaveCount(6);
    await expect(page.getByTestId('home-journey').locator('article')).toHaveCount(3);
    await expect(page.getByTestId('journey-beginner')).toBeVisible();
    await expect(page.getByTestId('journey-intermediate')).toBeVisible();
    await expect(page.getByTestId('journey-advanced')).toBeVisible();
    await expect(page.getByTestId('home-why')).toBeVisible();

    // No leftover marketing modules from the old site.
    for (const retired of ['/courses', '/shop', '/events']) {
      await expect(page.locator(`a[href="${retired}"]`)).toHaveCount(0);
    }
  });

  test('hero CTAs, popular lab cards and category chips lead to real labs', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('hero-cta-primary').click();
    await expect(page).toHaveURL(/\/labs$/);
    await expect(page.getByTestId('dashboard-title')).toBeVisible();

    await page.goto('/');
    await page.getByTestId('popular-lab-start-checkbox').click();
    await expect(page).toHaveURL(/\/labs\/checkbox$/);
    await expect(page.getByTestId('module-checkbox')).toBeVisible();

    await page.goto('/');
    await page.getByTestId('area-web-ui-lab-dropdown').click();
    await expect(page).toHaveURL(/\/labs\/dropdown$/);
  });

  test('resources dropdown reveals the resource pages', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-resources').click();
    const menu = page.getByRole('menu', { name: 'Resources' });
    await expect(menu).toBeVisible();
    await menu.getByRole('menuitem', { name: /Automation guides/ }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByTestId('blog-page')).toBeVisible();
  });

  test('legacy /testing URLs redirect to the new lab routes', async ({ page }) => {
    await page.goto('/testing');
    await expect(page).toHaveURL(/\/labs$/);
    await expect(page.getByTestId('dashboard-title')).toBeVisible();

    await page.goto('/testing/webtable');
    await expect(page).toHaveURL(/\/labs\/webtable$/);
    await expect(page.getByTestId('module-webtable')).toBeVisible();
  });

  test('hamburger menu works on mobile and theme toggle persists', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByTestId('hamburger-menu').click();
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
    await page.getByTestId('mobile-nav-challenges').click();
    await expect(page).toHaveURL(/\/challenges$/);
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
    await expect(page.getByTestId('search-results')).toContainText('Shadow DOM practice lab');
  });

  test('sidebar navigates to all 15 labs and highlights the active one', async ({ page }) => {
    await page.goto('/labs');
    for (const module of PRACTICE_MODULES) {
      await page.getByTestId(`sidebar-${module.slug}`).click();
      await expect(page).toHaveURL(new RegExp(`/labs/${module.slug}$`));
      await expect(page.getByTestId(`module-${module.slug}`)).toBeVisible();
      const classes = await page.getByTestId(`sidebar-${module.slug}`).getAttribute('class');
      expect(classes).toContain('sidebar-link-active');
      await expect(page.getByTestId('module-title')).toHaveText(module.title);
    }
  });

  test('sidebar collapse toggle keeps navigation usable', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/labs');
    await page.getByTestId('sidebar-collapse-toggle').click();
    await expect(page.locator('#testing-sidebar')).toHaveAttribute('data-collapsed', 'true');
    await page.getByTestId('sidebar-collapse-toggle').click();
    await expect(page.locator('#testing-sidebar')).toHaveAttribute('data-collapsed', 'false');
  });

  test('challenges page filters by level and remembers solved briefs', async ({ page }) => {
    await page.goto('/challenges');
    await expect(page.getByTestId('challenge-list').locator('> li')).toHaveCount(CHALLENGES.length);

    await page.getByTestId('challenge-filter-advanced').click();
    await expect(page).toHaveURL(/level=Advanced/);
    const advancedCount = await page.getByTestId('challenge-list').locator('> li').count();
    expect(advancedCount).toBeGreaterThan(0);
    expect(advancedCount).toBeLessThan(CHALLENGES.length);

    await page.getByTestId('challenge-filter-all').click();
    const first = CHALLENGES[1].id;
    await page.getByTestId(`challenge-toggle-${first}`).click();
    await expect(page.getByTestId(`challenge-details-${first}`)).toBeVisible();
    await page.getByTestId(`challenge-solve-${first}`).click();
    await expect(page.getByTestId(`challenge-solved-badge-${first}`)).toBeVisible();

    await page.reload();
    await expect(page.getByTestId(`challenge-solved-badge-${first}`)).toBeVisible();
    await page.getByTestId('challenges-reset').click();
    await expect(page.getByTestId(`challenge-solved-badge-${first}`)).toHaveCount(0);
  });

  test('resources hub indexes guides, labs and interview questions', async ({ page }) => {
    await page.goto('/resources');
    await expect(page.getByTestId('resources-page')).toBeVisible();
    await page.getByTestId('resources-search').fill('shadow dom');
    await expect(page.getByTestId('resources-results').getByTestId('resource-result').first()).toBeVisible();

    await page.getByTestId('resources-search').fill('zzzz-nothing-matches');
    await expect(page.getByTestId('resources-page').getByTestId('empty-state')).toBeVisible();
  });
});
