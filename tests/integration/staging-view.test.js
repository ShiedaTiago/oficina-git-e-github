import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const fs = require('node:fs');
const path = require('node:path');
let root;
let instance;
const load = async (name) => {
  const file = path.resolve(name);
  if (fs.existsSync(file)) await import(/* @vite-ignore */ file);
};
beforeEach(async () => {
  vi.resetModules();
  delete window.Oficina;
  document.body.innerHTML = '<section id="staging"></section>';
  root = document.getElementById('staging');
  await load('features/staging-model.js');
  await load('features/staging-view.js');
});
afterEach(() => { instance?.destroy(); instance = undefined; });
const mount = () => {
  expect(window.Oficina?.mountStaging).toBeTypeOf('function');
  instance = window.Oficina.mountStaging(root);
};
const find = (name) => root.querySelector(`[data-staging-${name}]`);
const click = (action) => root.querySelector(`[data-staging-action="${action}"]`).click();
const input = (name, value) => {
  const field = find(name);
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
};

describe('staging simulation UI', () => {
  it('explains the three areas, fake ids, and the pending-change simplification', () => {
    mount();
    expect(root.textContent).toMatch(/Simulação/);
    expect(root.textContent).toContain('Trabalho');
    expect(root.textContent).toContain('Staging');
    expect(root.textContent).toContain('Histórico');
    expect(root.textContent).toMatch(/índice.*snapshot/);
    expect(root.textContent).toMatch(/sem alterações preparadas pendentes/);
    expect(root.textContent).toMatch(/IDs.*demonstração/);
    expect(find('status').getAttribute('role')).toBe('status');
    expect(root.querySelector('[data-staging-action="commit"]').disabled).toBe(true);
    expect(find('reason').textContent).toMatch(/Prepare.*mensagem/);
    expect(find('working').labels).toHaveLength(1);
    expect(find('message').labels).toHaveLength(1);
  });
  it('commits A after editing B and reports why a subsequent commit is unavailable', () => {
    mount();
    input('working', 'A'); click('stage'); input('working', 'B');
    expect(find('snapshot').textContent).toBe('A');
    input('message', 'Primeiro'); click('commit');
    expect(find('working').value).toBe('B');
    expect(find('history').textContent).toContain('A');
    expect(find('history').textContent).toContain('Primeiro');
    expect(find('history').textContent).toContain('demo-001');
    expect(find('snapshot').textContent).toMatch(/Sem alterações preparadas pendentes/);
    expect(find('status').textContent).toMatch(/registrado/);
    expect(root.querySelector('[data-staging-action="commit"]').disabled).toBe(true);
  });
  it('keeps textarea focus and selection while typing and supports restaging', () => {
    mount();
    const field = find('working');
    field.focus(); input('working', 'ABC'); field.setSelectionRange(1, 1);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    expect(find('working')).toBe(field);
    expect(document.activeElement).toBe(field);
    expect(field.selectionStart).toBe(1);
    click('stage'); input('working', 'Novo'); click('stage');
    expect(find('snapshot').textContent).toBe('Novo');
  });
  it('requires a nonblank message but accepts an empty staged file', () => {
    mount(); click('stage');
    input('message', '   ');
    expect(root.querySelector('[data-staging-action="commit"]').disabled).toBe(true);
    expect(find('reason').textContent).toMatch(/Escreva uma mensagem/);
    input('message', 'Arquivo vazio');
    expect(root.querySelector('[data-staging-action="commit"]').disabled).toBe(false);
    click('commit');
    expect(find('history').children).toHaveLength(1);
  });
  it('renders file content and commit messages literally without executable markup', () => {
    mount();
    const payload = '<img src=x onerror="alert(1)">';
    input('working', payload); click('stage'); input('message', payload); click('commit');
    expect(find('history').textContent.split(payload)).toHaveLength(3);
    expect(root.querySelector('img')).toBeNull();
  });
  it('resets all fields and history, and removes listeners on destroy', () => {
    mount(); input('working', 'A'); click('stage'); input('message', 'A'); click('commit');
    click('reset');
    expect(find('working').value).toBe('');
    expect(find('message').value).toBe('');
    expect(find('history').textContent).toMatch(/Nenhum commit/);
    expect(find('status').textContent).toMatch(/reiniciada/);
    instance.destroy(); instance.destroy();
    input('working', 'Ignorado'); click('stage'); click('reset');
    expect(find('snapshot').textContent).toMatch(/Sem alterações/);
    expect(find('working').value).toBe('Ignorado');
  });
  it('registers with the presentation widget lifecycle', async () => {
    await load('app/navigation.js'); await load('app/presentation.js');
    // Registration occurs when the feature loads after the presentation shell.
    vi.resetModules(); await load('features/staging-view.js');
    instance = window.Oficina.mountPresentation(root, [{ id: 'inicio', title: 'Prática', blocks: [{ type: 'widget', widget: 'staging' }] }]);
    expect(root.querySelector('[data-staging-working]')).not.toBeNull();
    const stage = root.querySelector('[data-staging-action="stage"]');
    const snapshot = root.querySelector('[data-staging-snapshot]');
    instance.destroy(); stage.click();
    expect(snapshot.textContent).toMatch(/Sem alterações/);
  });
});
