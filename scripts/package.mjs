import { cp, lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distRoot = join(projectRoot, 'dist');
const packageRoot = join(distRoot, 'oficina-git-github');
const temporaryRoot = join(distRoot, '.oficina-git-github-em-preparo');
const zipPath = join(distRoot, 'oficina-git-github.zip');
const temporaryZipPath = join(distRoot, '.oficina-git-github-em-preparo.zip');
const backupRoot = join(distRoot, '.oficina-git-github-anterior');
const backupZipPath = join(distRoot, '.oficina-git-github-anterior.zip');

const publicMaterials = Object.freeze({
  product: Object.freeze([
    'index.html',
    'app/bootstrap.js',
    'app/navigation.js',
    'app/presentation.js',
    'content/agenda.js',
    'content/commands.js',
    'content/questions.js',
    'content/slides.js',
    'features/clipboard.js',
    'features/history-model.js',
    'features/history-view.js',
    'features/preparation.js',
    'features/quiz.js',
    'features/reference.js',
    'features/staging-model.js',
    'features/staging-view.js',
    'styles/base.css',
    'styles/history.css',
    'styles/learning-tools.css',
    'styles/preparation.css',
    'styles/presentation.css',
    'styles/staging.css',
  ]),
  guides: Object.freeze([
    'guides/diagnostico.html',
    'guides/exercicios.html',
    'guides/preparacao.html',
  ]),
  example: Object.freeze([
    'examples/site-da-turma/index.html',
    'examples/site-da-turma/README.md',
    'examples/site-da-turma/styles.css',
  ]),
  documentation: Object.freeze([
    'README.md',
    'TESTES.md',
    'ROTEIRO.md',
    'REFERENCIAS.md',
    'CREDITOS.md',
  ]),
});

const forbiddenNames = new Set([
  '.git',
  '.npmrc',
  'node_modules',
  'coverage',
  'test-results',
  'playwright-report',
]);
const credentialName = /^(?:\.env(?:\..*)?|credentials?(?:\..*)?|id_(?:rsa|dsa|ecdsa|ed25519)(?:\.pub)?|.*\.(?:key|pem|p12|pfx))$/i;

async function inspectPublicPath(sourcePath) {
  const pathParts = relative(projectRoot, sourcePath).split(sep);
  const blockedPart = pathParts.find((part) => forbiddenNames.has(part.toLowerCase()) || credentialName.test(part));
  if (blockedPart) throw new Error(`O empacotamento recusou o item protegido: ${blockedPart}`);

  const inspectedPaths = pathParts.map((_, index) => join(projectRoot, ...pathParts.slice(0, index + 1)));
  const metadata = await Promise.all(inspectedPaths.map((path) => lstat(path).catch(() => null)));
  const missingIndex = metadata.findIndex((item) => item === null);
  if (missingIndex >= 0) throw new Error(`Material obrigatório ausente: ${relative(projectRoot, inspectedPaths[missingIndex])}`);
  const linkIndex = metadata.findIndex((item) => item.isSymbolicLink());
  if (linkIndex >= 0) throw new Error(`Links simbólicos não são aceitos no pacote: ${relative(projectRoot, inspectedPaths[linkIndex])}`);
  return metadata.at(-1);
}

async function copyPublicEntry(relativePath) {
  const source = join(projectRoot, relativePath);
  const destination = join(temporaryRoot, relativePath);
  const metadata = await inspectPublicPath(source);

  if (!metadata.isFile()) throw new Error(`Tipo de arquivo não aceito: ${relativePath}`);
  await mkdir(resolve(destination, '..'), { recursive: true });
  await cp(source, destination, { errorOnExist: true, force: false });
}

async function createZip(entries) {
  const archiveEntries = await Promise.all(entries.map(async (relativePath) => {
    const archivePath = `oficina-git-github/${relativePath.replaceAll('\\', '/')}`;
    const contents = await readFile(join(temporaryRoot, relativePath));
    return [archivePath, [contents, { mtime: new Date(1980, 0, 1) }]];
  }));
  const archive = zipSync(Object.fromEntries(archiveEntries), { level: 9 });
  await writeFile(temporaryZipPath, archive, { flag: 'wx' });
}

async function exists(path) {
  return Boolean(await lstat(path).catch(() => null));
}

async function prepareOutputRoot() {
  const metadata = await lstat(distRoot).catch(() => null);
  if (!metadata) {
    await mkdir(distRoot);
    return;
  }
  if (metadata.isSymbolicLink() || !metadata.isDirectory()) {
    throw new Error('O diretório de saída dist deve ser uma pasta local comum.');
  }
}

async function restorePrevious(destination, backup, hadPrevious) {
  if (await exists(backup)) {
    await rm(destination, { recursive: true, force: true });
    await rename(backup, destination);
  } else if (!hadPrevious) {
    await rm(destination, { recursive: true, force: true });
  }
}

async function recoverInterruptedPublish() {
  const pairs = [[packageRoot, backupRoot], [zipPath, backupZipPath]];
  await Promise.all(pairs.map(async ([destination, backup]) => {
    if (!await exists(backup)) return;
    if (await exists(destination)) await rm(backup, { recursive: true, force: true });
    else await rename(backup, destination);
  }));
}

async function publishPackage() {
  const hadPackageRoot = await exists(packageRoot);
  const hadZip = await exists(zipPath);
  await rm(backupRoot, { recursive: true, force: true });
  await rm(backupZipPath, { force: true });

  try {
    if (hadPackageRoot) await rename(packageRoot, backupRoot);
    if (hadZip) await rename(zipPath, backupZipPath);
    await rename(temporaryRoot, packageRoot);
    await rename(temporaryZipPath, zipPath);
  } catch (error) {
    await restorePrevious(packageRoot, backupRoot, hadPackageRoot);
    await restorePrevious(zipPath, backupZipPath, hadZip);
    throw error;
  }

  await rm(backupRoot, { recursive: true, force: true });
  await rm(backupZipPath, { force: true });
}

async function buildPackage() {
  const entries = Object.values(publicMaterials).flat();
  await prepareOutputRoot();
  await recoverInterruptedPublish();
  await rm(temporaryRoot, { recursive: true, force: true });
  await rm(temporaryZipPath, { force: true });
  await mkdir(temporaryRoot, { recursive: true });

  try {
    await Promise.all(entries.map(copyPublicEntry));
    await createZip(entries);
    await publishPackage();
  } catch (error) {
    await rm(temporaryRoot, { recursive: true, force: true });
    await rm(temporaryZipPath, { force: true });
    throw error;
  }

  console.log(`Pacote criado em ${relative(projectRoot, packageRoot)} e ${relative(projectRoot, zipPath)} com ${entries.length} arquivos públicos.`);
}

await buildPackage();
