(function () {
  'use strict';
  const normalize = (text) => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  function filterCommands(commands, query) {
    const term = normalize(query);
    return commands.filter(command => normalize(`${command.name} ${command.purpose}`).includes(term));
  }
  function mountReference(root, commands) {
    const label = document.createElement('label');
    label.textContent = 'Buscar comandos por nome ou objetivo';
    const search = document.createElement('input');
    search.type = 'search'; label.append(search);
    const count = document.createElement('p'); count.setAttribute('role', 'status');
    const results = document.createElement('div'); results.className = 'command-results';
    root.replaceChildren(label, count, results);
    function render() {
      const found = filterCommands(commands, search.value);
      count.textContent = found.length ? `${found.length} comandos encontrados.` : 'Nenhum comando encontrado.';
      results.replaceChildren(...found.map(command => {
        const article = document.createElement('article'); article.className = 'command-card';
        for (const [tag, value] of [['h3',command.name], ['p',command.purpose], ['pre',command.example], ['p',command.caution]]) {
          const element = document.createElement(tag); element.textContent = value; article.append(element);
        }
        const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = `Copiar ${command.name}`;
        copy.dataset.copyCommand = command.example; article.append(copy);
        return article;
      }));
    }
    search.addEventListener('input', render);
    render(); search.focus();
    return {focus() { search.focus(); }, destroy() { search.removeEventListener('input', render); root.replaceChildren(); }};
  }
  function attachReference(root, commands) {
    let mounted = null;
    let host = null;
    function open(event) {
      const target = event.detail?.host;
      if (!target || !root.contains(target)) return;
      if (target !== host) {
        mounted?.destroy(); host = target; mounted = mountReference(host, commands);
      } else mounted.focus();
    }
    root.addEventListener('oficina:reference', open);
    return {destroy() { root.removeEventListener('oficina:reference', open); mounted?.destroy(); }};
  }
  window.Oficina = {...window.Oficina, filterCommands, mountReference, attachReference};
}());
