import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const chapters = ['fundamentos', 'preparacao', 'primeiros-commits', 'intervalo', 'branches', 'remotos', 'colaboracao', 'revisao'];
const load = async (file) => {
  const script = path.resolve(file);
  if (fs.existsSync(script)) await import(/* @vite-ignore */ script);
};
beforeEach(async () => {
  vi.resetModules();
  delete window.Oficina;
  await load('content/agenda.js');
  await load('content/slides.js');
});
afterEach(() => window.Oficina?.presentation?.destroy());

describe('three-hour beginner curriculum', () => {
  it('allocates exactly 180 minutes in the approved order', () => {
    expect(window.Oficina?.agenda?.map((item) => item.minutes)).toEqual([15, 20, 35, 10, 30, 20, 35, 15]);
    expect(window.Oficina.agenda.map((item) => item.id)).toEqual(chapters);
    expect(window.Oficina.agenda.reduce((total, item) => total + item.minutes, 0)).toBe(180);
  });
  it('provides unique stable slide ids, opening anchor, and all chapters', () => {
    const slides = window.Oficina?.slides || [];
    expect(slides.length).toBeGreaterThanOrEqual(30);
    expect(slides.length).toBeLessThanOrEqual(40);
    expect(slides[0].id).toBe('inicio');
    expect(new Set(slides.map((slide) => slide.id)).size).toBe(slides.length);
    expect([...new Set(slides.map((slide) => slide.chapter))]).toEqual(chapters);
    for (const slide of slides) expect(slide.id).toMatch(/^[a-z][a-z0-9-]*$/);
  });
  it('includes facilitation notes and keeps slide times inside their blocks', () => {
    expect(window.Oficina?.slides).toBeInstanceOf(Array);
    for (const chapter of window.Oficina.agenda) {
      const slides = window.Oficina.slides.filter((slide) => slide.chapter === chapter.id);
      expect(slides.reduce((total, slide) => total + slide.notes.minutes, 0)).toBe(chapter.minutes);
      for (const slide of slides) {
        expect(slide.title.length).toBeGreaterThan(4);
        expect(slide.notes.objective.length).toBeGreaterThan(10);
        expect(slide.notes.demo.length).toBeGreaterThan(10);
        expect(slide.notes.pitfalls.length).toBeGreaterThan(0);
        expect(slide.notes.minutes).toBeGreaterThan(0);
      }
    }
  });
  it('uses only supported readable blocks and all four deferred widgets', () => {
    expect(window.Oficina?.slides).toBeInstanceOf(Array);
    const widgets = [];
    for (const slide of window.Oficina.slides) {
      expect(slide.blocks.length).toBeGreaterThan(0);
      expect(slide.blocks.length).toBeLessThanOrEqual(4);
      for (const block of slide.blocks) {
        expect(['text', 'code', 'list', 'diagram', 'activity', 'widget']).toContain(block.type);
        if (block.type === 'widget') widgets.push(block.widget);
        if (block.type === 'code') expect(block.code.split('\n').length).toBeLessThanOrEqual(7);
      }
    }
    expect([...new Set(widgets)].sort()).toEqual(['history', 'preparation', 'quiz', 'staging']);
  });
  it('loads the real deck before bootstrap using relative classic scripts', async () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html.indexOf('content/agenda.js')).toBeGreaterThan(-1);
    expect(html.indexOf('content/slides.js')).toBeGreaterThan(html.indexOf('content/agenda.js'));
    expect(html.indexOf('app/bootstrap.js')).toBeGreaterThan(html.indexOf('content/slides.js'));
    document.body.innerHTML = '<div id="app"></div>';
    history.replaceState(null, '', '/#inicio');
    await load('app/navigation.js');
    await load('app/presentation.js');
    await load('app/bootstrap.js');
    window.Oficina.bootstrap();
    expect(document.querySelector('h1').textContent).toBe(window.Oficina.slides[0].title);
    expect(document.querySelector('[data-progress]').textContent).toContain(`1 / ${window.Oficina.slides.length}`);
  });
});
