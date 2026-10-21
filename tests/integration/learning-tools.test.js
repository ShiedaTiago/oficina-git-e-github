import { beforeEach, expect, it, vi } from 'vitest';
const path = require('node:path');
beforeEach(async () => {
  vi.resetModules(); delete window.Oficina;
  document.body.replaceChildren();
  for (const file of ['app/navigation.js','app/presentation.js','content/commands.js','content/questions.js','features/reference.js','features/clipboard.js','features/quiz.js']) await import(/* @vite-ignore */ path.resolve(file));
});
function root() { const node = document.createElement('div'); document.body.append(node); return node; }
it('opens search with focus, safely filters HTML, closes on Escape and restores focus', () => {
  const host = root(); const api = window.Oficina;
  const ref = api.attachReference(host, api.commands);
  const deck = api.mountPresentation(host, [{id:'a',title:'A',blocks:[],notes:{}}]);
  const trigger = host.querySelector('[data-action="reference"]'); trigger.focus(); trigger.click();
  const search = host.querySelector('input[type="search"]'); expect(document.activeElement).toBe(search);
  search.value = '<img src=x onerror=alert(1)>'; search.dispatchEvent(new Event('input'));
  expect(host.textContent).toContain('Nenhum comando encontrado'); expect(host.querySelector('img')).toBeNull();
  document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape',bubbles:true}));
  expect(document.activeElement).toBe(trigger); expect(host.querySelector('[data-reference]').hidden).toBe(true);
  trigger.click(); expect(document.activeElement).toBe(search);
  ref.destroy(); deck.destroy();
});
it('filters rendered commands by name, purpose, example, option, caution and keyword', () => {
  const host = root(); const api = window.Oficina;
  const commands = [
    {name:'git status', purpose:'Consultar o estado do repositório', example:'git status --short', caution:'Leia a saída antes de continuar.', keywords:['diagnóstico']},
    {name:'git diff', purpose:'Comparar alterações', example:'git diff --staged', caution:'Revise o snapshot preparado.', keywords:['área de preparação']},
  ];
  const ref = api.mountReference(host, commands);
  const search = host.querySelector('input[type="search"]');
  const expectOnly = (query, expected) => {
    search.value = query; search.dispatchEvent(new Event('input'));
    expect(host.querySelectorAll('.command-card')).toHaveLength(1);
    expect(host.querySelector('.command-card h3').textContent).toBe(expected);
  };

  expectOnly('STATUS', 'git status');
  expectOnly('estado do repositorio', 'git status');
  expectOnly('--staged', 'git diff');
  expectOnly('snapshot', 'git diff');
  expectOnly('preparacao', 'git diff');
  ref.destroy();
});
it('supports interactive category chips and renders rich card layout', () => {
  const host = root(); const api = window.Oficina;
  const commands = [
    {
      id: 'pwd',
      name: 'pwd',
      category: 'configuracao',
      purpose: 'Exibir caminho atual',
      example: 'pwd',
      caution: 'Confira antes de commitar',
      keywords: ['pasta'],
      url: 'https://git-scm.com/docs/git'
    },
    {
      id: 'branch',
      name: 'git branch',
      category: 'branches',
      purpose: 'Listar ramificações',
      example: 'git branch',
      caution: 'Asterisco marca atual',
      keywords: ['ramificação'],
      url: 'https://git-scm.com/docs/git-branch'
    },
    {
      id: 'restore',
      name: 'git restore',
      category: 'recuperacao',
      purpose: 'Descartar alterações',
      example: 'git restore index.html',
      caution: 'Ação irreversível',
      keywords: ['descartar'],
      url: 'https://git-scm.com/docs/git-restore'
    }
  ];

  const ref = api.mountReference(host, commands);

  expect(host.querySelector('#git-command-reference-title').textContent).toBe('Comandos Git e GitHub');
  expect(host.querySelectorAll('.category-filter-btn').length).toBeGreaterThanOrEqual(7);

  const branchesBtn = host.querySelector('[data-category="branches"]');
  expect(branchesBtn.getAttribute('aria-pressed')).toBe('false');

  branchesBtn.click();
  expect(branchesBtn.getAttribute('aria-pressed')).toBe('true');
  expect(host.querySelectorAll('.command-card')).toHaveLength(1);
  expect(host.querySelector('.command-card h3').textContent).toBe('git branch');

  const card = host.querySelector('.command-card');
  expect(card.querySelector('.command-category').textContent).toBe('Branches');
  expect(card.querySelector('p').textContent).toBe('Listar ramificações');
  expect(card.querySelector('pre').textContent).toBe('git branch');
  expect(card.querySelector('.command-observation').textContent).toBe('Asterisco marca atual');
  expect(card.querySelector('a').getAttribute('target')).toBe('_blank');
  expect(card.querySelector('a').getAttribute('rel')).toBe('noopener');
  expect(card.querySelector('[data-copy-command]').dataset.copyCommand).toBe('git branch');

  // Test search within category
  const search = host.querySelector('input[type="search"]');
  search.value = 'inexistente';
  search.dispatchEvent(new Event('input'));
  expect(host.querySelectorAll('.command-card')).toHaveLength(0);
  expect(host.textContent).toContain('Nenhum comando encontrado.');

  // Reset to "Todos"
  const allBtn = host.querySelector('[data-category="todas"]');
  allBtn.click();
  search.value = '';
  search.dispatchEvent(new Event('input'));
  expect(host.querySelectorAll('.command-card')).toHaveLength(3);

  ref.destroy();
  expect(host.children.length).toBe(0);
});
it('renders multiline command examples with individual cmd-line spans and specific hints', () => {
  const host = root();
  const api = window.Oficina;
  const commands = [
    {
      name: 'git branch',
      purpose: 'Gerenciar branches',
      example: 'git branch\ngit branch -a',
      caution: 'Use com cuidado.',
      category: 'branches',
      keywords: ['branch']
    }
  ];
  const ref = api.mountReference(host, commands);
  const card = host.querySelector('.command-card');
  const pre = card.querySelector('pre');
  expect(pre.textContent).toBe('git branch\ngit branch -a');

  const cmdLines = pre.querySelectorAll('.cmd-line');
  expect(cmdLines).toHaveLength(2);
  expect(cmdLines[0].textContent).toBe('git branch');
  expect(cmdLines[0].dataset.cmdHint).toContain('Lista as branches locais');
  expect(cmdLines[1].textContent).toBe('git branch -a');
  expect(cmdLines[1].dataset.cmdHint).toContain('Lista todas as branches locais e remotas');

  ref.destroy();
});
it('renders manual fallback after clipboard rejection and only reports success after fulfillment', async () => {
  const host = root(); const api = window.Oficina;
  const ref = api.mountReference(host, api.commands.slice(0,1));
  const copy = api.attachClipboard(host, {writeText: vi.fn().mockRejectedValue(new Error())});
  host.querySelector('[data-copy-command]').click(); await vi.waitFor(() => expect(host.querySelector('textarea')).not.toBeNull());
  expect(host.querySelector('textarea').value).toBe(api.commands[0].example);
  expect(host.textContent).not.toContain('Comando copiado.'); copy.destroy();
  let resolve; const success = api.attachClipboard(host, {writeText: () => new Promise(done => {resolve = done;})});
  host.querySelector('[data-copy-command]').click(); expect(host.textContent).not.toContain('Comando copiado.');
  resolve(); await vi.waitFor(() => expect(host.textContent).toContain('Comando copiado.'));
  success.destroy(); ref.destroy();
});
it('replaces quiz answers without duplicate scoring and resets memory and controls', () => {
  const host = root(); const api = window.Oficina; const quiz = api.mountQuiz(host, api.questions);
  const choose = value => {const input = host.querySelector(`input[value="${value}"]`); input.checked=true; input.dispatchEvent(new Event('change',{bubbles:true}));};
  choose('b'); expect(host.textContent).toContain('Vamos revisar.'); expect(host.textContent).toContain(api.questions[0].explanation);
  choose('a'); choose('a'); expect(host.querySelector('[role="status"]').textContent).toBe('1 de 6 respostas corretas. 1 respondidas.');
  choose('b'); expect(host.querySelector('[role="status"]').textContent).toContain('0 de 6');
  host.querySelector('button').click(); expect(host.querySelector('[role="status"]').textContent).toContain('0 respondidas');
  expect(host.querySelector('input:checked')).toBeNull(); expect(document.activeElement).toBe(host.querySelector('input'));
  quiz.destroy(); expect(host.children.length).toBe(0);
});
it('registers quiz widget and cleans it up with the presentation', () => {
  const host = root(); const api = window.Oficina; api.registerQuiz();
  const deck = api.mountPresentation(host, [{id:'quiz',title:'Quiz',blocks:[{type:'widget',widget:'quiz'}],notes:{}}]);
  expect(host.querySelectorAll('fieldset')).toHaveLength(6); deck.destroy();
});
