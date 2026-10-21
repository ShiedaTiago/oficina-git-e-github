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
it('renders manual fallback after clipboard rejection and only reports success after fulfillment', async () => {
  const host = root(); const api = window.Oficina;
  const ref = api.mountReference(host, api.commands.slice(0,1));
  const copy = api.attachClipboard(host, {writeText: vi.fn().mockRejectedValue(new Error())});
  host.querySelector('button').click(); await vi.waitFor(() => expect(host.querySelector('textarea')).not.toBeNull());
  expect(host.querySelector('textarea').value).toBe(api.commands[0].example);
  expect(host.textContent).not.toContain('Comando copiado.'); copy.destroy();
  let resolve; const success = api.attachClipboard(host, {writeText: () => new Promise(done => {resolve = done;})});
  host.querySelector('button').click(); expect(host.textContent).not.toContain('Comando copiado.');
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
