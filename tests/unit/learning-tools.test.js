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
