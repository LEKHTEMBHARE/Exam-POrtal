document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  const result = JSON.parse(localStorage.getItem(window.PYTHON_EXAM.STORAGE_KEYS.lastResult) || 'null');
  if (!result) {
    document.getElementById('resultSummary').innerHTML = '<p>No result found. Please return to your dashboard.</p>';
    return;
  }

  const summary = document.getElementById('resultSummary');
  const totalQuestions = result.review ? result.review.length : 0;
  summary.innerHTML = `
    <div class="score-badge">${result.score} / ${totalQuestions}</div>
    <h1>Test Completed</h1>
    <div class="result-metrics">
      <div><span>Score</span><strong>${result.score} / ${totalQuestions}</strong></div>
      <div><span>Percentage</span><strong>${result.percentage}%</strong></div>
      <div><span>Correct</span><strong>${result.correctAnswers || result.correct || 0}</strong></div>
      <div><span>Wrong</span><strong>${result.wrongAnswers || result.wrong || 0}</strong></div>
      <div><span>Unattempted</span><strong>${result.unattempted || 0}</strong></div>
    </div>
  `;

  const performanceMessage = document.getElementById('performanceMessage');
  performanceMessage.textContent = getPerformanceMessage(result.percentage);

  const reviewContainer = document.getElementById('questionReview');
  reviewContainer.innerHTML = (result.review || []).map((item, index) => {
    const statusClass = item.status === 'Correct' ? 'correct' : item.status === 'Wrong' ? 'wrong' : 'unattempted';
    const questionLabel = item.type === 'mcq' ? 'MCQ' : 'Programming';

    if (item.type === 'mcq') {
      return `
        <div class="review-card ${statusClass}">
          <div class="review-header">
            <span class="review-tag">${questionLabel}</span>
            <span class="status-pill ${statusClass}">${item.status}</span>
          </div>
          <h3>Q${index + 1}: ${escapeHtml(item.question)}</h3>
          <div class="review-grid">
            <div><strong>Student Answer:</strong> ${escapeHtml(item.studentAnswer)}</div>
            <div><strong>Correct Answer:</strong> ${escapeHtml(item.correctAnswer)}</div>
          </div>
          <p><strong>Explanation:</strong> ${escapeHtml(item.explanation)}</p>
        </div>
      `;
    }

    return `
      <div class="review-card ${statusClass}">
        <div class="review-header">
          <span class="review-tag">${questionLabel}</span>
          <span class="status-pill ${statusClass}">${item.status}</span>
        </div>
        <h3>Q${index + 1}: ${escapeHtml(item.question)}</h3>
        <div class="review-grid">
          <div>
            <strong>Student Submitted Code:</strong>
            <pre>${escapeHtml(item.studentAnswer)}</pre>
          </div>
          <div>
            <strong>Expected Concept:</strong>
            <p>${escapeHtml(item.correctAnswer)}</p>
          </div>
        </div>
        <p><strong>Evaluation Status:</strong> ${escapeHtml(item.evaluationStatus || item.status)}</p>
      </div>
    `;
  }).join('');

  const feedbackBtn = document.getElementById('goToFeedback');
  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', () => {
      window.location.href = 'feedback.html';
    });
  }
});

function getPerformanceMessage(percentage) {
  if (percentage >= 80) return 'Excellent performance. You have a strong grasp of the Python fundamentals.';
  if (percentage >= 60) return 'Good work. A little more practice will push you higher.';
  if (percentage >= 40) return 'Fair attempt. Review the topics where you lost marks and try again.';
  return 'Keep practicing. The syllabus topics are manageable, and consistency will improve your score.';
}
