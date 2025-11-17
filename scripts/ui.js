(function () {
  const root = document.documentElement;
  const basePath = root.dataset.base || 'https://atlasmodel.org';
  const lang = (document.body && document.body.dataset.lang) || root.lang || 'en';

  const translations = {
    no: {
      moduleLabel: 'Modul',
      partnerAlt: 'Logo for',
      supporterAlt: 'Logo for',
    },
    en: {
      moduleLabel: 'Module',
      partnerAlt: 'Logo for',
      supporterAlt: 'Logo for',
    },
  };

  const iconMap = {
    bulb: '💡',
    book: '📘',
    puzzle: '🧩',
    share: '🔁',
  };

  function resolveAsset(path) {
    if (!path) return '';
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }
    const trimmedBase = basePath.replace(/\/$/, '');
    const trimmedPath = path.replace(/^\.?(\/)*/, '');
    return trimmedBase + '/' + trimmedPath;
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
        return [];
      });
  }

  function renderModules(data) {
    const container = document.querySelector('[data-modules]');
    if (!container || !Array.isArray(data)) return;
    const t = translations[lang] || translations.en;

    container.innerHTML = '';
    data.forEach(function (module) {
      const card = document.createElement('article');
      card.className = 'module-card ' + (module.class || '');

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = t.moduleLabel;
      card.appendChild(badge);

      const icon = document.createElement('span');
      icon.className = 'module-card__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = iconMap[module.icon] || '✨';
      card.appendChild(icon);

      const title = document.createElement('h3');
      title.className = 'module-card__title';
      title.textContent = module.title;
      card.appendChild(title);

      const desc = document.createElement('p');
      desc.className = 'module-card__desc';
      desc.textContent = module.desc;
      card.appendChild(desc);

      container.appendChild(card);
    });
  }

  function createLogoElement(partner, className) {
    const link = document.createElement('a');
    link.className = className;
    link.href = partner.url || '#';
    link.target = '_blank';
    link.rel = 'noopener';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = resolveAsset(partner.logo);
    img.alt = (translations[lang] || translations.en).partnerAlt + ' ' + partner.name;
    link.appendChild(img);
    return link;
  }

  function renderPartners(partners) {
    const marquee = document.querySelector('[data-marquee]');
    if (!marquee || !Array.isArray(partners) || partners.length === 0) return;

    const track = document.createElement('div');
    track.className = 'logo-marquee__track';

    const loopItems = partners.concat(partners);
    loopItems.forEach(function (partner) {
      const logoEl = createLogoElement(partner, 'logo-marquee__logo');
      track.appendChild(logoEl);
    });

    marquee.innerHTML = '';
    marquee.appendChild(track);
  }

  function renderSupporters(partners) {
    const grid = document.querySelector('[data-support-grid]');
    if (!grid || !Array.isArray(partners)) return;
    const t = translations[lang] || translations.en;

    grid.innerHTML = '';
    partners.forEach(function (partner) {
      const item = document.createElement(partner.url ? 'a' : 'div');
      item.className = 'support-grid__item';
      if (partner.url) {
        item.href = partner.url;
        item.target = '_blank';
        item.rel = 'noopener';
      }
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = resolveAsset(partner.logo);
      img.alt = t.supporterAlt + ' ' + partner.name;
      item.appendChild(img);
      grid.appendChild(item);
    });
  }

  function renderTestimonials(testimonials) {
    const container = document.querySelector('[data-testimonials]');
    if (!container || !Array.isArray(testimonials)) return;

    container.innerHTML = '';
    testimonials.forEach(function (testimonial) {
      const card = document.createElement('article');
      card.className = 'testimonial-card';
      card.tabIndex = 0;

      const quote = document.createElement('p');
      quote.className = 'testimonial-card__quote';
      quote.textContent = '“' + testimonial.quote + '”';
      card.appendChild(quote);

      const meta = document.createElement('p');
      meta.className = 'testimonial-card__meta';
      meta.textContent = (testimonial.name || '') + (testimonial.role ? ' · ' + testimonial.role : '');
      card.appendChild(meta);

      container.appendChild(card);
    });
  }

  function renderTeam(team) {
    if (!Array.isArray(team) || team.length === 0) return;
    const highlight = team[0];
    const image = document.querySelector('[data-team-image]');
    const name = document.querySelector('[data-team-name]');
    const role = document.querySelector('[data-team-role]');
    const quote = document.querySelector('[data-team-quote]');

    if (image && highlight.image) {
      image.src = resolveAsset(highlight.image);
    }
    if (image && highlight.name) {
      image.alt = (lang === 'no' ? 'Portrett av ' : 'Portrait of ') + highlight.name;
    }
    if (name && highlight.name) {
      name.textContent = highlight.name;
    }
    if (role && highlight.role) {
      role.textContent = highlight.role;
    }
    if (quote && highlight.bio) {
      quote.textContent = highlight.bio;
    }
  }

  function initReveal() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('[data-modules]')) {
      return;
    }

    initReveal();

    const dataPromises = [
      fetchJSON(basePath + '/data/modules.' + lang + '.json'),
      fetchJSON(basePath + '/data/partners.json'),
      fetchJSON(basePath + '/data/testimonials.' + lang + '.json'),
      fetchJSON(basePath + '/data/team.' + lang + '.json')
    ];

    Promise.all(dataPromises).then(function (responses) {
      const [modules, partners, testimonials, team] = responses;
      renderModules(modules);
      renderPartners(partners);
      renderSupporters(partners);
      renderTestimonials(testimonials);
      renderTeam(team);
    });
  });
})();
