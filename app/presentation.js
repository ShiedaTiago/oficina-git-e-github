(function () {
  'use strict';

  const widgetIds = ['preparation', 'staging', 'history', 'quiz'];
  let widgets = {};

  function registerWidget(id, render) {
    if (!widgetIds.includes(id) || typeof render !== 'function') {
      throw new TypeError('Widget desconhecido ou renderizador inválido.');
    }
    widgets = { ...widgets, [id]: render };
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function button(action, label, title) {
    const node = element('button', 'control', label);
    node.type = 'button';
    node.dataset.action = action;
    node.title = title;
    return node;
  }

  function renderList(items, className, ordered) {
    const list = element(ordered ? 'ol' : 'ul', className);
    (items || []).forEach((item) => list.append(element('li', '', item)));
    return list;
  }

  function renderBlock(block, cleanups) {
    const text = block.text ?? block.content ?? '';
    switch (block.type) {
      case 'text': return element('p', 'slide-text', text);
      case 'code': {
        const frame = element('div', 'code-block');
        frame.append(element('span', 'code-language', block.language || 'terminal'));
        const pre = element('pre');
        pre.tabIndex = 0;
        pre.setAttribute('aria-label', 'Comando para o terminal');
        pre.append(element('code', '', block.code ?? text));
        frame.append(pre);
        const copy = element('button', 'copy-command', 'Copiar comando');
        copy.type = 'button';
        copy.dataset.copyCommand = block.code ?? text;
        frame.append(copy);
        return frame;
      }
      case 'list': return renderList(block.items, 'slide-list', block.ordered);
      case 'diagram': return renderList(block.steps || block.items || [], 'diagram', true);
      case 'activity': {
        const activity = element('section', 'activity');
        activity.append(element('p', 'eyebrow', 'Mão na massa'));
        if (block.title) activity.append(element('h2', '', block.title));
        activity.append(element('p', '', text));
        if (block.items) activity.append(renderList(block.items, 'slide-list', false));
        return activity;
      }
      case 'widget': {
        const id = block.widget || block.id;
        const host = element('section', 'widget');
        host.dataset.widget = id;
        if (widgetIds.includes(id) && widgets[id]) {
          const cleanup = widgets[id](host, block);
          if (typeof cleanup === 'function') cleanups.push(cleanup);
          else if (cleanup && typeof cleanup.destroy === 'function') cleanups.push(() => cleanup.destroy());
        } else {
          host.append(element('p', 'muted', 'Espaço de prática interativa.'));
        }
        return host;
      }
      default: return element('p', 'muted', 'Conteúdo indisponível.');
    }
  }

  function renderNotes(notes) {
    const fragment = document.createDocumentFragment();
    fragment.append(element('h2', '', 'Notas de quem facilita'));
    const fields = [['Objetivo', notes.objective], ['Tempo', notes.minutes === undefined ? '' : `${notes.minutes} min`],
      ['Demonstração', notes.demo], ['Cuidados', Array.isArray(notes.pitfalls) ? notes.pitfalls.join(' · ') : notes.pitfalls]];
    fields.forEach(([label, value]) => {
      if (!value) return;
      const paragraph = element('p');
      paragraph.append(element('strong', '', `${label}: `), document.createTextNode(String(value)));
      fragment.append(paragraph);
    });
    return fragment;
  }

  function shouldIgnoreKey(event) {
    return event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
      event.target.isContentEditable || event.target.contentEditable === 'true' ||
      event.target.closest?.('input, textarea, select, button, a, [tabindex="0"], [contenteditable=""], [contenteditable="true"], [role="textbox"]') ||
      !window.getSelection().isCollapsed;
  }

  function mountPresentation(root, slides) {
    const deck = [...slides];
    const ids = deck.map((slide) => slide.id);
    let index = window.Oficina.resolveSlide(location.hash, ids);
    let cleanups = [];
    let destroyed = false;
    let previousFocus;
    root.replaceChildren();
    root.className = 'presentation';

    const header = element('header', 'presentation-header');
    const brand = element('a', 'brand', 'git / github');
    brand.href = '#inicio';
    brand.setAttribute('aria-label', 'Git e GitHub, na prática — início');
    header.append(brand, element('span', 'edition', 'OFICINA · 3 HORAS'));
    const tools = element('nav', 'tools');
    tools.setAttribute('aria-label', 'Ferramentas da apresentação');
    const referenceButton = button('reference', 'Referência', 'Abrir consulta de comandos (/)');
    const notesButton = button('notes', 'Notas', 'Alternar notas de quem facilita (N)');
    notesButton.setAttribute('aria-expanded', 'false');
    notesButton.setAttribute('aria-controls', 'instructor-notes');
    tools.append(referenceButton, notesButton, button('fullscreen', 'Tela cheia', 'Alternar tela cheia (F)'));
    header.append(tools);

    const main = element('main', 'slide');
    main.id = 'slide-content';
    main.tabIndex = -1;
    const chapters = element('nav', 'chapter-navigation');
    chapters.setAttribute('aria-label', 'Capítulos da oficina');
    chapters.append(element('p', 'eyebrow', 'Seu percurso'));
    const chapterIds = [...new Set(deck.map((slide) => slide.chapter))];
    const chapterLinks = chapterIds.map((id, chapterIndex) => {
      const chapter = window.Oficina.agenda?.find((item) => item.id === id);
      const firstSlide = deck.find((slide) => slide.chapter === id);
      const link = element('a', 'chapter-link');
      link.href = `#${encodeURIComponent(firstSlide.id)}`;
      link.dataset.chapter = id;
      link.append(element('span', 'chapter-number', String(chapterIndex + 1).padStart(2, '0')),
        element('span', '', chapter?.title || id));
      if (chapter) link.append(element('small', '', `${chapter.minutes} min`));
      chapters.append(link);
      return link;
    });
    const skipLink = document.querySelector('a.skip-link[href="#slide-content"]');
    const notes = element('aside', 'instructor-notes');
    notes.id = 'instructor-notes';
    notes.dataset.notes = '';
    notes.hidden = true;
    const footer = element('footer', 'presentation-footer');
    const progress = element('span', 'progress');
    progress.dataset.progress = '';
    progress.setAttribute('aria-live', 'polite');
    progress.setAttribute('aria-atomic', 'true');
    const previous = button('previous', '← Anterior', 'Slide anterior (←)');
    const next = button('next', 'Próximo →', 'Próximo slide (→)');
    footer.append(element('span', 'keyboard-hint', '← → navegar · N notas · / consulta'), progress, previous, next);
    const meter = element('div', 'progress-track');
    const fill = element('div', 'progress-fill');
    meter.setAttribute('aria-hidden', 'true');
    meter.append(fill);
    const status = element('p', 'status');
    status.dataset.status = '';
    status.setAttribute('role', 'status');
    const reference = element('aside', 'reference-panel');
    reference.dataset.reference = '';
    reference.hidden = true;
    reference.setAttribute('aria-label', 'Referência de comandos');
    reference.setAttribute('role', 'dialog');
    reference.tabIndex = -1;
    const closeReference = button('close-reference', 'Fechar ×', 'Fechar referência (Esc)');
    const referenceContent = element('div', 'reference-content');
    referenceContent.dataset.referenceContent = '';
    referenceContent.append(element('h2', '', 'Comandos sempre à mão'),
      element('p', '', 'Use git status para observar o repositório antes e depois de cada passo.'));
    reference.append(closeReference, referenceContent);
    const body = element('div', 'presentation-body');
    body.append(chapters, main);
    root.append(header, body, notes, footer, meter, status, reference);

    function render() {
      cleanups.forEach((cleanup) => cleanup());
      cleanups = [];
      main.replaceChildren();
      const slide = deck[index];
      if (!slide) {
        main.append(element('h1', '', 'Nenhum slide disponível.'));
      } else {
        const chapter = window.Oficina.agenda?.find((item) => item.id === slide.chapter);
        main.append(element('p', 'eyebrow', chapter?.title || slide.chapter), element('h1', '', slide.title));
        const content = element('div', 'slide-blocks');
        (slide.blocks || []).forEach((block) => content.append(renderBlock(block, cleanups)));
        main.append(content);
        notes.replaceChildren(renderNotes(slide.notes || {}));
      }
      previous.disabled = index === 0;
      chapterLinks.forEach((link) => {
        if (link.dataset.chapter === slide?.chapter) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
      next.disabled = !deck.length || index === deck.length - 1;
      progress.textContent = `${deck.length ? index + 1 : 0} / ${deck.length}`;
      fill.style.width = `${deck.length ? ((index + 1) / deck.length) * 100 : 0}%`;
      document.title = slide ? `${slide.title} · Git e GitHub, na prática` : 'Git e GitHub, na prática';
    }

    function go(delta) {
      const target = window.Oficina.moveSlide(index, delta, deck.length);
      if (target === index) return;
      index = target;
      history.replaceState(null, '', `#${encodeURIComponent(ids[index])}`);
      render();
    }

    function showReference(open) {
      reference.hidden = !open;
      referenceButton.setAttribute('aria-expanded', String(open));
      if (open) {
        previousFocus = document.activeElement;
        reference.focus();
        root.dispatchEvent(new CustomEvent('oficina:reference', { bubbles: true, detail: { host: referenceContent } }));
      } else if (previousFocus?.isConnected) previousFocus.focus();
    }

    async function fullscreen() {
      try {
        if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
        else if (root.requestFullscreen) await root.requestFullscreen();
        else throw new Error('unsupported');
        if (!destroyed) status.textContent = '';
      } catch {
        if (!destroyed) status.textContent = 'Tela cheia indisponível. Use F11 no computador ou o zoom do navegador.';
      }
    }

    function action(name) {
      if (name === 'next') go(1);
      if (name === 'previous') go(-1);
      if (name === 'notes') {
        notes.hidden = !notes.hidden;
        notesButton.setAttribute('aria-expanded', String(!notes.hidden));
      }
      if (name === 'fullscreen') void fullscreen();
      if (name === 'reference') showReference(reference.hidden);
      if (name === 'close-reference') showReference(false);
    }

    function onClick(event) {
      const control = event.target.closest('[data-action]');
      if (control && root.contains(control)) action(control.dataset.action);
    }

    function focusContent(event) {
      event.preventDefault();
      main.focus();
    }

    function onKey(event) {
      if (!reference.hidden && event.key === 'Escape' && !event.defaultPrevented &&
          !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault();
        showReference(false);
        return;
      }
      if (shouldIgnoreKey(event)) return;
      if (!reference.hidden) return;
      const actions = { ArrowRight: 'next', ArrowLeft: 'previous', n: 'notes', N: 'notes', f: 'fullscreen', F: 'fullscreen', '/': 'reference' };
      const name = actions[event.key];
      if (name) { event.preventDefault(); action(name); }
    }

    function onHash() {
      index = window.Oficina.resolveSlide(location.hash, ids);
      render();
    }

    root.addEventListener('click', onClick);
    skipLink?.addEventListener('click', focusContent);
    document.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', onHash);
    render();
    return {
      destroy() {
        if (destroyed) return;
        destroyed = true;
        root.removeEventListener('click', onClick);
        skipLink?.removeEventListener('click', focusContent);
        document.removeEventListener('keydown', onKey);
        window.removeEventListener('hashchange', onHash);
        cleanups.forEach((cleanup) => cleanup());
        cleanups = [];
      },
    };
  }

  window.Oficina = { ...window.Oficina, registerWidget, mountPresentation };
}());
