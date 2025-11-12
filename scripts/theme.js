(function () {
  const STORAGE_KEY = 'atlas-theme';
  const body = document.body;

  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
    } else {
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
    }
    updateToggle(theme);
  }

  function updateToggle(theme) {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    const isLight = theme === 'light';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', isLight ? toggle.dataset.labelDark || 'Switch to dark mode' : toggle.dataset.labelLight || 'Switch to light mode');
    const icon = toggle.querySelector('[data-theme-icon]');
    if (icon) {
      icon.textContent = isLight ? '☀️' : '🌙';
    }
  }

  function resolveInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  document.addEventListener('DOMContentLoaded', function () {
    const initial = body.classList.contains('theme-light') ? 'light' : resolveInitialTheme();
    applyTheme(initial);

    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    toggle.dataset.labelLight = toggle.dataset.labelLight || (document.documentElement.lang === 'no' ? 'Bytt til lysmodus' : 'Switch to light mode');
    toggle.dataset.labelDark = toggle.dataset.labelDark || (document.documentElement.lang === 'no' ? 'Bytt til mørk modus' : 'Switch to dark mode');

    toggle.addEventListener('click', function () {
      const current = body.classList.contains('theme-light') ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      body.classList.toggle('theme-light', next === 'light');
      body.classList.toggle('theme-dark', next === 'dark');
      localStorage.setItem(STORAGE_KEY, next);
      updateToggle(next);
    });
  });
})();
