import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const fs = require('node:fs');
const path = require('node:path');

const slides = [
  { id: 'inicio', chapter: 'Começar', title: 'Seu histórico começa aqui', blocks: [
    { type: 'text', text: '<img src=x onerror=alert(1)>' },
    { type: 'code', code: 'git status', language: 'bash' },
    { type: 'list', items: ['Arquivo', 'Snapshot'] },
    { type: 'diagram', steps: ['Editar', 'Preparar', 'Registrar'] },
    { type: 'activity', title: 'Experimente', text: 'Crie um arquivo.' },
    { type: 'widget', widget: 'staging' },
  ], notes: { objective: 'Reconhecer o estado', minutes: 5, demo: 'Mostrar git status', pitfalls: ['Não usar sudo'] } },
  { id: 'segundo', chapter: 'Praticar', title: 'Um passo por vez', blocks: [], notes: {} },
];
let instance;
let root;
const press = (key, target = document.body, options = {}) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options });
  target.dispatchEvent(event);
  return event;
};
const load = async (file) => {
  const script = path.resolve(file);
  if (fs.existsSync(script)) await import(/* @vite-ignore */ script);
};

beforeEach(async () => {
  vi.resetModules();
  window.getSelection().removeAllRanges();
  history.replaceState(null, '', '/');
  document.body.innerHTML = '<div id="app"></div>';
  root = document.getElementById('app');
  delete window.Oficina;
  await load('app/navigation.js');
  await load('app/presentation.js');
});
afterEach(() => { instance?.destroy(); instance = undefined; });
const mount = () => {
  expect(window.Oficina?.mountPresentation).toBeTypeOf('function');
  instance = window.Oficina.mountPresentation(root, slides);
};

describe('presentation lifecycle and navigation', () => {
  it('renders all block types as safe readable content and starts with hidden notes', () => {
    mount();
    expect(root.querySelector('h1').textContent).toBe('Seu histórico começa aqui');
    expect(root.querySelector('img')).toBeNull();
    expect(root.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(root.querySelector('code').textContent).toBe('git status');
    expect(root.querySelector('[data-notes]').hidden).toBe(true);
    expect(root.querySelector('[data-action="previous"]').disabled).toBe(true);
    expect(root.querySelector('[data-widget="staging"]')).not.toBeNull();
  });
  it('navigates with buttons, announces progress and preserves stable hashes', () => {
    mount();
    root.querySelector('[data-action="next"]').click();
    expect(location.hash).toBe('#segundo');
    expect(root.querySelector('h1').textContent).toBe('Um passo por vez');
    expect(root.querySelector('[data-action="next"]').disabled).toBe(true);
    expect(root.querySelector('[data-progress]').textContent).toContain('2 / 2');
    root.querySelector('[data-action="previous"]').click();
    expect(location.hash).toBe('#inicio');
  });
  it('reacts to hashchange and recovers malformed fragments', () => {
    mount();
    history.replaceState(null, '', '#segundo');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(root.querySelector('h1').textContent).toBe('Um passo por vez');
    history.replaceState(null, '', '#%ZZ');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(root.querySelector('h1').textContent).toBe('Seu histórico começa aqui');
  });
  it('toggles complete instructor notes with N', () => {
    mount(); press('n');
    const notes = root.querySelector('[data-notes]');
    expect(notes.hidden).toBe(false);
    expect(notes.textContent).toContain('Reconhecer o estado');
    expect(notes.textContent).toContain('5 min');
    expect(notes.textContent).toContain('Mostrar git status');
    expect(notes.textContent).toContain('Não usar sudo');
    expect(root.querySelector('[data-action="notes"]').getAttribute('aria-expanded')).toBe('true');
  });
  it('supports arrows and the reference shortcut', () => {
    mount(); press('ArrowRight');
    expect(location.hash).toBe('#segundo');
    press('ArrowLeft'); expect(location.hash).toBe('#inicio');
    press('/'); expect(root.querySelector('[data-reference]').hidden).toBe(false);
    press('Escape'); expect(root.querySelector('[data-reference]').hidden).toBe(true);
  });
  it.each(['input', 'textarea', 'select', 'button', 'a', 'div'])('preserves native interaction in %s', (tag) => {
    mount();
    const field = document.createElement(tag);
    if (tag === 'div') field.contentEditable = 'true';
    root.append(field);
    expect(press('ArrowRight', field).defaultPrevented).toBe(false);
    expect(root.querySelector('h1').textContent).toBe('Seu histórico começa aqui');
  });
  it('ignores modifiers, handled events, and text selections', () => {
    mount();
    press('ArrowRight', document.body, { ctrlKey: true });
    press('ArrowRight', document.body, { altKey: true });
    press('ArrowRight', document.body, { metaKey: true });
    press('ArrowRight', document.body, { shiftKey: true });
    const handled = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
    handled.preventDefault(); document.body.dispatchEvent(handled);
    const selection = window.getSelection();
    const range = document.createRange(); range.selectNodeContents(root.querySelector('h1'));
    selection.addRange(range); press('ArrowRight'); selection.removeAllRanges();
    expect(root.querySelector('h1').textContent).toBe('Seu histórico começa aqui');
  });
  it('shows a readable alternative when fullscreen is unsupported', async () => {
    mount(); press('f'); await Promise.resolve();
    expect(root.querySelector('[data-status]').textContent).toMatch(/F11/);
  });
  it('catches fullscreen rejection without claiming success', async () => {
    root.requestFullscreen = () => Promise.reject(new Error('denied'));
    mount(); root.querySelector('[data-action="fullscreen"]').click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(root.querySelector('[data-status]').textContent).toMatch(/F11/);
    press('ArrowRight'); expect(location.hash).toBe('#segundo');
  });
  it('removes listeners and widget resources on destroy', () => {
    let cleaned = false;
    expect(window.Oficina?.registerWidget).toBeTypeOf('function');
    window.Oficina.registerWidget('staging', (host) => {
      host.textContent = 'Simulação'; return () => { cleaned = true; };
    });
    mount(); instance.destroy();
    press('ArrowRight');
    root.querySelector('[data-action="next"]').click();
    history.replaceState(null, '', '#segundo'); window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(root.querySelector('h1').textContent).toBe('Seu histórico começa aqui');
    expect(cleaned).toBe(true);
  });
  it('allows only known widget registrations and renders registered widgets', () => {
    expect(window.Oficina?.registerWidget).toBeTypeOf('function');
    expect(() => window.Oficina.registerWidget('arbitrary', () => {})).toThrow();
    window.Oficina.registerWidget('staging', (host) => { host.textContent = 'Snapshot preparado'; });
    mount(); expect(root.querySelector('[data-widget="staging"]').textContent).toBe('Snapshot preparado');
  });
  it('handles an empty deck without broken controls', () => {
    expect(window.Oficina?.mountPresentation).toBeTypeOf('function');
    instance = window.Oficina.mountPresentation(root, []);
    expect(root.textContent).toContain('Nenhum slide');
  });
  it('bootstraps the offline fixture and can remount declarative content', async () => {
    await load('app/bootstrap.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(root.querySelector('h1').textContent).toBe('Git e GitHub, na prática.');
    window.Oficina = { ...window.Oficina, slides };
    window.Oficina.bootstrap();
    instance = window.Oficina.presentation;
    expect(root.querySelector('h1').textContent).toBe('Seu histórico começa aqui');
    press('ArrowRight');
    expect(root.querySelector('h1').textContent).toBe('Um passo por vez');
    instance.destroy();
    root.remove();
    expect(() => window.Oficina.bootstrap()).not.toThrow();
  });
  it('can enter and leave fullscreen and close reference from its button', async () => {
    root.requestFullscreen = async () => {};
    document.exitFullscreen = async () => {};
    mount();
    press('f'); await Promise.resolve();
    expect(root.querySelector('[data-status]').textContent).toBe('');
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: root });
    press('f'); await Promise.resolve();
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
    root.querySelector('[data-action="reference"]').click();
    press('ArrowRight'); expect(root.querySelector('h1').textContent).toBe('Seu histórico começa aqui');
    root.querySelector('[data-action="close-reference"]').click();
    expect(root.querySelector('[data-reference]').hidden).toBe(true);
  });
});
