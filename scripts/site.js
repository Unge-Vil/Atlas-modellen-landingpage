(function () {
  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var basePath = root.dataset.base || '.';
  var lang = (body && body.dataset.lang) || root.lang || 'en';
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var translations = {
    no: {
      moduleLabel: 'Modul',
      moduleCta: 'Les mer',
      moduleCtaExternal: 'Les mer',
      testimonialsFallback: 'Vi samler nye historier.',
      statusFallback: 'Atlas er under utvikling',
      statusDescriptionFallback: 'Vi bygger videre sammen med ungdom og partnere over hele landet.',
      heroFallback: ['For kreativitet.', 'For samarbeid.', 'For ungdom.'],
    },
    en: {
      moduleLabel: 'Module',
      moduleCta: 'Read more',
      moduleCtaExternal: 'Read more',
      testimonialsFallback: 'More stories are coming soon.',
      statusFallback: 'Atlas is in active development',
      statusDescriptionFallback: 'We are building it together with young people and partners across Norway.',
      heroFallback: ['For creativity.', 'For collaboration.', 'For young people.'],
    },
  };

  function resolveAsset(path) {
    if (!path) return '';
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }
    var cleanBase = basePath.replace(/\/$/, '');
    var cleanPath = path.replace(/^\.?(\/)*/, '');
    return cleanBase + '/' + cleanPath;
  }

  function fetchJSON(path) {
    return fetch(path, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(function (error) {
        console.error('Atlas data load failed:', error);
        return null;
      });
  }

  function resolveLangData(payload) {
    if (!payload) return null;
    if (Array.isArray(payload)) return payload;
    if (typeof payload !== 'object') return null;
    return payload[lang] || payload[lang.toLowerCase()] || payload.en || payload.no || null;
  }

  function initThemeToggle() {
    var toggle = doc.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    var icon = toggle.querySelector('[data-theme-icon]');

    function updateLabel(isLight) {
      var labelLight = toggle.getAttribute('data-label-light') || '';
      var labelDark = toggle.getAttribute('data-label-dark') || '';
      toggle.setAttribute('aria-label', isLight ? labelDark : labelLight);
      toggle.setAttribute('data-theme', isLight ? 'light' : 'dark');
      toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      if (icon) {
        icon.textContent = isLight ? '☀️' : '🌙';
      }
    }

    function applyTheme(theme) {
      if (theme === 'light') {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
      } else {
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
      }
      updateLabel(theme === 'light');
    }

    toggle.addEventListener('click', function () {
      var isLight = body.classList.contains('theme-light');
      var nextTheme = isLight ? 'dark' : 'light';
      applyTheme(nextTheme);
      try {
        localStorage.setItem('atlas-theme', nextTheme);
      } catch (err) {
        console.warn('Unable to persist theme preference', err);
      }
    });

    var stored = null;
    try {
      stored = localStorage.getItem('atlas-theme');
    } catch (err) {
      stored = null;
    }

    applyTheme(stored === 'light' ? 'light' : 'dark');
  }

  function initLanguageSwitch() {
    doc.querySelectorAll('[data-lang-switch]').forEach(function (link) {
      link.addEventListener('click', function () {
        try {
          localStorage.setItem('atlas-lang', link.getAttribute('data-lang-switch'));
        } catch (err) {
          console.warn('Unable to persist language preference', err);
        }
      });
    });
  }

  function renderModules(modules) {
    var container = doc.querySelector('[data-modules]');
    if (!container || !Array.isArray(modules)) return;
    var t = translations[lang] || translations.en;

    container.innerHTML = '';
    modules.forEach(function (module) {
      var card = doc.createElement('article');
      card.className = 'module-card';
      if (module.theme) {
        card.setAttribute('data-theme', module.theme);
      }
      card.setAttribute('tabindex', '0');

      var badge = doc.createElement('span');
      badge.className = 'badge';
      badge.textContent = t.moduleLabel;
      card.appendChild(badge);

      var iconWrap = doc.createElement('div');
      iconWrap.className = 'module-card__icon';
      var icon = doc.createElement('img');
      icon.loading = 'lazy';
      icon.decoding = 'async';
      icon.src = resolveAsset(module.icon);
      icon.alt = module.title;
      iconWrap.appendChild(icon);
      card.appendChild(iconWrap);

      var title = doc.createElement('h3');
      title.className = 'module-card__title';
      title.textContent = module.title;
      card.appendChild(title);

      var desc = doc.createElement('p');
      desc.className = 'module-card__desc';
      desc.textContent = module.description;
      card.appendChild(desc);

      var cta = doc.createElement('a');
      cta.className = 'module-card__cta';
      cta.href = module.link || 'https://docs.atlasmodel.org';
      cta.target = '_blank';
      cta.rel = 'noopener';
      cta.textContent = module.cta || t.moduleCta;
      card.appendChild(cta);

      container.appendChild(card);
    });
  }

  function renderStatus(status) {
    var box = doc.querySelector('[data-status-box]');
    if (!box) return;
    var t = translations[lang] || translations.en;
    var title = box.querySelector('h2');
    var description = box.querySelector('[data-status-description]');

    if (status && status.title && title) {
      title.textContent = status.title;
    } else if (title) {
      title.textContent = t.statusFallback;
    }

    if (status && status.description && description) {
      description.textContent = status.description;
    } else if (description) {
      description.textContent = t.statusDescriptionFallback;
    }
  }

  function renderTestimonials(testimonials) {
    var container = doc.querySelector('[data-testimonials]');
    if (!container) return;
    var t = translations[lang] || translations.en;

    container.innerHTML = '';
    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      var empty = doc.createElement('p');
      empty.className = 'meta';
      empty.textContent = t.testimonialsFallback;
      container.appendChild(empty);
      return;
    }

    testimonials.forEach(function (testimonial) {
      var card = doc.createElement('article');
      card.className = 'testimonial-card';
      card.tabIndex = 0;

      var quote = doc.createElement('p');
      quote.className = 'testimonial-card__quote';
      quote.textContent = '“' + testimonial.quote + '”';
      card.appendChild(quote);

      var profile = doc.createElement('div');
      profile.className = 'testimonial-card__profile';

      if (testimonial.image) {
        var avatar = doc.createElement('img');
        avatar.className = 'testimonial-card__avatar';
        avatar.src = resolveAsset(testimonial.image);
        avatar.alt = testimonial.name || '';
        avatar.loading = 'lazy';
        avatar.decoding = 'async';
        profile.appendChild(avatar);
      }

      var details = doc.createElement('div');
      details.className = 'testimonial-card__details';

      if (testimonial.name) {
        var name = doc.createElement('p');
        name.className = 'testimonial-card__name';
        name.textContent = testimonial.name;
        details.appendChild(name);
      }

      if (testimonial.role) {
        var role = doc.createElement('p');
        role.className = 'testimonial-card__role';
        role.textContent = testimonial.role;
        details.appendChild(role);
      }

      if (details.childNodes.length > 0) {
        profile.appendChild(details);
      }

      if (profile.childNodes.length > 0) {
        card.appendChild(profile);
      }

      container.appendChild(card);
    });
  }

  function initHeroPhrases(phrases) {
    var wrapper = doc.querySelector('[data-hero-phrases]');
    var phraseEl = wrapper ? wrapper.querySelector('[data-hero-phrase]') : null;
    var list = Array.isArray(phrases) && phrases.length ? phrases : (translations[lang] || translations.en).heroFallback;
    if (!phraseEl || !list || list.length === 0) return;

    var index = 0;
    phraseEl.textContent = list[0];

    if (prefersReducedMotion || list.length === 1) {
      return;
    }

    setInterval(function () {
      index = (index + 1) % list.length;
      phraseEl.classList.add('is-hiding');
      setTimeout(function () {
        phraseEl.textContent = list[index];
        phraseEl.classList.remove('is-hiding');
        phraseEl.classList.add('is-showing');
        setTimeout(function () {
          phraseEl.classList.remove('is-showing');
        }, 600);
      }, 300);
    }, 3200);
  }

  function start() {
    initThemeToggle();
    initLanguageSwitch();

    var dataRequests = [
      fetchJSON(basePath + '/data/modules.json'),
      fetchJSON(basePath + '/data/quotes.json'),
      fetchJSON(basePath + '/data/updates.json'),
      fetchJSON(basePath + '/data/testimonials.' + lang + '.json')
    ];

    Promise.all(dataRequests).then(function (responses) {
      var modulesPayload = responses[0];
      var quotesPayload = responses[1];
      var updatesPayload = responses[2];
      var testimonialsPayload = responses[3];

      renderModules(resolveLangData(modulesPayload));

      var quotes = resolveLangData(quotesPayload);
      var heroPhrases = quotes && quotes.hero ? quotes.hero : quotes;
      initHeroPhrases(Array.isArray(heroPhrases) ? heroPhrases : (heroPhrases && heroPhrases.list));

      var updates = resolveLangData(updatesPayload);
      renderStatus(updates && updates.status ? updates.status : null);

      renderTestimonials(Array.isArray(testimonialsPayload) ? testimonialsPayload : []);
    });
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
