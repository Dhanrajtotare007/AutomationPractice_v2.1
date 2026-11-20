import { expect, test } from './fixtures';
import { PRACTICE_MODULES } from '../shared/modules';
import { PRACTICE_CATEGORIES } from '../shared/practice';

test.describe('practice lab directory', () => {
  test('shows hero, features, stats and lab cards', async ({ page }) => {
    await page.goto('/labs');
    await expect(page.getByTestId('dashboard-title')).toHaveText('Automation practice labs');
    await expect(page.getByTestId('feature-tools')).toBeVisible();
    await expect(page.getByTestId('feature-frameworks')).toBeVisible();
    await expect(page.getByTestId('feature-locators')).toBeVisible();
    await expect(page.getByTestId('feature-free')).toBeVisible();
    await expect(page.getByTestId('stat-tools')).toContainText('15');
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(PRACTICE_MODULES.length);
    await expect(page.getByTestId('empty-state')).toBeVisible();

    await page.getByTestId('filter-beginner').click();
    await expect(page).toHaveURL(/level=Beginner/);
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(
      PRACTICE_MODULES.filter((module) => module.difficulty === 'Beginner').length,
    );
    await page.getByTestId('filter-all').click();
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(PRACTICE_MODULES.length);
  });

  test('category filter, deep links and search narrow the grid', async ({ page }) => {
    await page.goto('/labs?category=playwright');
    const playwrightLabs = PRACTICE_CATEGORIES.find((category) => category.id === 'playwright');
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(playwrightLabs?.labs.length ?? 0);
    await expect(page.getByTestId('filter-category-playwright')).toHaveAttribute('aria-pressed', 'true');

    await page.getByTestId('filter-category-all').click();
    await expect(page).not.toHaveURL(/category=/);

    await page.getByTestId('labs-search').fill('shadow');
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(1);
    await expect(page.getByTestId('module-card-shadow-dom')).toBeVisible();

    await page.getByTestId('labs-search').fill('zzzz-no-such-lab');
    await expect(page.getByTestId('module-grid').getByTestId('empty-state')).toBeVisible();
    await page.getByTestId('labs-clear-filters').click();
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(PRACTICE_MODULES.length);
  });

  test('difficulty cards on the progress panel filter the grid', async ({ page }) => {
    await page.goto('/labs');
    await page.getByTestId('progress-level-advanced').click();
    await expect(page).toHaveURL(/level=Advanced/);
    const advanced = PRACTICE_MODULES.filter((module) => module.difficulty === 'Advanced').length;
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(advanced);
  });

  test('progress updates as exercises are ticked and can be reset', async ({ page }) => {
    await page.goto('/labs/checkbox');
    await page.getByTestId('exercise-1').click();
    await page.getByTestId('exercise-2').click();
    await expect(page.getByTestId('module-progress-label')).toHaveText('2/3');

    await page.goto('/labs');
    const value = Number(await page.getByTestId('dashboard-progress').getAttribute('data-value'));
    expect(value).toBeGreaterThan(0);
    await expect(page.getByTestId('stat-completed')).toContainText('2');
    await expect(page.getByTestId('recent-modules')).toContainText('Checkbox');

    await page.getByTestId('progress-reset').click();
    await expect(page.getByTestId('dashboard-progress')).toHaveAttribute('data-value', '0');

    await page.reload();
    await expect(page.getByTestId('dashboard-progress')).toHaveAttribute('data-value', '0');
  });

  test('progress can be saved to and restored from the API', async ({ page }) => {
    await page.goto('/labs/radio');
    await page.getByTestId('exercise-1').click();
    await page.goto('/labs');
    await page.getByTestId('progress-save-server').click();
    await expect(page.getByTestId('toast-item').first()).toContainText(/saved to the server/i);

    // Clearing local progress must not touch the snapshot stored on the API.
    await page.evaluate(() => window.localStorage.removeItem('qa-progress-v1'));
    await page.reload();
    await expect(page.getByTestId('dashboard-progress')).toHaveAttribute('data-value', '0');

    await page.getByTestId('progress-load-server').click();
    await expect(page.getByTestId('toast-item').first()).toContainText(/restored/i);
    await expect
      .poll(async () => Number(await page.getByTestId('dashboard-progress').getAttribute('data-value')))
      .toBeGreaterThan(0);
  });

  test('homepage reflects progress and links into the labs', async ({ page }) => {
    await page.goto('/labs/waits');
    await page.getByTestId('exercise-1').click();
    await page.goto('/');
    await expect(page.getByTestId('home-progress-label')).toContainText('/');
    expect(Number(await page.getByTestId('home-progress-bar').getAttribute('data-value'))).toBeGreaterThan(0);
    await page.getByTestId('hero-cta-secondary').click();
    await expect(page).toHaveURL(/\/labs\?level=Beginner$/);
    await expect(page.getByTestId('filter-beginner')).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('content pages', () => {
  test('retired marketing modules no longer exist', async ({ page }) => {
    for (const path of ['/courses', '/shop', '/events']) {
      await page.goto(path);
      await expect(page.getByTestId('not-found')).toBeVisible();
    }
  });

  test('contact form validates and submits to the API', async ({ page }) => {
    await page.goto('/contact');
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-error-name')).toBeVisible();
    await expect(page.getByTestId('contact-error-email')).toBeVisible();

    await page.getByTestId('contact-name').fill('Playwright User');
    await page.getByTestId('contact-email').fill('automation@example.com');
    await page.getByTestId('contact-subject').fill('E2E message');
    await page.getByTestId('contact-message').fill('This message was written by the automated test suite.');
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-success')).toContainText(/message #\d+/i);
    await expect(page.getByTestId('contact-name')).toHaveValue('');
  });

  test('blog, interview preparation and API console render', async ({ page }) => {
    await page.goto('/blog');
    await page.getByTestId('blog-search').fill('sleeps');
    await expect(page.getByTestId('article-stop-using-sleeps')).toHaveCount(1);
    await expect(page.getByTestId('article-locator-strategy-ladder')).toHaveCount(0);
    await page.getByTestId('article-read-stop-using-sleeps').click();
    await expect(page.getByTestId('blog-article')).toBeVisible();

    await page.goto('/interview-preparation');
    await page.getByTestId('interview-toggle-q4').click();
    await expect(page.getByTestId('interview-answer-q4')).toContainText('Shadow roots');
    await page.getByTestId('interview-search').fill('flaky');
    await expect(page.getByTestId('interview-list').locator('li')).toHaveCount(1);

    await page.goto('/api-docs');
    await page.getByTestId('api-send').click();
    await expect(page.getByTestId('api-status')).toHaveText('200');
    await expect(page.getByTestId('api-response')).toContainText('items');
    await page.getByTestId('api-health-check').click();
    await expect(page.getByTestId('toast-item').first()).toContainText('API is healthy');
  });

  test('about and resources pages describe the platform with working links', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByTestId('about-page')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Learn by automating');
    await page.getByTestId('about-areas').getByRole('link', { name: 'Explore Practice Labs' }).click();
    await expect(page).toHaveURL(/\/labs$/);

    await page.goto('/resources');
    await expect(page.getByTestId('resources-guides').locator('a').first()).toBeVisible();
    await expect(page.getByTestId('resources-articles')).toContainText('Stop using sleeps');
  });
});
