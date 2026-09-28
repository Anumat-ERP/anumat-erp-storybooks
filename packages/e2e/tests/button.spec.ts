import { expect, test } from '@playwright/test';

test('a loading button keeps its size and ignores clicks', async ({ page }) => {
  await page.goto('/iframe.html?id=primitives-button--loading&viewMode=story');
  const buttons = page.getByRole('button', { name: 'Save changes' });
  await expect(buttons).toHaveCount(2);
  const [loading, idle] = await buttons.all();
  const a = await loading!.boundingBox();
  const b = await idle!.boundingBox();
  expect(a?.width).toBe(b?.width);
  expect(a?.height).toBe(b?.height);
  await expect(loading!).toHaveAttribute('aria-busy', 'true');
});

test('buttons are reachable by keyboard with a visible focus ring', async ({ page }) => {
  await page.goto('/iframe.html?id=primitives-button--variants&viewMode=story');
  await page.getByRole('button', { name: 'Primary' }).waitFor();
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus-visible');
  await expect(focused).toHaveText('Primary');
  const outline = await focused.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).toBe('solid');
});
