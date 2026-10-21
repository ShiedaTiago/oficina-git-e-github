(function () {
  'use strict';
  const createHistoryState = () => ({
    commits: [{ id: 'c1', parents: [], text: 'Olá, turma!' }],
    branches: { main: 'c1' }, head: 'main', conflict: null, resolution: null,
  });
  const validResolution = text => typeof text === 'string' && text.trim().length > 0 &&
    !/(<{7}|={7}|>{7}|\|{7})/.test(text);
  function advance(state) {
    if (state.conflict || state.commits.length >= 4) return state;
    if (!state.branches.aluno) return { ...state, branches: { ...state.branches, aluno: 'c1' }, head: 'aluno' };
    if (state.commits.length === 1) return {
      ...state, commits: [...state.commits, { id: 'c2', parents: ['c1'], text: 'Olá, turma criativa!' }],
      branches: { ...state.branches, aluno: 'c2' },
    };
    if (state.commits.length === 2) return {
      ...state, head: 'main', commits: [...state.commits, { id: 'c3', parents: ['c1'], text: 'Olá, turma colaborativa!' }],
      branches: { ...state.branches, main: 'c3' },
    };
    return { ...state, conflict: { source: 'aluno', target: 'main' } };
  }
  function reduceHistory(state, action) {
    switch (action?.type) {
      case 'reset': return createHistoryState();
      case 'advance': return advance(state);
      case 'resolve': return state.conflict && typeof action.text === 'string' ? { ...state, resolution: action.text } : state;
      case 'completeMerge': {
        if (!state.conflict || !validResolution(state.resolution)) return state;
        const { target, source } = state.conflict;
        return { ...state,
          commits: [...state.commits, { id: 'c4', parents: [state.branches[target], state.branches[source]], text: state.resolution.trim() }],
          branches: { ...state.branches, [target]: 'c4' }, head: target, conflict: null,
        };
      }
      default: return state;
    }
  }
  window.Oficina = { ...window.Oficina, createHistoryState, reduceHistory, validHistoryResolution: validResolution };
}());
