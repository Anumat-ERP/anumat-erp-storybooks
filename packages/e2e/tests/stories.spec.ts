import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Every story in the static Storybook build must render without runtime
 * errors and pass axe's WCAG 2.1 A/AA rules, in both themes.
 */
interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
}

const indexPath = fileURLToPath(new URL('../../ui/storybook-static/index.json', import.meta.url));
const entries = Object.values(
  (JSON.parse(readFileSync(indexPath, 'utf8')) as { entries: Record<string, IndexEntry> }).entries,
).filter((e) => e.type === 'story');

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} theme`, () => {
    for (const story of entries) {
      test(`${story.title} › ${story.name}`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('console', (m) => {
          if (m.type() === 'error' && !m.text().includes('Failed to load resource')) errors.push(m.text());
        });

        await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);
        await page.waitForSelector('#storybook-root > *', { state: 'attached' });
        // Let enter animations settle so colour-contrast reads final colours.
        await page.waitForTimeout(400);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          // Story canvases are fragments, not pages.
          .disableRules(['landmark-one-main', 'page-has-heading-one', 'region'])
          .analyze();

        const violations = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join('\n    ')}`,
        );
        expect(errors, 'runtime errors').toEqual([]);
        expect(violations, 'axe violations').toEqual([]);
      });
    }
  });
}
