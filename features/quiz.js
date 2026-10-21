(function () {
  'use strict';
  function gradeAnswer(question, choiceId) {
    return {correct: choiceId === question.correctId, explanation: question.explanation};
  }
  function mountQuiz(root, questions) {
    let answers = {};
    let index = 0;
    root.classList.add('learning-quiz');
    const score = document.createElement('p'); score.setAttribute('role', 'status');
    const progress = document.createElement('p'); progress.dataset.quizProgress = ''; progress.className = 'quiz-progress';
    const form = document.createElement('div');
    const previous = document.createElement('button'); previous.type = 'button'; previous.textContent = '← Pergunta anterior'; previous.dataset.quizAction = 'previous';
    const next = document.createElement('button'); next.type = 'button'; next.textContent = 'Próxima pergunta →'; next.dataset.quizAction = 'next';
    const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = 'Reiniciar quiz'; reset.dataset.quizAction = 'reset';
    const controls = document.createElement('div'); controls.className = 'quiz-controls'; controls.append(previous, next, reset);
    root.replaceChildren(score, progress, form, controls);

    function createField(question) {
      const field = document.createElement('fieldset');
      const legend = document.createElement('legend'); legend.textContent = `${index + 1}. ${question.prompt}`; field.append(legend);
      question.choices.forEach(choice => {
        const label = document.createElement('label');
        const radio = document.createElement('input'); radio.type = 'radio'; radio.name = `question-${question.id}`;
        radio.value = choice.id; radio.dataset.question = question.id;
        radio.checked = answers[question.id] === choice.id;
        label.append(radio, document.createTextNode(choice.text)); field.append(label);
      });
      const feedback = document.createElement('p'); feedback.dataset.feedback = question.id; feedback.setAttribute('aria-live', 'polite');
      if (answers[question.id]) {
        const result = gradeAnswer(question, answers[question.id]);
        feedback.textContent = `${result.correct ? 'Correto!' : 'Vamos revisar.'} ${result.explanation}`;
      }
      field.append(feedback);
      return field;
    }

    function renderQuestion(focus = false) {
      const question = questions[index];
      form.replaceChildren(question ? createField(question) : document.createTextNode('Nenhuma pergunta disponível.'));
      progress.textContent = questions.length ? `Pergunta ${index + 1} de ${questions.length}` : 'Quiz vazio';
      previous.disabled = index === 0;
      next.disabled = !questions.length || index === questions.length - 1;
      if (focus) form.querySelector('input')?.focus();
    }
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
      const feedback = form.querySelector('[data-feedback]');
      feedback.textContent = `${result.correct ? 'Correto!' : 'Vamos revisar.'} ${result.explanation}`;
      updateScore();
    }
    function restart() {
      answers = {};
      index = 0;
      updateScore(); renderQuestion(true);
    }
    function navigate(event) {
      const action = event.target.closest('[data-quiz-action]')?.dataset.quizAction;
      if (action === 'reset') restart();
      if (action === 'previous' && index > 0) { index -= 1; renderQuestion(true); }
      if (action === 'next' && index < questions.length - 1) { index += 1; renderQuestion(true); }
    }
    form.addEventListener('change', change); controls.addEventListener('click', navigate); updateScore(); renderQuestion();
    return {destroy() { form.removeEventListener('change', change); controls.removeEventListener('click', navigate); root.replaceChildren(); }};
  }
  function registerQuiz() {
    window.Oficina.registerWidget('quiz', root => {
      const mounted = mountQuiz(root, window.Oficina.questions);
      return () => mounted.destroy();
    });
  }
  window.Oficina = {...window.Oficina, gradeAnswer, mountQuiz, registerQuiz};
}());
