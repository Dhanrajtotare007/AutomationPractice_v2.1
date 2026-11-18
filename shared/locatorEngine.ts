/**
 * Locator practice catalog.
 *
 * Every entry describes one interactive element of the playground together with
 * a pure locator expression that the UI evaluates against the live DOM to prove
 * the selector really matches the element it documents.
 */

export type LocatorCategory =
  | 'ID'
  | 'Name'
  | 'Class'
  | 'CSS'
  | 'XPath'
  | 'Text'
  | 'Role'
  | 'Placeholder'
  | 'Label'
  | 'Test ID';

export interface LocatorExample {
  /** Stable identifier for the element inside the module page. */
  key: string;
  /** Human readable description, e.g. "Accept terms checkbox". */
  description: string;
  /** Module slug the element lives on. */
  module: string;
  strategy: LocatorCategory;
  /** The raw selector/expression (XPath starts with // or (//). */
  expression: string;
  /** Element type used by framework snippets for the final action. */
  elementType?: 'button' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'link';
  /** Playwright steps that must run before the locator expression. */
  before?: string[];
  notes?: string;
}

export interface LocatorSnippets {
  playwrightJs: string;
  playwrightPy: string;
  seleniumPy: string;
  cypress: string;
  pageObjectPy?: string;
}

const isXPath = (expr: string) => expr.startsWith('//') || expr.startsWith('(//');

export const moduleUrl = (module: string) => `/testing/${module}`;

const snake = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/^_|_$/g, '');

const pascal = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

/** Pure Playwright JS expression for the locator. */
export function playwrightExpression(example: LocatorExample): string {
  const { expression, strategy } = example;
  switch (strategy) {
    case 'Test ID':
      return `page.getByTestId('${expression}')`;
    case 'Role': {
      const [role, name] = expression.split('|');
      return `page.getByRole('${role}', { name: '${name}' })`;
    }
    case 'Placeholder':
      return `page.getByPlaceholder('${expression}')`;
    case 'Label':
      return `page.getByLabel('${expression}')`;
    case 'Text':
      return `page.getByText('${expression}')`;
    default:
      if (isXPath(expression)) return `page.locator('xpath=${expression}')`;
      if (strategy === 'ID') return `page.locator('#${expression}')`;
      return `page.locator('${expression}')`;
  }
}

/** Pure Playwright Python expression (same semantics as JS). */
export function playwrightPythonExpression(example: LocatorExample): string {
  const { expression, strategy } = example;
  switch (strategy) {
    case 'Test ID':
      return `page.get_by_test_id('${expression}')`;
    case 'Role': {
      const [role, name] = expression.split('|');
      return `page.get_by_role('${role}', name='${name}')`;
    }
    case 'Placeholder':
      return `page.get_by_placeholder('${expression}')`;
    case 'Label':
      return `page.get_by_label('${expression}')`;
    case 'Text':
      return `page.get_by_text('${expression}')`;
    default:
      if (isXPath(expression)) return `page.locator('xpath=${expression}')`;
      if (strategy === 'ID') return `page.locator('#${expression}')`;
      return `page.locator('${expression}')`;
  }
}

/** Translate a JS `before` step into its Python equivalent. */
function toPythonStep(step: string) {
  return step
    .replace(/page\.getByTestId\('([^']+)'\)/g, "page.get_by_test_id('$1')")
    .replace(/page\.getByRole\('([^']+)', \{ name: '([^']+)' \}\)/g, "page.get_by_role('$1', name='$2')")
    .replace(/page\.getByLabel\('([^']+)'\)/g, "page.get_by_label('$1')")
    .replace(/page\.getByText\('([^']+)'\)/g, "page.get_by_text('$1')")
    .replace(/page\.getByPlaceholder\('([^']+)'\)/g, "page.get_by_placeholder('$1')");
}

interface SeleniumTarget {
  by: string;
  selector: string;
  note: string;
}

function seleniumTarget(example: LocatorExample): SeleniumTarget {
  const { expression, strategy } = example;
  if (isXPath(expression) || strategy === 'XPath') {
    return { by: 'By.XPATH', selector: `'${expression}'`, note: 'XPath expression' };
  }
  switch (strategy) {
    case 'Test ID':
      return { by: 'By.CSS_SELECTOR', selector: `'[data-testid="${expression}"]'`, note: 'data-testid attribute' };
    case 'ID':
      return { by: 'By.ID', selector: `'${expression}'`, note: 'id attribute' };
    case 'Name':
      return { by: 'By.NAME', selector: `'${expression.replace(/^\[name="|"\]$/g, '')}'`, note: 'name attribute' };
    case 'Class':
      return { by: 'By.CLASS_NAME', selector: `'${expression.replace(/^\./, '').split(' ')[0]}'`, note: 'class attribute' };
    case 'Role': {
      const [role, name] = expression.split('|');
      return { by: 'By.XPATH', selector: `"//${role === 'link' ? 'a' : role}[normalize-space(.)='${name}']"`, note: 'accessible text' };
    }
    case 'Label':
      return { by: 'By.XPATH', selector: `"//label[contains(normalize-space(.), '${expression}')]"`, note: 'label text' };
    case 'Placeholder':
      return { by: 'By.CSS_SELECTOR', selector: `'[placeholder="${expression}"]'`, note: 'placeholder attribute' };
    case 'Text':
      return { by: 'By.XPATH', selector: `"//*[contains(normalize-space(.), '${expression}')]"`, note: 'visible text' };
    default:
      return { by: 'By.CSS_SELECTOR', selector: `'${expression}'`, note: 'CSS selector' };
  }
}

function cypressSelector(example: LocatorExample): string {
  const { expression, strategy } = example;
  if (isXPath(expression) || strategy === 'XPath') return `'xpath=${expression}'`;
  switch (strategy) {
    case 'Test ID':
      return `'[data-testid="${expression}"]'`;
    case 'ID':
      return `'#${expression}'`;
    case 'Role': {
      const [role, name] = expression.split('|');
      if (role === 'button') return `'button:contains("${name}")'`;
      if (role === 'link') return `'a:contains("${name}")'`;
      return `'[role="${role}"]'`;
    }
    case 'Text':
      return `':contains("${expression}")'`;
    case 'Label':
      return `'label:contains("${expression}")'`;
    case 'Placeholder':
      return `'[placeholder="${expression}"]'`;
    default:
      return `'${expression}'`;
  }
}

/** Ready-to-run snippets for the four supported framework setups. */
export function buildSnippets(example: LocatorExample): LocatorSnippets {
  const pw = playwrightExpression(example);
  const pwPy = playwrightPythonExpression(example);
  const before = example.before ?? [];
  const beforeJs = before.map((step) => `  ${step};\n`).join('');
  const beforePy = before.map((step) => `    ${toPythonStep(step)}\n`).join('');

  const target = seleniumTarget(example);
  const isCheckable = example.elementType === 'checkbox' || example.elementType === 'radio';
  const seleniumAction = isCheckable || example.elementType === 'button' || example.elementType === 'link'
    ? '.click()'
    : ".send_keys('value')";
  const pyAction = isCheckable || example.elementType === 'button' || example.elementType === 'link' ? '.click()' : ".fill('value')";

  const seleniumBefore = before
    .map((step) => {
      const idMatch = step.match(/getByTestId\('([^']+)'\)/);
      if (!idMatch) return '';
      if (step.includes('.check()') || step.includes('.click()')) {
        return `driver.find_element(By.CSS_SELECTOR, "[data-testid='${idMatch[1]}']").click()\n`;
      }
      return '';
    })
    .join('');

  return {
    playwrightJs: `import { test, expect } from '@playwright/test';\n\ntest('${example.description.replace(/'/g, "")}', async ({ page }) => {\n  await page.goto('${moduleUrl(example.module)}');\n${beforeJs}  const target = ${pw};\n  await expect(target).toBeVisible();\n  await target${isCheckable ? '.check()' : '.click()'};\n});`,
    playwrightPy: `from playwright.sync_api import expect\n\n\ndef test_${snake(example.key)}(page):\n    page.goto('${moduleUrl(example.module)}')\n${beforePy}    target = ${pwPy}\n    expect(target).to_be_visible()\n    target${pyAction}`,
    seleniumPy: `from selenium.webdriver.common.by import By\nfrom selenium.webdriver.support.ui import WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\n\n${seleniumBefore}element = WebDriverWait(driver, 10).until(\n    EC.presence_of_element_located((${target.by}, ${target.selector}))\n)\nelement${seleniumAction}`,
    cypress: `describe('${example.description.replace(/'/g, "")}', () => {\n  it('interacts with the element', () => {\n    cy.visit('${moduleUrl(example.module)}')\n${before.length ? `    // requires: cy.iframe('[data-testid="iframe-demo"]') or a frame plugin\n` : ''}    cy.get(${cypressSelector(example)})\n      .should('exist')\n      .and('be.visible')\n      ${isCheckable ? '.check()' : '.click()'}\n  })\n})`,
    pageObjectPy: `class ${pascal(example.key)}Page:\n    LOCATOR = (${target.by}, ${target.selector})  # ${target.note}\n\n    def __init__(self, driver):\n        self.driver = driver\n\n    def element(self):\n        return WebDriverWait(self.driver, 10).until(\n            EC.presence_of_element_located(self.LOCATOR)\n        )`,
  };
}
