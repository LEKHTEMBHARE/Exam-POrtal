const TEST_TIME = {
  mcq: 10,
  programming: 90
};

const testState = {
  currentIndex: 0,
  answers: {},
  expiredQuestions: {},
  startedAt: null,
  timerId: null,
  remainingTime: TEST_TIME.mcq,
  violationCount: 0,
  submitted: false,
  session: null
};

const timeWarningClass = 'warning';

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'index.html';
    return;
  }

  const savedSession = getCurrentSession();
  if (!savedSession) {
    window.location.href = 'student.html';
    return;
  }

  testState.session = savedSession;
  testState.currentIndex = Number(savedSession.currentIndex || 0);
  testState.answers = savedSession.answers || {};
  testState.expiredQuestions = savedSession.expiredQuestions || {};
  testState.startedAt = savedSession.startedAt || new Date().toISOString();
  testState.violationCount = Number(savedSession.violationCount || 0);
  testState.submitted = Boolean(savedSession.submitted);

  if (!testState.submitted && !document.fullscreenElement) {
    requestFullScreen();
  }

  bindNavigation();
  bindAntiCheat();
  renderQuestion();
});

function getCurrentSessionKey() {
  const user = getCurrentUser();
  return user ? `pythonExamSession_${user.email.toLowerCase()}` : null;
}

function getCurrentSession() {
  try {
    const key = getCurrentSessionKey();
    if (!key) return null;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function persistSession() {
  if (!testState.session) return;
  const key = getCurrentSessionKey();
  if (!key) return;
  testState.session.currentIndex = testState.currentIndex;
  testState.session.answers = testState.answers;
  testState.session.expiredQuestions = testState.expiredQuestions;
  testState.session.violationCount = testState.violationCount;
  testState.session.submitted = testState.submitted;
  localStorage.setItem(key, JSON.stringify(testState.session));
}

function getNextAvailableIndex(startIndex, direction) {
  if (!testState.session || !Array.isArray(testState.session.questions)) return null;
  const questionCount = testState.session.questions.length;
  let index = startIndex;

  while (index >= 0 && index < questionCount) {
    index += direction;
    if (index < 0 || index >= questionCount) {
      return null;
    }
    const question = testState.session.questions[index];
    if (question && !testState.expiredQuestions[question.id]) {
      return index;
    }
  }

  return null;
}

function getCurrentQuestion() {
  if (!testState.session || !Array.isArray(testState.session.questions)) return null;
  return testState.session.questions[testState.currentIndex] || null;
}

function isQuestionLocked(index) {
  const question = testState.session?.questions?.[index];
  if (!question) return false;
  return Boolean(testState.expiredQuestions[question.id]);
}

function bindNavigation() {
  document.getElementById('prevBtn')?.addEventListener('click', () => {
    if (testState.submitted) return;
    if (testState.currentIndex <= 0) return;

    let targetIndex = null;
    for (let i = testState.currentIndex - 1; i >= 0; i -= 1) {
      if (!isQuestionLocked(i)) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex !== null) {
      testState.currentIndex = targetIndex;
      persistSession();
      renderQuestion();
    }
  });

  document.getElementById('nextBtn')?.addEventListener('click', () => {
    if (testState.submitted) return;
    const nextIndex = getNextAvailableIndex(testState.currentIndex, 1);
    if (nextIndex !== null) {
      testState.currentIndex = nextIndex;
      persistSession();
      renderQuestion();
      return;
    }
    openSubmitModal();
  });

  document.getElementById('submitBtn')?.addEventListener('click', () => {
    openSubmitModal();
  });

  document.getElementById('cancelSubmitBtn')?.addEventListener('click', closeSubmitModal);
  document.getElementById('confirmSubmitBtn')?.addEventListener('click', () => {
    closeSubmitModal();
    submitTest();
  });
}

function renderQuestion() {
  const question = getCurrentQuestion();
  const questionNumberEl = document.getElementById('questionNumber');
  const progressTextEl = document.getElementById('progressText');
  const questionTextEl = document.getElementById('questionText');
  const questionMetaEl = document.getElementById('questionMeta');
  const optionsEl = document.getElementById('answerOptions');
  const programmingWrap = document.getElementById('programmingWrap');
  const btnPrev = document.getElementById('prevBtn');
  const btnNext = document.getElementById('nextBtn');

  if (!question) return;

  const currentPosition = testState.currentIndex + 1;
  const totalQuestions = testState.session.questions.length;
  questionNumberEl.textContent = `Question ${currentPosition} of ${totalQuestions}`;
  progressTextEl.textContent = `${currentPosition} / ${totalQuestions}`;
  questionTextEl.innerHTML = `${question.question}`;
  questionMetaEl.innerHTML = `<span>${question.topic}</span><span>${question.difficulty}</span><span>1 Mark</span>`;

  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    const percent = ((currentPosition / totalQuestions) * 100).toFixed(0);
    progressFill.style.width = `${percent}%`;
  }

  if (question.type === 'mcq') {
    programmingWrap.innerHTML = '';
    programmingWrap.classList.add('hidden');
    programmingWrap.style.display = 'none';
    optionsEl.innerHTML = '';
    optionsEl.classList.remove('hidden');
    optionsEl.style.display = 'grid';
    const selectedAnswer = testState.answers[question.id];
    optionsEl.innerHTML = question.options.map((option) => {
      const isSelected = String(selectedAnswer) === String(option);
      return `
        <button type="button" class="option-button ${isSelected ? 'selected' : ''}" data-option="${escapeHtml(option)}">
          <span class="option-letter">${String.fromCharCode(65 + question.options.indexOf(option))}</span>
          <span>${escapeHtml(option)}</span>
        </button>
      `;
    }).join('');

    optionsEl.querySelectorAll('.option-button').forEach((button) => {
      button.addEventListener('click', () => {
        if (testState.submitted || isQuestionLocked(testState.currentIndex)) return;
        const choice = button.dataset.option;
        testState.answers[question.id] = choice;
        persistSession();
        renderQuestionNavigation();
        renderQuestion();
      });
    });
  } else {
    optionsEl.innerHTML = '';
    optionsEl.classList.add('hidden');
    optionsEl.style.display = 'none';
    programmingWrap.classList.remove('hidden');
    programmingWrap.style.display = 'block';
    const currentCode = testState.answers[question.id] || '';
    programmingWrap.innerHTML = `
      <label class="program-label">Write your Python solution</label>
      <textarea id="programAnswer" spellcheck="false" placeholder="Enter your code here...">${escapeHtml(currentCode)}</textarea>
      <div class="program-hint">
        <strong>Expected concept:</strong> ${escapeHtml(question.expectedConcept)}
      </div>
    `;
    const textarea = document.getElementById('programAnswer');
    if (textarea) {
      textarea.value = currentCode;
      textarea.addEventListener('input', (event) => {
        if (testState.submitted || isQuestionLocked(testState.currentIndex)) return;
        testState.answers[question.id] = event.target.value;
        persistSession();
        renderQuestionNavigation();
      });
    }
  }

  renderQuestionNavigation();
  updatePaginationButtons(btnPrev, btnNext);
  startCurrentTimer();
}

function renderQuestionNavigation() {
  const nav = document.getElementById('questionNavigator');
  if (!nav) return;

  nav.innerHTML = testState.session.questions.map((question, index) => {
    const status = getQuestionStatus(index);
    const classes = ['nav-question'];
    if (status === 'current') classes.push('is-current');
    if (status === 'answered') classes.push('is-answered');
    if (status === 'unanswered') classes.push('is-unanswered');
    if (status === 'expired') classes.push('is-expired');

    return `<button type="button" class="${classes.join(' ')}" data-index="${index}" ${isQuestionLocked(index) ? 'disabled' : ''}>${index + 1}</button>`;
  }).join('');

  nav.querySelectorAll('.nav-question').forEach((button) => {
    button.addEventListener('click', () => {
      const idx = Number(button.dataset.index);
      if (Number.isNaN(idx) || idx < 0 || idx >= testState.session.questions.length) return;
      if (isQuestionLocked(idx)) return;
      testState.currentIndex = idx;
      persistSession();
      renderQuestion();
    });
  });
}

function getQuestionStatus(index) {
  const question = testState.session.questions[index];
  if (!question) return 'unanswered';
  if (testState.currentIndex === index) return 'current';
  if (isQuestionLocked(index)) return 'expired';
  if (Object.prototype.hasOwnProperty.call(testState.answers, question.id) && testState.answers[question.id] !== undefined && testState.answers[question.id] !== null && String(testState.answers[question.id]).trim() !== '') return 'answered';
  return 'unanswered';
}

function updatePaginationButtons(prevBtn, nextBtn) {
  if (!prevBtn || !nextBtn) return;
  prevBtn.disabled = testState.currentIndex === 0 || isQuestionLocked(testState.currentIndex - 1);
  const nextIndex = getNextAvailableIndex(testState.currentIndex, 1);
  nextBtn.textContent = nextIndex === null ? 'Submit Test' : 'Next';
}

function startCurrentTimer() {
  clearInterval(testState.timerId);

  const question = getCurrentQuestion();
  if (!question || testState.submitted || isQuestionLocked(testState.currentIndex)) {
    return;
  }

  testState.remainingTime = getTimeLimitForQuestion(question);
  const timerValue = document.getElementById('timerValue');
  if (timerValue) {
    timerValue.dataset.timeLeft = String(testState.remainingTime);
    timerValue.textContent = formatTime(testState.remainingTime);
    timerValue.classList.remove(timeWarningClass);
  }

  testState.timerId = setInterval(() => {
    if (testState.submitted) {
      clearInterval(testState.timerId);
      return;
    }

    if (isQuestionLocked(testState.currentIndex)) {
      clearInterval(testState.timerId);
      const nextIndex = getNextAvailableIndex(testState.currentIndex, 1);
      if (nextIndex !== null) {
        testState.currentIndex = nextIndex;
        persistSession();
        renderQuestion();
      }
      return;
    }

    testState.remainingTime -= 1;
    const timerValueEl = document.getElementById('timerValue');
    if (timerValueEl) {
      timerValueEl.dataset.timeLeft = String(testState.remainingTime);
      timerValueEl.textContent = formatTime(testState.remainingTime);
    }

    if (testState.remainingTime <= 3) {
      timerValueEl?.classList.add(timeWarningClass);
    }

    if (testState.remainingTime <= 0) {
      clearInterval(testState.timerId);
      handleQuestionTimeout();
    }
  }, 1000);
}

function getTimeLimitForQuestion(question) {
  if (!question) return TEST_TIME.mcq;
  return question.type === 'programming' ? TEST_TIME.programming : TEST_TIME.mcq;
}

function handleQuestionTimeout() {
  const question = getCurrentQuestion();
  if (!question || testState.submitted) return;

  testState.expiredQuestions[question.id] = true;
  testState.answers[question.id] = testState.answers[question.id] || null;
  persistSession();

  const timerValue = document.getElementById('timerValue');
  if (timerValue) {
    timerValue.textContent = '00:00';
  }

  const nextIndex = getNextAvailableIndex(testState.currentIndex, 1);
  if (nextIndex !== null) {
    testState.currentIndex = nextIndex;
    renderQuestion();
  } else {
    openSubmitModal();
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function requestFullScreen() {
  const root = document.documentElement;
  if (root.requestFullscreen) {
    root.requestFullscreen().catch(() => {
      showTestWarning('Please allow full-screen mode to continue the exam.');
    });
  }
}

function bindAntiCheat() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !testState.submitted) {
      registerViolation('Warning: Leaving the test window is not allowed.');
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && !testState.submitted) {
      registerViolation('Warning: Fullscreen mode was exited. Please return to fullscreen.');
      requestFullScreen();
    }
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const blockedKeys = ['c', 'v', 'x', 'u', 's', 'f12', 'i'];
    const ctrlCombo = event.ctrlKey && blockedKeys.includes(key);
    const isF12 = event.key === 'F12';
    const isInspect = event.ctrlKey && event.shiftKey && key === 'i';

    if (ctrlCombo || isF12 || isInspect) {
      event.preventDefault();
      registerViolation('Shortcut usage is disabled during the exam.');
    }
  });

  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  document.body.addEventListener('selectstart', (event) => {
    event.preventDefault();
  });

  window.addEventListener('pagehide', () => {
    if (!testState.submitted) {
      registerViolation('Warning: The test window was closed or navigated away from.');
    }
  });
}

function registerViolation(message) {
  const storedCount = Number(localStorage.getItem(window.PYTHON_EXAM.STORAGE_KEYS.violations) || '0');
  const nextCount = storedCount + 1;
  localStorage.setItem(window.PYTHON_EXAM.STORAGE_KEYS.violations, String(nextCount));
  testState.violationCount = nextCount;
  showTestWarning(`${message} Violation ${nextCount}/3.`);

  if (nextCount >= 3) {
    submitTest(true);
  }
}

function showTestWarning(message) {
  const warningBox = document.getElementById('testWarning');
  if (!warningBox) return;
  warningBox.textContent = message;
  warningBox.style.display = 'block';
}

function openSubmitModal() {
  const modal = document.getElementById('submitModal');
  if (!modal) return;
  const answered = Object.keys(testState.answers).filter((key) => {
    const value = testState.answers[key];
    return value !== undefined && value !== null && String(value).trim() !== '';
  }).length;
  const total = testState.session.questions.length;
  const remaining = total - answered;
  document.getElementById('attemptedCount').textContent = answered;
  document.getElementById('remainingCount').textContent = remaining;
  document.getElementById('unattemptedCount').textContent = remaining;
  modal.classList.add('show');
}

function closeSubmitModal() {
  const modal = document.getElementById('submitModal');
  if (modal) modal.classList.remove('show');
}

function submitTest(force = false) {
  if (testState.submitted && !force) return;

  clearInterval(testState.timerId);
  testState.submitted = true;
  persistSession();

  const currentUser = getCurrentUser();
  const result = calculateResult();
  const resultsMap = JSON.parse(localStorage.getItem(window.PYTHON_EXAM.STORAGE_KEYS.results) || '{}');
  const key = (currentUser?.email || 'student').toLowerCase();
  const existing = Array.isArray(resultsMap[key]) ? resultsMap[key] : [];
  existing.push(result);
  resultsMap[key] = existing;

  localStorage.setItem(window.PYTHON_EXAM.STORAGE_KEYS.results, JSON.stringify(resultsMap));
  localStorage.setItem(window.PYTHON_EXAM.STORAGE_KEYS.lastResult, JSON.stringify(result));
  window.location.href = 'result.html';
}

function evaluateProgrammingAnswer(question, codeText) {
  const normalized = String(codeText || '').toLowerCase();
  if (!normalized.trim()) return { correct: false, status: 'Unattempted' };

  if (question.question.toLowerCase().includes('even or odd')) {
    const valid = normalized.includes('% 2') || normalized.includes('%2') || normalized.includes('mod') || normalized.includes('divisible');
    const hasIf = normalized.includes('if') || normalized.includes('elif');
    return { correct: valid && hasIf, status: valid && hasIf ? 'Correct' : 'Wrong' };
  }

  if (question.question.toLowerCase().includes('sum of numbers in a list')) {
    const hasLoop = normalized.includes('for ') || normalized.includes('while') || normalized.includes('sum(');
    const hasTotal = normalized.includes('total') || normalized.includes('sum');
    return { correct: hasLoop && hasTotal, status: hasLoop && hasTotal ? 'Correct' : 'Wrong' };
  }

  return { correct: false, status: 'Wrong' };
}

function calculateResult() {
  const currentUser = getCurrentUser();
  const session = testState.session || getCurrentSession();
  const review = (session.questions || []).map((question) => {
    const studentAnswer = session.answers[question.id];

    if (question.type === 'mcq') {
      const hasAnswer = studentAnswer !== undefined && studentAnswer !== null && String(studentAnswer).trim() !== '';
      const isCorrect = hasAnswer && String(studentAnswer) === String(question.correctAnswer);
      const status = hasAnswer ? (isCorrect ? 'Correct' : 'Wrong') : 'Unattempted';

      return {
        id: question.id,
        sessionId: question.sessionId,
        type: question.type,
        question: question.question,
        studentAnswer: hasAnswer ? String(studentAnswer) : 'No answer',
        correctAnswer: String(question.correctAnswer),
        status,
        explanation: question.explanation,
        topic: question.topic,
        difficulty: question.difficulty,
        marks: question.marks || 1
      };
    }

    const evaluation = evaluateProgrammingAnswer(question, studentAnswer);
    return {
      id: question.id,
      sessionId: question.sessionId,
      type: question.type,
      question: question.question,
      studentAnswer: typeof studentAnswer === 'string' ? studentAnswer : 'No answer',
      correctAnswer: question.expectedConcept,
      status: evaluation.status,
      explanation: question.expectedConcept,
      topic: question.topic,
      difficulty: question.difficulty,
      marks: question.marks || 1,
      evaluationStatus: evaluation.status
    };
  });

  const correct = review.filter((item) => item.status === 'Correct').length;
  const wrong = review.filter((item) => item.status === 'Wrong').length;
  const attempted = review.filter((item) => item.status !== 'Unattempted').length;
  const unattempted = review.filter((item) => item.status === 'Unattempted').length;
  const score = correct;
  const percentage = review.length ? Math.round((score / review.length) * 100) : 0;

  return {
    studentId: currentUser?.email || session.studentEmail || 'unknown',
    studentName: currentUser?.name || session.studentName || 'Student',
    studentEmail: currentUser?.email || session.studentEmail || 'unknown',
    questionSet: (session.questions || []).map((question) => ({ id: question.id, question: question.question, type: question.type, topic: question.topic })),
    answers: session.answers || {},
    correctAnswers: correct,
    wrongAnswers: wrong,
    unattempted,
    attempted,
    score,
    percentage,
    violations: Number(localStorage.getItem(window.PYTHON_EXAM.STORAGE_KEYS.violations) || 0),
    submittedAt: new Date().toISOString(),
    status: 'Completed',
    review
  };
}

window.testState = testState;
