import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ShieldCheck, Terminal } from 'lucide-react';
import { PRACTICE_MODULES } from '@shared/modules';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { cx } from '@/lib/utils';

/**
 * Framework cheat-sheet shown below every practice module: explicit waits,
 * assertions, visibility / enabled checks and runnable starter code.
 */
export function ModuleCheatsheet({ slug }: { slug: string }) {
  const module = PRACTICE_MODULES.find((item) => item.slug === slug);
  const url = `http://localhost:5173/testing/${slug}`;
  const page = module?.title ?? slug;

  const snippets = useMemo(
    () => ({
      playwrightJs: `import { test, expect } from '@playwright/test';

test('${page} module', async ({ page }) => {
  await page.goto('${url}');

  // explicit wait + visibility assertion
  const panel = page.getByTestId('practice-panel');
  await expect(panel).toBeVisible({ timeout: 5000 });

  // text verification
  await expect(page.getByTestId('module-title')).toHaveText('${page}');

  // enabled / disabled state
  const disabled = page.locator(':disabled');
  if (await disabled.count()) await expect(disabled.first()).toBeDisabled();
});`,
      playwrightPy: `from playwright.sync_api import expect, sync_playwright

def test_${slug.replace(/-/g, '_')}(page):
    page.goto('${url}')
    panel = page.get_by_test_id('practice-panel')
    expect(panel).to_be_visible(timeout=5000)
    expect(page.get_by_test_id('module-title')).to_have_text('${page}')`,
      seleniumPy: `import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def test_${slug.replace(/-/g, '_')}(driver):
    driver.get('${url}')
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="practice-panel"]'))
    )
    title = driver.find_element(By.CSS_SELECTOR, '[data-testid="module-title"]')
    assert title.text == '${page}'`,
      cypress: `describe('${page}', () => {
  beforeEach(() => cy.visit('${url}'))

  it('renders the practice panel', () => {
    cy.get('[data-testid="practice-panel"]').should('be.visible')
    cy.get('[data-testid="module-title"]').should('contain.text', '${page}')
  })
})`,
    }),
    [page, slug, url],
  );

  return (
    <Card testId="module-cheatsheet">
      <CardHeader
        icon={<Terminal className="h-4 w-4" aria-hidden />}
        title="Framework starter snippets"
        description="Run these against a locally running Automation Practice instance. Auto-waiting assertions keep the suites stable."
        actions={
          <Badge tone="success" className="gap-1">
            <ShieldCheck className="h-3 w-3" aria-hidden /> Explicit waits
          </Badge>
        }
      />
      <div className="grid gap-3 xl:grid-cols-2">
        <CodeBlock code={snippets.playwrightJs} title="Playwright · JavaScript" maxHeight="max-h-72" />
        <CodeBlock code={snippets.playwrightPy} title="Playwright · Python" maxHeight="max-h-72" />
        <CodeBlock code={snippets.seleniumPy} title="Selenium · Python" maxHeight="max-h-72" />
        <CodeBlock code={snippets.cypress} title="Cypress" maxHeight="max-h-72" />
      </div>
      <div className="mt-3 grid gap-2 text-xs text-slate-600 dark:text-slate-400 sm:grid-cols-3">
        {[
          { label: 'Visibility', value: 'toBeVisible() · visibility_of_element_located' },
          { label: 'Enabled state', value: 'toBeEnabled() · element_to_be_clickable' },
          { label: 'Text', value: 'toHaveText() · text_to_be_present_in_element' },
        ].map((item) => (
          <div key={item.label} className={cx('surface-muted px-3 py-2')}>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</p>
            <p className="mt-0.5 font-mono text-[11px]">{item.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Rocket className="h-3.5 w-3.5" aria-hidden />
        Every lab ships an opinionated test id on every control, so you never need brittle CSS chains.
        <Link to="/about" className="font-semibold text-brand-700 underline-offset-2 hover:underline dark:text-brand-300">
          Learn more
        </Link>
      </p>
    </Card>
  );
}

