# Referências técnicas

Consulta em **20 de outubro de 2026**. As explicações e diagramas da oficina são redação original em português brasileiro. Os links abaixo permitem verificar os conceitos e repetir os exercícios; consultar a versão do manual correspondente ao Git instalado quando houver diferença. O produto não carrega estes sites para funcionar.

## Git — conceitos e comandos

| Fonte oficial | Assunto conferido e aplicação na oficina |
| --- | --- |
| [Pro Git: What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F) | Snapshots, operações locais e estados de trabalho/staging/histórico; modelo conceitual de abertura. |
| [Instalação no Windows](https://git-scm.com/install/windows) e [no Linux](https://git-scm.com/install/linux) | Instaladores e gerenciadores por distribuição; separar os caminhos de preparação. |
| [git-config](https://git-scm.com/docs/git-config) | `user.name`, `user.email` e escopo global; autoria não é autenticação. |
| [git-init](https://git-scm.com/docs/git-init) | `-b main` escolhe a branch inicial (disponível desde 2.28). |
| [git-add](https://git-scm.com/docs/git-add) | Captura conteúdo no index/staging naquele momento; nova edição requer novo add para entrar no snapshot preparado. |
| [git-diff](https://git-scm.com/docs/git-diff) | Comparação trabalho/index; `--staged` compara index/HEAD. |
| [git-commit](https://git-scm.com/docs/git-commit) e [git-log](https://git-scm.com/docs/git-log) | Registro preparado, mensagem `-m`, leitura `--oneline --graph --all`. |
| [git-restore](https://git-scm.com/docs/git-restore) | `--staged` atua apenas no index e usa HEAD por padrão; sem opção atua no trabalho e pode descartar edições. A prática pressupõe HEAD existente. |
| [git-revert](https://git-scm.com/docs/git-revert) | Registra um novo commit inverso, preservando o histórico. Usar trabalho limpo; exemplo restrito ao último commit simples. |
| [git-switch](https://git-scm.com/docs/git-switch) | `-c` cria e seleciona uma branch; alternância pode ser impedida para proteger mudanças. |
| [git-merge](https://git-scm.com/docs/git-merge) | Fast-forward, merge com dois pais, marcadores de conflito e `--abort`; iniciar com trabalho limpo. |
| [git-clone](https://git-scm.com/docs/git-clone) | Nova cópia em uma nova pasta; não é atualização da pasta atual. |
| [git-fetch](https://git-scm.com/docs/git-fetch) | Recebe objetos e atualiza referências de acompanhamento remotas locais. |
| [git-pull](https://git-scm.com/docs/git-pull) | Fetch seguido de integração; modos merge/rebase podem conflitar. `--ff-only` explícito recusa divergência e mantém o exercício previsível entre versões/configurações. |
| [git-push](https://git-scm.com/docs/git-push) | Envio de commits e atualização de referências remotas; `-u` configura acompanhamento. |

## GitHub — acesso e colaboração

| Fonte oficial | Assunto conferido e aplicação na oficina |
| --- | --- |
| [Credenciais HTTPS no Git](https://docs.github.com/pt/get-started/git-basics/caching-your-github-credentials-in-git) | GitHub recomenda GitHub CLI ou GCM; `gh auth login`, HTTPS e autenticação no navegador. Git for Windows inclui GCM. |
| [Autenticação no GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github) | Separação entre sessão web, acesso Git e credenciais; senha da conta não autentica operações Git HTTPS. |
| [E-mail dos commits](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address) | Configuração de autoria e endereço noreply para privacidade. |
| [Adicionar código local ao GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github) | Criar remoto vazio, sem README/licença/gitignore inicial, conferir URL e enviar main. |
| [Referência de pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests) | Proposta, discussão, revisão e integração. PR é recurso do GitHub; `git pull` é comando Git. |

## Licenças e decisões de uso

- [Pro Git, 2ª edição](https://git-scm.com/book/en/v2), de Scott Chacon e Ben Straub: a página informa **CC BY-NC-SA 3.0**. Usado como fonte conceitual, sem copiar figuras, trechos ou código do livro. Não presumir que a licença do programa Git seja a licença do livro.
- [Licença do repositório GitHub Docs](https://github.com/github/docs/blob/main/LICENSE): **Creative Commons Attribution 4.0 International**. Usado para conferir fatos e fluxos; os slides não reproduzem capturas ou trechos da documentação.
- Manuais Git: consulta técnica dos comandos, sem incorporar seus textos, desenhos ou arquivos ao pacote. Se uma futura edição copiar conteúdo, conferir a licença do arquivo específico antes de incorporar.
- Referência de organização didática: [oficina-docker-ifrs](https://github.com/JoaoLucasDaSilvaOliveira/oficina-docker-ifrs). A premissa de slides, notas, prática e consulta inspirou a experiência; nenhum arquivo, imagem ou código desse projeto foi reutilizado. Não é fonte para comandos Git.

Detalhes de atribuição estão em [CREDITOS.md](CREDITOS.md). Links externos exigem conexão; os arquivos locais da oficina permanecem utilizáveis sem ela.
