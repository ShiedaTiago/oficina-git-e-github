(function () {
  'use strict';

  const normalize = (text) =>
    String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const categoryLabels = {
    configuracao: 'Configuração',
    staging: 'Staging & Commits',
    inspecao: 'Inspeção & Diffs',
    branches: 'Branches',
    recuperacao: 'Recuperação',
    remoto: 'Remoto',
    github: 'GitHub'
  };

  const CATEGORIES = [
    { id: 'todas', label: 'Todos' },
    { id: 'configuracao', label: 'Configuração' },
    { id: 'staging', label: 'Staging & Commits' },
    { id: 'inspecao', label: 'Inspeção & Diffs' },
    { id: 'branches', label: 'Branches' },
    { id: 'recuperacao', label: 'Recuperação' },
    { id: 'remoto', label: 'Remoto & GitHub' }
  ];

  function filterCommands(commands, query, category) {
    if (!Array.isArray(commands)) return [];
    const term = normalize(query || '');
    const cat = normalize(category || '');
    const isAll = !cat || cat === 'all' || cat === 'todas';

    return commands.filter((command) => {
      if (!command) return false;
      if (!isAll) {
        const cmdCat = normalize(command.category || '');
        let matchesCategory = cmdCat === cat;
        if (cat === 'remoto' || cat === 'remoto-github' || cat === 'remoto & github') {
          matchesCategory = cmdCat === 'remoto' || cmdCat === 'github';
        } else if (cat === 'staging' || cat === 'staging & commits') {
          matchesCategory = cmdCat === 'staging' || cmdCat === 'commits';
        } else if (cat === 'inspecao' || cat === 'inspecao & diffs') {
          matchesCategory = cmdCat === 'inspecao' || cmdCat === 'diffs';
        }
        if (!matchesCategory) return false;
      }
      if (!term) return true;
      const keywords = Array.isArray(command.keywords)
        ? command.keywords.join(' ')
        : command.keywords || '';
      const searchable = [
        command.name,
        command.purpose,
        command.example,
        command.caution,
        command.observation,
        command.category,
        keywords
      ]
        .filter(Boolean)
        .join(' ');
      return normalize(searchable).includes(term);
    });
  }

  function mountReference(root, commands) {
    let activeCategory = 'todas';

    const title = document.createElement('h2');
    title.id = 'git-command-reference-title';
    title.textContent = 'Comandos Git e GitHub';

    const description = document.createElement('p');
    description.className = 'reference-description';
    description.textContent = 'Pesquise comandos, variantes e atalhos usados nesta oficina.';

    const label = document.createElement('label');
    label.htmlFor = 'git-command-search-input';
    label.textContent = 'Pesquisar comandos Git';

    const search = document.createElement('input');
    search.type = 'search';
    search.id = 'git-command-search-input';
    search.placeholder = 'Ex.: status, staging ou merge --abort';
    search.autocomplete = 'off';
    search.setAttribute('aria-describedby', 'git-command-search-help');
    label.append(search);

    const help = document.createElement('p');
    help.id = 'git-command-search-help';
    help.className = 'search-help';
    help.textContent = 'Busque por nome, finalidade, exemplo, observação ou palavra-chave.';

    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'category-chips';
    chipsContainer.setAttribute('role', 'toolbar');
    chipsContainer.setAttribute('aria-label', 'Filtrar comandos por categoria');

    const categoryButtons = CATEGORIES.map((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'category-filter-btn';
      btn.dataset.category = cat.id;
      const isSelected = cat.id === activeCategory;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      if (isSelected) btn.classList.add('active');
      btn.textContent = cat.label;
      return btn;
    });
    chipsContainer.append(...categoryButtons);

    const count = document.createElement('p');
    count.setAttribute('role', 'status');
    count.className = 'command-count';

    const results = document.createElement('div');
    results.className = 'command-results';

    root.replaceChildren(title, description, label, help, chipsContainer, count, results);

    function render() {
      const found = filterCommands(commands, search.value, activeCategory);
      count.textContent = found.length
        ? `${found.length} ${found.length === 1 ? 'comando encontrado' : 'comandos encontrados'}.`
        : 'Nenhum comando encontrado.';

      results.replaceChildren(
        ...found.map((command) => {
          const article = document.createElement('article');
          article.className = 'command-card';

          if (command.category) {
            const badge = document.createElement('span');
            badge.className = 'command-category';
            badge.textContent = categoryLabels[command.category] || command.category;
            article.append(badge);
          }

          const heading = document.createElement('h3');
          heading.textContent = command.name;
          article.append(heading);

          if (command.purpose) {
            const purpose = document.createElement('p');
            purpose.textContent = command.purpose;
            article.append(purpose);
          }

          if (command.example) {
            const pre = document.createElement('pre');
            const lines = String(command.example).split('\n');
            lines.forEach((line, lineIdx) => {
              if (lineIdx > 0) pre.append(document.createTextNode('\n'));
              if (window.Oficina?.renderCommandLine) pre.append(window.Oficina.renderCommandLine(line));
              else pre.append(document.createTextNode(line));
            });
            article.append(pre);
          }

          const obs = command.caution || command.observation;
          if (obs) {
            const observation = document.createElement('p');
            observation.className = 'command-observation';
            observation.textContent = obs;
            article.append(observation);
          }

          if (command.url) {
            const official = document.createElement('a');
            official.href = command.url;
            official.target = '_blank';
            official.rel = 'noopener';
            official.textContent = 'Abrir manual oficial';
            article.append(official);
          }

          const copy = document.createElement('button');
          copy.type = 'button';
          copy.textContent = `Copiar ${command.name}`;
          copy.dataset.copyCommand = command.example || command.name;
          article.append(copy);

          return article;
        })
      );
    }

    function onInput() {
      render();
    }

    function onChipClick(event) {
      const btn = event.target.closest('.category-filter-btn');
      if (!btn || !chipsContainer.contains(btn)) return;
      const selected = btn.dataset.category;
      if (selected === activeCategory) return;
      activeCategory = selected;
      categoryButtons.forEach((b) => {
        const isSelected = b.dataset.category === activeCategory;
        b.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        b.classList.toggle('active', isSelected);
      });
      render();
    }

    search.addEventListener('input', onInput);
    chipsContainer.addEventListener('click', onChipClick);

    render();
    search.focus();

    return {
      focus() {
        search.focus();
      },
      destroy() {
        search.removeEventListener('input', onInput);
        chipsContainer.removeEventListener('click', onChipClick);
        root.replaceChildren();
      }
    };
  }

  function attachReference(root, commands) {
    let mounted = null;
    let host = null;
    function open(event) {
      const target = event.detail?.host;
      if (!target || !root.contains(target)) return;
      if (target !== host) {
        mounted?.destroy();
        host = target;
        mounted = mountReference(host, commands);
      } else mounted.focus();
    }
    root.addEventListener('oficina:reference', open);
    return {
      destroy() {
        root.removeEventListener('oficina:reference', open);
        mounted?.destroy();
      }
    };
  }

  window.Oficina = { ...window.Oficina, filterCommands, mountReference, attachReference };
}());
