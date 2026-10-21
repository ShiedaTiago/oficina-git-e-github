import { beforeEach, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
let api;
beforeEach(async () => {
  vi.resetModules(); delete window.Oficina;
  const file = path.resolve('features/history-model.js');
  if (fs.existsSync(file)) await import(/* @vite-ignore */ file);
  api = window.Oficina;
});
const initial = () => { expect(api?.createHistoryState).toBeTypeOf('function'); return api.createHistoryState(); };
const advance = state => api.reduceHistory(state, { type: 'advance' });
const conflict = () => Array.from({length: 4}).reduce(advance, initial());
it('guides a divergent DAG with HEAD pointing at the destination branch', () => {
  let state = initial();
  expect(state.commits).toEqual([{ id: 'c1', parents: [], text: 'Olá, turma!' }]);
  const saved = JSON.stringify(state);
  const branched = advance(state);
  expect(branched.branches).toEqual({ main: 'c1', aluno: 'c1' });
  expect(branched.head).toBe('aluno');
  const edited = advance(branched);
  expect(edited.commits.at(-1).parents).toEqual(['c1']);
  state = advance(edited);
  expect(state.head).toBe('main');
  expect(state.branches).toEqual({ main: 'c3', aluno: 'c2' });
  expect(JSON.stringify(initial())).toBe(saved);
  expect(branched.commits).toHaveLength(1);
  state = advance(state);
  expect(state.conflict).toEqual({ source: 'aluno', target: 'main' });
  expect(state.commits).toHaveLength(3);
});
it('refuses an unresolved merge and marker-bearing or empty resolutions', () => {
  const state = conflict(); const saved = JSON.stringify(state);
  for (const text of ['', '   ', '<<<<<<< main\na', 'a\n=======\nb', 'b\n>>>>>>> aluno']) {
    const candidate = api.reduceHistory(state, { type: 'resolve', text });
    expect(api.reduceHistory(candidate, { type: 'completeMerge' }).commits).toHaveLength(3);
  }
  expect(api.reduceHistory(state, { type: 'completeMerge' })).toEqual(state);
  expect(JSON.stringify(state)).toBe(saved);
});
it('merges with two parents, preserves source history and resets independently', () => {
  const state = conflict();
  const resolved = api.reduceHistory(state, { type: 'resolve', text: 'Olá, turma colaborativa!' });
  const merged = api.reduceHistory(resolved, { type: 'completeMerge' });
  expect(merged.commits.at(-1)).toEqual({ id: 'c4', parents: ['c3', 'c2'], text: 'Olá, turma colaborativa!' });
  expect(merged.commits.slice(0, 3)).toEqual(state.commits);
  expect(merged.branches).toEqual({ main: 'c4', aluno: 'c2' });
  expect(merged.head).toBe('main'); expect(merged.conflict).toBeNull();
  expect(advance(merged)).toEqual(merged);
  expect(api.reduceHistory(merged, {type: 'reset'})).toEqual(initial());
  expect(state.resolution).toBeNull();
});
it('ignores unsupported actions and resolution outside a conflict', () => {
  const state = initial();
  for (const action of [{type:'unknown'}, {type:'resolve',text:'x'}, {type:'completeMerge'}, null]) {
    expect(api.reduceHistory(state, action)).toEqual(state);
  }
});
