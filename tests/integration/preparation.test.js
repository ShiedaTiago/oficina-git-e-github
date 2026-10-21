import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

let instance;
let root;
const load = async (file) => {
  if (fs.existsSync(path.resolve(file))) await import(/* @vite-ignore */ path.resolve(file));
};
const selectOS = (select, os) => {
  select.value = os;
  select.dispatchEvent(new Event('change', { bubbles: true }));
};

beforeEach(async () => {
  vi.resetModules();
  delete window.Oficina;
  history.replaceState(null, '', '/#preparo');
  document.body.innerHTML = '<div id="app"></div>';
  root = document.getElementById('app');
  await load('app/navigation.js');
  await load('app/presentation.js');
  await load('features/preparation.js');
});
afterEach(() => { instance?.destroy(); instance = undefined; });
const mount = (os) => {
  expect(window.Oficina?.mountPreparation).toBeTypeOf('function');
  instance = window.Oficina.mountPreparation(root, os);
};

describe('preparation system selection', () => {
  it('defaults to Windows with an explicitly labelled native select', () => {
    mount();
    const select = root.querySelector('select');
    expect(select.labels[0].textContent).toContain('Sistema operacional');
    expect(select.value).toBe('windows');
    expect(root.querySelector('[data-preparation-content]').textContent).toContain('Git Bash');
    expect(root.textContent).toContain('git --version');
    expect(root.querySelector('a[href="guides/preparacao.html"]')).not.toBeNull();
    expect(root.querySelector('a[href="guides/diagnostico.html"]')).not.toBeNull();
  });
  it('shows Debian/Ubuntu/Mint and Fedora when Linux is selected', () => {
    mount('windows');
    selectOS(root.querySelector('select'), 'linux');
    const content = root.querySelector('[data-preparation-content]').textContent;
    expect(content).toContain('Debian / Ubuntu / Mint');
    expect(content).toContain('sudo apt install git');
    expect(content).toContain('Fedora');
    expect(content).toContain('sudo dnf install git');
    expect(content).not.toContain('Abra o Git Bash');
    expect(root.querySelector('[role="status"]').textContent).toContain('Linux');
    selectOS(root.querySelector('select'), 'windows');
    expect(root.querySelector('[data-preparation-content]').textContent).toContain('Git Bash');
  });
  it('accepts Linux initially and falls back safely for an unknown initial system', () => {
    mount('linux');
    expect(root.querySelector('select').value).toBe('linux');
    instance.destroy();
    mount('<img src=x onerror=alert(1)>');
    expect(root.querySelector('select').value).toBe('windows');
    expect(root.querySelector('img')).toBeNull();
  });
  it('rejects a missing host with a clear error', () => {
    expect(window.Oficina?.mountPreparation).toBeTypeOf('function');
    expect(() => window.Oficina.mountPreparation(null)).toThrow(TypeError);
  });
  it('also exposes its mount API when loaded without the presentation registry', async () => {
    vi.resetModules();
    window.Oficina = { existing: 'preserved' };
    const previous = window.Oficina;
    await load('features/preparation.js');
    expect(window.Oficina).not.toBe(previous);
    expect(window.Oficina.existing).toBe('preserved');
    mount('linux');
    expect(root.textContent).toContain('Fedora');
  });
  it('registers the widget and keeps presentation navigation unchanged while using the control', () => {
    expect(window.Oficina?.mountPreparation).toBeTypeOf('function');
    instance = window.Oficina.mountPresentation(root, [
      { id: 'preparo', title: 'Preparação', blocks: [{ type: 'widget', widget: 'preparation', initialOS: 'windows' }] },
      { id: 'depois', title: 'Depois', blocks: [] },
    ]);
    const select = root.querySelector('select');
    select.focus();
    const arrow = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    select.dispatchEvent(arrow);
    expect(arrow.defaultPrevented).toBe(false);
    // jsdom does not implement native select keyboard actions; dispatch its resulting change.
    selectOS(select, 'linux');
    expect(document.activeElement).toBe(select);
    expect(location.hash).toBe('#preparo');
    expect(root.querySelector('h1').textContent).toBe('Preparação');
    expect(root.textContent).toContain('Debian / Ubuntu / Mint');
  });
  it('removes its listener and DOM on repeatable destroy', () => {
    mount();
    const select = root.querySelector('select');
    instance.destroy(); instance.destroy();
    expect(root.childElementCount).toBe(0);
    selectOS(select, 'linux');
    expect(root.childElementCount).toBe(0);
  });
});

describe('standalone preparation guides', () => {
  it.each(['preparacao', 'diagnostico'])('%s works as static HTML with relative local styles and navigation', (name) => {
    const file = path.resolve(`guides/${name}.html`);
    expect(fs.existsSync(file)).toBe(true);
    const doc = new DOMParser().parseFromString(fs.readFileSync(file, 'utf8'), 'text/html');
    expect(doc.documentElement.lang).toBe('pt-BR');
    expect(doc.querySelector('h1')).not.toBeNull();
    expect(doc.querySelector('main')).not.toBeNull();
    expect(doc.querySelector('script[src="../app/presentation.js"]')).not.toBeNull();
    expect(doc.querySelector('script:not([src])').textContent).toContain('initCommandTooltip');
    expect(doc.querySelector('link[href="../styles/base.css"]')).not.toBeNull();
    expect(doc.querySelector('a[href="../index.html"]')).not.toBeNull();
    for (const asset of doc.querySelectorAll('link[href], script[src]')) {
      const relativeAsset = asset.getAttribute('href') || asset.getAttribute('src');
      expect(fs.existsSync(path.resolve(path.dirname(file), relativeAsset))).toBe(true);
    }
  });
});
