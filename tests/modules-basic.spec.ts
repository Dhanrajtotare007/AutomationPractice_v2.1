import { expect, test } from './fixtures';
import { openModule } from './fixtures';

test.describe('checkbox module', () => {
  test('single checkbox, group and select-all behave correctly', async ({ page }) => {
    await openModule(page, 'checkbox');
    const accept = page.getByTestId('checkbox-accept-terms');
    await expect(accept).not.toBeChecked();
    await accept.check();
    await expect(accept).toBeChecked();
    await expect(page.getByTestId('checkbox-accepted-value')).toHaveText('true');
    await expect(page.getByTestId('checkbox-accept-status')).toHaveText('Accepted');
    await page.getByTestId('checkbox-continue').click();
    await expect(accept).not.toBeChecked();

    await page.getByTestId('checkbox-select-all').click();
    await expect(page.getByTestId('checkbox-skill-appium')).toBeChecked();
    await expect(page.getByTestId('checkbox-count-value')).toHaveText('5');
    await page.getByTestId('checkbox-deselect-all').click();
    await expect(page.getByTestId('checkbox-skill-playwright')).not.toBeChecked();
    await expect(page.getByTestId('checkbox-skills-value')).toHaveText('—');

    await page.getByTestId('checkbox-skill-cypress').check();
    await expect(page.getByTestId('checkbox-skills-value')).toHaveText('Cypress');

    await expect(page.getByTestId('checkbox-disabled')).toBeDisabled();
    await expect(page.getByTestId('checkbox-prechecked')).toBeChecked();
  });
});

test.describe('radio module', () => {
  test('exclusive groups, disabled option and live output', async ({ page }) => {
    await openModule(page, 'radio');
    await page.getByTestId('radio-gender-male').check();
    await page.getByTestId('radio-gender-female').check();
    await expect(page.getByTestId('radio-gender-male')).not.toBeChecked();
    await expect(page.getByTestId('radio-gender-value')).toHaveText('female');

    await page.getByTestId('radio-payment-upi').check();
    await expect(page.getByTestId('radio-payment-value')).toHaveText('upi');
    await page.getByTestId('radio-plan-premium').check();
    await expect(page.getByTestId('radio-plan-value')).toHaveText('premium');
    await expect(page.getByTestId('radio-disabled')).toBeDisabled();

    await page.getByTestId('radio-reset').click();
    await expect(page.getByTestId('radio-plan-value')).toHaveText('basic');
  });
});

test.describe('dropdown module', () => {
  test('standard, dependent and multi selects', async ({ page }) => {
    await openModule(page, 'dropdown');
    await page.getByTestId('dropdown-country').selectOption('in');
    await expect(page.getByTestId('dropdown-country-value')).toHaveText('India');
    await expect(page.getByTestId('dropdown-city')).toBeEnabled();
    await page.getByTestId('dropdown-city').selectOption('Mumbai');
    await expect(page.getByTestId('dropdown-city-value')).toHaveText('Mumbai');
    await page.getByTestId('dropdown-dependent-country').selectOption('gb');
    await expect(page.getByTestId('dropdown-city-value')).toHaveText('—');

    await page.getByTestId('dropdown-multi-languages').selectOption(['py', 'java']);
    await expect(page.getByTestId('dropdown-languages-value')).toHaveText('Python, Java');
    await page.getByTestId('dropdown-clear-languages').click();
    await expect(page.getByTestId('dropdown-languages-value')).toHaveText('—');

    await page.getByTestId('dropdown-experience').selectOption('5-8');
    await expect(page.getByTestId('dropdown-experience-value')).toHaveText('5 - 8 years');
  });

  test('searchable combobox filters and selects with the keyboard', async ({ page }) => {
    await openModule(page, 'dropdown');
    const combo = page.getByTestId('dropdown-search');
    await combo.click();
    await combo.fill('cy');
    await expect(page.getByTestId('dropdown-framework-option-cypress')).toBeVisible();
    await page.getByTestId('dropdown-framework-option-cypress').click();
    await expect(page.getByTestId('dropdown-framework-value')).toHaveText('Cypress');

    await page.getByTestId('dropdown-search').fill('play');
    await page.getByTestId('dropdown-search').press('ArrowDown');
    await page.getByTestId('dropdown-search').press('ArrowDown');
    await page.getByTestId('dropdown-search').press('Enter');
    await expect(page.getByTestId('dropdown-framework-value')).toHaveText('Playwright');
  });
});

test.describe('form module', () => {
  test('validation blocks submission and reports every error', async ({ page }) => {
    await openModule(page, 'form');
    await page.getByTestId('form-submit-text').click();
    await expect(page.getByTestId('form-error-first-name')).toBeVisible();
    await expect(page.getByTestId('form-error-email')).toBeVisible();
    await expect(page.getByTestId('form-error-password')).toBeVisible();
    await expect(page.getByTestId('form-error-country')).toBeVisible();
    await expect(page.getByTestId('form-error-terms')).toBeVisible();
    await expect(page.getByTestId('form-success')).toHaveCount(0);

    await page.getByTestId('form-email').fill('not-an-email');
    await page.getByTestId('form-first-name').fill('Ada');
    await page.getByTestId('form-submit-text').click();
    await expect(page.getByTestId('form-error-email')).toContainText('valid email');
  });

  test('a valid form submits, shows values and resets', async ({ page }) => {
    await openModule(page, 'form');
    await page.getByTestId('form-first-name').fill('Ada');
    await page.getByTestId('form-last-name').fill('Lovelace');
    await page.getByTestId('form-email').fill('ada@example.com');
    await page.getByTestId('form-password').fill('Passw0rd!');
    await page.getByTestId('form-confirm-password').fill('Passw0rd!');
    await page.getByTestId('form-age').fill('36');
    await page.getByTestId('form-dob').fill('1990-01-01');
    await page.getByTestId('form-experience').selectOption('senior');
    await page.getByTestId('form-country').selectOption('gb');
    await page.getByTestId('form-gender-other').check();
    await page.getByTestId('form-terms').check();
    await expect(page.getByTestId('form-password-meter')).toHaveAttribute('data-value', '100');

    await page.getByTestId('form-submit-text').click();
    await expect(page.getByTestId('form-success')).toBeVisible();
    await expect(page.getByTestId('form-success')).toContainText('ada@example.com');
    await expect(page.getByTestId('toast-item').first()).toContainText('Account created');

    await page.getByTestId('form-reset').click();
    await expect(page.getByTestId('form-first-name')).toHaveValue('');
    await expect(page.getByTestId('form-success')).toHaveCount(0);
  });
});
