const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const { resolve } = require('node:path');

const workshopUrl = pathToFileURL(resolve(__dirname, '../../index.html')).href;

test.beforeEach(async ({ page }) => {
  await page.goto(workshopUrl);
});

test('apresenta a oficina e se adapta à área visível', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Git e GitHub');
  await expect(page.locator('[data-progress]')).toHaveText(/1 \/ \d+/);

  const viewport = page.viewportSize();
  const dimensions = await page.evaluate(() => ({
    larguraDoDocumento: document.documentElement.scrollWidth,
    larguraVisivel: document.documentElement.clientWidth,
  }));

  expect(viewport).not.toBeNull();
  expect(dimensions.larguraDoDocumento).toBeLessThanOrEqual(dimensions.larguraVisivel);
});

test('permite conduzir a apresentação pelo teclado', async ({ page }) => {
  const heading = page.getByRole('heading', { level: 1 });
  const firstTitle = await heading.textContent();

  await page.keyboard.press('ArrowRight');
  await expect(heading).not.toHaveText(firstTitle);
  await expect(page).toHaveURL(/#.+/);

  await page.keyboard.press('n');
  await expect(page.locator('[data-notes]')).toBeVisible();

  await page.keyboard.press('/');
  await expect(page.locator('[data-reference]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-reference]')).toBeHidden();
});

test.describe('movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('remove transições quando essa preferência está ativa', async ({ page }) => {
    const movingElements = await page.locator('body').evaluate(() => {
      const hasDuration = (value) => value.split(',').some((duration) => Number.parseFloat(duration) > 0);
      return [...document.querySelectorAll('*')]
        .filter((element) => {
          const style = getComputedStyle(element);
          return hasDuration(style.transitionDuration) || hasDuration(style.animationDuration);
        })
        .map((element) => element.tagName.toLowerCase());
    });

    expect(movingElements).toEqual([]);
  });
});
