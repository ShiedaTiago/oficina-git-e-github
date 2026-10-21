(function () {
  'use strict';
  const slides = [
    {
      id: 'inicio', chapter: 'fundamentos', title: 'Git e GitHub, na prática.',
      blocks: [
        { type: 'text', text: 'Em três horas: construir um histórico, experimentar ideias e propor uma mudança em equipe.' },
        { type: 'diagram', steps: ['Entender · 15 min', 'Preparar · 20 min', 'Commits · 35 min', 'Pausa · 10 min', 'Branches · 30 min', 'Remotos · 20 min', 'Colaborar · 35 min', 'Revisar · 15 min'] },
      ],
      notes: { objective: 'Apresentar o percurso e acolher quem começa do zero.', minutes: 3,
        demo: 'Mostrar setas, notas (N), consulta (/) e tela cheia (F). Pedir um sinal sobre experiência prévia.',
        pitfalls: ['Não pressupor conhecimentos de terminal.', 'Os tempos incluem demonstrações e prática; total de 180 minutos.'] },
    },
    {
      id: 'por-que-versionar', chapter: 'fundamentos', title: 'Qual versão conta a história?',
      blocks: [
        { type: 'list', items: ['final.html → final-agora-vai.html → final-2.html', 'O que mudou? Por quê? Quem decidiu?', 'Controle de versão registra etapas que podemos comparar.'] },
        { type: 'activity', title: 'Uma situação real', text: 'Conte à pessoa ao lado uma mudança que você já quis desfazer.' },
      ],
      notes: { objective: 'Relacionar versionamento a um problema conhecido.', minutes: 4,
        demo: 'Mostrar duas versões de um título e perguntar qual diferença importa. Ouvir dois exemplos da turma.',
        pitfalls: ['Evitar a ideia de que Git salva cada tecla automaticamente. É preciso registrar commits.'] },
    },
    {
      id: 'git-e-github', chapter: 'fundamentos', title: 'Git na máquina. GitHub na colaboração.',
      blocks: [
        { type: 'diagram', steps: ['Seu computador · arquivos + Git + histórico local', 'Rede · envio e recebimento de commits', 'GitHub · repositório remoto + revisão + conversa'] },
        { type: 'text', text: 'Editar e criar commits funciona offline. Compartilhar no GitHub exige conexão e acesso.' },
        { type: 'activity', title: 'Checkpoint', text: 'Sem internet, ainda é possível fazer um commit? Explique onde ele fica.' },
      ],
      notes: { objective: 'Distinguir a ferramenta Git do serviço GitHub.', minutes: 4,
        demo: 'Apontar o terminal local e uma página de repositório, deixando clara a fronteira entre os dois.',
        pitfalls: ['Salvar um arquivo, criar um commit e fazer push são três ações diferentes.', 'Repositório público permite leitura; escrita depende de permissão.'] },
    },
    {
      id: 'tres-lugares', chapter: 'fundamentos', title: 'Três lugares para uma mudança.',
      blocks: [
        { type: 'diagram', steps: ['Trabalho · o arquivo que você edita', 'Staging · conteúdo escolhido com add', 'Histórico · snapshot registrado com commit'] },
        { type: 'text', text: 'Um repositório reúne os arquivos e os dados do Git. Um commit tem identificação, mensagem e ligação com o histórico anterior.' },
        { type: 'activity', title: 'Antes de digitar', text: 'Em qual lugar está uma mudança que acabou de ser salva no editor?' },
      ],
      notes: { objective: 'Construir o vocabulário mínimo para a primeira prática.', minutes: 4,
        demo: 'Usar três cartões para mover uma mudança do trabalho ao staging e ao histórico.',
        pitfalls: ['Snapshot é um estado registrado, não uma pasta duplicada manualmente.', 'A pasta .git guarda os dados do repositório; não apagá-la.'] },
    },
    {
      id: 'preparar', chapter: 'preparacao', title: 'Escolha seu caminho de preparação.',
      blocks: [
        { type: 'text', text: 'Windows: Git Bash. Linux: terminal da distribuição. Nas duas opções usaremos os mesmos comandos Git.' },
        { type: 'widget', widget: 'preparation' },
      ],
      notes: { objective: 'Verificar instalação sem misturar instruções de sistemas diferentes.', minutes: 3,
        demo: 'Abrir o seletor e seguir apenas o sistema usado por cada pessoa. Retomar o guia enviado antes da aula.',
        pitfalls: ['Instalação pode exigir permissão de administrador.', 'Não pedir PowerShell nos exercícios compartilhados.', 'Sem instalação, seguir em dupla ou usar as simulações.'] },
    },
    {
      id: 'terminal-e-pasta', chapter: 'preparacao', title: 'Primeiro, descubra onde você está.',
      blocks: [
        { type: 'code', language: 'Git Bash / terminal Linux', code: 'git --version\npwd\nls\ncd "caminho/da/oficina"\npwd' },
        { type: 'activity', title: 'Abra a pasta certa', text: 'Extraia o material. No terminal, entre na pasta examples/site-da-turma. Abra essa mesma pasta no editor.' },
      ],
      notes: { objective: 'Alinhar terminal e editor na cópia local do exercício.', minutes: 5,
        demo: 'Mostrar pwd e a pasta no editor. Usar cd com aspas quando houver espaços; substituir o caminho ilustrativo.',
        pitfalls: ['Não digitar o símbolo $ do prompt.', 'Git Bash aceita caminhos como /c/Users/...; não copiar um caminho Windows literalmente para Linux.', 'Não executar init na pasta pessoal.'] },
    },
    {
      id: 'identidade', chapter: 'preparacao', title: 'Quem assina os seus commits?',
      blocks: [
        { type: 'code', code: 'git config --global user.name "Seu Nome"\ngit config --global user.email "seu-email-de-commit"\ngit config --global --get user.name\ngit config --global --get user.email' },
        { type: 'text', text: 'Use seu nome e um e-mail escolhido por você. Para privacidade no GitHub, copie o endereço noreply oferecido nas configurações da sua conta.' },
        { type: 'activity', title: 'Checkpoint', text: 'A identidade do commit faz login no GitHub? Não: autoria e autenticação têm funções distintas.' },
      ],
      notes: { objective: 'Configurar autoria sem confundi-la com credenciais.', minutes: 5,
        demo: 'Preencher valores próprios e conferir a leitura. Em máquina compartilhada, usar configuração local depois do init, sem --global.',
        pitfalls: ['Os exemplos são valores para substituir, não credenciais.', 'Nome e e-mail ficam gravados nos commits.', 'Não projetar dados pessoais da turma.'] },
    },
    {
      id: 'prontos-para-comecar', chapter: 'preparacao', title: 'Ambiente pronto, sem pressa.',
      blocks: [
        { type: 'list', items: ['Git responde no terminal.', 'Editor e terminal apontam para site-da-turma.', 'O arquivo index.html abre no navegador.'] },
        { type: 'activity', title: '7 minutos para preparar', text: 'Confira os três itens com a pessoa ao lado. Quem terminou ajuda a conferir a pasta, sem assumir o teclado.' },
      ],
      notes: { objective: 'Reservar tempo real para equalizar a preparação.', minutes: 7,
        demo: 'Abrir index.html pelo gerenciador de arquivos. Circular pela sala e confirmar o diretório antes da próxima etapa.',
        pitfalls: ['Não transformar a oficina em instalação coletiva longa.', 'Problemas persistentes seguem em dupla; o guia de diagnóstico fica para consulta.'] },
    },
    {
      id: 'primeiro-repositorio', chapter: 'primeiros-commits', title: 'Uma pasta passa a ter histórico.',
      blocks: [
        { type: 'code', code: 'git init -b main\ngit status' },
        { type: 'text', text: 'Execute uma vez, dentro de site-da-turma. main será a branch inicial deste exercício.' },
        { type: 'activity', title: 'Leia a resposta', text: 'Localize o nome da branch e os arquivos ainda não rastreados (untracked).' },
      ],
      notes: { objective: 'Iniciar um repositório e ler o status antes de alterá-lo.', minutes: 4,
        demo: 'Conferir pwd; inicializar uma cópia nova do projeto e identificar untracked no status.',
        pitfalls: ['init não publica nada.', 'A opção -b requer Git 2.28 ou superior; atualizar antes da aula.', 'Não inicializar repositórios dentro de outro repositório.'] },
    },
    {
      id: 'primeiro-commit', chapter: 'primeiros-commits', title: 'Prepare. Confira. Registre.',
      blocks: [
        { type: 'code', code: 'git add index.html styles.css README.md\ngit diff --staged\ngit commit -m "Cria a página inicial da turma"\ngit status' },
        { type: 'text', text: 'O primeiro commit registra a base. A mensagem explica uma mudança com sentido.' },
      ],
      notes: { objective: 'Criar o primeiro snapshot com arquivos escolhidos explicitamente.', minutes: 4,
        demo: 'Ler o diff preparado antes do commit e conferir que a árvore de trabalho fica limpa.',
        pitfalls: ['Sem configuração de autoria, o commit pode falhar.', 'No paginador do terminal, q volta ao prompt.', 'Não incluir senhas, tokens ou arquivos pessoais no histórico.'] },
    },
    {
      id: 'ler-diferencas', chapter: 'primeiros-commits', title: 'Mude uma coisa. Observe duas vezes.',
      blocks: [
        { type: 'activity', title: 'Edite o título da página', text: 'No editor, mude o texto do título em index.html. Salve e recarregue o navegador.' },
        { type: 'code', code: 'git status\ngit diff\ngit add index.html\ngit diff --staged' },
        { type: 'text', text: 'diff compara trabalho com staging. diff --staged compara staging com o último commit.' },
      ],
      notes: { objective: 'Interpretar diferenças em vez de executar comandos às cegas.', minutes: 5,
        demo: 'Apontar linhas removidas e adicionadas. Mostrar que o diff simples esvazia depois do add.',
        pitfalls: ['git diff não mostra o conteúdo de arquivos untracked.', 'O arquivo precisa ser salvo no editor para o Git ver a mudança.'] },
    },
    {
      id: 'snapshot-preparado', chapter: 'primeiros-commits', title: 'add captura o conteúdo daquele momento.',
      blocks: [
        { type: 'text', text: 'Se você editar de novo depois de add, o staging continua com a versão anterior. Outro add atualiza a seleção.' },
        { type: 'widget', widget: 'staging' },
        { type: 'activity', title: 'Preveja antes de clicar', text: 'Edite → prepare → edite novamente. Qual versão entrará no commit?' },
      ],
      notes: { objective: 'Distinguir a versão preparada da versão de trabalho.', minutes: 6,
        demo: 'Na simulação, preparar uma versão e depois editar outra. Comparar com diff e diff --staged no terminal.',
        pitfalls: ['add não acompanha edições futuras automaticamente.', 'Um arquivo pode ter mudanças preparadas e não preparadas simultaneamente.'] },
    },
    {
      id: 'segundo-commit', chapter: 'primeiros-commits', title: 'Uma mudança com uma explicação.',
      blocks: [
        { type: 'code', code: 'git add index.html\ngit diff --staged\ngit commit -m "Personaliza o título da turma"\ngit log --oneline\ngit status' },
        { type: 'activity', title: 'Checkpoint', text: 'Encontre os dois commits e conte, em uma frase, o que cada um mudou.' },
      ],
      notes: { objective: 'Consolidar o ciclo com um segundo commit e leitura do histórico.', minutes: 5,
        demo: 'Mostrar que os identificadores curtos diferem em cada máquina. Usar git show com um identificador da demonstração.',
        pitfalls: ['A mensagem não deve ser apenas “mudanças”.', 'Não copiar hashes ilustrativos de outra máquina.'] },
    },
    {
      id: 'tirar-do-staging', chapter: 'primeiros-commits', title: 'Preparou o arquivo errado? Refaça a seleção.',
      blocks: [
        { type: 'code', code: 'git restore --staged index.html\ngit status\ngit diff' },
        { type: 'text', text: 'Depois de existir um commit, --staged repõe o staging a partir de HEAD e mantém sua edição no arquivo.' },
        { type: 'text', text: 'Atenção: restore sem --staged atua no arquivo de trabalho e pode descartar edições. Não execute para “testar”.' },
      ],
      notes: { objective: 'Recuperar uma seleção equivocada sem perder o trabalho.', minutes: 5,
        demo: 'Fazer uma pequena edição, add e restore --staged. Conferir no editor que o texto permanece; depois preparar e commitar essa edição para seguir limpo.',
        pitfalls: ['O exemplo pressupõe pelo menos um commit em HEAD.', 'Não apresentar reset --hard como atalho de recuperação.', 'Descartar é diferente de tirar da seleção.'] },
    },
    {
      id: 'desfazer-com-historico', chapter: 'primeiros-commits', title: 'Um commit de correção preserva a história.',
      blocks: [
        { type: 'code', code: 'git status\ngit revert --no-edit HEAD\ngit log --oneline' },
        { type: 'text', text: 'Com o trabalho limpo, revert cria outro commit que desfaz os efeitos do escolhido. O commit anterior continua no histórico.' },
        { type: 'activity', title: '6 minutos de prática', text: 'Desfaça apenas o último commit simples do exercício. Explique por que agora há um commit a mais.' },
      ],
      notes: { objective: 'Distinguir uma correção histórica do descarte de edições locais.', minutes: 6,
        demo: 'Identificar o último commit antes de executar. Reverter só o commit simples mais recente; confirmar status limpo.',
        pitfalls: ['Revert pode ter conflito em outros cenários; pedir ajuda antes de continuar.', 'Não usar este exemplo para merge commits.', 'Não prometer que um commit remove um segredo do histórico.'] },
    },
    {
      id: 'intervalo', chapter: 'intervalo', title: '10 minutos para respirar.',
      blocks: [
        { type: 'text', text: 'Levante, beba água e descanse os olhos. Voltamos para experimentar caminhos diferentes no mesmo projeto.' },
        { type: 'activity', title: 'Deixe um marcador', text: 'Antes de sair, confira git status. Se houver uma dúvida, anote o comando e a resposta que você viu.' },
      ],
      notes: { objective: 'Fazer uma pausa real e preservar o ponto de retomada.', minutes: 10,
        demo: 'Anunciar em voz alta o horário exato de retorno e deixar o slide projetado.',
        pitfalls: ['Não consumir o intervalo com conteúdo novo.', 'Atender dúvidas individuais sem atrasar o retorno coletivo.'] },
    },
    {
      id: 'branch-e-head', chapter: 'branches', title: 'Branch é um nome que aponta para um commit.',
      blocks: [
        { type: 'diagram', steps: ['A → B · base compartilhada', 'main → B', 'melhoria → B · pode seguir outro caminho', 'HEAD → branch atual'] },
        { type: 'text', text: 'Uma branch permite desenvolver uma ideia sem mover main. Os próximos commits avançam a branch atual.' },
      ],
      notes: { objective: 'Compreender branches como referências no mesmo histórico.', minutes: 4,
        demo: 'Desenhar dois rótulos no mesmo commit e mover apenas o rótulo da branch que recebe um novo commit.',
        pitfalls: ['Branch não é uma segunda pasta do projeto.', 'Neste percurso HEAD acompanha uma branch; detached HEAD fica para estudo posterior.'] },
    },
    {
      id: 'criar-branch', chapter: 'branches', title: 'Dê um nome à sua ideia.',
      blocks: [
        { type: 'code', code: 'git status\ngit switch -c melhoria-descricao\ngit branch' },
        { type: 'activity', title: 'Faça uma melhoria pequena', text: 'Mude um parágrafo de index.html. Salve, prepare e registre com uma mensagem que explique o resultado.' },
      ],
      notes: { objective: 'Criar uma branch e registrar uma mudança nela.', minutes: 5,
        demo: 'Começar com status limpo, criar melhoria-descricao e mostrar o asterisco em git branch. Usar add e commit já aprendidos.',
        pitfalls: ['Trocar de branch com mudanças pendentes pode ser bloqueado ou carregá-las junto; começar limpo.', 'Não criar a branch duas vezes.'] },
    },
    {
      id: 'navegar-historico', chapter: 'branches', title: 'Trocar de branch muda o ponto de vista.',
      blocks: [
        { type: 'code', code: 'git switch main\ngit log --oneline --graph --all\ngit switch melhoria-descricao' },
        { type: 'widget', widget: 'history' },
        { type: 'activity', title: 'Checkpoint', text: 'Observe o parágrafo em cada branch. Qual rótulo andou depois do novo commit?' },
      ],
      notes: { objective: 'Relacionar arquivos visíveis e posição da branch atual.', minutes: 6,
        demo: 'Alternar com árvore limpa e recarregar a página. Na simulação, acompanhar os rótulos e os commits existentes.',
        pitfalls: ['A mudança não sumiu: ela está registrada na outra branch.', 'O gráfico completo pode divergir do desenho se a turma criou commits adicionais.'] },
    },
    {
      id: 'integrar-branch', chapter: 'branches', title: 'Integre a ideia em main.',
      blocks: [
        { type: 'code', code: 'git switch main\ngit merge melhoria-descricao\ngit log --oneline --graph --all' },
        { type: 'text', text: 'Se main não avançou, o merge pode apenas avançar seu rótulo (fast-forward). Com caminhos divergentes, um merge pode criar um commit com dois pais.' },
      ],
      notes: { objective: 'Integrar uma branch e distinguir fast-forward de merge com dois pais.', minutes: 4,
        demo: 'Executar o fluxo linear do exercício e contrastar com o histórico divergente da simulação. Confirmar o parágrafo em main.',
        pitfalls: ['Merge integra na branch em que você está.', 'Não afirmar que todo merge cria um commit.', 'Manter a branch para inspecionar nesta oficina.'] },
    },
    {
      id: 'conflitos', chapter: 'branches', title: 'Conflito é uma decisão que precisa de você.',
      blocks: [
        { type: 'text', text: 'Quando mudanças não podem ser combinadas automaticamente, o Git para. Leia as duas intenções antes de escolher o texto final.' },
        { type: 'code', language: 'marcadores no arquivo', code: '<<<<<<< HEAD\nTexto da branch atual\n=======\nTexto da outra branch\n>>>>>>> melhoria-descricao' },
        { type: 'list', items: ['Converse e edite o resultado desejado.', 'Remova os marcadores, salve e teste a página.', 'Prepare o arquivo resolvido e conclua o merge com commit.'] },
      ],
      notes: { objective: 'Ler os marcadores e entender a resolução humana de conflitos.', minutes: 5,
        demo: 'Usar o conflito da simulação para comparar versões. Mostrar um arquivo pronto sem os marcadores.',
        pitfalls: ['Não escolher “ours” ou “theirs” sem ler.', 'Também pode haver conflitos em remoções e renomeações, sem este formato textual.'] },
    },
    {
      id: 'pratica-branches', chapter: 'branches', title: 'Explique o caminho de uma ideia.',
      blocks: [
        { type: 'activity', title: '6 minutos em dupla', text: 'Sigam o conflito controlado do guia de exercícios: alterem a mesma linha em duas branches. Leiam, resolvam e concluam o merge.', items: ['Uma pessoa opera e a outra prevê o próximo estado.', 'Troquem os papéis e confiram a página.', 'Na simulação, repitam o fluxo e apontem os dois pais.'] },
        { type: 'text', text: 'No terminal, se um merge real ficar em andamento e você quiser interrompê-lo: git merge --abort. Comece sempre com o trabalho limpo.' },
      ],
      notes: { objective: 'Verificar entendimento do histórico sem pressionar a turma com um conflito real.', minutes: 6,
        demo: 'Usar a seção de conflito controlado de guides/exercicios.html. Circular e pedir HEAD, branches e pais do merge; se faltar tempo ou instalação, executar a mesma decisão na simulação.',
        pitfalls: ['A simulação não executa Git nem muda arquivos reais.', 'merge --abort não garante recuperar edições que já estavam pendentes antes do merge.'] },
    },
    {
      id: 'remoto', chapter: 'remotos', title: 'Remoto é outro repositório, com um endereço.',
      blocks: [
        { type: 'diagram', steps: ['Local · main e seus commits', 'push → envia commits', 'GitHub · repositório remoto', 'fetch / pull ← recebe dados', 'Local · origin/main lembra o estado remoto conhecido'] },
        { type: 'text', text: 'origin é um apelido local para um endereço. Commit continua sendo uma ação local.' },
      ],
      notes: { objective: 'Separar criação de histórico de troca de dados com um remoto.', minutes: 4,
        demo: 'Desenhar uma máquina e um repositório no GitHub. Explicar origin/main como referência local da branch remota conhecida, não como conexão ao vivo.',
        pitfalls: ['Um remoto também pode estar em outra pasta ou servidor.', 'Push não publica automaticamente um site na web.'] },
    },
    {
      id: 'https-e-acesso', chapter: 'remotos', title: 'HTTPS: acesso pelo fluxo do navegador.',
      blocks: [
        { type: 'list', items: ['Use Git Credential Manager ou GitHub CLI já configurado.', 'Na CLI: gh auth login → GitHub.com → HTTPS → navegador.', 'A senha da conta não autentica operações Git por HTTPS.'] },
        { type: 'text', text: 'Autoria do commit não concede acesso. Complete autenticação e 2FA na sua própria tela; nunca compartilhe tokens.' },
        { type: 'activity', title: 'Sem acesso agora?', text: 'Continue acompanhando a demonstração e o fluxo local. A configuração pode ser concluída depois.' },
      ],
      notes: { objective: 'Explicar a autenticação HTTPS com uma rota simples e atual.', minutes: 5,
        demo: 'Mostrar o caminho escolhido no preparo: Git for Windows inclui GCM; no Linux preparar GitHub CLI ou GCM antes da aula.',
        pitfalls: ['Não exibir credenciais, códigos temporários ou telas pessoais na projeção.', 'GitHub CLI é opcional e não vem com Git em todos os sistemas.', 'Rede e políticas da organização podem bloquear o login.'] },
    },
    {
      id: 'primeiro-push', chapter: 'remotos', title: 'Conecte sua cópia a um repositório vazio.',
      blocks: [
        { type: 'text', text: 'Na sua conta, crie um repositório vazio chamado site-da-turma, sem README, licença ou .gitignore inicial. Escolha a visibilidade com cuidado.' },
        { type: 'code', code: 'git remote add origin https://github.com/SEU-USUARIO/site-da-turma.git\ngit remote -v\ngit push -u origin main' },
        { type: 'activity', title: 'Confira o resultado', text: 'Substitua SEU-USUARIO. No GitHub, encontre a mesma mensagem do último commit local.' },
      ],
      notes: { objective: 'Associar o histórico existente a um remoto vazio e enviar main.', minutes: 5,
        demo: 'Usar somente uma conta e repositório de demonstração previamente autorizados. Mostrar que -u registra a relação de acompanhamento.',
        pitfalls: ['Esta ação envia conteúdo ao GitHub; cada estudante decide realizá-la na própria conta.', 'Se origin já existe, inspecionar antes de alterar.', 'Se o remoto tem histórico, não usar force; pedir ajuda.'] },
    },
    {
      id: 'clone-e-pull', chapter: 'remotos', title: 'Começar uma cópia é diferente de atualizá-la.',
      blocks: [
        { type: 'list', items: ['clone: cria uma nova pasta com o repositório.', 'fetch: recebe commits e atualiza referências remotas locais.', 'pull: recebe e integra na branch atual; pode gerar conflito.'] },
        { type: 'code', code: 'git status\ngit switch main\ngit pull --ff-only origin main' },
        { type: 'activity', title: 'Checkpoint · 6 minutos', text: 'Após um merge no GitHub, atualize main com trabalho limpo. --ff-only recusa histórias divergentes: pare e peça ajuda se isso ocorrer.' },
      ],
      notes: { objective: 'Escolher entre clone, fetch e pull com uma atualização previsível.', minutes: 6,
        demo: 'Explicar clone pela demonstração de outra cópia em pasta nova; no exercício atual manter a pasta existente. Reusar a atualização depois do PR.',
        pitfalls: ['Não clonar dentro do repositório existente.', 'Pull sem --ff-only pode integrar por merge ou rebase conforme opções e configuração.', 'Não executar comandos de força para contornar uma recusa.'] },
    },
    {
      id: 'fluxo-de-colaboracao', chapter: 'colaboracao', title: 'Uma proposta pequena facilita a conversa.',
      blocks: [
        { type: 'diagram', steps: ['Branch local · editar e commitar', 'push · branch no GitHub', 'Pull request · proposta + revisão', 'Merge · integra na branch de destino', 'pull · atualiza sua main local'] },
        { type: 'text', text: 'Pull request (PR) é uma proposta no GitHub. git pull é um comando para receber e integrar mudanças no Git local.' },
      ],
      notes: { objective: 'Visualizar o ciclo completo sem confundir PR e pull.', minutes: 3,
        demo: 'Percorrer as cinco etapas e apontar quais ocorrem na máquina e quais no GitHub.',
        pitfalls: ['Abrir um PR não integra a mudança automaticamente.', 'Revisão também discute intenção e clareza.'] },
    },
    {
      id: 'combinar-a-dupla', chapter: 'colaboracao', title: 'Combinem uma mudança e dois papéis.',
      blocks: [
        { type: 'activity', title: 'Autoria e revisão', text: 'Pessoa A mantém o repositório e convida B nas configurações de colaboradores. B aceita na própria conta e clona a cópia para contribuir.', items: ['A revisão confere o objetivo combinado; depois troquem os papéis.', 'Sigam o guia de exercícios para convite, aceite e clone.', 'Sem acesso, revisem lado a lado; não compartilhem senhas.'] },
      ],
      notes: { objective: 'Definir escopo e alternativa viável de colaboração sem impor convites.', minutes: 4,
        demo: 'Combinar uma frase a mudar e o critério de sucesso. Mostrar a sequência de convite e aceite do guia; cada pessoa decide nas próprias contas. Quem já tem acesso pula o convite.',
        pitfalls: ['Convite de colaborador é decisão do dono da conta.', 'Fork é alternativa para estudo posterior, não requisito desta prática.', 'Garantir tempo de teclado para ambas as pessoas.'] },
    },
    {
      id: 'enviar-uma-branch', chapter: 'colaboracao', title: 'Envie a proposta, com um nome próprio.',
      blocks: [
        { type: 'code', code: 'git switch main\ngit pull --ff-only origin main\ngit switch -c melhoria-em-dupla\ngit add index.html\ngit commit -m "Esclarece a descrição da turma"\ngit push -u origin melhoria-em-dupla' },
        { type: 'text', text: 'Antes de add, edite e salve index.html na nova branch. Revise com git diff e git diff --staged.' },
      ],
      notes: { objective: 'Publicar uma branch de trabalho sem enviar a proposta direto para main.', minutes: 5,
        demo: 'Começar limpo, executar as três primeiras linhas, pausar para edição, conferir os diffs, depois preparar, registrar e enviar.',
        pitfalls: ['Não copiar o bloco inteiro sem fazer a edição entre switch e add.', 'Sem rede, criar branch e commit localmente e pular pull/push.', 'Erro de permissão exige conferir acesso e endereço.'] },
    },
    {
      id: 'abrir-pr', chapter: 'colaboracao', title: 'Conte o que mudou e como você conferiu.',
      blocks: [
        { type: 'list', items: ['Abra um PR da branch melhoria-em-dupla para main.', 'Título: “Esclarece a descrição da turma”.', 'Descrição: objetivo da mudança e como a página foi conferida.', 'Em Files changed, confirme que só entrou o que você pretendia.'] },
        { type: 'activity', title: 'Checkpoint', text: 'Aponte a branch de origem e a de destino antes de criar o PR.' },
      ],
      notes: { objective: 'Abrir uma proposta compreensível com destino correto.', minutes: 5,
        demo: 'Mostrar base main e compare melhoria-em-dupla. Ler o diff antes de confirmar e redigir uma descrição curta.',
        pitfalls: ['Rótulos e posição dos botões podem mudar; reconhecer origem, destino e diff.', 'Não incluir dados pessoais no texto.', 'Sem rede, escrever a proposta no caderno para revisão da dupla.'] },
    },
    {
      id: 'revisar-pr', chapter: 'colaboracao', title: 'Revisar é ajudar a mudança a ficar clara.',
      blocks: [
        { type: 'activity', title: '5 minutos de revisão', text: 'Pessoa A revisa a proposta de B: lê a diferença e confere a página com a mudança.', items: ['O texto atende ao objetivo combinado?', 'Há alguma mudança que não pertence à proposta?', 'Escreva uma observação concreta e respeitosa.'] },
        { type: 'text', text: 'Se for preciso ajustar, faça outro commit na mesma branch e envie com push. O PR acompanha a atualização.' },
      ],
      notes: { objective: 'Praticar feedback observável e o ciclo de ajustes.', minutes: 5,
        demo: 'Trocar “está ruim” por “este trecho repete o título; podemos explicar o propósito?”. Conferir um novo commit no PR.',
        pitfalls: ['O autor não aprova formalmente o próprio PR.', 'Sem acesso ou conta, revisão verbal lado a lado cumpre o exercício.', 'Respeitar quem escreveu e discutir o conteúdo.'] },
    },
    {
      id: 'merge-e-sincronizacao', chapter: 'colaboracao', title: 'Integração feita. Atualize a sua cópia.',
      blocks: [
        { type: 'text', text: 'Combinem a integração e confira a opção de merge disponível no repositório. O GitHub pode oferecer merge commit, squash ou rebase.' },
        { type: 'code', code: 'git switch main\ngit pull --ff-only origin main\ngit log --oneline --graph --all\ngit status' },
        { type: 'activity', title: 'Checkpoint', text: 'Recarregue a página local. A mudança revisada chegou a main? Identifique a evidência.' },
      ],
      notes: { objective: 'Fechar o ciclo entre revisão remota e arquivos locais.', minutes: 5,
        demo: 'Quando disponível, usar Create a merge commit na demonstração para preservar os commits e mostrar dois pais. Depois atualizar main local.',
        pitfalls: ['Proteções de branch podem impedir merge; não tentar contorná-las.', 'Squash e rebase produzem outro formato de histórico.', 'Uma recusa de --ff-only pede inspeção; não é motivo para force.'] },
    },
    {
      id: 'desafio-dupla', chapter: 'colaboracao', title: 'Sua dupla fecha o ciclo.',
      blocks: [
        { type: 'activity', title: '8 minutos · agora sem acompanhar cada clique', text: 'Troquem os papéis e façam outra melhoria pequena.', items: ['Branch → edição → diff → add → commit.', 'Com acesso: push → PR → revisão → merge → pull.', 'Sem rede: proposta escrita → revisão em dupla → merge local.', 'Mostrem status limpo e expliquem o resultado.'] },
        { type: 'text', text: 'Travou? Registre o comando, a mensagem e o objetivo. Use o guia de diagnóstico e peça ajuda sem apagar o histórico.' },
      ],
      notes: { objective: 'Observar autonomia no fluxo e permitir participação com ou sem conta.', minutes: 8,
        demo: 'Circular sem ditar comandos. Pedir que a dupla aponte uma evidência por etapa; no caminho offline integrar a branch com git merge a partir de main.',
        pitfalls: ['Usar outro nome de branch, como melhoria-dupla-2.', 'Não exigir criação de conta ou convites durante a atividade.', 'Encerrar com evidência, não com uma corrida por botões.'] },
    },
    {
      id: 'revisao-mapa', chapter: 'revisao', title: 'Cada comando responde a uma pergunta.',
      blocks: [
        { type: 'list', items: ['Onde estou? status, branch e log.', 'O que mudou? diff e diff --staged.', 'O que vou registrar? add e commit.', 'Como combinar? switch e merge.', 'Como compartilhar? push, PR e pull.'] },
        { type: 'text', text: 'Observe → escolha → confira → registre. Consulte em vez de tentar decorar tudo.' },
      ],
      notes: { objective: 'Organizar os comandos por intenção e recuperar o mapa mental.', minutes: 3,
        demo: 'Abrir a consulta e pedir que a turma encontre um comando a partir de uma pergunta.',
        pitfalls: ['Saber consultar é parte da prática.', 'Repetir a diferença entre commit local e push.'] },
    },
    {
      id: 'quiz', chapter: 'revisao', title: 'Teste sua previsão, sem valer nota.',
      blocks: [
        { type: 'widget', widget: 'quiz' },
        { type: 'activity', title: 'Explique o porquê', text: 'Discuta uma resposta com a pessoa ao lado antes de conferir o feedback.' },
      ],
      notes: { objective: 'Identificar dúvidas restantes por meio de previsões de estado.', minutes: 5,
        demo: 'Responder ao quiz local e discutir staging, recuperação e colaboração. Usar as respostas para escolher uma retomada breve.',
        pitfalls: ['As respostas ficam nesta sessão; não há envio ou ranking.', 'Valorizar a justificativa, não a velocidade.'] },
    },
    {
      id: 'diagnosticar', chapter: 'revisao', title: 'Quando travar, preserve as pistas.',
      blocks: [
        { type: 'list', items: ['Confira a pasta e leia git status.', 'Copie o erro sem expor credenciais.', 'Diga o que queria fazer e qual foi o último passo.', 'Procure o caso no guia de diagnóstico; evite comandos de força.'] },
        { type: 'activity', title: 'Checkpoint', text: 'Preparou algo por engano? Desfazer um commit já compartilhado? Nomeie a ação segura para cada caso.' },
      ],
      notes: { objective: 'Consolidar um método de diagnóstico e recuperação.', minutes: 4,
        demo: 'Contrastar restore --staged com revert. Perguntar o que cada um preserva e retomar um erro frequente observado na turma.',
        pitfalls: ['Não colar tokens em pedidos de ajuda.', 'Com conflito ativo, inspecionar antes de executar outra operação.', 'Não descartar edições como primeira tentativa.'] },
    },
    {
      id: 'proximos-passos', chapter: 'revisao', title: 'Leve um hábito para o próximo projeto.',
      blocks: [
        { type: 'activity', title: 'Bilhete de saída', text: 'Complete: “Consigo explicar…”, “Quero praticar…” e “Meu próximo pequeno commit será…”.' },
        { type: 'text', text: 'Repita o exercício em uma pasta nova. Use os guias, a consulta de comandos e as referências oficiais que acompanham o material.' },
      ],
      notes: { objective: 'Encerrar com uma evidência de aprendizagem e uma prática futura concreta.', minutes: 3,
        demo: 'Ouvir duas respostas e indicar guides/exercicios.html, guides/diagnostico.html e REFERENCIAS.md no pacote.',
        pitfalls: ['Não prometer domínio completo de Git em três horas.', 'Agradecer as perguntas e manter o próximo passo pequeno.'] },
    },
  ];
  window.Oficina = { ...window.Oficina, slides };
}());
