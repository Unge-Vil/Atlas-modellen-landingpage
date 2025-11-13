
// Simple reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); }
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Tiny tilt effect
document.querySelectorAll('.tilt').forEach(el=>{
  el.addEventListener('mousemove', (e)=>{
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top + r.height/2;
    const dx = (e.clientX - cx) / (r.width/2);
    const dy = (e.clientY - cy) / (r.height/2);
    el.style.transform = `rotateX(${(-dy*5).toFixed(2)}deg) rotateY(${(dx*6).toFixed(2)}deg)`;
  });
  el.addEventListener('mouseleave', ()=>{ el.style.transform = 'rotateX(0) rotateY(0)'; });
});

// Simple testimonials rotator (optional manual trigger in future)

// Theme toggle with localStorage
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'light'){
  root.classList.add('light');
}
document.querySelector('.theme-toggle').addEventListener('click',()=>{
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// Load JSON data for orgs, testimonials, supporters
async function loadData(){
  const [orgs, tests, sups] = await Promise.all([
    fetch('https://atlasmodel.org/assets/data/orgs.json').then(r=>r.json()),
    fetch('https://atlasmodel.org/assets/data/testimonials.json').then(r=>r.json()),
    fetch('https://atlasmodel.org/assets/data/supporters.json').then(r=>r.json()),
  ]);

  const orgWrap = document.querySelector('#using .logo-grid');
  orgWrap.innerHTML = '';
  orgs.organizations.forEach(n=>{
    const d = document.createElement('div');
    d.className = 'logo-card'; d.textContent = n;
    orgWrap.appendChild(d);
  });

  const tWrap = document.querySelector('#testimonials .testimonials');
  tWrap.innerHTML = '';
  tests.testimonials.forEach(t=>{
    const d = document.createElement('div');
    d.className='testi';
    d.innerHTML = `<p>«${t.text}»</p><div class="name">— ${t.author}, ${t.org}</div>`;
    tWrap.appendChild(d);
  });

  const supWrap = document.querySelector('#support .logo-grid');
  supWrap.innerHTML = '';
  sups.supporters.forEach(item=>{
    const el = document.createElement(item.url ? 'a' : 'div');
    el.className = 'logo-card';
    if(item.url){
      el.href = item.url;
      el.target = '_blank';
      el.rel = 'noopener';
      el.setAttribute('aria-label', item.name);
    }

    if(item.logo){
      const img = document.createElement('img');
      img.src = item.logo;
      img.alt = item.name;
      img.width = item.width || 200;
      img.height = item.height || 80;
      img.loading = 'lazy';
      el.appendChild(img);
    }else{
      const span = document.createElement('span');
      span.textContent = item.name;
      el.appendChild(span);
    }
    supWrap.appendChild(el);
  });
}
loadData();

// Module carousel enhancements
const moduleCarousel = document.querySelector('.module-carousel');
if(moduleCarousel){
  const moduleCards = Array.from(moduleCarousel.querySelectorAll('.module-card'));
  const moduleButtons = Array.from(document.querySelectorAll('.module-step-btn'));
  const progressBar = document.querySelector('.module-progress__bar');
  let activeIndex = 0;

  const clampIndex = (value)=>{
    if(!moduleCards.length) return 0;
    return Math.max(0, Math.min(moduleCards.length - 1, value));
  };

  const setActiveIndex = (nextIndex, {force = false} = {})=>{
    nextIndex = clampIndex(nextIndex);
    if(!force && nextIndex === activeIndex) return;
    activeIndex = nextIndex;

    moduleCards.forEach((card, idx)=>{
      const isActive = idx === nextIndex;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    moduleButtons.forEach((btn, idx)=>{
      const isActive = idx === nextIndex;
      btn.classList.toggle('is-active', isActive);
      if(isActive){
        btn.setAttribute('aria-current', 'step');
      }else{
        btn.removeAttribute('aria-current');
      }
    });

    if(progressBar){
      const ratio = moduleCards.length > 1 ? nextIndex / (moduleCards.length - 1) : 1;
      const clampedRatio = Math.max(0, Math.min(1, ratio));
      progressBar.style.setProperty('--progress', `${clampedRatio}`);
    }

    if(moduleCards[nextIndex]){
      moduleCarousel.setAttribute('aria-activedescendant', moduleCards[nextIndex].id);
    }
  };

  if(moduleCards.length){
    setActiveIndex(0, {force:true});
  }

  const scrollToIndex = (index, { focusCard = false } = {})=>{
    const targetIndex = clampIndex(index);
    const target = moduleCards[targetIndex];
    if(!target) return;
    setActiveIndex(targetIndex);
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if(focusCard && typeof target.focus === 'function'){
      try{
        target.focus({ preventScroll: true });
      }catch(_err){
        target.focus();
      }
    }
    updateEdgeState();
  };

  const intersectionObserver = new IntersectionObserver((entries)=>{
    const visible = entries
      .filter(entry=>entry.isIntersecting)
      .sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
    if(visible){
      const index = moduleCards.indexOf(visible.target);
      if(index !== -1){
        setActiveIndex(index);
      }
    }
  }, { root: moduleCarousel, threshold: 0.55 });

  moduleCards.forEach(card=>intersectionObserver.observe(card));

  moduleButtons.forEach((btn, idx)=>{
    btn.addEventListener('click', ()=> scrollToIndex(idx));
  });

  moduleCarousel.addEventListener('keydown', (event)=>{
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft'){
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = clampIndex(activeIndex + direction);
      if(nextIndex !== activeIndex){
        scrollToIndex(nextIndex);
      }
    }else if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault();
      scrollToIndex(activeIndex, { focusCard: true });
    }
  });

  const updateEdgeState = ()=>{
    const atStart = moduleCarousel.scrollLeft <= 6;
    const atEnd = moduleCarousel.scrollLeft + moduleCarousel.clientWidth >= moduleCarousel.scrollWidth - 6;
    moduleCarousel.classList.toggle('is-start', atStart);
    moduleCarousel.classList.toggle('is-end', atEnd);
  };

  let scrollRaf;
  const handleScroll = ()=>{
    if(scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(()=>{
      updateEdgeState();
    });
  };

  moduleCarousel.addEventListener('scroll', handleScroll, { passive:true });

  let resizeRaf;
  window.addEventListener('resize', ()=>{
    if(resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(()=>{
      updateEdgeState();
    });
  });

  if('ResizeObserver' in window){
    const resizeObserver = new ResizeObserver(()=> updateEdgeState());
    resizeObserver.observe(moduleCarousel);
  }

  window.addEventListener('load', updateEdgeState, { once: true });

  updateEdgeState();
}

// Story slider / timeline
const storySlider = document.querySelector('[data-slider]');
if(storySlider){
  const slides = Array.from(storySlider.querySelectorAll('[data-slide]'));
  const prevButton = storySlider.querySelector('[data-slider-prev]');
  const nextButton = storySlider.querySelector('[data-slider-next]');
  const dotsHost = storySlider.querySelector('[data-slider-dots]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = Math.max(0, slides.findIndex(slide=>slide.classList.contains('is-active')));
  if(!slides[activeIndex]){ activeIndex = 0; }
  let liveResetTimer = null;

  const syncMotionClass = ()=>{
    storySlider.classList.toggle('prefers-reduced-motion', prefersReducedMotion.matches);
  };

  if(typeof prefersReducedMotion.addEventListener === 'function'){
    prefersReducedMotion.addEventListener('change', syncMotionClass);
  }else if(typeof prefersReducedMotion.addListener === 'function'){
    prefersReducedMotion.addListener(syncMotionClass);
  }

  const setAriaLive = (mode)=>{
    if(liveResetTimer) window.clearTimeout(liveResetTimer);
    storySlider.setAttribute('aria-live', mode);
    if(mode === 'assertive'){
      liveResetTimer = window.setTimeout(()=>{
        storySlider.setAttribute('aria-live', 'polite');
      }, 700);
    }
  };

  const storyDots = slides.map((slide, index)=>{
    if(!dotsHost) return null;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'story-slider__dot';
    const title = slide.querySelector('.story-slide__title');
    const year = slide.querySelector('.story-slide__year');
    const labelParts = [year ? year.textContent.trim() : `Slide ${index + 1}`];
    if(title){ labelParts.push(title.textContent.trim()); }
    button.setAttribute('aria-label', `Show story: ${labelParts.join(' – ')}`);
    if(slide.id){ button.setAttribute('aria-controls', slide.id); }
    button.dataset.sliderDot = String(index);
    dotsHost.appendChild(button);
    button.addEventListener('click', ()=>{
      goTo(index, { userInitiated: true, focus: shouldFocusSlide() });
    });
    button.addEventListener('keydown', (event)=>{
      if(event.key === 'ArrowRight' || event.key === 'ArrowLeft'){
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        goTo(activeIndex + direction, { userInitiated: true, focus: true });
      }
    });
    return button;
  }).filter(Boolean);

  const storySlides = slides;

  const focusWithoutScroll = (element)=>{
    if(!element) return;
    try{
      element.focus({ preventScroll: true });
    }catch(_error){
      element.focus();
    }
  };

  const shouldFocusSlide = ()=>{
    const activeElement = document.activeElement;
    return !!(activeElement && activeElement.closest('[data-slider]') === storySlider && activeElement.tagName === 'BUTTON');
  };

  const updateNavState = ()=>{
    if(prevButton) prevButton.disabled = activeIndex <= 0;
    if(nextButton) nextButton.disabled = activeIndex >= storySlides.length - 1;
  };

  const applyActiveState = (index, { announce = false, focus = false } = {})=>{
    storySlides.forEach((slide, idx)=>{
      const isActive = idx === index;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.setAttribute('tabindex', isActive ? '0' : '-1');
      if(isActive){
        slide.setAttribute('aria-current', 'true');
        storySlider.setAttribute('aria-activedescendant', slide.id || '');
        if(focus){
          focusWithoutScroll(slide);
        }
      }else{
        slide.removeAttribute('aria-current');
      }
    });

    storyDots.forEach((dot, idx)=>{
      const isActive = idx === index;
      dot.classList.toggle('is-active', isActive);
      if(isActive){
        dot.setAttribute('aria-current', 'true');
      }else{
        dot.removeAttribute('aria-current');
      }
    });

    updateNavState();

    if(announce){
      setAriaLive('assertive');
    }
  };

  const goTo = (index, { userInitiated = false, focus = false } = {})=>{
    const clamped = Math.max(0, Math.min(storySlides.length - 1, index));
    if(clamped === activeIndex) return;
    activeIndex = clamped;
    applyActiveState(activeIndex, { announce: userInitiated, focus });
  };

  if(prevButton){
    prevButton.addEventListener('click', ()=>{
      goTo(activeIndex - 1, { userInitiated: true, focus: shouldFocusSlide() });
    });
  }

  if(nextButton){
    nextButton.addEventListener('click', ()=>{
      goTo(activeIndex + 1, { userInitiated: true, focus: shouldFocusSlide() });
    });
  }

  storySlider.addEventListener('keydown', (event)=>{
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft'){
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      goTo(activeIndex + direction, { userInitiated: true, focus: true });
    }else if(event.key === 'Home'){
      event.preventDefault();
      goTo(0, { userInitiated: true, focus: true });
    }else if(event.key === 'End'){
      event.preventDefault();
      goTo(storySlides.length - 1, { userInitiated: true, focus: true });
    }
  });

  const sliderObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.target !== storySlider) return;
      storySlider.classList.toggle('is-visible', entry.isIntersecting);
      if(entry.isIntersecting){
        setAriaLive('polite');
      }else{
        setAriaLive('off');
      }
    });
  }, { threshold: 0.35 });

  sliderObserver.observe(storySlider);

  syncMotionClass();
  applyActiveState(activeIndex, { announce: false, focus: false });
  updateNavState();
}

// Parallax tilt in hero title
const hero = document.querySelector('.hero');
hero.addEventListener('mousemove', (e)=>{
  const t = hero.querySelector('.hero__inner');
  const r = hero.getBoundingClientRect();
  const dx = (e.clientX - (r.left + r.width/2)) / (r.width/2);
  const dy = (e.clientY - (r.top + r.height/2)) / (r.height/2);
  t.style.transform = `translate3d(${dx*8}px, ${dy*6}px, 0)`;
});
hero.addEventListener('mouseleave', ()=>{
  hero.querySelector('.hero__inner').style.transform = 'translate3d(0,0,0)';
});
