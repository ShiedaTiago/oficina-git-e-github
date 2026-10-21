# Git e GitHub, na prática — roteiro de facilitação

Oficina de **180 minutos**, para iniciantes absolutos. Os 37 slides deixam os passos essenciais na projeção; as notas (tecla **N**) explicam objetivo, tempo, demonstração e dificuldades. Cada tempo já inclui explicação, prática e checkpoint. Não acrescente uma segunda contagem para os exercícios.

## Antes da aula

Envie [o guia de preparação](guides/preparacao.html) e o pacote completo com antecedência. Peça um computador com navegador e editor de texto, Git instalado e permissão para trabalhar em uma pasta própria. Windows usa **Git Bash**; Linux usa o terminal da distribuição. A trilha requer Git 2.28 ou superior para `init -b`; a preparação deve recomendar uma versão atual suportada.

Peça que a turma teste `git --version`, abra o editor e localize o projeto inicial em `examples/site-da-turma`. Para a parte remota, orientar criação da conta, acesso ao e-mail, 2FA quando exigido e autenticação HTTPS por Git Credential Manager (GCM) ou GitHub CLI. Essas etapas devem estar majoritariamente prontas: os 20 minutos iniciais de preparação são conferência e suporte. Git for Windows inclui GCM; no Linux, seguir a instalação específica da ferramenta escolhida. Não usar a senha da conta como senha de operações Git por HTTPS.

Cada pessoa escolhe nome/e-mail de autoria e informações fictícias ou que aceite compartilhar. Explique antes que commits retêm autoria e conteúdo; excluir um arquivo depois não remove o conteúdo do histórico. O endereço noreply da conta é uma opção de privacidade. Computadores compartilhados usam configuração local depois de `init`, sem `--global`.

Prepare sua própria cópia limpa do exemplo, a apresentação aberta em `index.html`, guias e uma conta de demonstração previamente autorizada. Não faça demonstrações em dados pessoais da turma. Se houver GitHub na aula, reserve um repositório vazio: sem README, licença ou .gitignore remoto inicial, pois a base já vem da máquina. A publicação real do estudante é uma escolha consciente; a apresentação não acessa contas.

## Agenda fechada

| Minutos da aula | Bloco | Duração | Evidência de aprendizagem |
| --- | --- | --- | --- |
| 00–15 | Fundamentos | 15 min | Explica Git local, GitHub remoto e os três estados |
| 15–35 | Preparação | 20 min | Terminal, editor e navegador abrem a mesma pasta |
| 35–70 | Primeiros commits | 35 min | Dois commits, diffs interpretados e recuperação segura |
| 70–80 | Intervalo | 10 min | Pausa real, sem conteúdo novo |
| 80–110 | Branches | 30 min | Branch criada, merge inspecionado e conflito resolvido |
| 110–130 | Remotos | 20 min | Reconhece clone, push, fetch e pull |
| 130–165 | Colaboração | 35 min | Proposta revisada e integrada, com alternativa local |
| 165–180 | Revisão | 15 min | Justifica respostas e escolhe próximo passo |

## Distribuição por slide

Estes tempos são a distribuição da agenda acima. A facilitação pode mover minutos entre slides do mesmo bloco conforme o grupo; preserve o total de cada bloco e a pausa.

| Bloco | IDs dos slides e minutos |
| --- | --- |
| Fundamentos · 15 | `inicio` 3 · `por-que-versionar` 4 · `git-e-github` 4 · `tres-lugares` 4 |
| Preparação · 20 | `preparar` 3 · `terminal-e-pasta` 5 · `identidade` 5 · `prontos-para-comecar` 7 |
| Commits · 35 | `primeiro-repositorio` 4 · `primeiro-commit` 4 · `ler-diferencas` 5 · `snapshot-preparado` 6 · `segundo-commit` 5 · `tirar-do-staging` 5 · `desfazer-com-historico` 6 |
| Intervalo · 10 | `intervalo` 10 |
| Branches · 30 | `branch-e-head` 4 · `criar-branch` 5 · `navegar-historico` 6 · `integrar-branch` 4 · `conflitos` 5 · `pratica-branches` 6 |
| Remotos · 20 | `remoto` 4 · `https-e-acesso` 5 · `primeiro-push` 5 · `clone-e-pull` 6 |
| Colaboração · 35 | `fluxo-de-colaboracao` 3 · `combinar-a-dupla` 4 · `enviar-uma-branch` 5 · `abrir-pr` 5 · `revisar-pr` 5 · `merge-e-sincronizacao` 5 · `desafio-dupla` 8 |
| Revisão · 15 | `revisao-mapa` 3 · `quiz` 5 · `diagnosticar` 4 · `proximos-passos` 3 |

## Condução dos blocos

**Fundamentos.** Comece por uma situação de perda de versão. Use três lugares (trabalho, staging, histórico) como modelo recorrente. Peça previsões em voz alta antes dos comandos. Git registra snapshots por escolha; não salva automaticamente cada tecla e não faz envio ao GitHub durante um commit.

**Preparação.** Selecione o sistema e evite ler comandos de instalação dos dois caminhos para todos. Mostre a equivalência da pasta no terminal e no editor. `pwd`, `ls` e `cd` são para Git Bash/terminal Linux. Não há dependência de PowerShell. Quem já está pronto ajuda alguém a conferir o ambiente; não assuma o teclado da pessoa. Quem não consegue instalar trabalha em dupla ou nas simulações.

**Commits.** Faça a base com `index.html`, `styles.css` e `README.md`. Edite o título, salve e leia os dois diffs. Na simulação, prepare uma versão e edite novamente para tornar visível o snapshot do staging. O segundo commit confirma esse entendimento. Para o exercício de `restore --staged`, use um arquivo já rastreado e HEAD existente; preserve a edição no trabalho, prepare-a novamente e faça um commit antes de seguir. Para `revert`, comece com status limpo e escolha somente o último commit simples do exercício. `--no-edit` evita abrir um editor de mensagem. Não use `reset --hard`, descarte de arquivos, rebase ou push forçado para “consertar” a atividade.

**Intervalo.** Anuncie o horário de volta e respeite dez minutos completos. Reúna dúvidas sem transformar a pausa em aula obrigatória.

**Branches.** Crie uma mudança pequena em `melhoria-descricao`, alterne branches e recarregue a página. Integre em main. Nesse fluxo, main não avançou: é esperado fast-forward. Use o grafo interativo para mostrar caminhos divergentes e o merge com dois pais, mantendo todos os commits anteriores. O conflito real controlado segue [o guia de exercícios](guides/exercicios.html): duas branches mudam a mesma linha a partir da mesma base; a dupla lê os dois lados, escolhe um resultado, remove marcadores, salva, testa a página, prepara e conclui o merge. Mostre também a simulação. Se faltar instalação ou tempo, pratique a decisão na simulação e preserve o guia para repetir depois. `merge --abort` serve para um merge em andamento; iniciar com trabalho limpo facilita a recuperação.

**Remotos.** Use um diagrama com duas localizações, não uma pasta mágica “na nuvem”. `origin/main` é uma referência local do estado remoto conhecido, atualizada pela sincronização; não é leitura ao vivo. `clone` cria nova pasta, `fetch` recebe dados e `pull` recebe e integra. O exercício usa `pull --ff-only` explicitamente: não cria merge em histórico divergente e deve parar para diagnóstico nesse caso. Outros modos de pull podem resultar em conflito. No primeiro push, confirmar autoria, acesso, endereço e visibilidade. Nunca pedir tokens ou códigos na projeção. Quem estiver sem rede acompanha e conserva os commits locais.

**Colaboração.** Combine uma melhoria pequena. No fluxo central, A mantém o repositório e decide convidar B como colaboradora; B aceita na própria conta e clona em nova pasta. O [guia de exercícios](guides/exercicios.html) fornece passos e resultados por papel. Se o acesso já existir, pular convite e aceite. B cria uma branch, edita, confere, faz commit, push e PR para main; A revisa o diff e a página. Um ajuste vira novo commit e push na mesma branch. Combinem a integração e atualizem main local. Quando disponível, escolha merge commit na demonstração para relacionar com os dois pais; explique que squash/rebase geram outro desenho. Não contorne proteções ou permissões. Troquem os papéis na segunda rodada e usem outro nome, como `melhoria-dupla-2`.

Sem conta, sem permissão, sem rede ou sem desejo de enviar dados, a dupla trabalha no mesmo computador: branch e commit local, proposta escrita, revisão lado a lado e merge local a partir de main. Isso exercita a decisão colaborativa; abrir um PR real fica como repetição posterior. O professor não deve criar contas, enviar convites, publicar ou alterar permissões para validar a oficina sem autorização específica de quem controla a conta.

**Revisão.** O quiz local verifica previsões, não velocidade. Peça justificativas para `add` seguido de nova edição, `restore --staged`, `revert` e PR versus pull. Termine com um bilhete de saída e uma pequena melhoria que cada pessoa consegue registrar depois. Retome o [guia de diagnóstico](guides/diagnostico.html) e a [lista de fontes oficiais](REFERENCIAS.md).

## Ritmo, acessibilidade e limites

Leia os comandos em voz alta, descreva os estados sem depender só de cor e dê tempo para salvar e observar resultados. Oriente a abrir a consulta em vez de decorar. Os controles e campos das atividades mantêm seus próprios atalhos; use a navegação fora deles. Em telas menores, o conteúdo pode rolar; projeção prioriza títulos e passos curtos.

A apresentação e simulações funcionam localmente e offline. Abrir links, instalar ferramentas, autenticar e usar GitHub são atividades externas com internet. Simulações são didáticas: não executam Git nem alteram arquivos ou contas. Não há avaliação remota ou coleta de respostas. O estado interativo reinicia ao recarregar a página.

As fontes foram conferidas em 20/10/2026. Antes de outra turma, confira os links, a autenticação e a interface do GitHub; não dependa de um botão permanecer na mesma posição.
