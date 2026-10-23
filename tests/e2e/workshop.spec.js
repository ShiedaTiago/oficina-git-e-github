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

test('mostra créditos com links diretos para Instagram e LinkedIn', async ({ page }) => {
  const instagram = page.getByRole('link', { name: /Instagram: @soulbleederr/ });
  const linkedin = page.getByRole('link', { name: /LinkedIn de Tiago Torres/ });
  await expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/soulbleederr/');
  await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/tiago-torres-02a07926a/');
  await expect(instagram.locator('svg')).toBeAttached();
  await expect(linkedin.locator('svg')).toBeAttached();
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

test('mantém o conteúdo em tamanho natural e rolável no celular em pé', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(`${workshopUrl}#simular-staging`);
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));

  const metrics = await page.evaluate(() => {
    const body = document.querySelector('.presentation-body');
    const canvas = document.querySelector('.slide-content');
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      overflowY: getComputedStyle(body).overflowY,
      scrollHeight: body.scrollHeight,
      clientHeight: body.clientHeight,
      zoom: Number.parseFloat(getComputedStyle(canvas).zoom),
    };
  });

  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
  expect(metrics.overflowY).toBe('auto');
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
  expect(metrics.zoom).toBe(1);

  await page.locator('.presentation-body').evaluate((body) => { body.scrollTop = body.scrollHeight; });
  await page.getByRole('button', { name: 'Próximo →' }).click();
  await expect.poll(() => page.locator('.presentation-body').evaluate((body) => body.scrollTop)).toBe(0);
});

test('mantém os controles principais confortáveis para toque', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${workshopUrl}#simular-historico`);

    const undersized = await page.locator('button:visible').evaluateAll((buttons) => buttons
      .map((button) => {
        const box = button.getBoundingClientRect();
        return { label: button.textContent.trim(), width: box.width, height: box.height };
      })
      .filter(({ width, height }) => width < 44 || height < 44));

    expect(undersized, `${viewport.width}x${viewport.height}`).toEqual([]);
  }
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

test('mantém a navegação visível no viewport e o tooltip dentro da tela cheia', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(`${workshopUrl}#terminal-e-pasta`);
  await page.getByRole('button', { name: 'Tela cheia' }).click();
  await expect(page.locator('#app')).toHaveClass(/is-fullscreen/);

  const bounds = await page.evaluate(() => {
    const footer = document.querySelector('.presentation-footer').getBoundingClientRect();
    const shell = document.querySelector('.presentation').getBoundingClientRect();
    const slide = document.querySelector('.slide');
    return {
      footerBottom: footer.bottom,
      shellBottom: shell.bottom,
      viewport: innerHeight,
      slideHeight: slide.clientHeight,
      slideContentHeight: slide.scrollHeight,
      slideBottom: slide.getBoundingClientRect().bottom,
      footerTop: footer.top,
    };
  });
  expect(bounds.footerBottom).toBeLessThanOrEqual(bounds.viewport + 1);
  expect(bounds.shellBottom).toBeLessThanOrEqual(bounds.viewport + 1);
  expect(bounds.slideContentHeight).toBeLessThanOrEqual(bounds.slideHeight + 1);
  expect(bounds.slideBottom).toBeLessThanOrEqual(bounds.footerTop + 1);

  const token = page.locator('.code-block .cmd-part').first();
  await token.hover();
  await expect(page.locator('#cmd-tooltip')).toBeVisible();
  expect(await page.locator('#cmd-tooltip').evaluate((node) => node.parentElement?.id)).toBe('app');

  await page.getByRole('button', { name: 'Próximo →' }).click();
  await expect(page.locator('#cmd-tooltip')).not.toHaveClass(/is-visible/);
  await expect(page.locator('#cmd-tooltip')).toHaveAttribute('aria-hidden', 'true');
  await page.evaluate(() => document.exitFullscreen());
});

test('faz todos os slides caberem nos viewports de validação sem soltar a navegação', async ({ page }) => {
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
    { width: 768, height: 1024 },
    { width: 375, height: 667 },
    { width: 667, height: 375 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto(workshopUrl);
    const ids = await page.evaluate(() => window.Oficina.slides.map((slide) => slide.id));
    for (const id of ids) {
      const metrics = await page.evaluate(async (slideId) => {
        location.hash = slideId;
        await new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolveFrame))));
        const slide = document.querySelector('.slide');
        const footer = document.querySelector('.presentation-footer').getBoundingClientRect();
        return {
          id: slideId,
          fit: Number(slide.dataset.fit),
          slideHeight: slide.clientHeight,
          slideContentHeight: slide.scrollHeight,
          footerBottom: footer.bottom,
        };
      }, id);
      expect(metrics.slideContentHeight, `${id} em ${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(metrics.slideHeight + 1);
      expect(metrics.footerBottom, `rodapé em ${id}`).toBeLessThanOrEqual(viewport.height + 1);
      expect(metrics.fit, `escala legível em ${id}`).toBeGreaterThanOrEqual(.82);
    }
  }
});

test('mantém o editor de conflito do grafo totalmente operável', async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 375, height: 667 }, { width: 667, height: 375 }]) {
    await page.setViewportSize(viewport);
    await page.goto(workshopUrl);
    await page.goto(`${workshopUrl}#simular-historico`);
    await expect(page.locator('[data-history-action="advance"]')).toBeVisible();
    for (let step = 0; step < 4; step++) await page.evaluate(() => document.querySelector('[data-history-action="advance"]').click());
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    const metrics = await page.evaluate(() => {
      const slide = document.querySelector('.slide');
      const footer = document.querySelector('.presentation-footer').getBoundingClientRect();
      const complete = document.querySelector('[data-history-action="completeMerge"]').getBoundingClientRect();
      const reset = document.querySelector('[data-history-action="reset"]').getBoundingClientRect();
      return { slideHeight: slide.clientHeight, slideContentHeight: slide.scrollHeight, footerTop: footer.top, completeBottom: complete.bottom, resetBottom: reset.bottom };
    });
    expect(metrics.slideContentHeight, `${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(metrics.slideHeight + 1);
    expect(metrics.completeBottom).toBeLessThanOrEqual(metrics.footerTop);
    expect(metrics.resetBottom).toBeLessThanOrEqual(metrics.footerTop);
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
