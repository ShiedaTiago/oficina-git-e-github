(function () {
  'use strict';
  async function copyCommand(text, clipboard) {
    try {
      const target = clipboard === undefined ? navigator.clipboard : clipboard;
      if (!target || typeof target.writeText !== 'function') return 'manual';
      await target.writeText(text);
      return 'copied';
    } catch { return 'manual'; }
  }
  function attachClipboard(root, clipboard) {
    let active = true;
    async function onClick(event) {
      const button = event.target.closest('[data-copy-command]');
      if (!button || !root.contains(button)) return;
      const text = button.dataset.copyCommand;
      button.disabled = true;
      const result = await copyCommand(text, clipboard);
      if (!active || !button.isConnected) return;
      button.disabled = false;
      let feedback = button.parentElement.querySelector('[data-copy-feedback]');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.dataset.copyFeedback = '';
        feedback.setAttribute('role', 'status');
        button.after(feedback);
      }
      feedback.replaceChildren();
      feedback.textContent = result === 'copied' ? 'Comando copiado.' : 'Cópia automática indisponível. Selecione e copie o comando abaixo:';
      if (result === 'manual') {
        const field = document.createElement('textarea');
        field.readOnly = true;
        field.value = text;
        field.setAttribute('aria-label', 'Comando para cópia manual');
        feedback.append(field);
        field.focus(); field.select();
      }
    }
    root.addEventListener('click', onClick);
    return {destroy() { active = false; root.removeEventListener('click', onClick); }};
  }
  window.Oficina = {...window.Oficina, copyCommand, attachClipboard};
}());
