(function () {
  'use strict';

  const fixture = [{
    id: 'inicio', chapter: '01 / Boas-vindas', title: 'Git e GitHub, na prática.',
    blocks: [
      { type: 'text', text: 'Do primeiro arquivo ao trabalho em equipe: um passo de cada vez, com espaço para experimentar.' },
      { type: 'diagram', steps: ['Entender', 'Experimentar', 'Colaborar'] },
      { type: 'activity', title: 'Seu ponto de partida', text: 'Abra o terminal e deixe a curiosidade por perto. Esta oficina começa do zero.' },
    ],
    notes: { objective: 'Acolher o grupo e apresentar o percurso.', minutes: 5,
      demo: 'Mostrar os controles da apresentação.', pitfalls: ['Respeitar o ritmo de quem está começando.'] },
  }];

  function bootstrap() {
    const root = document.getElementById('app');
    if (!root) return;
    window.Oficina.presentation?.destroy();
    window.Oficina.referenceController?.destroy();
    window.Oficina.clipboardController?.destroy();
    window.Oficina.registerQuiz?.();
    const presentation = window.Oficina.mountPresentation(root, window.Oficina.slides || fixture);
    const referenceController = window.Oficina.attachReference?.(root, window.Oficina.commands || []);
    const clipboardController = window.Oficina.attachClipboard?.(root);
    window.Oficina = { ...window.Oficina, presentation, referenceController, clipboardController };
  }

  window.Oficina = { ...window.Oficina, bootstrap };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  else bootstrap();
}());
