import { expect, test } from './fixtures';

test.describe('dashboard and progress', () => {
  test('shows hero, features, stats and module cards', async ({ page }) => {
    await page.goto('/testing');
    await expect(page.getByTestId('dashboard-title')).toHaveText('UI Automation Playground');
    await expect(page.getByTestId('feature-tools')).toBeVisible();
    await expect(page.getByTestId('feature-frameworks')).toBeVisible();
    await expect(page.getByTestId('feature-locators')).toBeVisible();
    await expect(page.getByTestId('feature-free')).toBeVisible();
    await expect(page.getByTestId('stat-tools')).toContainText('15');
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(15);
    await expect(page.getByTestId('empty-state')).toBeVisible();

    await page.getByTestId('filter-beginner').click();
    const beginnerCards = await page.getByTestId('module-grid').getByTestId(/module-card-/).count();
    expect(beginnerCards).toBeGreaterThan(0);
    expect(beginnerCards).toBeLessThan(15);
    await page.getByTestId('filter-all').click();
    await expect(page.getByTestId('module-grid').getByTestId(/module-card-/)).toHaveCount(15);
  });

  test('progress updates as exercises are ticked and can be reset', async ({ page }) => {
    await page.goto('/testing/checkbox');
    await page.getByTestId('exercise-1').click();
    await page.getByTestId('exercise-2').click();
    await expect(page.getByTestId('module-progress-label')).toHaveText('2/3');

    await page.goto('/testing');
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
    await page.goto('/testing/radio');
    await page.getByTestId('exercise-1').click();
    await page.goto('/testing');
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
});

test.describe('content pages', () => {
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

  test('shop cart, courses and events work end to end', async ({ page }) => {
    await page.goto('/shop');
    await page.getByTestId('book-buy-playwright-in-action').click();
    await expect(page.getByTestId('cart-total')).toHaveText('$39');
    await page.getByTestId('cart-increase-playwright-in-action').click();
    await expect(page.getByTestId('cart-total')).toHaveText('$78');
    await page.getByTestId('cart-remove-playwright-in-action').click();
    await expect(page.getByTestId('shop-cart')).toContainText('Your cart is empty');

    await page.goto('/courses');
    await page.getByTestId('courses-filter-advanced').click();
    await expect(page.getByTestId('course-automation-architecture')).toHaveCount(1);
    await expect(page.getByTestId('course-playwright-fundamentals')).toHaveCount(0);
    await page.getByTestId('courses-filter-all').click();
    await page.getByTestId('course-enroll-playwright-fundamentals').click();
    await page.getByTestId('enroll-email').fill('bad-email');
    await page.getByTestId('enroll-submit').click();
    await expect(page.getByTestId('enroll-email-error')).toBeVisible();
    await page.getByTestId('enroll-email').fill('learner@example.com');
    await page.getByTestId('enroll-submit').click();
    await expect(page.getByTestId('enroll-modal')).toHaveCount(0);

    await page.goto('/events');
    const email = `event.${Date.now()}@example.com`;
    await page.getByTestId('event-register-meetup-locators').click();
    await page.getByTestId('event-name').fill('Event Tester');
    await page.getByTestId('event-email').fill(email);
    await page.getByTestId('event-submit').click();
    await expect(page.getByTestId('event-modal')).toHaveCount(0);
    await expect(page.getByTestId('toast-item').first()).toContainText('Seat reserved');
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
});
