import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect, test, openModule } from './fixtures';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-upload-'));

function makeFile(name: string, content: string) {
  const filePath = path.join(tempDir, name);
  fs.writeFileSync(filePath, content);
  return filePath;
}

test.describe('web table module', () => {
  test('search, sort, paginate and CRUD against the real API', async ({ page }) => {
    await openModule(page, 'webtable');
    await expect(page.getByTestId('table-body').locator('tr').first()).toBeVisible();

    // search
    await page.getByTestId('table-search').fill('Priya');
    await expect(page.getByTestId('table-cell-name').first()).toContainText('Priya');
    await page.getByTestId('table-search').fill('');
    await expect(page.getByTestId('table-page-1')).toBeVisible();

    // sort by name descending
    await page.getByTestId('table-sort-name').click();
    await page.getByTestId('table-sort-name').click();
    await expect(page.getByTestId('table-last-action-text')).toContainText('name descending');

    // pagination
    await page.getByTestId('table-next-page').click();
    await expect(page.getByTestId('table-summary')).toContainText('page 2 of');

    // row selection
    const firstRowCheckbox = page.getByTestId('table-body').getByRole('checkbox').first();
    await firstRowCheckbox.check();
    await expect(page.getByTestId('table-selected-count')).toContainText('1 selected');
    await page.getByTestId('table-clear-selection').click();
    await expect(page.getByTestId('table-selected-count')).toContainText('0 selected');

    // create - invalid email first, then a valid record
    const email = `e2e.${Date.now()}@example.com`;
    await page.getByTestId('table-add').click();
    await expect(page.getByTestId('employee-modal')).toBeVisible();
    await page.getByTestId('employee-name').fill('E2E Tester');
    await page.getByTestId('employee-email').fill('not-an-email');
    await page.getByTestId('employee-save').click();
    await expect(page.getByTestId('employee-error-email')).toBeVisible();
    await page.getByTestId('employee-email').fill(email);
    await page.getByTestId('employee-role').fill('SDET');
    await page.getByTestId('employee-salary').fill('72000');
    await page.getByTestId('employee-save').click();
    await expect(page.getByTestId('employee-modal')).toHaveCount(0, { timeout: 15000 });

    await page.getByTestId('table-search').fill('E2E Tester');
    await expect(page.getByTestId('table-cell-name').first()).toHaveText('E2E Tester');

    // edit
    await page.getByTestId('table-body').getByRole('button', { name: /^Edit / }).first().click();
    await page.getByTestId('employee-name').fill('E2E Tester Updated');
    await page.getByTestId('employee-save').click();
    await expect(page.getByTestId('table-cell-name').first()).toHaveText('E2E Tester Updated');

    // delete
    await page.getByTestId('table-body').getByRole('button', { name: /^Delete / }).first().click();
    await expect(page.getByTestId('delete-modal')).toBeVisible();
    await page.getByTestId('delete-confirm').click();
    await expect(page.getByTestId('table-body').getByText('E2E Tester Updated')).toHaveCount(0);
    await page.getByTestId('table-search').fill('');
  });
});

test.describe('iframe module', () => {
  test('interacts with the embedded document', async ({ page }) => {
    await openModule(page, 'iframe');
    const frame = page.frameLocator('[data-testid="iframe-demo"]');
    await expect(frame.getByTestId('iframe-heading')).toContainText('Automation Practice');
    await frame.getByTestId('iframe-name').fill('Ada Lovelace');
    await frame.getByTestId('iframe-email').fill('ada@example.com');
    await frame.getByTestId('iframe-topic').selectOption('playwright');
    await frame.getByTestId('iframe-submit').click();
    await expect(frame.getByTestId('iframe-status')).toContainText('Thanks Ada Lovelace');
    await expect(page.getByTestId('iframe-submission-name')).toHaveText('Ada Lovelace');

    await frame.getByTestId('iframe-open-modal').click();
    await expect(frame.getByTestId('iframe-nested-modal')).toBeVisible();
    await frame.getByTestId('iframe-nested-modal').click();
    await expect(frame.getByTestId('iframe-modal')).not.toHaveClass(/open/);

    await page.getByTestId('iframe-outer-input').fill('Sent from parent');
    await page.getByTestId('iframe-outer-send').click();
    await expect(frame.getByTestId('iframe-name')).toHaveValue('Sent from parent');
  });
});

test.describe('shadow DOM module', () => {
  test('pierces open shadow roots and nested components', async ({ page }) => {
    await openModule(page, 'shadow-dom');
    await page.getByTestId('shadow-input').fill('inside shadow');
    await page.getByTestId('shadow-button').click();
    await expect(page.getByTestId('shadow-output')).toHaveText('Clicked with: inside shadow');
    await expect(page.getByTestId('shadow-event-log')).toContainText('inside shadow');

    await page.getByTestId('shadow-nested-button').click();
    await expect(page.getByTestId('shadow-nested-output')).toHaveText('Nested clicks: 1');

    await page.getByTestId('shadow-react-increment').click();
    await page.getByTestId('shadow-react-increment').click();
    await expect(page.getByTestId('shadow-react-count')).toHaveText('Count: 2');

    await page.getByTestId('shadow-light-input').fill('light dom value');
    await page.getByTestId('shadow-light-send').click();
    await expect(page.getByTestId('shadow-output')).toHaveText('Clicked with: light dom value');
  });
});

test.describe('drag and drop module', () => {
  test('moves cards between columns and reports rejects', async ({ page }) => {
    await openModule(page, 'drag-drop');
    await expect(page.getByTestId('drag-count-todo')).toHaveText('2');
    await page.getByTestId('drag-item-1').dragTo(page.getByTestId('drop-zone-progress'));
    await expect(page.getByTestId('drop-zone-progress').getByTestId('drag-item-1')).toBeVisible();
    await expect(page.getByTestId('drag-count-todo')).toHaveText('1');
    await expect(page.getByTestId('drag-log-list')).toContainText('Moved');

    // Native HTML5 drops cannot be simulated with plain mouse events - dispatch
    // the DOM events exactly like the browser does during a real drag.
    const rejected = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="drag-item-1"]');
      const zone = document.querySelector('[data-testid="drop-zone-reject"]');
      if (!card || !zone) return 'missing nodes';
      const dataTransfer = new DataTransfer();
      dataTransfer.setData('text/plain', '1');
      card.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer }));
      zone.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
      zone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
      card.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer }));
      return 'dispatched';
    });
    expect(rejected).toBe('dispatched');
    await expect(page.getByTestId('drag-log-list')).toContainText('Drop rejected');

    await page.getByTestId('drag-add').click();
    await expect(page.getByTestId('drag-count-todo')).toHaveText('2');
    await page.getByTestId('drag-item-5').dragTo(page.getByTestId('drop-zone-done'));
    await expect(page.getByTestId('drag-count-done')).toHaveText('2');

    await page.getByTestId('drag-delete-5').click();
    await expect(page.getByTestId('drag-item-5')).toHaveCount(0);
  });
});

test.describe('notifications module', () => {
  test('fires toasts, auto-dismisses and clears the stack', async ({ page }) => {
    await openModule(page, 'notifications');
    await page.getByTestId('toast-btn-success').click();
    await expect(page.getByTestId('toast-success')).toBeVisible();
    await expect(page.getByTestId('notifications-active-count')).toHaveText('1');
    await page.getByTestId('toast-success').getByRole('button', { name: /^Dismiss/ }).click();
    await expect(page.getByTestId('toast-success')).toHaveCount(0);

    await page.getByTestId('toast-btn-success').click();
    await page.getByTestId('toast-btn-error').click();
    await page.getByTestId('toast-btn-warning').click();
    await page.getByTestId('toast-btn-info').click();
    await expect(page.getByTestId('notifications-active-count')).toHaveText('4');
    await expect(page.getByTestId('toast-success')).toBeVisible();
    await expect(page.getByTestId('toast-error')).toBeVisible();
    await expect(page.getByTestId('toast-warning')).toBeVisible();
    await expect(page.getByTestId('toast-info')).toBeVisible();

    await page.getByTestId('toast-custom-title').fill('Custom toast');
    await page.getByTestId('toast-custom-duration').selectOption('0');
    await page.getByTestId('toast-btn-custom').click();
    await expect(page.getByTestId('toast-custom')).toContainText('Custom toast');

    await page.getByTestId('notifications-clear').click();
    await expect(page.getByTestId('notifications-active-count')).toHaveText('0');

    await page.getByTestId('toast-btn-success').click();
    await expect(page.getByTestId('toast-success')).toBeVisible();
    await expect(page.getByTestId('toast-success')).toHaveCount(0, { timeout: 9000 });
  });
});

test.describe('alerts module', () => {
  test('handles alert, confirm (accept/dismiss) and prompt values', async ({ page }) => {
    await openModule(page, 'alerts');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toContain('native JavaScript alert');
      await dialog.accept();
    });
    await page.getByTestId('alert-trigger').click();
    await expect(page.getByTestId('alerts-last')).toContainText('alert');

    page.once('dialog', (dialog) => dialog.dismiss());
    await page.getByTestId('confirm-trigger').click();
    await expect(page.getByTestId('alerts-confirm-result')).toContainText('false');

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByTestId('confirm-trigger').click();
    await expect(page.getByTestId('alerts-confirm-result')).toContainText('true');

    await page.getByTestId('prompt-default-input').fill('Lead SDET');
    page.once('dialog', (dialog) => dialog.accept('Principal SDET'));
    await page.getByTestId('prompt-trigger').click();
    await expect(page.getByTestId('alerts-prompt-result')).toContainText('Principal SDET');

    await expect(page.getByTestId('alerts-history-list').locator('li')).toHaveCount(4);
  });
});

test.describe('mouse module', () => {
  test('click, double click, right click, hover and hold', async ({ page }) => {
    await openModule(page, 'mouse');
    await page.getByTestId('mouse-click-target').click();
    await expect(page.getByTestId('mouse-count-click')).toHaveText('1');

    await page.getByTestId('mouse-dblclick-target').dblclick();
    await expect(page.getByTestId('mouse-count-dblclick')).toHaveText('1');

    await page.getByTestId('mouse-rightclick-target').click({ button: 'right' });
    await expect(page.getByTestId('mouse-count-rightclick')).toHaveText('1');
    await expect(page.getByTestId('mouse-context-message')).toBeVisible();

    await page.getByTestId('mouse-hover-target').hover();
    await expect(page.getByTestId('mouse-hover-reveal')).toBeVisible();
    await expect(page.getByTestId('mouse-count-hover')).toHaveText('1');

    const hold = page.getByTestId('mouse-hold-target');
    const box = await hold.boundingBox();
    if (!box) throw new Error('hold target not visible');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(220);
    await page.mouse.up();
    await expect(page.getByTestId('mouse-hold-result')).toContainText('Last hold:');

    await page.getByTestId('mouse-move-area').hover({ position: { x: 40, y: 30 } });
    await expect(page.getByTestId('mouse-pos-inside')).toHaveText('yes');
    await expect(page.getByTestId('mouse-pos-x')).not.toHaveText('0');

    await page.getByTestId('mouse-reset').click();
    await expect(page.getByTestId('mouse-count-click')).toHaveText('0');
  });
});

test.describe('keyboard module', () => {
  test('captures keys, submits with Enter and clears with Escape', async ({ page }) => {
    await openModule(page, 'keyboard');
    const input = page.getByTestId('keyboard-input');
    await input.click();
    await input.pressSequentially('hello');
    await expect(input).toHaveValue('hello');
    await input.press('Enter');
    await expect(page.getByTestId('keyboard-submitted-list')).toContainText('hello');
    await expect(input).toHaveValue('');

    await input.pressSequentially('draft');
    await input.press('Escape');
    await expect(input).toHaveValue('');

    await input.pressSequentially('select me');
    await input.press('ControlOrMeta+a');
    await expect(page.getByTestId('keyboard-selection-state')).toContainText('selected');

    await input.press('ArrowUp');
    await expect(page.getByTestId('keyboard-counter')).toHaveText('1');
    await input.press('ArrowRight');
    await expect(page.getByTestId('keyboard-counter')).toHaveText('11');

    await page.getByTestId('keyboard-copy-source').fill('expect(page).toHaveTitle()');
    await page.getByTestId('keyboard-paste-simulate').click();
    await expect(page.getByTestId('keyboard-paste-target')).toHaveValue('expect(page).toHaveTitle()');
    await expect(page.getByTestId('keyboard-log-list')).toContainText('Arrow');
  });
});

test.describe('file upload module', () => {
  test('accepts valid files and rejects invalid type or size', async ({ page }) => {
    await openModule(page, 'file-upload');
    await page.getByTestId('upload-single').setInputFiles(makeFile('avatar.png', 'png-content'));
    await expect(page.getByTestId('upload-single-name')).toHaveText('avatar.png');
    await page.getByTestId('upload-single-remove').click();
    await expect(page.getByTestId('upload-single-name')).toHaveText('—');

    await page.getByTestId('upload-single').setInputFiles(makeFile('notes.txt', 'not allowed'));
    await expect(page.getByTestId('upload-single-error')).toContainText('Unsupported file type');

    const big = Buffer.alloc(3 * 1024 * 1024, 1);
    await page.getByTestId('upload-single').setInputFiles({ name: 'big.png', mimeType: 'image/png', buffer: big });
    await expect(page.getByTestId('upload-single-error')).toContainText('too large');

    await page.getByTestId('upload-multiple').setInputFiles([makeFile('one.txt', 'a'), makeFile('two.txt', 'bb')]);
    await expect(page.getByTestId('upload-multiple-list').locator('li')).toHaveCount(2);
    await expect(page.getByTestId('upload-multiple-count')).toHaveText('2');

    await page.getByTestId('upload-multiple').setInputFiles([
      makeFile('1.txt', 'a'),
      makeFile('2.txt', 'a'),
      makeFile('3.txt', 'a'),
      makeFile('4.txt', 'a'),
      makeFile('5.txt', 'a'),
      makeFile('6.txt', 'a'),
    ]);
    await expect(page.getByTestId('upload-multiple-error')).toContainText('at most 5 files');

    await page.getByTestId('upload-multiple-clear').click();
    await expect(page.getByTestId('upload-multiple-list')).toHaveCount(0);
  });
});

test.describe('date picker module', () => {
  test('native inputs, calendar widget and range selection', async ({ page }) => {
    await openModule(page, 'date-picker');
    await page.getByTestId('date-native').fill('2026-11-20');
    await expect(page.getByTestId('date-native-value')).toContainText('Nov 2026');

    await page.getByTestId('date-calendar-trigger').click();
    await expect(page.getByTestId('calendar-widget')).toBeVisible();
    await page.getByTestId('calendar-prev-month').click();
    await page.getByTestId('calendar-next-month').click();
    await page.getByTestId('calendar-day-2026-12-20').click();
    await expect(page.getByTestId('date-calendar-iso')).toHaveText('2026-12-20');
    await page.getByTestId('date-calendar-confirm').click();
    await expect(page.getByTestId('calendar-widget')).toHaveCount(0);

    // move the range calendar to March 2026 before selecting a range
    await page.getByTestId('range-calendar-prev-month').click();
    await page.getByTestId('range-calendar-prev-month').click();
    await page.getByTestId('date-range-start').fill('2026-03-02');
    await page.getByTestId('date-range-end').fill('2026-03-06');
    await expect(page.getByTestId('date-range-days')).toHaveText('5');

    // the range calendar follows the selected start date
    await expect(page.getByTestId('range-calendar-month-label')).toHaveText('March 2026');
    await expect(page.getByTestId('range-calendar-day-2026-03-10')).toBeVisible();
    await expect(page.getByTestId('range-calendar-day-2026-03-02')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('range-calendar-day-2026-03-04')).toBeVisible();

    // picking a new start date resets the range
    await page.getByTestId('range-calendar-day-2026-03-03').click();
    await expect(page.getByTestId('date-range-start-value')).toContainText('Mar 2026');
    await expect(page.getByTestId('date-range-days')).toHaveText('0');
  });
});

test.describe('dynamic waits module', () => {
  test('delayed elements appear and can be interacted with', async ({ page }) => {
    await openModule(page, 'waits');
    await expect(page.getByTestId('waits-pending')).toBeVisible();
    await page.getByTestId('waits-delay').selectOption('1000');
    await page.getByTestId('waits-start').click();
    await expect(page.getByTestId('waits-result')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('waits-result')).toContainText('Loaded after 1000 ms');

    await page.getByTestId('waits-trigger-visibility').click();
    await expect(page.getByTestId('waits-click-me')).toBeVisible({ timeout: 6000 });
    await page.getByTestId('waits-click-me').click();
    await expect(page.getByTestId('waits-text-output')).toHaveText('Button was clicked!');
  });
});

