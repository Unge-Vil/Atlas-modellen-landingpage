(function () {
  const STORAGE_KEY = 'atlas-lang';

  document.addEventListener('DOMContentLoaded', function () {
    const currentLang = document.documentElement.lang || 'en';
    const links = document.querySelectorAll('[data-lang-switch]');

    links.forEach(function (link) {
      const lang = link.dataset.langSwitch;
      if (!lang) return;
      if (lang === currentLang) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }

      link.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, lang);
      });
    });
  });
})();
