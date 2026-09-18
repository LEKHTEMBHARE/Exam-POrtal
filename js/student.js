document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.role !== 'student') {
    window.location.href = 'index.html';
    return;
  }

  const nameLabel = document.querySelector('[data-student-name]');
  if (nameLabel) {
    nameLabel.textContent = currentUser.name;
  }

  const syllabusList = document.getElementById('syllabusList');
  if (syllabusList) {
    syllabusList.innerHTML = window.PYTHON_EXAM.SYLLABUS_TOPICS.slice(0, 10).map((topic) => `<li>${topic}</li>`).join('');
  }

  const startButton = document.getElementById('startTestBtn');
  if (startButton) {
    startButton.addEventListener('click', async () => {
      const sessionKey = `pythonExamSession_${currentUser.email.toLowerCase()}`;
      const questionSet = window.PYTHON_EXAM.generateQuestionSetForStudent(currentUser.email);
      const session = {
        studentId: currentUser.email,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        startedAt: new Date().toISOString(),
        currentIndex: 0,
        answers: {},
        expiredQuestions: {},
        violationCount: 0,
        submitted: false,
        questions: questionSet,
        totalQuestions: questionSet.length,
        questionSet: questionSet.map((question) => ({ id: question.id, question: question.question, type: question.type, topic: question.topic }))
      };

      localStorage.setItem(sessionKey, JSON.stringify(session));
      localStorage.setItem(window.PYTHON_EXAM.STORAGE_KEYS.attempt, JSON.stringify({ sessionKey }));
      localStorage.setItem(window.PYTHON_EXAM.STORAGE_KEYS.violations, '0');

      try {
        if (document.documentElement.requestFullscreen && document.fullscreenElement === null) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.warn('Fullscreen request blocked:', error);
      }

      window.location.href = 'test.html';
    });
  }
});
