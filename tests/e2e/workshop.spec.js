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

test('abre Comandos Git por clique, pesquisa variantes e devolve o foco ao fechar', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Comandos Git' });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toHaveAttribute('aria-controls', /.+/);

  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const search = page.getByRole('searchbox');
  await expect(search).toBeFocused();
  await search.fill('check-ignore');
  await expect(page.locator('.command-card')).toHaveCount(1);
  await expect(page.locator('.command-card')).toContainText('git check-ignore');

  await page.keyboard.press('Escape');
  await expect(page.locator('[data-reference]')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('permite pesquisar comandos pelo botão em tela móvel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = page.getByRole('button', { name: 'Comandos Git' });
  await trigger.click();
  await page.getByRole('searchbox').fill('merge --abort');
  await expect(page.locator('.command-card')).toContainText('git merge --abort');
  await expect(page.locator('[data-reference]')).toBeVisible();
});

test('exibe tooltip flutuante ao passar o mouse ou focar linhas de comando', async ({ page }) => {
  await page.goto(`${workshopUrl}#terminal-e-pasta`);

  const cmdLine = page.locator('.code-block .cmd-line').first();
  await expect(cmdLine).toBeVisible();

  await cmdLine.hover();
  const tooltip = page.locator('#cmd-tooltip');
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveClass(/is-visible/);
  await expect(tooltip).toContainText('Git');
});

test('mantém o botão Próximo estável ao avançar múltiplos slides', async ({ page }) => {
  const next = page.getByRole('button', { name: 'Próximo →' });
  const initialBox = await next.boundingBox();
  expect(initialBox).not.toBeNull();

  for (let i = 0; i < 4; i++) {
    await next.click();
    const newBox = await next.boundingBox();
    expect(newBox.y).toBeCloseTo(initialBox.y, 0);
    expect(newBox.x).toBeCloseTo(initialBox.x, 0);
  }
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
