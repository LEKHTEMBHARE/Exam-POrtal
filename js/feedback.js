document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }

  const studentNameField = document.getElementById('studentName');
  if (studentNameField) {
    studentNameField.value = currentUser.name || '';
  }

  const stars = document.querySelectorAll('.star');
  stars.forEach((star) => {
    star.addEventListener('click', () => {
      const selectedValue = Number(star.dataset.ratingValue);
      document.getElementById('courseExperience').value = selectedValue;
      stars.forEach((item) => {
        const value = Number(item.dataset.ratingValue);
        item.classList.toggle('active', value <= selectedValue);
      });
    });
  });

  const form = document.getElementById('feedbackForm');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const fields = [
        document.getElementById('studentName'),
        document.getElementById('courseExperience'),
        document.getElementById('testDifficulty'),
        document.getElementById('questionQuality'),
        document.getElementById('timeManagement'),
        document.getElementById('websiteExperience'),
        document.getElementById('liked'),
        document.getElementById('improvements'),
        document.getElementById('suggestions')
      ];

      const isComplete = fields.every((field) => {
        if (!field) return false;
        return String(field.value || '').trim() !== '';
      });

      if (!isComplete) {
        const errorBox = document.getElementById('feedbackError');
        errorBox.textContent = 'Please complete the feedback form before finishing.';
        errorBox.style.display = 'block';
        return;
      }

      const payload = {
        studentId: currentUser.email,
        studentName: document.getElementById('studentName').value.trim(),
        studentEmail: currentUser.email,
        ratings: Number(document.getElementById('courseExperience').value || 0),
        difficulty: document.getElementById('testDifficulty').value,
        questionQuality: document.getElementById('questionQuality').value,
        timeManagement: document.getElementById('timeManagement').value,
        websiteExperience: document.getElementById('websiteExperience').value,
        liked: document.getElementById('liked').value,
        improvements: document.getElementById('improvements').value,
        suggestions: document.getElementById('suggestions').value,
        submittedAt: new Date().toISOString()
      };

      const allFeedback = JSON.parse(localStorage.getItem(window.PYTHON_EXAM.STORAGE_KEYS.feedback) || '[]');
      allFeedback.push(payload);
      localStorage.setItem(window.PYTHON_EXAM.STORAGE_KEYS.feedback, JSON.stringify(allFeedback));

      const errorBox = document.getElementById('feedbackError');
      errorBox.textContent = 'Thank you for your feedback.';
      errorBox.style.display = 'block';
      errorBox.style.color = '#0a7f4c';
      errorBox.style.background = 'rgba(46, 204, 113, 0.08)';
      errorBox.style.borderColor = 'rgba(46, 204, 113, 0.25)';

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    });
  }
});
