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

  function explainCommand(raw) {
    if (window.Oficina?.explainCommand && window.Oficina.explainCommand !== explainCommand) {
      return window.Oficina.explainCommand(raw);
    }
    if (typeof raw !== 'string') return null;
    const line = raw.trim();
    if (!line) return null;

    if (line.startsWith('<<<<<<<')) {
      return 'Marca o início das alterações da branch atual durante um conflito de merge.';
    }
    if (line === '=======') {
      return 'Separa as alterações da branch atual das alterações da branch que está sendo integrada.';
    }
    if (line.startsWith('>>>>>>>')) {
      return 'Marca o fim das alterações trazidas pela branch a ser integrada.';
    }
    if (line.startsWith('#')) {
      return 'Comentário explicativo; não é executado pelo terminal.';
    }

    if (/^git\s+branch\s+-a\b/.test(line)) {
      return 'Lista todas as branches locais e remotas.';
    }
    if (/^git\s+branch\s+--show-current\b/.test(line)) {
      return 'Exibe apenas o nome da branch em que você está no momento.';
    }
    if (/^git\s+branch\s+-D\b/.test(line)) {
      return 'Força a exclusão de uma branch local, mesmo sem integração prévia.';
    }
    if (/^git\s+branch\s+-d\b/.test(line)) {
      return 'Exclui uma branch local que já foi integrada.';
    }
    if (/^git\s+branch\b/.test(line)) {
      return 'Lista as branches locais e indica a branch atual com um asterisco.';
    }

    if (/^git\s+status\s+(--short|-s)\b/.test(line)) {
      return 'Exibe o estado do repositório em formato compacto de duas colunas.';
    }
    if (/^git\s+status\b/.test(line)) {
      return 'Exibe o estado dos arquivos modificados, preparados e não rastreados.';
    }

    if (/^git\s+diff\s+(--cached|--staged)\s+--\s+\S+/.test(line)) {
      return 'Compara alterações preparadas do arquivo específico com o último commit.';
    }
    if (/^git\s+diff\s+(--staged|--cached)\b/.test(line)) {
      return 'Compara o snapshot preparado no staging com o último commit (HEAD).';
    }
    if (/^git\s+diff\s+--check\b/.test(line)) {
      return 'Procura problemas de espaço em branco e marcadores de conflito pendentes.';
    }
    if (/^git\s+diff\s+--\s+\S+/.test(line)) {
      return 'Compara alterações não preparadas no arquivo especificado.';
    }
    if (/^git\s+diff\b/.test(line)) {
      return 'Compara alterações da área de trabalho com a área de preparação (staging).';
    }

    if (/^git\s+log\b.*--graph\b.*-8\b/.test(line)) {
      return 'Exibe até 8 commits com um grafo visual de todas as branches.';
    }
    if (/^git\s+log\b.*--graph\b.*--decorate\b.*-6\b/.test(line)) {
      return 'Exibe até 6 commits com grafo, branches e tags decoradas.';
    }
    if (/^git\s+log\b.*--decorate\b.*-4\b/.test(line)) {
      return 'Exibe os últimos 4 commits resumidos com nomes de branches e tags.';
    }
    if (/^git\s+log\b.*--graph\b.*--all\b/.test(line) || /^git\s+log\b.*--all\b.*--graph\b/.test(line)) {
      return 'Exibe todo o histórico com um grafo visual de branches e merges.';
    }
    if (/^git\s+log\b.*-3\b/.test(line)) {
      return 'Exibe apenas os últimos 3 commits em formato resumido.';
    }
    if (/^git\s+log\s+--oneline\b/.test(line)) {
      return 'Lista o histórico de commits de forma resumida, um por linha.';
    }
    if (/^git\s+log\b/.test(line)) {
      return 'Lista o histórico de commits do repositório.';
    }

    if (/^git\s+show\s+HEAD\b/.test(line)) {
      return 'Inspeciona o commit atual e as alterações registradas nele.';
    }
    if (/^git\s+show\b/.test(line)) {
      return 'Inspeciona o commit especificado e suas alterações.';
    }

    if (/^git\s+add\b/.test(line)) {
      return 'Prepara o conteúdo atual do(s) arquivo(s) para o próximo commit.';
    }
    if (/^git\s+check-ignore\b/.test(line)) {
      return 'Verifica se um caminho é ignorado pelas regras do repositório.';
    }

    if (/^git\s+commit\b/.test(line)) {
      return 'Registra o snapshot preparado no histórico local com uma mensagem explicativa.';
    }

    if (/^git\s+restore\s+--staged\b/.test(line)) {
      return 'Retira o arquivo do staging preservando suas alterações na área de trabalho.';
    }
    if (/^git\s+restore\b/.test(line)) {
      return 'Descarta alterações locais e restaura o arquivo para a versão do commit anterior.';
    }
    if (/^git\s+revert\s+--no-edit\s+HEAD\b/.test(line)) {
      return 'Cria um novo commit que desfaz o último commit sem abrir o editor de texto.';
    }
    if (/^git\s+revert\b/.test(line)) {
      return 'Cria um novo commit que desfaz as alterações do commit especificado.';
    }

    if (/^git\s+switch\s+-c\b/.test(line)) {
      return 'Cria uma nova branch e alterna para ela imediatamente.';
    }
    if (/^git\s+switch\b/.test(line)) {
      return 'Alterna para uma branch existente protegendo alterações pendentes.';
    }
    if (/^git\s+merge\s+--abort\b/.test(line)) {
      return 'Interrompe e cancela um merge em andamento que gerou conflito, voltando ao estado anterior.';
    }
    if (/^git\s+merge\s+--ff-only\b/.test(line)) {
      return 'Integra alterações somente se for possível avançar diretamente (fast-forward).';
    }
    if (/^git\s+merge\s+origin\/main\b/.test(line)) {
      return 'Integra as alterações da branch remota origin/main na branch atual.';
    }
    if (/^git\s+merge\b/.test(line)) {
      return 'Integra o histórico e as alterações da branch especificada na branch atual.';
    }

    if (/^git\s+remote\s+add\s+origin\b/.test(line)) {
      return 'Associa o repositório local a um servidor remoto chamado origin.';
    }
    if (/^git\s+remote\s+add\b/.test(line)) {
      return 'Associa o repositório local a um servidor remoto.';
    }
    if (/^git\s+remote\s+-v\b/.test(line)) {
      return 'Lista os remotos configurados e suas URLs de busca e envio.';
    }
    if (/^git\s+remote\s+get-url\b/.test(line)) {
      return 'Consulta a URL atualmente configurada para o remoto origin.';
    }
    if (/^git\s+remote\b/.test(line)) {
      return 'Consulta ou gerencia os repositórios remotos vinculados.';
    }

    if (/^git\s+clone\b/.test(line)) {
      return 'Copia um repositório remoto completo e seu histórico para uma nova pasta.';
    }
    if (/^git\s+fetch\b/.test(line)) {
      return 'Busca os commits do repositório remoto sem alterar seus arquivos de trabalho.';
    }

    if (/^git\s+pull\s+--ff-only\b/.test(line)) {
      return 'Busca e integra alterações do remoto somente se não houver divergência.';
    }
    if (/^git\s+pull\b/.test(line)) {
      return 'Busca e integra alterações do repositório remoto na branch local.';
    }
    if (/^git\s+push\s+(-u\s+|.*-u\b)/.test(line)) {
      return 'Envia commits locais para o remoto e configura o acompanhamento da branch (upstream).';
    }
    if (/^git\s+push\s+origin\b/.test(line)) {
      return 'Envia commits locais para a branch remota especificada.';
    }
    if (/^git\s+push\b/.test(line)) {
      return 'Envia commits locais para o repositório remoto.';
    }

    if (/^git\s+--version\b/.test(line)) {
      return 'Verifica a versão do Git instalada no sistema.';
    }
    if (/^git\s+init\s+-b\s+main\b/.test(line)) {
      return 'Inicia um repositório Git local com a branch principal chamada main.';
    }
    if (/^git\s+init\b/.test(line)) {
      return 'Inicia um repositório Git local na pasta atual.';
    }

    if (/^git\s+config\s+--global\s+user\.name\s+["'].+["']/.test(line) || /^git\s+config\s+--global\s+user\.name\s+\S+/.test(line)) {
      return 'Define o nome de autoria exibido nos commits deste computador.';
    }
    if (/^git\s+config\s+--global\s+user\.email\s+["'].+["']/.test(line) || /^git\s+config\s+--global\s+user\.email\s+\S+/.test(line)) {
      return 'Define o e-mail de autoria exibido nos commits deste computador.';
    }
    if (/^git\s+config\s+--global\s+(--get\s+)?user\.name\b/.test(line)) {
      return 'Consulta o nome de autoria configurado globalmente.';
    }
    if (/^git\s+config\s+--global\s+(--get\s+)?user\.email\b/.test(line)) {
      return 'Consulta o e-mail de autoria configurado globalmente.';
    }
    if (/^git\s+config\s+(--local\s+)?user\.name\s+/.test(line)) {
      return 'Define o nome de autoria no repositório atual.';
    }
    if (/^git\s+config\s+(--get\s+)?user\.name\b/.test(line)) {
      return 'Consulta o nome de autoria no repositório atual.';
    }
    if (/^git\s+config\s+(--local\s+)?user\.email\s+/.test(line)) {
      return 'Define o e-mail de autoria no repositório atual.';
    }
    if (/^git\s+config\s+(--get\s+)?user\.email\b/.test(line)) {
      return 'Consulta o e-mail de autoria no repositório atual.';
    }
    if (/^git\s+config\b/.test(line)) {
      return 'Consulta ou ajusta as configurações do Git.';
    }

    if (/^gh\s+auth\s+login\b/.test(line)) {
      return 'Inicia a autenticação segura da sua conta GitHub pelo terminal.';
    }
    if (/^gh\s+auth\s+status\b/.test(line)) {
      return 'Verifica o status da conexão e conta autenticada no GitHub.';
    }
    if (/^gh\s+pr\s+create\b/.test(line)) {
      return 'Cria uma proposta de Pull Request no GitHub a partir da branch atual.';
    }
    if (/^gh\b/.test(line)) {
      return 'Interage com a plataforma GitHub pelo terminal via GitHub CLI.';
    }

    if (/^pwd\b/.test(line)) {
      return 'Mostra o caminho da pasta em que você está no momento (diretório atual).';
    }
    if (/^ls\b/.test(line)) {
      return 'Lista os arquivos e pastas existentes no diretório atual.';
    }
    if (/^cd\b/.test(line)) {
      return 'Muda para a pasta especificada.';
    }
    if (/^mkdir\b/.test(line)) {
      return 'Cria uma nova pasta no computador (incluindo subpastas se necessário).';
    }
    if (/^sudo\s+apt\s+update\b/.test(line)) {
      return 'Atualiza a lista de pacotes no terminal Linux (Debian/Ubuntu/Mint).';
    }
    if (/^sudo\s+apt\s+install\s+git\b/.test(line) || /^sudo\s+apt\s+install\b/.test(line)) {
      return 'Instala o Git pelo gerenciador de pacotes apt.';
    }
    if (/^sudo\s+dnf\s+install\s+git\b/.test(line) || /^sudo\s+dnf\s+install\b/.test(line)) {
      return 'Instala o Git pelo gerenciador de pacotes dnf no Fedora.';
    }

    return null;
  }

  const executableHints = {
    git: 'Executa o Git, o programa que controla o histórico do repositório.',
    gh: 'Executa o GitHub CLI para conversar com o GitHub pelo terminal.',
    pwd: 'Mostra a pasta atual do terminal.',
    ls: 'Lista arquivos e pastas no local atual.',
    cd: 'Muda a pasta atual do terminal.',
    mkdir: 'Cria uma nova pasta.',
    sudo: 'Executa a ação seguinte com permissão administrativa no Linux.',
  };

  const gitPartHints = {
    add: 'Seleciona o conteúdo para o próximo snapshot no staging.',
    branch: 'Consulta ou gerencia branches do repositório.',
    'check-ignore': 'Confere se um caminho está coberto por regras de ignore.',
    clone: 'Baixa um repositório remoto e todo o histórico disponível.',
    commit: 'Registra o snapshot preparado como um novo commit.',
    config: 'Consulta ou altera configurações do Git.',
    diff: 'Compara versões do conteúdo para revelar mudanças.',
    fetch: 'Busca dados do remoto sem alterar os arquivos de trabalho.',
    init: 'Inicia um repositório Git nesta pasta.',
    log: 'Exibe o histórico de commits.',
    merge: 'Integra o histórico de outra branch na branch atual.',
    pull: 'Busca e integra commits do remoto.',
    push: 'Envia commits locais para um repositório remoto.',
    remote: 'Consulta ou configura repositórios remotos.',
    restore: 'Restaura conteúdo ou retira arquivos do staging.',
    revert: 'Cria um commit novo que desfaz outro commit.',
    show: 'Mostra detalhes e alterações de um commit.',
    status: 'Mostra o estado dos arquivos, do staging e da branch atual.',
    switch: 'Troca de branch ou cria uma nova branch.',
  };

  const optionHints = {
    '-a': 'Inclui todas as branches locais e remotas na listagem.',
    '-b': 'Define explicitamente o nome da branch inicial.',
    '-c': 'Cria uma nova branch antes de mudar para ela.',
    '-d': 'Exclui uma branch local somente quando a integração já é segura.',
    '-D': 'Força a exclusão da branch local, mesmo sem integração.',
    '-m': 'Informa a mensagem do commit diretamente no comando.',
    '-p': 'Cria também as pastas intermediárias que ainda não existem.',
    '-s': 'Pede uma saída curta e compacta.',
    '-u': 'Configura a branch remota como upstream para os próximos push e pull.',
    '--abort': 'Cancela a operação em andamento e volta ao estado anterior.',
    '--all': 'Inclui todas as referências disponíveis.',
    '--cached': 'Compara o staging, também chamado de índice, com o último commit.',
    '--check': 'Procura espaços problemáticos e marcadores de conflito.',
    '--decorate': 'Mostra nomes de branches e tags junto aos commits.',
    '--ff-only': 'Permite a integração apenas por avanço direto, sem merge commit.',
    '--get': 'Consulta apenas o valor configurado para a chave seguinte.',
    '--global': 'Aplica ou consulta a configuração para o usuário deste computador.',
    '--graph': 'Desenha as ramificações do histórico em caracteres.',
    '--local': 'Aplica a configuração somente ao repositório atual.',
    '--no-edit': 'Usa a mensagem padrão sem abrir um editor de texto.',
    '--oneline': 'Resume cada commit em uma única linha.',
    '--short': 'Pede uma saída curta e compacta.',
    '--show-current': 'Mostra somente o nome da branch atual.',
    '--staged': 'Compara o staging com o último commit.',
    '--version': 'Pede que o programa mostre sua versão instalada.',
  };

  function commandPartHint(token, index, tokens, line) {
    const plain = token.replace(/^["']|["']$/g, '');
    if (index === 0 && executableHints[plain]) return executableHints[plain];
    if (tokens[0] === 'git' && index === 1 && gitPartHints[plain]) return gitPartHints[plain];
    if (optionHints[plain]) return optionHints[plain];
    if (/^https:\/\//.test(plain)) return 'URL do repositório remoto usado pelo comando.';
    if (plain === 'origin') return 'Nome convencional do repositório remoto principal.';
    if (plain === 'main') return 'Nome da branch principal usada neste exemplo.';
    if (plain === 'HEAD') return 'Referência para o commit atual da branch em uso.';
    if (/^user\.(name|email)$/.test(plain)) return `Chave de configuração que guarda ${plain.endsWith('name') ? 'o nome' : 'o e-mail'} de autoria.`;
    if (tokens[index - 1] === '-m') return 'Mensagem que descreve o objetivo do commit.';
    if (plain === '--') return 'Separa as opções do comando dos caminhos de arquivo que vêm depois.';
    if (/^-\d+$/.test(plain)) return `Limita a saída aos ${plain.slice(1)} registros mais recentes.`;
    if (/[/\\]|\.[a-z0-9]{1,8}$/i.test(plain)) return 'Caminho de arquivo, pasta ou repositório usado como argumento.';
    if (/^(<<<<<<<|=======|>>>>>>>)/.test(line)) return explainCommand(line);
    const action = tokens[1] || tokens[0];
    return `Argumento “${plain}” usado pela ação ${action}.`;
  }

  function explainCommandParts(raw) {
    if (typeof raw !== 'string') return [];
    const line = raw.trim();
    if (!line) return [];
    if (line.startsWith('#') || /^(<<<<<<<|=======|>>>>>>>)/.test(line)) {
      return [{ text: line, hint: explainCommand(line) }];
    }
    const chunks = line.match(/\s+|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s]+/g) || [];
    const tokens = chunks.filter((chunk) => !/^\s+$/.test(chunk));
    let tokenIndex = 0;
    return chunks.map((chunk) => {
      if (/^\s+$/.test(chunk)) return { text: chunk, hint: null };
      const hint = commandPartHint(chunk, tokenIndex, tokens, line);
      tokenIndex += 1;
      return { text: chunk, hint };
    });
  }

  function renderCommandLine(raw) {
    const line = element('span', 'cmd-line');
    const lineHint = explainCommand(raw);
    if (lineHint) line.dataset.cmdHint = lineHint;
    explainCommandParts(raw).forEach((part) => {
      if (!part.hint) {
        line.append(document.createTextNode(part.text));
        return;
      }
      const token = element('span', 'cmd-part', part.text);
      token.dataset.cmdHint = part.hint;
      token.title = part.hint;
      token.tabIndex = 0;
      line.append(token);
    });
    return line;
  }

  function initCommandTooltip(scope) {
    const targetScope = scope || document;
    targetScope.querySelectorAll?.('.cmd-line[data-cmd-hint]').forEach((line) => {
      if (!line.querySelector('.cmd-part')) line.replaceWith(renderCommandLine(line.textContent));
    });
    let tooltip = document.getElementById('cmd-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'cmd-tooltip';
      tooltip.className = 'cmd-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('aria-hidden', 'true');
    }
    const tooltipHost = targetScope.body || targetScope;
    tooltipHost.append(tooltip);

    let activeTarget = null;

    function showTooltip(target) {
      const hint = target.dataset.cmdHint;
      if (!hint) return;
      activeTarget = target;
      tooltip.textContent = hint;
      tooltip.classList.add('is-visible');
      tooltip.setAttribute('aria-hidden', 'false');
      target.setAttribute('aria-describedby', tooltip.id);

      if (target.title) {
        target.dataset.originalTitle = target.title;
        target.title = '';
      }

      positionTooltip(target);
    }

    function hideTooltip(target) {
      if (activeTarget && (!target || activeTarget === target)) {
        if (activeTarget.dataset.originalTitle) {
          activeTarget.title = activeTarget.dataset.originalTitle;
          delete activeTarget.dataset.originalTitle;
        }
        activeTarget.removeAttribute('aria-describedby');
        activeTarget = null;
        tooltip.classList.remove('is-visible');
        tooltip.setAttribute('aria-hidden', 'true');
      }
    }

    function positionTooltip(target) {
      const rect = target.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const margin = 8;

      let top = rect.top - tooltipRect.height - margin;
      if (top < margin) {
        top = rect.bottom + margin;
      }

      let left = rect.left;
      if (left + tooltipRect.width > window.innerWidth - margin) {
        left = window.innerWidth - tooltipRect.width - margin;
      }
      if (left < margin) {
        left = margin;
      }

      tooltip.style.top = `${Math.round(top)}px`;
      tooltip.style.left = `${Math.round(left)}px`;
    }

    function onMouseOver(e) {
      const target = e.target.closest?.('.cmd-part[data-cmd-hint], .cmd-line[data-cmd-hint]');
      if (target && targetScope.contains(target)) {
        showTooltip(target);
      }
    }

    function onMouseOut(e) {
      const target = e.target.closest?.('.cmd-part[data-cmd-hint], .cmd-line[data-cmd-hint]');
      if (target) {
        hideTooltip(target);
      }
    }

    function onFocusIn(e) {
      const target = e.target.closest?.('.cmd-part[data-cmd-hint], .cmd-line[data-cmd-hint]');
      if (target && targetScope.contains(target)) {
        showTooltip(target);
      }
    }

    function onFocusOut(e) {
      const target = e.target.closest?.('.cmd-part[data-cmd-hint], .cmd-line[data-cmd-hint]');
      if (target) {
        hideTooltip(target);
      }
    }

    function onScroll() {
      if (activeTarget) {
        positionTooltip(activeTarget);
      }
    }

    targetScope.addEventListener('mouseover', onMouseOver);
    targetScope.addEventListener('mouseout', onMouseOut);
    targetScope.addEventListener('focusin', onFocusIn);
    targetScope.addEventListener('focusout', onFocusOut);
    const onTooltipHide = () => hideTooltip();
    targetScope.addEventListener('oficina:tooltip-hide', onTooltipHide);
    window.addEventListener('scroll', onScroll, { passive: true });

    return function destroy() {
      targetScope.removeEventListener('mouseover', onMouseOver);
      targetScope.removeEventListener('mouseout', onMouseOut);
      targetScope.removeEventListener('focusin', onFocusIn);
      targetScope.removeEventListener('focusout', onFocusOut);
      targetScope.removeEventListener('oficina:tooltip-hide', onTooltipHide);
      window.removeEventListener('scroll', onScroll);
      hideTooltip();
    };
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
        const codeNode = element('code');
        const rawCode = block.code ?? text;
        const lines = String(rawCode).split('\n');
        lines.forEach((line, lineIndex) => {
          if (lineIndex > 0) codeNode.append(document.createTextNode('\n'));
          codeNode.append(renderCommandLine(line));
        });
        pre.append(codeNode);
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
    let fitFrame = 0;
    root.replaceChildren();
    root.className = 'presentation';
    document.body.classList.add('presentation-mode');

    const header = element('header', 'presentation-header');
    const brand = element('a', 'brand', 'git / github');
    brand.href = '#inicio';
    brand.setAttribute('aria-label', 'Git e GitHub, na prática — início');
    header.append(brand, element('span', 'edition', 'OFICINA · 3 HORAS'));
    const tools = element('nav', 'tools');
    tools.setAttribute('aria-label', 'Ferramentas da apresentação');
    const referenceButton = button('reference', 'Comandos Git', 'Abrir pesquisa de comandos Git (/)');
    referenceButton.setAttribute('aria-expanded', 'false');
    referenceButton.setAttribute('aria-controls', 'git-command-reference');
    const notesButton = button('notes', 'Notas', 'Alternar notas de quem facilita (N)');
    notesButton.setAttribute('aria-expanded', 'false');
    notesButton.setAttribute('aria-controls', 'instructor-notes');
    const fullscreenButton = button('fullscreen', 'Tela cheia', 'Alternar tela cheia (F)');
    fullscreenButton.setAttribute('aria-pressed', 'false');
    tools.append(referenceButton, notesButton, fullscreenButton);
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
    const credits = element('nav', 'creator-links');
    credits.setAttribute('aria-label', 'Créditos da página');
    const instagram = element('a', 'creator-link');
    instagram.href = 'https://www.instagram.com/soulbleederr/';
    instagram.target = '_blank';
    instagram.rel = 'noopener noreferrer';
    instagram.setAttribute('aria-label', 'Instagram: @soulbleederr (abre em nova aba)');
    instagram.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="instagram-flash" cx="17.5" cy="6.5" r="1"/></svg><span>@soulbleederr</span>';
    const linkedin = element('a', 'creator-link');
    linkedin.href = 'https://www.linkedin.com/in/tiago-torres-02a07926a/';
    linkedin.target = '_blank';
    linkedin.rel = 'noopener noreferrer';
    linkedin.setAttribute('aria-label', 'LinkedIn de Tiago Torres (abre em nova aba)');
    linkedin.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M5 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 10h4v11H3zm7 0h3.8v1.5h.1a4.2 4.2 0 0 1 3.8-2c4.1 0 4.8 2.5 4.8 5.8V21h-4v-5c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V21h-4z"/></svg><span>LinkedIn</span>';
    credits.append(instagram, linkedin);
    footer.append(credits, element('span', 'keyboard-hint', '← → navegar · N notas · / consulta'), progress, previous, next);
    const meter = element('div', 'progress-track');
    const fill = element('div', 'progress-fill');
    meter.setAttribute('aria-hidden', 'true');
    meter.append(fill);
    const status = element('p', 'status');
    status.dataset.status = '';
    status.setAttribute('role', 'status');
    const reference = element('aside', 'reference-panel');
    reference.id = 'git-command-reference';
    reference.dataset.reference = '';
    reference.hidden = true;
    reference.setAttribute('aria-labelledby', 'git-command-reference-title');
    reference.setAttribute('role', 'dialog');
    reference.tabIndex = -1;
    const closeReference = button('close-reference', 'Fechar ×', 'Fechar referência (Esc)');
    const referenceContent = element('div', 'reference-content');
    referenceContent.dataset.referenceContent = '';
    const referenceTitle = element('h2', '', 'Comandos Git');
    referenceTitle.id = 'git-command-reference-title';
    referenceContent.append(referenceTitle,
      element('p', '', 'Pesquise os comandos e as variantes usados nesta oficina.'));
    reference.append(closeReference, referenceContent);
    const body = element('div', 'presentation-body');
    body.append(chapters, main);
    root.append(header, body, notes, footer, meter, status, reference);

    function render() {
      root.dispatchEvent(new CustomEvent('oficina:tooltip-hide'));
      cleanups.forEach((cleanup) => cleanup());
      cleanups = [];
      main.replaceChildren();
      body.scrollTop = 0;
      const slide = deck[index];
      if (!slide) {
        main.append(element('h1', '', 'Nenhum slide disponível.'));
      } else {
        const canvas = element('div', 'slide-content');
        const chapter = window.Oficina.agenda?.find((item) => item.id === slide.chapter);
        canvas.append(element('p', 'eyebrow', chapter?.title || slide.chapter), element('h1', '', slide.title));
        const content = element('div', 'slide-blocks');
        (slide.blocks || []).forEach((block) => content.append(renderBlock(block, cleanups)));
        canvas.append(content);
        main.append(canvas);
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
      scheduleFit();
    }

    function fitSlide() {
      fitFrame = 0;
      const canvas = main.querySelector('.slide-content');
      if (!canvas || !main.clientHeight || !main.clientWidth) return;
      canvas.style.zoom = '1';
      const style = getComputedStyle(main);
      const availableHeight = main.clientHeight - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom);
      const availableWidth = main.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
      const naturalBounds = canvas.getBoundingClientRect();
      const heightScale = availableHeight / Math.max(naturalBounds.height, 1);
      const widthScale = availableWidth / Math.max(naturalBounds.width, 1);
      const scale = Math.max(.82, Math.min(1, heightScale, widthScale));
      canvas.style.zoom = String(Math.round(scale * 1000) / 1000);
      main.dataset.fit = scale.toFixed(3);
    }

    function scheduleFit() {
      if (fitFrame) cancelAnimationFrame(fitFrame);
      fitFrame = requestAnimationFrame(fitSlide);
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

    function onFullscreenChange() {
      const isFull = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      fullscreenButton.textContent = isFull ? 'Sair da tela cheia' : 'Tela cheia';
      fullscreenButton.title = isFull ? 'Sair da tela cheia (F)' : 'Alternar tela cheia (F)';
      fullscreenButton.setAttribute('aria-pressed', String(isFull));
      root.classList.toggle('is-fullscreen', isFull);
      scheduleFit();
    }

    async function fullscreen() {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (root.requestFullscreen) {
          await root.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (root.webkitRequestFullscreen) {
          await root.webkitRequestFullscreen();
        } else {
          throw new Error('unsupported');
        }
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

    const cleanupTooltip = initCommandTooltip(root);
    root.addEventListener('click', onClick);
    skipLink?.addEventListener('click', focusContent);
    document.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('resize', scheduleFit, { passive: true });
    const contentObserver = new MutationObserver(scheduleFit);
    contentObserver.observe(main, { childList: true, subtree: true, characterData: true });
    render();
    return {
      destroy() {
        if (destroyed) return;
        destroyed = true;
        root.removeEventListener('click', onClick);
        skipLink?.removeEventListener('click', focusContent);
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('fullscreenchange', onFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
        window.removeEventListener('hashchange', onHash);
        window.removeEventListener('resize', scheduleFit);
        contentObserver.disconnect();
        if (fitFrame) cancelAnimationFrame(fitFrame);
        cleanupTooltip?.();
        cleanups.forEach((cleanup) => cleanup());
        cleanups = [];
        document.body.classList.remove('presentation-mode');
      },
    };
  }

  window.Oficina = { ...window.Oficina, registerWidget, mountPresentation, explainCommand, explainCommandParts, renderCommandLine, initCommandTooltip };
}());
