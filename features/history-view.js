(function () {
  'use strict';
  const namespace = 'http://www.w3.org/2000/svg';
  const positions = { c1: [55, 75], c2: [190, 150], c3: [190, 75], c4: [325, 75] };
  const steps = [
    'Um commit inicial. HEAD aponta para a branch main, que aponta para c1.',
    'Criamos aluno no mesmo commit e mudamos para ela: git switch -c aluno.',
    'Na branch aluno, registramos uma alteração na saudação (c2).',
    'Voltamos à main e alteramos a mesma linha (c3). As branches agora divergiram.',
    'Na main, git merge aluno encontra duas alterações na mesma linha. Escolha o texto final.',
    'Merge concluído: c4 tem dois pais. HEAD continua na main; aluno permanece em c2.',
  ];
  const element = (tag, text) => { const node = document.createElement(tag); if (text) node.textContent = text; return node; };
  function svgElement(tag, attributes, text) {
    const node = document.createElementNS(namespace, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (text) node.textContent = text;
    return node;
  }
  function drawGraph(state) {
    const svg = svgElement('svg', { viewBox: '0 0 390 205', role: 'img', 'aria-label': 'Histórico de commits; relações de parentesco descritas na lista abaixo' });
    state.commits.forEach(commit => commit.parents.forEach(parent => {
      const [x1,y1] = positions[commit.id], [x2,y2] = positions[parent];
      svg.append(svgElement('line', { x1,y1,x2,y2, class: 'history-edge' }));
    }));
    state.commits.forEach(commit => {
      const [cx,cy] = positions[commit.id];
      svg.append(svgElement('circle', {cx,cy,r:21,class:'history-node'}));
      svg.append(svgElement('text', {x:cx,y:cy+5,'text-anchor':'middle',class:'history-id'},commit.id));
    });
    return svg;
  }
  function mountHistory(root) {
    const api = window.Oficina;
    let state = api.createHistoryState();
    const container = element('section'); container.className = 'history-simulator';
    container.setAttribute('aria-label', 'Simulação guiada de branches e merge');
    root.append(container);
    function render() {
      const stage = state.conflict ? 4 : state.commits.length === 4 ? 5 : state.branches.aluno ? state.commits.length : 0;
      const status = element('p', steps[stage]); status.setAttribute('role', 'status');
      const refs = element('p', `HEAD → ${state.head} · ${Object.entries(state.branches).map(([name,id]) => `${name} → ${id}`).join(' · ')}`);
      refs.className = 'history-refs';
      const list = element('ol'); list.className = 'history-records';
      state.commits.forEach(commit => list.append(element('li', `${commit.id} — pais: ${commit.parents.join(', ') || 'nenhum (inicial)'} — ${commit.text}`)));
      container.replaceChildren(status, refs, drawGraph(state), list);
      if (state.conflict) renderEditor();
      const controls = element('div'); controls.className = 'history-controls';
      if (stage < 4) controls.append(button('advance', ['Criar branch aluno', 'Commit na aluno', 'Voltar à main e criar commit', 'Tentar merge de aluno na main'][stage]));
      controls.append(button('reset', 'Reiniciar simulação'));
      container.append(controls);
    }
    function button(action, text) {
      const control = element('button', text); control.type = 'button'; control.dataset.historyAction = action; return control;
    }
    function renderEditor() {
      const note = element('p', 'Origem: aluno → destino: main. Remova os marcadores e escolha a saudação final. Validação simplificada: texto não vazio e sem marcadores; o Git real exige revisar, preparar (git add) e registrar a resolução.');
      const label = element('label', 'Texto final de saudacao.txt');
      const editor = element('textarea'); editor.rows = 7; editor.spellcheck = false;
      editor.value = state.resolution ?? '<<<<<<< main\nOlá, turma colaborativa!\n=======\nOlá, turma criativa!\n>>>>>>> aluno';
      label.append(editor);
      const complete = button('completeMerge', 'Preparar resolução e concluir merge'); complete.disabled = !api.validHistoryResolution(state.resolution);
      container.append(note, label, complete);
    }
    function onClick(event) {
      const control = event.target.closest('[data-history-action]');
      if (!control || !container.contains(control)) return;
      state = api.reduceHistory(state, { type: control.dataset.historyAction }); render();
      const focusTarget = container.querySelector('textarea, button'); focusTarget.focus();
    }
    function onInput(event) {
      if (event.target.tagName !== 'TEXTAREA') return;
      state = api.reduceHistory(state, { type: 'resolve', text: event.target.value });
      container.querySelector('[data-history-action="completeMerge"]').disabled = !api.validHistoryResolution(state.resolution);
    }
    container.addEventListener('click', onClick); container.addEventListener('input', onInput); render();
    return { destroy() { container.removeEventListener('click', onClick); container.removeEventListener('input', onInput); container.remove(); } };
  }
  window.Oficina = { ...window.Oficina, mountHistory };
  window.Oficina.registerWidget('history', mountHistory);
}());
