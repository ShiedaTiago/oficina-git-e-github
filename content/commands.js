(function () {
  'use strict';
  const gitDocs = (page) => `https://git-scm.com/docs/${page}`;
  const bookDocs = (chapter) => `https://git-scm.com/book/en/v2/${chapter}`;
  const ghCliDocs = (command) => `https://cli.github.com/manual/${command}`;
  const ghDocs = (path) => `https://docs.github.com/en/${path}`;

  const commands = [
    // --- Configuração e Terminal ---
    {
      id: 'pwd',
      name: 'pwd',
      purpose: 'Exibir no terminal o caminho completo da pasta atual de trabalho (print working directory)',
      example: 'pwd',
      caution: 'Confira sua localização antes de executar comandos Git. Use para verificar se está na pasta do projeto.',
      keywords: ['pasta atual', 'localização', 'diretório', 'caminho', 'terminal', 'navegação'],
      category: 'configuracao',
      url: bookDocs('Getting-Started-The-Command-Line')
    },
    {
      id: 'cd',
      name: 'cd',
      purpose: 'Navegar e trocar a pasta atual de trabalho no terminal (change directory)',
      example: 'cd ~/oficina-git/site-da-turma\ncd ..',
      caution: 'Use aspas se o caminho contiver espaços (ex.: cd "Minha Pasta"). O símbolo ~ representa sua pasta de usuário.',
      keywords: ['navegar', 'trocar pasta', 'diretório', 'terminal', 'caminho'],
      category: 'configuracao',
      url: bookDocs('Getting-Started-The-Command-Line')
    },
    {
      id: 'ls',
      name: 'ls',
      purpose: 'Listar os arquivos e subpastas contidos no diretório atual',
      example: 'ls\nls -la',
      caution: 'Arquivos ou pastas iniciados por ponto (como .git e .gitignore) só aparecem com a opção -a ou -la.',
      keywords: ['listar', 'arquivos', 'pastas', 'conteúdo', 'terminal'],
      category: 'configuracao',
      url: bookDocs('Getting-Started-The-Command-Line')
    },
    {
      id: '--version',
      name: 'git --version',
      purpose: 'Conferir a versão instalada do Git no sistema operacional',
      example: 'git --version',
      caution: 'Se o terminal não encontrar o Git, revise a instalação. A oficina requer Git 2.28 ou superior.',
      keywords: ['instalação', 'versão', 'diagnóstico', 'terminal'],
      category: 'configuracao',
      url: gitDocs('git')
    },
    {
      id: 'config',
      name: 'git config',
      purpose: 'Consultar ou configurar a autoria dos commits (nome e e-mail) e opções gerais',
      example: 'git config --global user.name "Seu Nome"\ngit config --global user.email "seu-email@example.com"',
      caution: 'Em computadores compartilhados, retire a opção --global para limitar a configuração ao repositório local.',
      keywords: ['autoria', 'nome', 'email', 'identidade', 'configuração', 'global'],
      category: 'configuracao',
      url: gitDocs('git-config')
    },
    {
      id: 'config --get',
      name: 'git config --get',
      purpose: 'Consultar o valor configurado para uma chave específica (como user.name ou user.email)',
      example: 'git config --get user.name\ngit config --get user.email\ngit config --global --get user.name',
      caution: 'Sem --global, o comando consulta o valor efetivo para o repositório onde você está no momento.',
      keywords: ['consultar', 'configuração', 'get', 'email', 'nome', 'identidade'],
      category: 'configuracao',
      url: gitDocs('git-config')
    },
    {
      id: 'config --local',
      name: 'git config --local',
      purpose: 'Definir configurações de autoria aplicadas apenas ao repositório local atual',
      example: 'git config --local user.name "Seu Nome"\ngit config --local user.email "seu-email@example.com"',
      caution: 'Funciona somente dentro de uma pasta com repositório Git já inicializado (.git presente).',
      keywords: ['configuração', 'local', 'repositório', 'autoria', 'identidade'],
      category: 'configuracao',
      url: gitDocs('git-config')
    },
    {
      id: 'init -b main',
      name: 'git init -b main',
      purpose: 'Iniciar um repositório local definindo main como a branch principal inicial',
      example: 'git init -b main',
      caution: 'Execute somente dentro da pasta do projeto; nunca execute git init na raiz da sua pasta pessoal (~).',
      keywords: ['iniciar', 'repositório', 'branch principal', 'main', 'novo'],
      category: 'configuracao',
      url: gitDocs('git-init')
    },

    // --- Staging & Commits ---
    {
      id: 'status',
      name: 'git status',
      purpose: 'Consultar o estado detalhado da área de trabalho e da área de preparação (staging)',
      example: 'git status',
      caution: 'Leia atentamente a saída antes de preparar ou registrar alterações para entender o que foi modificado.',
      keywords: ['estado', 'diagnóstico', 'arquivos', 'modificados', 'não rastreados'],
      category: 'staging',
      url: gitDocs('git-status')
    },
    {
      id: 'status --short',
      name: 'git status --short',
      purpose: 'Consultar o estado do repositório em formato resumido de duas colunas',
      example: 'git status --short',
      caution: 'A primeira coluna exibe o estado no staging (índice); a segunda coluna indica o estado no diretório de trabalho.',
      keywords: ['resumo', 'estado compacto', 'status', 'colunas', 'staging', 'short'],
      category: 'staging',
      url: gitDocs('git-status')
    },
    {
      id: 'add',
      name: 'git add',
      purpose: 'Preparar o conteúdo atual de um ou mais arquivos para o próximo snapshot (staging)',
      example: 'git add index.html\ngit add index.html styles.css README.md\ngit add .gitignore',
      caution: 'Se editar o arquivo novamente após o git add, execute git add outra vez para incluir a nova versão no snapshot.',
      keywords: ['staging', 'snapshot', 'preparar', 'índice', 'adicionar'],
      category: 'staging',
      url: gitDocs('git-add')
    },
    {
      id: 'commit',
      name: 'git commit',
      purpose: 'Registrar o snapshot preparado no histórico local com uma mensagem explicativa',
      example: 'git commit -m "Cria base do site da turma"',
      caution: 'O commit é uma gravação 100% local; ele não envia arquivos nem se conecta ao GitHub.',
      keywords: ['registrar', 'histórico', 'mensagem', 'snapshot', 'gravar'],
      category: 'staging',
      url: gitDocs('git-commit')
    },
    {
      id: 'check-ignore',
      name: 'git check-ignore',
      purpose: 'Confirmar se um caminho é ignorado pelas regras do repositório (.gitignore)',
      example: 'git check-ignore rascunhos/notas.txt',
      caution: 'Quando o caminho é ignorado, o comando imprime seu nome no terminal.',
      keywords: ['gitignore', 'ignorado', 'regra', 'filtro'],
      category: 'staging',
      url: gitDocs('git-check-ignore')
    },

    // --- Inspeção & Diffs ---
    {
      id: 'diff',
      name: 'git diff',
      purpose: 'Comparar alterações ainda não preparadas na pasta de trabalho com o staging',
      example: 'git diff\ngit diff -- index.html',
      caution: 'Arquivos novos ainda não rastreados não aparecem nesta comparação até que sejam adicionados com git add.',
      keywords: ['comparar', 'alterações', 'trabalho', 'modificações', 'diferenças'],
      category: 'inspecao',
      url: gitDocs('git-diff')
    },
    {
      id: 'diff --staged',
      name: 'git diff --staged',
      purpose: 'Comparar o snapshot preparado no staging com o último commit registrado (HEAD)',
      example: 'git diff --staged\ngit diff --staged -- index.html',
      caution: '--staged e --cached são comandos equivalentes. Revise antes de executar o commit.',
      keywords: ['comparar', 'staging', 'snapshot', 'índice', 'área de preparação'],
      category: 'inspecao',
      url: gitDocs('git-diff')
    },
    {
      id: 'diff --cached',
      name: 'git diff --cached',
      purpose: 'Sinônimo oficial de git diff --staged para comparar o índice preparado com o HEAD',
      example: 'git diff --cached -- index.html',
      caution: 'Produz o mesmo resultado de git diff --staged; útil para compatibilidade com versões antigas.',
      keywords: ['comparar', 'cached', 'staging', 'índice', 'snapshot'],
      category: 'inspecao',
      url: gitDocs('git-diff')
    },
    {
      id: 'diff --check',
      name: 'git diff --check',
      purpose: 'Procurar problemas de espaço em branco e marcadores de conflito pendentes antes do commit',
      example: 'git diff --check',
      caution: 'Sem saída significa que nenhum marcador de conflito ou problema de espaço foi detectado.',
      keywords: ['conflito', 'espaços', 'verificação', 'marcadores', 'validação'],
      category: 'inspecao',
      url: gitDocs('git-diff')
    },
    {
      id: 'log',
      name: 'git log',
      purpose: 'Consultar o histórico linear de commits registrados no repositório',
      example: 'git log --oneline\ngit log --oneline -3\ngit log --oneline --decorate -4',
      caution: 'Cada commit possui um identificador hash único. Pressione a tecla q para sair da paginação.',
      keywords: ['histórico', 'commits', 'linha do tempo', 'oneline'],
      category: 'inspecao',
      url: gitDocs('git-log')
    },
    {
      id: 'log --graph --all',
      name: 'git log --graph --all',
      purpose: 'Visualizar o grafo de branches e histórico completo de commits no terminal',
      example: 'git log --oneline --graph --all\ngit log --oneline --graph --decorate -6',
      caution: 'A opção --graph desenha as ramificações e convergências textualmente; --all inclui todas as branches.',
      keywords: ['histórico', 'grafo', 'commits', 'árvore', 'branches', 'graph', 'all'],
      category: 'inspecao',
      url: gitDocs('git-log')
    },
    {
      id: 'show',
      name: 'git show',
      purpose: 'Inspecionar os detalhes, autor, data e diff completo de um commit específico',
      example: 'git show HEAD',
      caution: 'HEAD identifica o commit atualmente ativo. Você também pode informar o hash de qualquer commit.',
      keywords: ['commit', 'inspecionar', 'HEAD', 'detalhes', 'mostrar'],
      category: 'inspecao',
      url: gitDocs('git-show')
    },

    // --- Recuperação & Desfazer ---
    {
      id: 'restore --staged',
      name: 'git restore --staged',
      purpose: 'Retirar um arquivo da área de preparação (staging) preservando suas edições na pasta de trabalho',
      example: 'git restore --staged index.html',
      caution: 'Use sempre a flag --staged na oficina para não descartar edições feitas na sua pasta de trabalho.',
      keywords: ['despreparar', 'staging', 'índice', 'desfazer', 'restaurar', 'preservar'],
      category: 'recuperacao',
      url: gitDocs('git-restore')
    },
    {
      id: 'restore',
      name: 'git restore',
      purpose: 'Descartar alterações locais não preparadas, revertendo o arquivo ao estado do último commit',
      example: 'git restore index.html',
      caution: 'ATENÇÃO: descarta permanentemente as alterações na sua pasta de trabalho que não foram salvas em commit.',
      keywords: ['descartar', 'restaurar', 'reverter', 'perda de dados', 'cuidado'],
      category: 'recuperacao',
      url: gitDocs('git-restore')
    },
    {
      id: 'revert',
      name: 'git revert',
      purpose: 'Desfazer o efeito de um commit anterior criando um novo commit com as alterações inversas',
      example: 'git revert --no-edit HEAD',
      caution: 'Preserva todo o histórico. Comece sempre com a árvore de trabalho limpa antes de executar.',
      keywords: ['desfazer', 'preservar histórico', 'commit inverso', 'segurança', 'reverter'],
      category: 'recuperacao',
      url: gitDocs('git-revert')
    },
    {
      id: 'merge --abort',
      name: 'git merge --abort',
      purpose: 'Interromper com segurança um merge em andamento que gerou conflitos não desejados',
      example: 'git merge --abort',
      caution: 'Retorna a branch ao estado anterior à tentativa de merge. Requer que não houvesse alterações pendentes antes do merge.',
      keywords: ['cancelar', 'conflito', 'recuperação', 'abortar', 'desfazer merge'],
      category: 'recuperacao',
      url: gitDocs('git-merge')
    },

    // --- Branches ---
    {
      id: 'branch',
      name: 'git branch',
      purpose: 'Listar as branches locais existentes no repositório',
      example: 'git branch\ngit branch -a',
      caution: 'O asterisco (*) e o destaque marcam a branch em que você se encontra no momento.',
      keywords: ['ramificação', 'listar', 'branches', 'locais'],
      category: 'branches',
      url: gitDocs('git-branch')
    },
    {
      id: 'branch --show-current',
      name: 'git branch --show-current',
      purpose: 'Exibir no terminal apenas o nome exato da branch ativa no momento',
      example: 'git branch --show-current',
      caution: 'Ideal para checar rapidamente sua branch antes de commitar ou abrir merge.',
      keywords: ['branch atual', 'nome', 'identificar', 'terminal'],
      category: 'branches',
      url: gitDocs('git-branch')
    },
    {
      id: 'branch -d',
      name: 'git branch -d',
      purpose: 'Excluir com segurança uma branch local que já teve suas alterações integradas',
      example: 'git branch -d melhoria-descricao',
      caution: 'O Git recusa a exclusão com -d se a branch contiver commits ainda não integrados, evitando perda de trabalho.',
      keywords: ['excluir', 'apagar', 'remover', 'branch', 'limpeza'],
      category: 'branches',
      url: gitDocs('git-branch')
    },
    {
      id: 'switch',
      name: 'git switch',
      purpose: 'Trocar para uma branch existente no repositório',
      example: 'git switch main\ngit switch melhoria-descricao',
      caution: 'Alterações não commitadas na pasta de trabalho podem impedir a troca para proteger suas edições.',
      keywords: ['trocar', 'mudar', 'branch', 'ramificação', 'selecionar'],
      category: 'branches',
      url: gitDocs('git-switch')
    },
    {
      id: 'switch -c',
      name: 'git switch -c',
      purpose: 'Criar uma nova branch a partir do ponto atual e alternar para ela imediatamente',
      example: 'git switch -c minha-melhoria\ngit switch -c mensagem-alternativa',
      caution: 'Escolha um nome descritivo usando letras minúsculas e hifens (ex.: melhoria-descricao).',
      keywords: ['criar', 'branch', 'ramificação', 'nova branch', 'trocar'],
      category: 'branches',
      url: gitDocs('git-switch')
    },
    {
      id: 'merge',
      name: 'git merge',
      purpose: 'Integrar o histórico de outra branch na branch atualmente ativa',
      example: 'git merge minha-melhoria\ngit merge mensagem-alternativa\ngit merge origin/main',
      caution: 'Confira a branch atual com git branch e garanta status limpo antes de iniciar a integração.',
      keywords: ['integrar', 'juntar', 'branch', 'conflito', 'fusão'],
      category: 'branches',
      url: gitDocs('git-merge')
    },
    {
      id: 'merge --ff-only',
      name: 'git merge --ff-only',
      purpose: 'Integrar alterações apenas se for possível avançar o ponteiro diretamente (fast-forward)',
      example: 'git merge --ff-only melhoria-descricao',
      caution: 'O comando interrompe a execução caso haja histórico divergente, evitando criação acidental de commits de merge.',
      keywords: ['fast-forward', 'integrar', 'branch', 'avanço direto'],
      category: 'branches',
      url: gitDocs('git-merge')
    },

    // --- Remoto & Sincronização ---
    {
      id: 'remote add',
      name: 'git remote add',
      purpose: 'Associar o repositório local a um repositório remoto sob o apelido padrão origin',
      example: 'git remote add origin https://github.com/USUARIO/REPOSITORIO.git',
      caution: 'Use a URL HTTPS oficial do seu repositório; nunca insira senha ou token pessoal dentro da URL.',
      keywords: ['remoto', 'origin', 'adicionar', 'vincular', 'GitHub', 'URL'],
      category: 'remoto',
      url: gitDocs('git-remote')
    },
    {
      id: 'remote -v',
      name: 'git remote -v',
      purpose: 'Listar todos os remotos cadastrados com suas respectivas URLs de busca (fetch) e envio (push)',
      example: 'git remote -v',
      caution: 'Confira conta, organização e repositório antes de realizar qualquer envio para a nuvem.',
      keywords: ['remoto', 'origin', 'URL', 'listar remotos', 'verbose'],
      category: 'remoto',
      url: gitDocs('git-remote')
    },
    {
      id: 'remote get-url',
      name: 'git remote get-url',
      purpose: 'Consultar a URL configurada para um remoto específico',
      example: 'git remote get-url origin',
      caution: 'Use para conferir o endereço exato do origin configurado no repositório.',
      keywords: ['remoto', 'origin', 'URL', 'consultar url'],
      category: 'remoto',
      url: gitDocs('git-remote')
    },
    {
      id: 'clone',
      name: 'git clone',
      purpose: 'Copiar um repositório remoto completo com todo o histórico de commits para uma nova pasta',
      example: 'git clone https://github.com/USUARIO/REPOSITORIO.git',
      caution: 'O clone cria uma nova subpasta; não execute o clone de dentro de outro repositório Git.',
      keywords: ['copiar', 'clonar', 'baixar', 'remoto', 'GitHub'],
      category: 'remoto',
      url: gitDocs('git-clone')
    },
    {
      id: 'fetch',
      name: 'git fetch',
      purpose: 'Baixar commits e dados do repositório remoto sem alterar seus arquivos de trabalho locais',
      example: 'git fetch origin',
      caution: 'Atualiza apenas as referências remotas origin/*; utilize git merge ou git log para inspecionar e integrar.',
      keywords: ['buscar', 'baixar', 'remoto', 'origin', 'sincronizar'],
      category: 'remoto',
      url: gitDocs('git-fetch')
    },
    {
      id: 'push',
      name: 'git push',
      purpose: 'Enviar commits locais para o repositório remoto e configurar acompanhamento de branch (-u)',
      example: 'git push -u origin main\ngit push -u origin melhoria-dupla\ngit push',
      caution: 'Requer permissão de escrita e autenticação HTTPS. Nunca inclua credenciais na URL.',
      keywords: ['enviar', 'publicar', 'remoto', 'upstream', 'push', 'subir commits'],
      category: 'remoto',
      url: gitDocs('git-push')
    },
    {
      id: 'pull --ff-only',
      name: 'git pull --ff-only',
      purpose: 'Buscar atualizações remotas e integrá-las à branch local apenas se for avanço direto',
      example: 'git pull --ff-only\ngit pull --ff-only origin main',
      caution: 'Se houver divergência no histórico, a operação é interrompida para você diagnosticar antes de integrar.',
      keywords: ['receber', 'puxar', 'remoto', 'fast-forward', 'atualizar', 'sincronizar'],
      category: 'remoto',
      url: gitDocs('git-pull')
    },

    // --- GitHub CLI e Colaboração ---
    {
      id: 'gh auth login',
      name: 'gh auth login',
      purpose: 'Autenticar o terminal com sua conta GitHub usando o fluxo oficial no navegador',
      example: 'gh auth login',
      caution: 'Selecione GitHub.com -> HTTPS -> autenticar Git: Yes -> abrir no navegador.',
      keywords: ['autenticação', 'login', 'sessão', 'github cli', 'gh', 'credenciais'],
      category: 'github',
      url: ghCliDocs('gh_auth_login')
    },
    {
      id: 'gh auth status',
      name: 'gh auth status',
      purpose: 'Verificar o estado da conexão, a conta logada e os escopos ativos no GitHub CLI',
      example: 'gh auth status',
      caution: 'Use para diagnosticar se a conta autenticada no terminal corresponde ao perfil convidado.',
      keywords: ['verificar login', 'status da conta', 'diagnóstico', 'gh', 'github'],
      category: 'github',
      url: ghCliDocs('gh_auth_status')
    },
    {
      id: 'pull-request',
      name: 'Pull Request (GitHub)',
      purpose: 'Propor alterações de uma branch para main, permitindo discussão e revisão de código antes do merge',
      example: 'gh pr create --title "Melhoria em dupla" --body "Descrição das alterações"\n# Ou abra o PR pela interface web do repositório no GitHub',
      caution: 'Um Pull Request é um recurso da plataforma GitHub para colaboração; não é um comando Git nativo.',
      keywords: ['pull request', 'pr', 'colaboração', 'revisão', 'código', 'proposta', 'github', 'conflito'],
      category: 'github',
      url: ghDocs('pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests')
    }
  ];

  function explainCommand(raw) {
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

  window.Oficina = { ...window.Oficina, commands, explainCommand };
}());
