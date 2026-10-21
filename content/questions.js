(function () {
  'use strict';
  const rows = [
    ['snapshot', 'Você editou um arquivo depois de git add. O que entra no próximo commit?', 'A versão preparada pelo add', 'Todas as edições mais recentes', 'O staging guarda um snapshot. Execute add novamente para preparar a nova edição.'],
    ['local', 'Um commit envia automaticamente arquivos ao GitHub?', 'Não, registra o histórico local', 'Sim, sempre envia à internet', 'Commit é local. Push é a ação que envia commits a um remoto.'],
    ['branch', 'O que uma branch representa?', 'Uma referência móvel para um commit', 'Uma segunda pasta obrigatória', 'Branches apontam para commits; permitem desenvolver caminhos de histórico separados.'],
    ['conflict', 'Como tratar um conflito de merge?', 'Revisar o conteúdo, resolver e preparar os arquivos', 'Apagar todos os arquivos do projeto', 'Escolha o conteúdo correto, remova os marcadores, teste, execute add e conclua o merge.'],
    ['remote', 'Qual a diferença entre Git e GitHub?', 'Git controla versões; GitHub hospeda repositórios e colaboração', 'São o mesmo programa', 'Git funciona localmente e offline. GitHub é um serviço que pode hospedar repositórios Git.'],
    ['review', 'O que uma pull request permite?', 'Discutir e revisar mudanças antes da integração', 'Enviar senhas com segurança no código', 'Uma pull request organiza revisão e discussão. Ela não substitui cuidados com segredos ou testes.']
  ];
  const questions = rows.map(([id, prompt, right, wrong, explanation], index) => ({id, prompt, choices:index % 2 ? [{id:'a',text:wrong},{id:'b',text:right}] : [{id:'a',text:right},{id:'b',text:wrong}], correctId:index % 2 ? 'b' : 'a', explanation}));
  window.Oficina = {...window.Oficina, questions};
}());

