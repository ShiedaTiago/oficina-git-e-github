import { beforeEach, describe, expect, it, vi } from 'vitest';
const fs = require('node:fs');
const path = require('node:path');

beforeEach(async () => {
  vi.resetModules();
  delete window.Oficina;
  const script = path.resolve('app/navigation.js');
  if (fs.existsSync(script)) await import(/* @vite-ignore */ script);
});

describe('stable slide fragments', () => {
  it.each(['#%ZZ', '#unknown', '', '#'])('falls back to first slide for %s', (hash) => {
    expect(window.Oficina?.resolveSlide?.(hash, ['inicio', 'git'])).toBe(0);
  });
  it('decodes and resolves a known stable id', () => {
    expect(window.Oficina?.resolveSlide?.('#pr%C3%A1tica', ['inicio', 'prática'])).toBe(1);
  });
  it('handles an empty deck', () => {
    expect(window.Oficina?.resolveSlide?.('#inicio', [])).toBe(0);
  });
});

describe('bounded movement', () => {
  it.each([[0, -1, 3, 0], [2, 1, 3, 2], [0, 1, 3, 1], [1, 20, 3, 2], [0, 1, 0, 0]])(
    'moves %s by %s with %s slides to %s', (index, delta, total, expected) => {
      expect(window.Oficina?.moveSlide?.(index, delta, total)).toBe(expected);
    },
  );
});
