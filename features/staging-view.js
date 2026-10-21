(function () {
  'use strict';

  let instanceCount = 0;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(action, text) {
    const node = element('button', 'control', text);
    node.type = 'button';
    node.dataset.stagingAction = action;
    return node;
  }

  function field(tag, name, labelText, prefix) {
    const label = element('label', 'staging-field', labelText);
    const control = element(tag);
    control.id = `${prefix}-${name}`;
    control.dataset[`staging${name[0].toUpperCase()}${name.slice(1)}`] = '';
    label.htmlFor = control.id;
    label.append(control);
    return { label, control };
  }

  function createLayout(prefix) {
    const simulation = element('div', 'staging-simulation');
    simulation.append(element('p', 'eyebrow', 'Simulação · um arquivo de texto'),
      element('p', 'staging-explanation', 'Edite, prepare com git add e registre com git commit. Editar depois de preparar não altera o snapshot já preparado.'));
    const areas = element('div', 'staging-areas');
    const working = element('section', 'staging-area');
    const editor = field('textarea', 'working', 'Conteúdo do arquivo', prefix);
    editor.control.rows = 4;
    editor.control.spellcheck = false;
    const stage = button('stage', 'git add · preparar');
    working.append(element('h3', '', '1. Trabalho'), editor.label, stage);
    const prepared = element('section', 'staging-area');
    const snapshot = element('pre', 'staging-snapshot');
    snapshot.dataset.stagingSnapshot = '';
    snapshot.tabIndex = 0;
    snapshot.setAttribute('aria-label', 'Snapshot preparado');
    prepared.append(element('h3', '', '2. Staging'), snapshot);
    const recorded = element('section', 'staging-area');
    const history = element('ol', 'staging-history');
    history.dataset.stagingHistory = '';
    recorded.append(element('h3', '', '3. Histórico'), history);
    areas.append(working, prepared, recorded);
    const message = field('input', 'message', 'Mensagem do commit', prefix);
    message.control.type = 'text';
    message.control.autocomplete = 'off';
    const commit = button('commit', 'git commit · registrar');
    const reason = element('p', 'staging-reason');
    reason.id = `${prefix}-reason`;
    reason.dataset.stagingReason = '';
    commit.setAttribute('aria-describedby', reason.id);
    message.control.setAttribute('aria-describedby', reason.id);
    const actions = element('div', 'staging-actions');
    actions.append(message.label, commit, button('reset', 'Reiniciar simulação'));
    const status = element('p', 'staging-status');
    status.dataset.stagingStatus = '';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-atomic', 'true');
    simulation.append(areas, actions, reason, status,
      element('p', 'staging-explanation', 'Simplificação didática: o índice do Git mantém o snapshot após o commit. Aqui, “sem alterações preparadas pendentes” indica que esse snapshot já foi registrado. IDs demo são apenas de demonstração; a simulação não executa Git nem altera arquivos reais.'));
    return { simulation, editor, message, snapshot, commit, reason, history, status };
  }

  function refresh(state, ui) {
    ui.snapshot.textContent = state.staged === null ? 'Sem alterações preparadas pendentes.' : state.staged;
    const missingMessage = !ui.message.control.value.trim();
    ui.commit.disabled = state.staged === null || missingMessage;
    ui.reason.textContent = state.staged === null
      ? 'Prepare um snapshot com git add e escreva uma mensagem para registrar.'
      : missingMessage ? 'Escreva uma mensagem para registrar o snapshot preparado.' : 'Pronto para registrar o snapshot preparado.';
    ui.history.replaceChildren();
    state.commits.forEach((item) => {
      const entry = element('li');
      entry.append(element('strong', '', `${item.id} · ${item.message}`), element('pre', '', item.text));
      ui.history.append(entry);
    });
    if (!state.commits.length) ui.history.append(element('li', 'muted', 'Nenhum commit nesta simulação.'));
  }

  function mountStaging(root) {
    const { createStagingState, reduceStaging } = window.Oficina;
    let state = createStagingState();
    const ui = createLayout(`staging-${++instanceCount}`);
    const { editor, message, status } = ui;
    root.replaceChildren(ui.simulation);

    function onInput(event) {
      if (event.target === editor.control) {
        state = reduceStaging(state, { type: 'edit', text: editor.control.value });
        status.textContent = 'Trabalho alterado. Use git add para preparar esta versão.';
      }
      if (event.target === editor.control || event.target === message.control) refresh(state, ui);
    }

    function onClick(event) {
      const action = event.target.closest('[data-staging-action]')?.dataset.stagingAction;
      if (!['stage', 'commit', 'reset'].includes(action)) return;
      const next = reduceStaging(state, { type: action, message: message.control.value });
      if (next === state) return;
      state = next;
      if (action === 'stage') status.textContent = 'Snapshot preparado. Novas edições no trabalho não mudam esta versão.';
      if (action === 'commit') {
        message.control.value = '';
        status.textContent = 'Commit registrado com o snapshot preparado. O trabalho mantém as edições atuais.';
      }
      if (action === 'reset') {
        editor.control.value = '';
        message.control.value = '';
        status.textContent = 'Simulação reiniciada.';
      }
      refresh(state, ui);
    }

    root.addEventListener('input', onInput);
    root.addEventListener('click', onClick);
    refresh(state, ui);
    return {
      destroy() {
        root.removeEventListener('input', onInput);
        root.removeEventListener('click', onClick);
      },
    };
  }

  window.Oficina = { ...window.Oficina, mountStaging };
  if (window.Oficina.registerWidget) window.Oficina.registerWidget('staging', mountStaging);
}());
