import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';

const root = process.cwd();
describe('material prático autônomo', () => {
  it('oferece checkpoints numerados com comandos, resultado e recuperação', () => {
    const html = readFileSync(resolve(root, 'guides/exercicios.html'), 'utf8');
    const doc = new JSDOM(html).window.document;
    const steps = [...doc.querySelectorAll('[data-checkpoint]')];
    expect(steps.length).toBeGreaterThanOrEqual(12);
    steps.forEach((step, i) => {
      expect(step.querySelector('h2').textContent).toMatch(new RegExp(`^${i + 1}\\.`));
      expect(step.querySelector('pre code').textContent.trim()).not.toBe('');
      expect(step.querySelector('[data-expected]').textContent.length).toBeGreaterThan(30);
      expect(step.querySelector('[data-recovery]').textContent.length).toBeGreaterThan(30);
    });
    expect(html).toContain('git restore --staged');
    expect(html).toContain('git revert --no-edit HEAD');
    expect(html).toContain('git pull --ff-only');
    for (const link of doc.querySelectorAll('[href],[src]')) {
      const url = link.getAttribute('href') || link.getAttribute('src');
      if (/^(https?:|#)/.test(url)) continue;
      expect(existsSync(resolve(root, 'guides', url.split('#')[0])), url).toBe(true);
    }
  });
  it('abre o projeto inicial sem rede, scripts ou dependências', () => {
    const path = resolve(root, 'examples/site-da-turma/index.html');
    const doc = new JSDOM(readFileSync(path, 'utf8')).window.document;
    expect(doc.querySelectorAll('script').length).toBe(0);
    expect(doc.querySelector('#mensagem').textContent).toBe('Aprendemos Git em conjunto.');
    for (const asset of doc.querySelectorAll('[href],[src]')) {
      const url = asset.getAttribute('href') || asset.getAttribute('src');
      expect(url).not.toMatch(/^(https?:|\/)/);
      expect(existsSync(resolve(dirname(path), url))).toBe(true);
    }
    expect(readFileSync(resolve(dirname(path), 'README.md'), 'utf8')).toContain('fict');
  });
});
