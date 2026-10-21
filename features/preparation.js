(function () {
  'use strict';

  function node(tag, text, className) {
    const result = document.createElement(tag);
    if (text !== undefined) result.textContent = text;
    if (className) result.className = className;
    return result;
  }

  function code(text) {
    const pre = node('pre');
    pre.tabIndex = 0;
    pre.append(node('code', text));
    return pre;
  }

  function systemContent(os) {
    const fragment = document.createDocumentFragment();
    if (os === 'windows') {
      fragment.append(node('h3', 'Windows · Git Bash'), node('p',
        'Instale o Git for Windows pelo guia e abra o Git Bash. Mantenha o Git Credential Manager disponível para autenticar pelo navegador.'));
    } else {
      fragment.append(node('h3', 'Linux · terminal da distribuição'), node('p',
        'Instale pelo gerenciador da sua distribuição. sudo pede a senha do computador; sem permissão, peça ajuda.'),
      node('h4', 'Debian / Ubuntu / Mint · Fedora'), code('sudo apt update && sudo apt install git\nsudo dnf install git'));
    }
    fragment.append(node('h3', 'Confira o terminal'), code('git --version\npwd\nls'));
    return fragment;
  }

  function mountPreparation(root, initialOS = 'windows') {
    if (!(root instanceof HTMLElement)) throw new TypeError('Informe um elemento HTML para a preparação.');
    const frame = node('div', undefined, 'preparation');
    const label = node('label', 'Sistema operacional ');
    const select = node('select');
    ['windows', 'linux'].forEach((os) => {
      const option = node('option', os === 'windows' ? 'Windows' : 'Linux');
      option.value = os;
      select.append(option);
    });
    select.value = initialOS === 'linux' ? 'linux' : 'windows';
    label.append(select);
    const content = node('div');
    content.dataset.preparationContent = '';
    const status = node('p', '', 'muted');
    status.setAttribute('role', 'status');
    const update = () => {
      content.replaceChildren(systemContent(select.value));
      status.textContent = `Caminho selecionado: ${select.value === 'linux' ? 'Linux' : 'Windows'}.`;
    };
    frame.append(label, status, content,
      node('p', 'Nome e e-mail identificam commits; não fazem login. Use sua identidade ou o e-mail noreply do GitHub. Nunca coloque credenciais nos arquivos.', 'preparation-note'));
    const links = node('p', undefined, 'preparation-links');
    [['guides/preparacao.html', 'Abrir preparação completa'], ['guides/diagnostico.html', 'Resolver um problema']].forEach(([href, text]) => {
      const link = node('a', text);
      link.href = href;
      links.append(link);
    });
    frame.append(links);
    root.replaceChildren(frame);
    update();
    select.addEventListener('change', update);
    return { destroy() { select.removeEventListener('change', update); frame.remove(); } };
  }

  window.Oficina = { ...window.Oficina, mountPreparation };
  if (typeof window.Oficina.registerWidget === 'function') {
    window.Oficina.registerWidget('preparation', (root, block) => mountPreparation(root, block.initialOS));
  }
}());
