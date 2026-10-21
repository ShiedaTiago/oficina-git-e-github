import { beforeEach, afterEach, expect, it, vi } from 'vitest';

let mounted;
beforeEach(async () => {
  vi.resetModules();
  delete window.Oficina;
  document.body.innerHTML = '<div id="app"></div>';
  history.replaceState(null, '', '/');
  window.getSelection().removeAllRanges();
  await import('../../app/navigation.js');
  await import('../../app/presentation.js');
  window.Oficina = { ...window.Oficina, agenda: [
    { id: 'fundamentos', title: 'Por que versionar?', minutes: 15 },
    { id: 'branches', title: 'Branches e integração', minutes: 30 },
  ] };
  mounted = window.Oficina.mountPresentation(document.querySelector('#app'), [
    { id: 'inicio', chapter: 'fundamentos', title: 'Comece aqui', blocks: [{ type: 'code', code: 'git status' }] },
    { id: 'branch', chapter: 'branches', title: 'Crie uma branch', blocks: [] },
  ]);
});
afterEach(() => mounted?.destroy());

it('provides chapter navigation with friendly labels and active chapter state', () => {
  const nav = document.querySelector('nav[aria-label="Capítulos da oficina"]');
  expect(nav).not.toBeNull();
  const links = nav.querySelectorAll('a');
  expect(links).toHaveLength(2);
  expect(links[0].textContent).toContain('Por que versionar?');
  expect(links[0].getAttribute('aria-current')).toBe('step');
  expect(links[1].getAttribute('href')).toBe('#branch');
  history.replaceState(null, '', '#branch');
  window.dispatchEvent(new HashChangeEvent('hashchange'));
  expect(document.querySelector('h1').textContent).toBe('Crie uma branch');
  expect(links[1].getAttribute('aria-current')).toBe('step');
  expect(links[0].hasAttribute('aria-current')).toBe(false);
});

it('keeps arrow keys available for horizontally scrollable code blocks', () => {
  const code = document.querySelector('pre');
  code.focus();
  const key = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
  code.dispatchEvent(key);
  expect(document.querySelector('h1').textContent).toBe('Comece aqui');
  expect(key.defaultPrevented).toBe(false);
});
