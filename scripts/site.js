(function () {
  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var basePath = root.dataset.base || 'https://atlasmodel.org';
  var lang = (body && body.dataset.lang) || root.lang || 'en';
  var gaId = root.dataset.gaId || 'G-PGQLY6Y1LT';
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var translations = {
    no: {
      moduleLabel: 'Modul',
      moduleCta: 'Les mer',
      moduleCtaExternal: 'Les mer',
      testimonialsFallback: 'Vi samler nye historier.',
      statusFallback: 'Atlas er i planleggingsfasen',
      statusDescriptionFallback: 'Vi planlegger innholdet og søker partnere som kan bygge det sammen med oss.',
      modulesFallback: 'Moduler kommer snart.',
      heroFallback: ['For kreativitet.', 'For samarbeid.', 'For ungdom.'],
    },
    en: {
      moduleLabel: 'Module',
      moduleCta: 'Read more',
      moduleCtaExternal: 'Read more',
      testimonialsFallback: 'More stories are coming soon.',
      statusFallback: 'Atlas is in the planning phase',
      statusDescriptionFallback: 'We are shaping the content and looking for partners to build it with us.',
      modulesFallback: 'Modules are coming soon.',
      heroFallback: ['For creativity.', 'For collaboration.', 'For young people.'],
    },
  };

  function parseSeconds(value) {
    if (typeof value !== 'string' || value.trim() === '') return null;
    var numeric = parseFloat(value);
    if (isNaN(numeric)) return null;
    if (/ms$/i.test(value.trim())) {
      return numeric / 1000;
    }
    return numeric;
  }

  function formatSeconds(value) {
    if (typeof value !== 'number' || !isFinite(value)) return null;
    var safe = Math.max(value, 0);
    var text = safe.toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
    if (text === '' || text === '.') {
      text = '0';
    }
    return text + 's';
  }

  function getStoredAnalyticsConsent() {
    try {
      return localStorage.getItem('atlas-ga-consent');
    } catch (err) {
      return null;
    }
  }

  function setStoredAnalyticsConsent(value) {
    try {
      localStorage.setItem('atlas-ga-consent', value);
    } catch (err) {
      /* Do nothing if storage fails */
    }
  }

  function applyAnalyticsConsent(consent) {
    var disableKey = 'ga-disable-' + gaId;
    var isGranted = consent === 'granted';
    window[disableKey] = !isGranted;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: isGranted ? 'granted' : 'denied' });
      if (isGranted) {
        window.gtag('config', gaId, { anonymize_ip: true });
      }
    }
  }

  function initCookieBanner() {
    var banner = doc.querySelector('[data-cookie-banner]');
    if (!banner) return;

    var accept = banner.querySelector('[data-cookie-accept]');
    var reject = banner.querySelector('[data-cookie-reject]');
    var storedConsent = getStoredAnalyticsConsent();

    if (storedConsent === 'granted' || storedConsent === 'denied') {
      applyAnalyticsConsent(storedConsent);
      return;
    }

    banner.hidden = false;

    function dismiss(consent) {
      setStoredAnalyticsConsent(consent);
      applyAnalyticsConsent(consent);
      banner.setAttribute('hidden', 'hidden');
      banner.style.display = 'none';
    }

    if (accept) {
      accept.addEventListener('click', function () {
        dismiss('granted');
      });
    }

    if (reject) {
      reject.addEventListener('click', function () {
        dismiss('denied');
      });
    }
  }

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

  function initMobileMenu() {
    var toggle = doc.querySelector('[data-mobile-menu-toggle]');
    var menu = doc.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;

    var focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var isOpen = false;
    var previousFocus = null;
    var labelOpen = toggle.getAttribute('data-label-open') || toggle.getAttribute('aria-label') || '';
    var labelClose = toggle.getAttribute('data-label-close') || labelOpen;
    var desktopMedia = window.matchMedia ? window.matchMedia('(min-width: 769px)') : null;

    function updateLabel(open) {
      toggle.setAttribute('aria-label', open ? labelClose : labelOpen);
    }

    function isMobileViewport() {
      if (desktopMedia) {
        return !desktopMedia.matches;
      }
      return window.innerWidth < 769;
    }

    function setMenuAriaHidden(hidden) {
      menu.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }

    function getFocusableItems() {
      return menu.querySelectorAll(focusableSelectors);
    }

    function handleKeydown(event) {
      if (!isOpen) return;
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === 'Tab') {
        var focusable = getFocusableItems();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        var active = doc.activeElement;

        if (event.shiftKey) {
          if (active === first || !menu.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    function openMenu() {
      if (isOpen) return;
      isOpen = true;
      previousFocus = doc.activeElement;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('is-active');
      body.classList.add('has-mobile-menu');
      menu.classList.add('is-open');
      setMenuAriaHidden(false);
      updateLabel(true);
      doc.addEventListener('keydown', handleKeydown);

      var focusable = getFocusableItems();
      if (focusable.length) {
        focusable[0].focus();
      }
    }

    function closeMenu(options) {
      if (!isOpen) return;
      isOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-active');
      body.classList.remove('has-mobile-menu');
      menu.classList.remove('is-open');
      setMenuAriaHidden(isMobileViewport());
      updateLabel(false);
      doc.removeEventListener('keydown', handleKeydown);

      var skipFocus = options && options.skipFocus;
      if (!skipFocus) {
        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus();
        } else {
          toggle.focus();
        }
      }
      previousFocus = null;
    }

    toggle.addEventListener('click', function () {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.addEventListener('click', function (event) {
      var target = event.target.closest('[data-menu-close]');
      if (target) {
        closeMenu({ skipFocus: true });
      }
    });

    if (desktopMedia) {
      var handleMediaChange = function (event) {
        if (event.matches) {
          closeMenu({ skipFocus: true });
          setMenuAriaHidden(false);
        } else if (!isOpen) {
          setMenuAriaHidden(true);
        }
      };

      if (desktopMedia.addEventListener) {
        desktopMedia.addEventListener('change', handleMediaChange);
      } else if (desktopMedia.addListener) {
        desktopMedia.addListener(handleMediaChange);
      }

      handleMediaChange(desktopMedia);
    }

    updateLabel(false);
    setMenuAriaHidden(isMobileViewport());
  }

  function renderModules(modules) {
    var container = doc.querySelector('[data-modules]');
    if (!container) return;
    var t = translations[lang] || translations.en;

    var list = Array.isArray(modules) ? modules : [];
    var revealDelayStep = 0.08;
    var renderQueue = [];

    container.innerHTML = '';
    if (!list.length) {
      var message = doc.createElement('p');
      message.className = 'modules__empty';
      message.textContent = t.modulesFallback || t.statusFallback || '';
      container.appendChild(message);
      return;
    }

    function resetTilt(card) {
      card.style.setProperty('--tilt-rotate-x', '0deg');
      card.style.setProperty('--tilt-rotate-y', '0deg');
      card.style.setProperty('--tilt-parallax-x', '0px');
      card.style.setProperty('--tilt-parallax-y', '0px');
      card.style.setProperty('--tilt-glow-x', '50%');
      card.style.setProperty('--tilt-glow-y', '50%');
    }

    function addTiltListeners(card) {
      if (prefersReducedMotion) return;
      var maxTilt = 6;
      var maxParallax = 8;

      resetTilt(card);

      var handleMove = function (event) {
        var rect = card.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((centerY - y) / centerY) * maxTilt;
        var rotateY = ((x - centerX) / centerX) * maxTilt;
        var parallaxX = ((x - centerX) / centerX) * maxParallax;
        var parallaxY = ((y - centerY) / centerY) * maxParallax;
        var glowX = Math.max(0, Math.min(100, (x / rect.width) * 100));
        var glowY = Math.max(0, Math.min(100, (y / rect.height) * 100));

        card.style.setProperty('--tilt-rotate-x', rotateX.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-rotate-y', rotateY.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-parallax-x', parallaxX.toFixed(2) + 'px');
        card.style.setProperty('--tilt-parallax-y', parallaxY.toFixed(2) + 'px');
        card.style.setProperty('--tilt-glow-x', glowX.toFixed(1) + '%');
        card.style.setProperty('--tilt-glow-y', glowY.toFixed(1) + '%');
      };

      card.addEventListener('pointermove', handleMove);
      card.addEventListener('pointerenter', handleMove);
      card.addEventListener('pointerleave', function () {
        resetTilt(card);
      });
    }

    list.forEach(function (module, index) {
      var card = doc.createElement('article');
      card.className = 'module-card';
      if (module.theme) {
        card.setAttribute('data-theme', module.theme);
      }

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

      addTiltListeners(card);

      if (!prefersReducedMotion) {
        card.setAttribute('data-reveal', '');
        var stagger = typeof revealDelayStep === 'number' ? revealDelayStep * index : 0;
        var formattedDelay = formatSeconds(stagger);
        if (formattedDelay) {
          card.style.setProperty('--reveal-delay', formattedDelay);
        }
        renderQueue.push({ card: card, delay: stagger });
      }

      container.appendChild(card);
    });

    if (!prefersReducedMotion && renderQueue.length) {
      window.requestAnimationFrame(function () {
        renderQueue.forEach(function (entry) {
          var delayMs = Math.max(entry.delay, 0) * 1000;
          setTimeout(function () {
            entry.card.classList.add('is-visible');
          }, delayMs + 30);
        });
      });
      return;
    }

    renderQueue.forEach(function (entry) {
      entry.card.classList.add('is-visible');
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

  function initScrollReveal() {
    var revealItems = Array.prototype.slice.call(doc.querySelectorAll('[data-reveal]'));
    if (!revealItems.length) return;

    var observed = [];

    function applyRevealVars(target, options) {
      var direction = (options && options.direction) || 'up';
      var distance = parseFloat(target.getAttribute('data-reveal-distance'));
      var offset = isNaN(distance) ? 32 : distance;
      var translateX = '0px';
      var translateY = offset + 'px';
      var scale = 1;
      var blur = '0px';

      switch (direction) {
        case 'left':
          translateX = '-' + offset + 'px';
          translateY = '0px';
          break;
        case 'right':
          translateX = offset + 'px';
          translateY = '0px';
          break;
        case 'scale':
          translateX = '0px';
          translateY = '0px';
          scale = 0.94;
          break;
        case 'blur':
          translateX = '0px';
          translateY = '0px';
          blur = '12px';
          break;
        default:
          translateX = '0px';
          translateY = offset + 'px';
          break;
      }

      target.style.setProperty('--reveal-direction', direction);
      target.style.setProperty('--reveal-translate-x', translateX);
      target.style.setProperty('--reveal-translate-y', translateY);
      target.style.setProperty('--reveal-scale', scale);
      target.style.setProperty('--reveal-blur', blur);

      if (options && typeof options.delay === 'number') {
        var formatted = formatSeconds(options.delay);
        if (formatted) {
          target.style.setProperty('--reveal-delay', formatted);
        }
      }
    }

    function configureItem(item) {
      var baseDirection = item.getAttribute('data-reveal-direction') || 'up';
      var baseDelaySeconds = parseSeconds(item.getAttribute('data-reveal-delay')) || 0;
      var staggerSeconds = parseSeconds(item.getAttribute('data-reveal-stagger'));
      var hasStagger = typeof staggerSeconds === 'number' && staggerSeconds > 0;

      if (hasStagger) {
        var targets = Array.prototype.slice.call(item.querySelectorAll('[data-reveal-item]'));
        if (!targets.length && item.children && item.children.length) {
          targets = Array.prototype.slice.call(item.children);
        }

        targets.forEach(function (child, index) {
          if (!child.hasAttribute('data-reveal')) {
            child.setAttribute('data-reveal', '');
          }

          var childDirection = child.getAttribute('data-reveal-direction') || baseDirection;
          var childDelay = parseSeconds(child.getAttribute('data-reveal-delay'));
          var totalDelay = typeof childDelay === 'number' ? childDelay : baseDelaySeconds + index * staggerSeconds;

          applyRevealVars(child, { direction: childDirection, delay: totalDelay });
          observed.push(child);
        });
        item.classList.add('is-visible');
        return;
      }

      applyRevealVars(item, { direction: baseDirection, delay: baseDelaySeconds });
      observed.push(item);
    }

    revealItems.forEach(configureItem);

    if (prefersReducedMotion || typeof IntersectionObserver !== 'function') {
      observed.forEach(function (item) {
        item.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -10% 0px'
    });

    observed.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initQuoteParallax() {
    if (prefersReducedMotion) return;
    var section = doc.querySelector('[data-quote-section]');
    if (!section) return;

    var marks = Array.prototype.slice.call(section.querySelectorAll('[data-quote-mark]'));
    if (!marks.length) return;

    var ticking = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function update() {
      ticking = false;
      if (!doc.body.contains(section)) return;

      var rect = section.getBoundingClientRect();
      var viewportHeight = window.innerHeight || root.clientHeight || 0;
      if (!viewportHeight || !rect) return;

      var progress = null;
      if (rect.bottom >= 0 && rect.top <= viewportHeight) {
        var total = rect.height + viewportHeight;
        if (total > 0) {
          progress = clamp((viewportHeight - rect.top) / total, 0, 1);
        }
      }

      marks.forEach(function (mark, index) {
        var direction = index % 2 === 0 ? 1 : -1;
        var amplitude = 2;
        var offset = 0;
        if (progress !== null) {
          offset = (progress - 0.5) * amplitude * direction;
        }
        mark.style.transform = 'translateY(' + offset.toFixed(2) + 'px)';
      });
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    update();

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  }

  function initPinnedMoments() {
    var pinnedSections = Array.prototype.slice.call(doc.querySelectorAll('[data-pin]'));
    if (!pinnedSections.length) return;

    pinnedSections.forEach(function (section) {
      var top = parseFloat(section.getAttribute('data-pin-top'));
      if (!isNaN(top)) {
        section.style.setProperty('--pin-sticky-top', top + 'vh');
      }
      section.classList.add('is-pinned-ready');
    });

    if (prefersReducedMotion) {
      pinnedSections.forEach(function (section) {
        section.classList.add('is-pinned-active');
        section.style.setProperty('--pin-progress', '0');
      });
      return;
    }

    var ticking = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function updateProgress() {
      ticking = false;
      var viewportHeight = window.innerHeight || root.clientHeight || 0;

      pinnedSections.forEach(function (section) {
        if (!doc.body.contains(section)) return;

        var rect = section.getBoundingClientRect();
        var total = rect.height + viewportHeight;
        var progress = total > 0 ? clamp((viewportHeight - rect.top) / total, 0, 1) : 0;

        section.style.setProperty('--pin-progress', progress.toFixed(3));
        section.classList.toggle('is-pinned-active', rect.bottom >= 0 && rect.top <= viewportHeight);
      });
    }

    function requestTick() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateProgress);
      }
    }

    updateProgress();

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  }

  function markHeroLoaded() {
    var target = doc.querySelector('.hero');
    var apply = function () {
      body.classList.add('is-loaded');
      if (target) {
        target.classList.add('is-loaded');
      }
    };

    if (prefersReducedMotion) {
      apply();
      return;
    }

    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(apply);
      });
    } else {
      setTimeout(apply, 30);
    }
  }

  function start() {
    markHeroLoaded();
    initCookieBanner();
    initMobileMenu();
    initThemeToggle();
    initLanguageSwitch();
    initScrollReveal();
    initQuoteParallax();
    initPinnedMoments();

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
