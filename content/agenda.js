(function () {
  'use strict';
  const agenda = [
    { id: 'fundamentos', title: 'Por que versionar?', minutes: 15 },
    { id: 'preparacao', title: 'Preparar o ambiente', minutes: 20 },
    { id: 'primeiros-commits', title: 'Do arquivo ao commit', minutes: 35 },
    { id: 'intervalo', title: 'Intervalo', minutes: 10 },
    { id: 'branches', title: 'Branches e integração', minutes: 30 },
    { id: 'remotos', title: 'Conectar ao GitHub', minutes: 20 },
    { id: 'colaboracao', title: 'Colaborar com pull requests', minutes: 35 },
    { id: 'revisao', title: 'Revisar e seguir praticando', minutes: 15 },
  ];
  window.Oficina = { ...window.Oficina, agenda };
}());
