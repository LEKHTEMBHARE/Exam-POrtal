document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('loginError');
    const passwordToggle = document.querySelector('[data-password-toggle]');

    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.textContent = type === 'password' ? 'Show' : 'Hide';
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = (emailInput.value || '').trim().toLowerCase();
      const password = passwordInput.value || '';

      if (!email || !password) {
        showLoginError(errorBox, 'Please enter both email and password.');
        return;
      }

      const match = PYTHON_ACCOUNTS.find(
        (account) => account.email.toLowerCase() === email && account.password === password
      );

      if (!match) {
        showLoginError(errorBox, 'Invalid credentials. Please try again.');
        return;
      }

      const sessionUser = {
        email: match.email,
        name: match.name,
        role: match.role
      };

      localStorage.setItem(window.PYTHON_EXAM.STORAGE_KEYS.currentUser, JSON.stringify(sessionUser));

      if (match.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'student.html';
      }
    });
  }

  const logoutButtons = document.querySelectorAll('[data-logout]');
  logoutButtons.forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.removeItem(window.PYTHON_EXAM.STORAGE_KEYS.currentUser);
      window.location.href = 'index.html';
    });
  });

  const currentUser = getCurrentUser();
  const userLabel = document.querySelector('[data-current-user]');
  if (userLabel && currentUser) {
    userLabel.textContent = currentUser.name;
  }

  const loginLink = document.querySelector('[data-login-link]');
  if (loginLink && currentUser) {
    loginLink.textContent = 'Dashboard';
  }
});

function getCurrentUser() {
  try {
    const user = localStorage.getItem(window.PYTHON_EXAM.STORAGE_KEYS.currentUser);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(window.PYTHON_EXAM.STORAGE_KEYS.currentUser, JSON.stringify(user));
}

function logoutCurrentUser() {
  localStorage.removeItem(window.PYTHON_EXAM.STORAGE_KEYS.currentUser);
  window.location.href = 'index.html';
}

function showLoginError(element, message) {
  if (!element) return;
  element.textContent = message;
  element.style.display = 'block';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
