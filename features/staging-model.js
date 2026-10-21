(function () {
  'use strict';

  function createStagingState() {
    return { working: '', staged: null, commits: [] };
  }

  function reduceStaging(state, action) {
    if (!action) return state;
    switch (action.type) {
      case 'edit':
        return typeof action.text === 'string' ? { ...state, working: action.text } : state;
      case 'stage':
        return { ...state, staged: state.working };
      case 'commit': {
        if (state.staged === null || typeof action.message !== 'string' || !action.message.trim()) return state;
        const commit = {
          id: `demo-${String(state.commits.length + 1).padStart(3, '0')}`,
          text: state.staged,
          message: action.message.trim(),
        };
        // null means no pending staged changes in this teaching model.
        // Git's real index retains the committed snapshot.
        return { ...state, staged: null, commits: [...state.commits, commit] };
      }
      case 'reset':
        return createStagingState();
      default:
        return state;
    }
  }

  window.Oficina = { ...window.Oficina, createStagingState, reduceStaging };
}());
