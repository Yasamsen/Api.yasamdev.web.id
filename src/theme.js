let theme = localStorage.getItem('samapi-theme-v2') || 'light';

export function getTheme() { return theme; }

export function applyTheme() {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('samapi-theme-v2', theme);
}

export function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
}

applyTheme();
