import { test, expect } from './fixtures';
import { LOCATORS } from '../shared/locators';
import { PRACTICE_MODULES } from '../shared/modules';
import { playwrightExpression, playwrightPythonExpression, buildSnippets, type LocatorExample } from '../shared/locatorEngine';

/**
 * Resolve a catalogue locator against the live DOM, honouring `before` steps
 * (the only supported pre-step is switching into the demo iframe).
 * Mirrors the runtime check performed by the Locator Workbench.
 */
async function resolveLocator(page: import('@playwright/test').Page, example: LocatorExample): Promise<boolean> {
  const inFrame = Boolean(example.before?.some((step) => step.includes('frameLocator')));
  const useLocator = playwrightExpression(example).startsWith('page.locator(');
  const expression = playwrightExpression(example);

  if (useLocator) {
    if (expression.startsWith("page.locator('xpath=")) {
      const xpath = expression.slice("page.locator('xpath=".length, -2);
      if (inFrame) {
        return page
          .frameLocator('[data-testid="iframe-demo"]')
          .locator('xpath=' + xpath)
          .count()
          .then((count) => count > 0);
      }
      return (await page.locator('xpath=' + xpath).count()) > 0;
    }
    const css = expression.slice("page.locator('".length, -2);
    if (inFrame) {
      return (await page.frameLocator('[data-testid="iframe-demo"]').locator(css).count()) > 0;
    }
    return (await page.locator(css).count()) > 0;
  }

  return page.evaluate(
    ({ expr, useFrame }) => {
      const doc = useFrame
        ? (document.querySelector('[data-testid="iframe-demo"]') as HTMLIFrameElement | null)?.contentDocument ?? document
        : document;

      const deepQuery = (selector: string, root: Document | ShadowRoot = doc): Element | null => {
        const direct = root.querySelector(selector);
        if (direct) return direct;
        for (const host of Array.from(root.querySelectorAll('*'))) {
          if (!host.shadowRoot) continue;
          const inner = deepQuery(selector, host.shadowRoot);
          if (inner) return inner;
        }
        return null;
      };

      const api = {
        getByTestId: (id: string) => deepQuery('[data-testid="' + id + '"]'),
        getByPlaceholder: (text: string) => doc.querySelector('[placeholder="' + text + '"]'),
        getByLabel: (text: string) => {
          const label = Array.from(doc.querySelectorAll('label')).find((node) => (node.textContent ?? '').trim().includes(text));
          if (!label) return null;
          const forId = label.getAttribute('for');
          if (forId) return doc.getElementById(forId);
          return label.querySelector('input,select,textarea');
        },
        getByText: (text: string) =>
          Array.from(doc.querySelectorAll('button,a,span,p,label,h1,h2,h3,legend,li')).find((node) =>
            (node.textContent ?? '').trim().includes(text),
          ) ?? null,
        getByRole: (role: string) => doc.querySelector('[role="' + role + '"],' + role),
        locator: (selector: string) => {
          if (selector.startsWith('xpath=')) {
            const result = doc.evaluate(selector.slice(6), doc, null, 9, null);
            return result.singleNodeValue;
          }
          return doc.querySelector(selector);
        },
      };

      // The expression is authored in our own catalogue, never user supplied.
      // eslint-disable-next-line no-new-func
      const fn = new Function('page', 'return (' + expr + ');');
      return Boolean(fn(api));
    },
    { expr: expression, useFrame: inFrame },
  );
}

test.describe('locator catalogue', () => {
  test('catalogue is non-empty, covers every module and every strategy', () => {
    expect(LOCATORS.length).toBeGreaterThan(50);
    const strategies = new Set(LOCATORS.map((locator) => locator.strategy));
    for (const expected of ['ID', 'Name', 'Class', 'CSS', 'XPath', 'Text', 'Role', 'Placeholder', 'Label', 'Test ID']) {
      expect(strategies.has(expected as never), `strategy ${expected} is documented`).toBe(true);
    }
    for (const module of PRACTICE_MODULES) {
      expect(LOCATORS.filter((locator) => locator.module === module.slug).length, `${module.slug}`).toBeGreaterThan(0);
    }
  });

  test('every locator expression matches a real element in the live DOM', async ({ page }) => {
    const failures: string[] = [];
    const byModule = new Map<string, LocatorExample[]>();
    for (const locator of LOCATORS) {
      const list = byModule.get(locator.module) ?? [];
      list.push(locator);
      byModule.set(locator.module, list);
    }

    for (const [moduleSlug, locators] of byModule) {
      await page.goto(`/labs/${moduleSlug}`);
      await expect(page.getByTestId(`module-${moduleSlug}`)).toBeVisible();
      // Some catalogue entries only exist after an interaction.
      if (moduleSlug === 'form') await page.getByTestId('form-submit-text').click();
      if (moduleSlug === 'notifications') await page.getByTestId('toast-btn-success').click();
      if (moduleSlug === 'waits') {
        await page.getByTestId('waits-delay').selectOption('1000');
        await page.getByTestId('waits-start').click();
        await expect(page.getByTestId('waits-result')).toBeVisible({ timeout: 5000 });
      }
      if (moduleSlug === 'iframe') {
        await page.frameLocator('[data-testid="iframe-demo"]').getByTestId('iframe-name').waitFor();
      }

      for (const locator of locators) {
        const found = await resolveLocator(page, locator);
        if (!found) failures.push(`${locator.module}/${locator.key} → ${playwrightExpression(locator)}`);
      }
    }

    expect(failures, `locators that did not match:\n${failures.join('\n')}`).toEqual([]);
  });

  test('every locator produces valid Playwright Python and 5 framework snippets', () => {
    for (const locator of LOCATORS) {
      const py = playwrightPythonExpression(locator);
      expect(py).toContain('page.');
      const snippets = buildSnippets(locator);
      expect(snippets.playwrightJs.length).toBeGreaterThan(40);
      expect(snippets.playwrightPy.length).toBeGreaterThan(40);
      expect(snippets.seleniumPy).toContain('By.');
      expect(snippets.cypress).toContain('cy.visit');
    }
  });

  test('locator workbench renders snippets and runs live checks', async ({ page }) => {
    await page.goto('/labs/radio');
    await page.getByTestId('tab-locators').click();
    await expect(page.getByTestId('locator-workbench')).toBeVisible();
    const card = page.getByTestId('locator-radio-plan-premium');
    await expect(card).toBeVisible();
    await card.getByTestId('locator-check-radio-plan-premium').click();
    await expect(card.getByTestId('locator-check-result-radio-plan-premium')).toContainText('Matches an element');

    await card.getByRole('tab', { name: 'Selenium · Python' }).click();
    await expect(card.getByTestId('locator-snippet-radio-plan-premium')).toContainText('webdriver.common.by');
    await card.getByRole('tab', { name: 'Cypress' }).click();
    await expect(card.getByTestId('locator-snippet-radio-plan-premium')).toContainText('cy.visit');
    await card.getByTestId('locator-copy-radio-plan-premium').click();
    await expect(card.getByTestId('locator-copy-radio-plan-premium-state')).toHaveText('Copied');

    await page.getByTestId('locator-strategy-xpath').click();
    await expect(page.getByTestId('locator-count')).toContainText('locators');
    await page.getByTestId('locator-search').fill('zzzz-no-match');
    await expect(page.getByTestId('locator-empty')).toBeVisible();
  });
});

