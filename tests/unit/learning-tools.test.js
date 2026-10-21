import { beforeEach, expect, it, vi } from 'vitest';
const fs = require('node:fs');
const path = require('node:path');
beforeEach(async () => {
  vi.resetModules(); delete window.Oficina;
  for (const file of ['content/commands.js', 'content/questions.js', 'features/reference.js', 'features/clipboard.js', 'features/quiz.js']) {
    if (fs.existsSync(file)) await import(/* @vite-ignore */ path.resolve(file));
  }
});
it('filters names and purposes without accents or case and safely handles empty results', () => {
  const api = window.Oficina;
  expect(api?.filterCommands?.([{name:'ação', purpose:'Alteração'}], 'ACAO')).toHaveLength(1);
  expect(api?.filterCommands?.([{name:'git', purpose:'Alteração'}], 'alteracao')).toHaveLength(1);
  expect(api?.filterCommands?.(api.commands, '')).toEqual(api.commands);
  expect(api?.filterCommands?.(api.commands, '<img>')).toEqual([]);
});
it('searches examples, options, cautions and keywords', () => {
  const api = window.Oficina;
  const commands = [{
    name: 'git diff',
    purpose: 'Comparar alterações',
    example: 'git diff --staged',
    caution: 'Revise o snapshot antes do commit.',
    keywords: ['área de preparação', 'índice'],
  }];

  expect(api?.filterCommands?.(commands, '--staged')).toEqual(commands);
  expect(api?.filterCommands?.(commands, 'SNAPSHOT')).toEqual(commands);
  expect(api?.filterCommands?.(commands, 'preparacao')).toEqual(commands);
});
it.each([
  'check-ignore',
  'merge --abort',
  'remote get-url',
  'init -b main',
  'diff --staged',
])('includes and finds the workshop command variant %s', (query) => {
  const api = window.Oficina;
  const found = api?.filterCommands?.(api.commands, query) || [];

  expect(found.length).toBeGreaterThan(0);
  expect(JSON.stringify(found).toLowerCase()).toContain(query);
});
it('filters commands by category when provided and supports all/todas', () => {
  const api = window.Oficina;
  const sample = [
    { name: 'pwd', category: 'configuracao', purpose: 'Pasta atual' },
    { name: 'git status', category: 'staging', purpose: 'Estado' },
    { name: 'git diff', category: 'inspecao', purpose: 'Diferença' },
    { name: 'git branch', category: 'branches', purpose: 'Ramificação' },
    { name: 'git restore', category: 'recuperacao', purpose: 'Descartar' },
    { name: 'git push', category: 'remoto', purpose: 'Enviar' },
    { name: 'gh auth login', category: 'github', purpose: 'Login' }
  ];

  expect(api.filterCommands(sample, '', 'configuracao').map(c => c.name)).toEqual(['pwd']);
  expect(api.filterCommands(sample, '', 'staging').map(c => c.name)).toEqual(['git status']);
  expect(api.filterCommands(sample, '', 'branches').map(c => c.name)).toEqual(['git branch']);
  expect(api.filterCommands(sample, '', 'recuperacao').map(c => c.name)).toEqual(['git restore']);
  expect(api.filterCommands(sample, '', 'remoto').map(c => c.name)).toEqual(['git push', 'gh auth login']);
  expect(api.filterCommands(sample, '', 'github').map(c => c.name)).toEqual(['gh auth login']);
  expect(api.filterCommands(sample, '', 'all')).toHaveLength(sample.length);
  expect(api.filterCommands(sample, '', 'todas')).toHaveLength(sample.length);
  expect(api.filterCommands(sample, 'login', 'remoto').map(c => c.name)).toEqual(['gh auth login']);
});
it('provides rich command catalog with required fields, categories and valid documentation links', () => {
  const api = window.Oficina;
  expect(api.commands.length).toBeGreaterThanOrEqual(30);

  const expectedIds = [
    'pwd', 'cd', 'ls', '--version', 'config', 'config --get', 'config --local', 'init -b main',
    'status', 'status --short', 'add', 'commit', 'check-ignore',
    'diff', 'diff --staged', 'diff --cached', 'diff --check', 'log', 'log --graph --all', 'show',
    'restore --staged', 'restore', 'revert', 'merge --abort',
    'branch', 'branch --show-current', 'branch -d', 'switch', 'switch -c', 'merge', 'merge --ff-only',
    'remote add', 'remote -v', 'remote get-url', 'clone', 'fetch', 'push', 'pull --ff-only',
    'gh auth login', 'gh auth status', 'pull-request'
  ];

  const presentIds = api.commands.map(c => c.id);
  for (const id of expectedIds) {
    expect(presentIds, `Comando esperado ausente: ${id}`).toContain(id);
  }

  const validCategories = ['configuracao', 'staging', 'inspecao', 'branches', 'recuperacao', 'remoto', 'github'];
  for (const command of api.commands) {
    expect(command.id).toBeDefined();
    expect(command.name.length).toBeGreaterThan(1);
    expect(command.purpose.length).toBeGreaterThan(5);
    expect(command.example.length).toBeGreaterThan(1);
    expect(command.caution.length).toBeGreaterThan(5);
    expect(Array.isArray(command.keywords)).toBe(true);
    expect(command.keywords.length).toBeGreaterThan(0);
    expect(validCategories).toContain(command.category);
    expect(command.url).toMatch(/^https:\/\/(git-scm\.com|docs\.github\.com|cli\.github\.com)\//);
  }
});
it('only confirms fulfilled clipboard calls', async () => {
  expect(await window.Oficina?.copyCommand?.('git status', {writeText: vi.fn().mockRejectedValue(new Error())})).toBe('manual');
  expect(await window.Oficina?.copyCommand?.('git status', null)).toBe('manual');
  expect(await window.Oficina?.copyCommand?.('git status', {writeText: vi.fn().mockResolvedValue()})).toBe('copied');
});
it('grades concepts with explanations and supplies at least six valid questions', () => {
  const api = window.Oficina;
  expect(api?.questions?.length).toBeGreaterThanOrEqual(6);
  for (const q of api.questions) {
    expect(q.choices.some(c => c.id === q.correctId)).toBe(true);
    expect(api.gradeAnswer(q, q.correctId)).toEqual({correct:true, explanation:q.explanation});
    expect(api.gradeAnswer(q, 'invalid').correct).toBe(false);
  }
});
it('provides accurate command explanations for branches, status, diffs, conflicts and terminal tools', () => {
  const explain = window.Oficina?.explainCommand;
  expect(explain).toBeTypeOf('function');

  // Branch
  expect(explain('git branch')).toContain('Lista as branches locais');
  expect(explain('git branch -a')).toContain('Lista todas as branches locais e remotas');
  expect(explain('git branch --show-current')).toContain('Exibe apenas o nome da branch');
  expect(explain('git branch -d feat')).toContain('Exclui uma branch local que já foi integrada');
  expect(explain('git branch -D feat')).toContain('Força a exclusão de uma branch local');

  // Status & Diffs
  expect(explain('git status')).toContain('Exibe o estado dos arquivos');
  expect(explain('git status --short')).toContain('formato compacto de duas colunas');
  expect(explain('git status -s')).toContain('formato compacto de duas colunas');
  expect(explain('git diff')).toContain('Compara alterações da área de trabalho');
  expect(explain('git diff -- index.html')).toContain('Compara alterações não preparadas');
  expect(explain('git diff --staged')).toContain('Compara o snapshot preparado no staging');
  expect(explain('git diff --cached')).toContain('Compara o snapshot preparado no staging');
  expect(explain('git diff --cached -- index.html')).toContain('Compara alterações preparadas do arquivo específico');
  expect(explain('git diff --check')).toContain('Procura problemas de espaço em branco');

  // Log & Show
  expect(explain('git log --oneline')).toContain('Lista o histórico de commits de forma resumida');
  expect(explain('git log --oneline -3')).toContain('Exibe apenas os últimos 3 commits');
  expect(explain('git log --oneline --graph --all')).toContain('grafo visual de branches e merges');
  expect(explain('git log --oneline --graph --decorate -6')).toContain('até 6 commits com grafo');
  expect(explain('git show HEAD')).toContain('Inspeciona o commit atual');

  // Staging, Commit & Undo
  expect(explain('git add index.html styles.css')).toContain('Prepara o conteúdo atual');
  expect(explain('git commit -m "feat: inicio"')).toContain('Registra o snapshot preparado');
  expect(explain('git check-ignore notas.txt')).toContain('Verifica se um caminho é ignorado');
  expect(explain('git restore --staged index.html')).toContain('Retira o arquivo do staging');
  expect(explain('git restore index.html')).toContain('Descarta alterações locais');
  expect(explain('git revert --no-edit HEAD')).toContain('desfaz o último commit sem abrir o editor');

  // Branching & Merging
  expect(explain('git switch main')).toContain('Alterna para uma branch existente');
  expect(explain('git switch -c nova-feature')).toContain('Cria uma nova branch e alterna');
  expect(explain('git merge nova-feature')).toContain('Integra o histórico e as alterações');
  expect(explain('git merge --ff-only nova-feature')).toContain('somente se for possível avançar diretamente');
  expect(explain('git merge --abort')).toContain('Interrompe e cancela um merge em andamento');

  // Marcadores de conflito
  expect(explain('<<<<<<< HEAD')).toContain('início das alterações da branch atual');
  expect(explain('=======')).toContain('Separa as alterações da branch atual');
  expect(explain('>>>>>>> feature-dupla')).toContain('fim das alterações trazidas pela branch');

  // Remoto
  expect(explain('git remote add origin https://github.com/u/r.git')).toContain('servidor remoto chamado origin');
  expect(explain('git remote -v')).toContain('Lista os remotos configurados');
  expect(explain('git remote get-url origin')).toContain('Consulta a URL atualmente configurada');
  expect(explain('git clone https://github.com/u/r.git')).toContain('Copia um repositório remoto completo');
  expect(explain('git fetch origin')).toContain('Busca os commits do repositório remoto sem alterar');
  expect(explain('git pull --ff-only')).toContain('Busca e integra alterações do remoto somente se não houver divergência');
  expect(explain('git push -u origin main')).toContain('configura o acompanhamento da branch');

  // Config & Shell
  expect(explain('git --version')).toContain('Verifica a versão do Git');
  expect(explain('git config --global user.name "Dev"')).toContain('Define o nome de autoria exibido nos commits');
  expect(explain('git config --global user.email "dev@ex.com"')).toContain('Define o e-mail de autoria exibido nos commits');
  expect(explain('git config --global --get user.name')).toContain('Consulta o nome de autoria configurado globalmente');
  expect(explain('git config user.name')).toContain('Consulta o nome de autoria no repositório atual');
  expect(explain('git init -b main')).toContain('Inicia um repositório Git local com a branch principal chamada main');
  expect(explain('gh auth login')).toContain('Inicia a autenticação segura da sua conta GitHub');
  expect(explain('gh auth status')).toContain('Verifica o status da conexão e conta autenticada');
  expect(explain('pwd')).toContain('Mostra o caminho da pasta em que você está');
  expect(explain('ls')).toContain('Lista os arquivos e pastas existentes');
  expect(explain('cd ~/oficina-git')).toContain('Muda para a pasta especificada');
  expect(explain('mkdir -p ~/oficina-git')).toContain('Cria uma nova pasta no computador');
  expect(explain('sudo apt update')).toContain('Atualiza a lista de pacotes no terminal Linux');
  expect(explain('sudo apt install git')).toContain('Instala o Git pelo gerenciador de pacotes apt');
  expect(explain('sudo dnf install git')).toContain('Instala o Git pelo gerenciador de pacotes dnf no Fedora');
});
