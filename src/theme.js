let theme = localStorage.getItem('samapi-theme') || 'dark';

export function getTheme() { return theme; }

export function applyTheme() {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('samapi-theme', theme);
}

export function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
}

applyTheme();
