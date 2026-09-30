let currentPath = getHashPath();
const listeners = new Set();

function getHashPath() {
  return window.location.hash.replace(/^#/, '') || '/';
}

export function getPath() { return currentPath; }

export function navigate(to) {
  window.location.hash = to;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function onRouteChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

window.addEventListener('hashchange', () => {
  currentPath = getHashPath();
  listeners.forEach((listener) => listener(currentPath));
});

if (!window.location.hash) window.location.hash = '/';
