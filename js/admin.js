document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  bindAdminTabs();
  loadAdminDashboard();
});

function bindAdminTabs() {
  document.querySelectorAll('.admin-tab').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.section;
      document.querySelectorAll('.admin-tab').forEach((tab) => tab.classList.toggle('active', tab === button));
      document.querySelectorAll('.admin-section').forEach((section) => {
        const isTarget = section.id === `${target}Section`;
        section.classList.toggle('active-section', isTarget);
        section.classList.toggle('hidden-section', !isTarget);
      });
    });
  });
}

function loadAdminDashboard() {
  const resultStore = JSON.parse(localStorage.getItem(window.PYTHON_EXAM.STORAGE_KEYS.results) || '{}');
  const feedbackStore = JSON.parse(localStorage.getItem(window.PYTHON_EXAM.STORAGE_KEYS.feedback) || '[]');
  const students = Object.entries(resultStore)
    .map(([email, attempts]) => {
      const latest = Array.isArray(attempts) ? attempts[attempts.length - 1] : null;
      return latest ? { email, ...latest } : null;
    })
    .filter(Boolean);

  const totalStudents = document.getElementById('totalStudents');
  const testsCompleted = document.getElementById('testsCompleted');
  const averageScore = document.getElementById('averageScore');
  const highestScore = document.getElementById('highestScore');
  const averagePercentage = document.getElementById('averagePercentage');

  const scores = students.map((student) => Number(student.score || 0));
  const percentages = students.map((student) => Number(student.percentage || 0));
  const total = students.length;

  if (totalStudents) totalStudents.textContent = String(total || 0);
  if (testsCompleted) testsCompleted.textContent = String(total || 0);
  if (averageScore) averageScore.textContent = String(total ? (scores.reduce((a, b) => a + b, 0) / total).toFixed(1) : 0);
  if (highestScore) highestScore.textContent = String(total ? Math.max(...scores) : 0);
  if (averagePercentage) averagePercentage.textContent = `${total ? Math.round(percentages.reduce((a, b) => a + b, 0) / total) : 0}%`;

  const studentResults = document.getElementById('studentResults');
  if (studentResults) {
    if (students.length === 0) {
      studentResults.innerHTML = '<p>No student results yet.</p>';
    } else {
      studentResults.innerHTML = students.map((student) => `
        <article class="student-result-card">
          <div class="student-card-header">
            <h3>${escapeHtml(student.studentName || 'Student')}</h3>
            <span class="status-pill ${student.status === 'Completed' ? 'correct' : 'unattempted'}">${escapeHtml(student.status || 'Completed')}</span>
          </div>
          <div class="student-metrics">
            <div><span>Name</span><strong>${escapeHtml(student.studentName || 'Student')}</strong></div>
            <div><span>Email</span><strong>${escapeHtml(student.studentEmail || student.email)}</strong></div>
            <div><span>Score</span><strong>${student.score || 0} / ${student.questionSet ? student.questionSet.length : 20}</strong></div>
            <div><span>Percentage</span><strong>${student.percentage || 0}%</strong></div>
            <div><span>Correct</span><strong>${student.correctAnswers || student.correct || 0}</strong></div>
            <div><span>Wrong</span><strong>${student.wrongAnswers || student.wrong || 0}</strong></div>
            <div><span>Unattempted</span><strong>${student.unattempted || 0}</strong></div>
            <div><span>Attempted</span><strong>${student.attempted || 0}</strong></div>
            <div><span>Submission Time</span><strong>${new Date(student.submittedAt).toLocaleString()}</strong></div>
          </div>
        </article>
      `).join('');
    }
  }

  const feedbackOverview = document.getElementById('feedbackOverview');
  if (feedbackOverview) {
    if (feedbackStore.length === 0) {
      feedbackOverview.innerHTML = '<p>No feedback submitted yet.</p>';
    } else {
      feedbackOverview.innerHTML = feedbackStore.map((item) => `
        <article class="feedback-card-item">
          <div class="student-card-header">
            <h3>${escapeHtml(item.studentName || item.studentEmail || 'Student')}</h3>
            <span class="status-pill correct">Feedback</span>
          </div>
          <div class="student-metrics">
            <div><span>Student Name</span><strong>${escapeHtml(item.studentName || 'Student')}</strong></div>
            <div><span>Student Email</span><strong>${escapeHtml(item.studentEmail || item.studentId || 'N/A')}</strong></div>
            <div><span>Course Experience</span><strong>${'★'.repeat(Number(item.ratings || 0)) || 'N/A'}</strong></div>
            <div><span>Test Difficulty</span><strong>${escapeHtml(item.difficulty || 'N/A')}</strong></div>
            <div><span>Question Quality</span><strong>${escapeHtml(item.questionQuality || 'N/A')}</strong></div>
            <div><span>Time Management</span><strong>${escapeHtml(item.timeManagement || 'N/A')}</strong></div>
            <div><span>Website Experience</span><strong>${escapeHtml(item.websiteExperience || 'N/A')}</strong></div>
            <div><span>What they liked</span><strong>${escapeHtml(item.liked || 'N/A')}</strong></div>
            <div><span>Improvement</span><strong>${escapeHtml(item.improvements || 'N/A')}</strong></div>
            <div><span>Suggestions</span><strong>${escapeHtml(item.suggestions || 'N/A')}</strong></div>
            <div><span>Submission Date</span><strong>${new Date(item.submittedAt).toLocaleString()}</strong></div>
          </div>
        </article>
      `).join('');
    }
  }

  const questionReviewList = document.getElementById('questionReviewList');
  if (questionReviewList) {
    const questionHtml = window.PYTHON_EXAM.QUESTION_BANK.map((question, index) => `
      <article class="question-admin-card">
        <div class="student-card-header">
          <h3>Question ${index + 1}</h3>
          <span class="status-pill correct">${escapeHtml(question.type)}</span>
        </div>
        <p>${escapeHtml(question.question)}</p>
        <div class="question-meta-grid">
          <span>Topic: ${escapeHtml(question.topic)}</span>
          <span>Difficulty: ${escapeHtml(question.difficulty)}</span>
          <span>Marks: ${question.marks || 1}</span>
        </div>
      </article>
    `).join('');

    questionReviewList.innerHTML = questionHtml;
  }
}
