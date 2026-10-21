const { test, expect } = require('@playwright/test');
const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync, readdirSync } = require('node:fs');
const { pathToFileURL } = require('node:url');
const { resolve } = require('node:path');
const { unzipSync } = require('fflate');

const projectRoot = resolve(__dirname, '../..');
const packageRoot = resolve(projectRoot, 'dist/oficina-git-github');
const zipPath = resolve(projectRoot, 'dist/oficina-git-github.zip');
const expectedFiles = [
  'CREDITOS.md', 'README.md', 'REFERENCIAS.md', 'ROTEIRO.md', 'TESTES.md', 'index.html',
  'app/bootstrap.js', 'app/navigation.js', 'app/presentation.js',
  'content/agenda.js', 'content/commands.js', 'content/questions.js', 'content/slides.js',
  'examples/site-da-turma/README.md', 'examples/site-da-turma/index.html',
  'examples/site-da-turma/styles.css',
  'features/clipboard.js', 'features/history-model.js', 'features/history-view.js',
  'features/preparation.js', 'features/quiz.js', 'features/reference.js',
  'features/staging-model.js', 'features/staging-view.js',
  'guides/diagnostico.html', 'guides/exercicios.html', 'guides/preparacao.html',
  'styles/base.css', 'styles/history.css', 'styles/learning-tools.css',
  'styles/preparation.css', 'styles/presentation.css', 'styles/staging.css',
].sort();

test.describe.configure({ mode: 'serial' });

test.beforeAll(() => {
  execFileSync(process.execPath, ['scripts/package.mjs'], { cwd: projectRoot, stdio: 'pipe' });
});

test('gera somente os materiais públicos previstos', async () => {
  expect(existsSync(zipPath), 'dist/oficina-git-github.zip').toBe(true);
  const firstArchive = readFileSync(zipPath);
  const requiredPaths = [
    'index.html',
    'app',
    'content',
    'features',
    'styles',
    'guides',
    'examples/site-da-turma',
    'README.md',
    'TESTES.md',
    'ROTEIRO.md',
    'REFERENCIAS.md',
    'CREDITOS.md',
  ];

  for (const relativePath of requiredPaths) {
    expect(existsSync(resolve(packageRoot, relativePath)), relativePath).toBe(true);
  }

  const listFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
  const packagedFiles = listFiles(packageRoot)
    .map((file) => file.slice(packageRoot.length + 1).replaceAll('\\', '/'))
    .sort();

  expect(packagedFiles).toEqual(expectedFiles);

  const archivedFiles = unzipSync(readFileSync(zipPath));
  const archivedPaths = Object.keys(archivedFiles).sort();
  const expectedArchivedPaths = expectedFiles.map((file) => `oficina-git-github/${file}`).sort();
  expect(archivedPaths).toEqual(expectedArchivedPaths);
  for (const relativePath of expectedFiles) {
    const archived = Buffer.from(archivedFiles[`oficina-git-github/${relativePath}`]);
    expect(archived.equals(readFileSync(resolve(packageRoot, relativePath))), relativePath).toBe(true);
  }

  execFileSync(process.execPath, ['scripts/package.mjs'], { cwd: projectRoot, stdio: 'pipe' });
  expect(readFileSync(zipPath).equals(firstArchive), 'ZIP reproduzível').toBe(true);
});

test('abre produto, guia e exemplo sem acesso à rede', async ({ page, context }) => {
  const networkRequests = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) networkRequests.push(request.url());
  });
  await context.setOffline(true);

  await page.goto(pathToFileURL(resolve(packageRoot, 'index.html')).href);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Git e GitHub');
  await page.keyboard.press('n');
  await expect(page.locator('[data-notes]')).toBeVisible();
  await page.keyboard.press('/');
  await expect(page.locator('[data-reference]')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('main').focus();

  const totalSlides = Number((await page.locator('[data-progress]').textContent()).split('/')[1].trim());
  for (let slide = 1; slide < totalSlides; slide += 1) await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-action="next"]')).toBeDisabled();

  await page.goto(pathToFileURL(resolve(packageRoot, 'guides/exercicios.html')).href);
  await expect(page.locator('[data-checkpoint]').first()).toBeVisible();

  await page.goto(pathToFileURL(resolve(packageRoot, 'examples/site-da-turma/index.html')).href);
  await expect(page.locator('#mensagem')).toHaveText('Aprendemos Git em conjunto.');
  expect(networkRequests).toEqual([]);
});

test('consulta comandos pelo clique enquanto o pacote está offline', async ({ page, context }) => {
  const networkRequests = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url())) networkRequests.push(request.url());
  });
  await context.setOffline(true);
  await page.goto(pathToFileURL(resolve(packageRoot, 'index.html')).href);

  const trigger = page.getByRole('button', { name: 'Comandos Git' });
  await trigger.click();
  const search = page.getByRole('searchbox');
  await expect(search).toBeFocused();
  await search.fill('remote get-url');
  await expect(page.locator('.command-card')).toContainText('git remote get-url origin');
  expect(networkRequests).toEqual([]);
});
