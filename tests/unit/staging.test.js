import { beforeEach, describe, expect, it, vi } from 'vitest';
const fs = require('node:fs');
const path = require('node:path');

beforeEach(async () => {
  vi.resetModules();
  delete window.Oficina;
  const file = path.resolve('features/staging-model.js');
  if (fs.existsSync(file)) await import(/* @vite-ignore */ file);
});

const api = () => {
  expect(window.Oficina?.createStagingState).toBeTypeOf('function');
  expect(window.Oficina?.reduceStaging).toBeTypeOf('function');
  return window.Oficina;
};
const freeze = (state) => {
  state.commits.forEach(Object.freeze);
  Object.freeze(state.commits);
  return Object.freeze(state);
};

describe('staging snapshots', () => {
  it('creates independent initial states', () => {
    const { createStagingState } = api();
    const first = createStagingState();
    expect(first).toEqual({ working: '', staged: null, commits: [] });
    expect(createStagingState()).not.toBe(first);
    expect(createStagingState().commits).not.toBe(first.commits);
  });
  it('commits the staged snapshot A while preserving later working edit B', () => {
    const { createStagingState, reduceStaging } = api();
    const first = freeze(createStagingState());
    const edited = freeze(reduceStaging(first, { type: 'edit', text: 'A' }));
    const staged = freeze(reduceStaging(edited, { type: 'stage' }));
    const later = freeze(reduceStaging(staged, { type: 'edit', text: 'B' }));
    const result = reduceStaging(later, { type: 'commit', message: '  Primeiro snapshot  ' });
    expect(result.commits.at(-1)).toEqual({ id: 'demo-001', text: 'A', message: 'Primeiro snapshot' });
    expect(result.working).toBe('B');
    expect(result.staged).toBeNull();
    expect(later).toEqual({ working: 'B', staged: 'A', commits: [] });
    expect(first.working).toBe('');
  });
  it('allows staging an empty file and generates deterministic growing ids', () => {
    const { createStagingState, reduceStaging } = api();
    const stage = (state) => reduceStaging(state, { type: 'stage' });
    const commit = (state) => reduceStaging(state, { type: 'commit', message: 'Arquivo vazio' });
    const first = freeze(commit(stage(createStagingState())));
    const second = commit(stage(first));
    expect(second.commits.map(({ id }) => id)).toEqual(['demo-001', 'demo-002']);
    expect(second.commits[0].text).toBe('');
    expect(first.commits).toHaveLength(1);
  });
  it('rejects commits without a snapshot or a nonblank string message', () => {
    const { createStagingState, reduceStaging } = api();
    const first = freeze(createStagingState());
    expect(reduceStaging(first, { type: 'commit', message: 'Mensagem' })).toBe(first);
    const staged = freeze(reduceStaging(first, { type: 'stage' }));
    for (const message of ['', '  \n ', null, 2, undefined]) {
      expect(reduceStaging(staged, { type: 'commit', message })).toBe(staged);
    }
  });
  it('restages current work, resets fully and ignores invalid actions', () => {
    const { createStagingState, reduceStaging } = api();
    const first = freeze(createStagingState());
    for (const action of [null, {}, { type: 'unknown' }, { type: 'edit', text: {} }]) {
      expect(reduceStaging(first, action)).toBe(first);
    }
    let state = reduceStaging(first, { type: 'edit', text: 'A' });
    state = reduceStaging(state, { type: 'stage' });
    state = reduceStaging(state, { type: 'edit', text: 'B' });
    state = reduceStaging(state, { type: 'stage' });
    expect(state.staged).toBe('B');
    state = freeze(reduceStaging(state, { type: 'commit', message: 'B' }));
    expect(reduceStaging(state, { type: 'reset' })).toEqual(first);
    expect(state.commits).toHaveLength(1);
  });
});
