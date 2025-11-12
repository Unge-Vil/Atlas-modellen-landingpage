
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
  sups.supporters.forEach(n=>{
    const d = document.createElement('div');
    d.className='logo-card'; d.textContent = n;
    supWrap.appendChild(d);
  });
}
loadData();

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
