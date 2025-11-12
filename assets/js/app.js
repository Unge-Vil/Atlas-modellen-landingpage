
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
    fetch('assets/data/orgs.json').then(r=>r.json()),
    fetch('assets/data/testimonials.json').then(r=>r.json()),
    fetch('assets/data/supporters.json').then(r=>r.json()),
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
