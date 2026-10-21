# Oficina de Git e GitHub

Site de apoio para uma oficina presencial de três horas voltada a pessoas iniciantes. A apresentação acompanha o percurso do primeiro repositório local até a colaboração no GitHub e funciona sem internet depois que o projeto é baixado.

## Conteúdo do projeto

- `index.html`: apresentação principal com navegação por slides;
- `guides/preparacao.html`: instalação e preparação para Windows e Linux;
- `guides/exercicios.html`: prática guiada com checkpoints e recuperação;
- `guides/diagnostico.html`: ajuda para problemas frequentes;
- `examples/site-da-turma/`: projeto fictício usado durante os exercícios;
- `ROTEIRO.md`: sequência e tempo sugerido para quem ministra a aula;
- `REFERENCIAS.md` e `CREDITOS.md`: fontes e atribuições.

## Abrir a oficina

O site não exige instalação nem conexão com a internet. Baixe ou clone o repositório e abra `index.html` em um navegador moderno.

No **Windows**, use o Explorador de Arquivos para abrir a pasta e dê dois cliques em `index.html`. Pelo PowerShell, execute:

```powershell
Start-Process .\index.html
```

No **Linux**, abra `index.html` pelo gerenciador de arquivos. Pelo terminal, execute:

```bash
xdg-open ./index.html
```

Use `←` e `→` para mudar de slide, `N` para mostrar as notas de aula, `/` para abrir a aba **Comandos Git** e `F` para alternar a tela cheia. A aba permite pesquisar, sem diferença entre maiúsculas, minúsculas ou acentos, todos os comandos e variantes usados na oficina. O catálogo e seus exemplos funcionam offline; os links para os manuais oficiais exigem conexão apenas quando forem abertos.

Ao passar o mouse ou focar com o teclado em qualquer linha de comando nos slides, na pesquisa ou nos guias, um balão explicativo flutuante apresenta a finalidade detalhada daquela instrução específica. A navegação mantém os botões "Anterior" e "Próximo" ancorados e estáveis em tela normal e em tela cheia.

## Desenvolvimento

Os testes exigem uma versão compatível do Node.js indicada em `package.json`.

```bash
npm install
npm test
npm run test:e2e
```

Na primeira execução dos testes de navegador, instale o Chromium do Playwright:

```bash
npx playwright install chromium
```

Consulte [TESTES.md](TESTES.md) para conhecer os cenários e os comandos de validação.

## Gerar o material para distribuição

Execute:

```bash
npm run package
```

O comando recria a pasta `dist/oficina-git-github` e o arquivo pronto para distribuição `dist/oficina-git-github.zip`. Ambos contêm a apresentação, os guias, o exemplo e a documentação. O empacotamento usa uma lista explícita de materiais públicos e recusa links simbólicos ou nomes associados a credenciais. Repositórios Git, dependências, arquivos `.env`, `.npmrc`, chaves, cobertura e relatórios de teste não são incluídos.

No **Windows**, o ZIP pode ser aberto ou copiado diretamente pelo Explorador de Arquivos:

```powershell
Start-Process .\dist
```

No **Linux**, abra a pasta de saída pelo gerenciador de arquivos ou confira o ZIP pelo terminal:

```bash
unzip -l ./dist/oficina-git-github.zip
```
