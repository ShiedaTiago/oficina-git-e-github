# Testes e validação

## Preparação

Instale as dependências e o navegador usado pelos testes E2E:

```bash
npm install
npx playwright install chromium
```

Os comandos são iguais no PowerShell do Windows e em terminais Linux. Em ambientes Windows que bloqueiam scripts do PowerShell, use `npm.cmd` e `npx.cmd` no lugar de `npm` e `npx`.

## Testes unitários e de integração

```bash
npm test
```

Esses testes validam navegação, conteúdo, histórico, área de preparação, modelo de staging, ferramentas de consulta e materiais práticos.

Para conferir a cobertura:

```bash
npm run test:coverage
```

## Testes de navegador

```bash
npm run test:e2e
```

O Playwright valida:

- apresentação em viewport desktop e mobile, sem rolagem horizontal;
- navegação, notas e referência por teclado;
- respeito à preferência de movimento reduzido;
- geração da pasta e do ZIP somente com os materiais públicos previstos e conteúdo idêntico;
- abertura da apresentação, do guia e do exemplo com a rede bloqueada.

Para executar um perfil isoladamente:

```bash
npx playwright test --project=desktop
npx playwright test --project=mobile
npx playwright test --project=offline
```

## Verificação dos exercícios de Git

```bash
npm run test:git
```

Esse roteiro cria um repositório temporário e exercita o fluxo de Git usado na oficina. Ele exige que o comando `git` esteja disponível no terminal.

## Empacotamento

```bash
npm run package
```

Os resultados ficam em `dist/oficina-git-github` e `dist/oficina-git-github.zip`. A pasta e o ZIP são recriados pelo script e não devem ser versionados.

## Evidências da entrega

Verificação executada em 21/10/2026 no Windows (`win32`), com Node.js 24.15.0, npm 11.12.1, Git 2.54.0 e Chromium do Playwright:

- testes unitários e de integração: 92 aprovados;
- cobertura: 97,75% de statements, 88,39% de branches, 99,17% de funções e 99,70% de linhas;
- testes E2E: 17 aprovados nos perfis desktop, mobile e offline;
- verificador Git: aprovado para snapshot, staging, revert, branches, conflito, merge e sincronização com remoto local;
- empacotamento: pasta e ZIP com 33 arquivos públicos, conteúdo idêntico e ZIP reproduzível;
- auditoria de dependências: nenhuma vulnerabilidade conhecida encontrada.

O verificador Git usa um remoto local temporário. Operações reais no GitHub, autenticação, convites e pull requests permanecem atividades orientadas da aula e não são automatizadas.
