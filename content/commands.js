(function () {
  'use strict';
  const rows = [
    ['--version', 'Conferir a versão instalada do Git', 'git --version', 'Se não for encontrado, revise a instalação.'],
    ['show', 'Inspecionar um commit e suas alterações', 'git show HEAD', 'HEAD identifica o commit atual.'],
    ['restore', 'Retirar um arquivo do staging preservando as edições', 'git restore --staged index.html', 'Sem --staged, restore pode descartar alterações do arquivo de trabalho.'],
    ['revert', 'Desfazer um commit criando um novo registro', 'git revert --no-edit HEAD', 'Confira o commit antes; o histórico anterior é preservado.'],
    ['init', 'Iniciar um repositório local', 'git init', 'Execute dentro da pasta do projeto.'],
    ['config', 'Configurar a autoria dos commits', 'git config --global user.name "Seu Nome"', 'Configure também user.email. --global vale para seu usuário.'],
    ['status', 'Consultar alterações e preparação', 'git status', 'Leia antes de preparar ou confirmar alterações.'],
    ['diff', 'Comparar alterações ainda não preparadas', 'git diff', 'Use git diff --staged para ver o snapshot preparado.'],
    ['add', 'Preparar um snapshot de um arquivo', 'git add index.html', 'Editar depois exige um novo add para incluir a edição.'],
    ['commit', 'Registrar o snapshot preparado no histórico local', 'git commit -m "Adiciona apresentação"', 'Não envia arquivos ao GitHub.'],
    ['log', 'Consultar o histórico de commits', 'git log --oneline --graph --all', 'Cada commit tem um identificador próprio.'],
    ['branch', 'Listar branches locais', 'git branch', 'O asterisco indica a branch atual.'],
    ['switch', 'Trocar ou criar uma branch', 'git switch -c minha-melhoria', 'Use git switch main para voltar à principal.'],
    ['merge', 'Integrar uma branch na branch atual', 'git merge minha-melhoria', 'Confira a branch atual; conflitos exigem resolução.'],
    ['clone', 'Copiar um repositório remoto com seu histórico', 'git clone https://github.com/USUARIO/REPOSITORIO.git', 'Substitua USUARIO e REPOSITORIO pela URL real.'],
    ['remote', 'Consultar endereços dos repositórios remotos', 'git remote -v', 'Não compartilhe URLs que contenham credenciais.'],
    ['push', 'Enviar commits locais ao remoto', 'git push -u origin main', 'Requer acesso e autenticação; nunca envie segredos.'],
    ['pull', 'Buscar e integrar mudanças remotas', 'git pull --ff-only', 'Se houver divergência, pare e revise o histórico.'],
    ['fetch', 'Buscar o histórico remoto sem integrar', 'git fetch origin', 'Atualiza referências remotas, não seus arquivos de trabalho.']
  ];
  const commands = rows.map(([id, purpose, example, caution]) => ({id, name: `git ${id}`, purpose, example, caution}));
  window.Oficina = {...window.Oficina, commands};
}());

