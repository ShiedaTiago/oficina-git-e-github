(function () {
  'use strict';
  function gradeAnswer(question, choiceId) {
    return {correct: choiceId === question.correctId, explanation: question.explanation};
  }
  function mountQuiz(root, questions) {
    let answers = {};
    root.classList.add('learning-quiz');
    const score = document.createElement('p'); score.setAttribute('role', 'status');
    const form = document.createElement('div');
    const fields = questions.map((question, index) => {
      const field = document.createElement('fieldset');
      const legend = document.createElement('legend'); legend.textContent = `${index + 1}. ${question.prompt}`; field.append(legend);
      question.choices.forEach(choice => {
        const label = document.createElement('label');
        const radio = document.createElement('input'); radio.type = 'radio'; radio.name = `question-${question.id}`;
        radio.value = choice.id; radio.dataset.question = question.id;
        label.append(radio, document.createTextNode(choice.text)); field.append(label);
      });
      const feedback = document.createElement('p'); feedback.dataset.feedback = question.id; feedback.setAttribute('aria-live', 'polite');
      field.append(feedback); return field;
    });
    const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Reiniciar quiz';
    form.append(...fields); root.replaceChildren(score, form, reset);
    function updateScore() {
      const correct = questions.filter(q => answers[q.id] && gradeAnswer(q, answers[q.id]).correct).length;
      score.textContent = `${correct} de ${questions.length} respostas corretas. ${Object.keys(answers).length} respondidas.`;
    }
    function change(event) {
      const id = event.target.dataset.question;
      const question = questions.find(q => q.id === id);
      if (!question || !question.choices.some(c => c.id === event.target.value)) return;
      answers = {...answers, [id]:event.target.value};
      const result = gradeAnswer(question, event.target.value);
      const feedback = fields[questions.indexOf(question)].querySelector('[data-feedback]');
      feedback.textContent = `${result.correct ? 'Correto!' : 'Vamos revisar.'} ${result.explanation}`;
      updateScore();
    }
    function restart() {
      answers = {};
      form.querySelectorAll('input').forEach(input => { input.checked = false; });
      form.querySelectorAll('[data-feedback]').forEach(node => { node.textContent = ''; });
      updateScore(); form.querySelector('input')?.focus();
    }
    form.addEventListener('change', change); reset.addEventListener('click', restart); updateScore();
    return {destroy() { form.removeEventListener('change', change); reset.removeEventListener('click', restart); root.replaceChildren(); }};
  }
  function registerQuiz() {
    window.Oficina.registerWidget('quiz', root => {
      const mounted = mountQuiz(root, window.Oficina.questions);
      return () => mounted.destroy();
    });
  }
  window.Oficina = {...window.Oficina, gradeAnswer, mountQuiz, registerQuiz};
}());
