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
        'Baixe o instalador oficial do Git for Windows pelo guia abaixo. Mantenha Git Bash e Git Credential Manager disponíveis. Depois de instalar, abra o Git Bash pelo menu Iniciar e use esse terminal nos exercícios.'));
    } else {
      fragment.append(node('h3', 'Linux · terminal da distribuição'), node('p',
        'Abra o aplicativo Terminal. Instale apenas pelo gerenciador da sua distribuição; sudo pede a senha do computador. Se não tiver permissão, peça ajuda a quem administra a máquina.'),
      node('h4', 'Debian / Ubuntu / Mint'), code('sudo apt update\nsudo apt install git'),
      node('h4', 'Fedora'), code('sudo dnf install git'));
    }
    fragment.append(node('h3', 'Confira o terminal e a pasta'), code('git --version\npwd\nls'),
      node('p', 'git --version deve mostrar Git 2.28 ou superior. pwd mostra sua pasta; ls lista os arquivos. No guia, prepare uma pasta própria e configure nome/e-mail antes do primeiro commit.'));
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
    frame.append(node('h2', 'Prepare seu ambiente'), label, status, content,
      node('h3', 'Identidade, conta e HTTPS'), node('p',
        'Nome/e-mail identificam commits; não fazem login. Use sua própria identidade ou o e-mail noreply copiado de Settings → Emails do GitHub. Crie e verifique sua conta para a prática em dupla.'),
      node('p', 'No Windows, o Git Credential Manager permite autenticar pelo navegador. No Linux, o guia mostra o GitHub CLI com HTTPS. Faça o login somente na etapa de conexão: a senha da conta não autentica Git por HTTPS. Nunca coloque credenciais nos arquivos do exercício.'));
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
