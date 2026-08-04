const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = $('[data-header]');
const toggle = $('.nav-toggle');
const navLinks = $('.nav-links');
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

const onScroll = () => {
  header?.classList.toggle('scrolled', scrollY > 24);
  const rules = $('#rules');
  const progress = $('.rule-progress');
  if (rules && progress) {
    const rect = rules.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight - rect.top) / (rect.height + innerHeight * .2)));
    progress.style.height = `${p * 100}%`;
  }
};
onScroll(); addEventListener('scroll', onScroll, { passive: true });

toggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  toggle.classList.toggle('active', open);
});
$$('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open'); document.body.classList.remove('menu-open'); toggle?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    const delay = Number(e.target.dataset.delay || 0);
    setTimeout(() => e.target.classList.add('visible'), delay);
    observer.unobserve(e.target);
  }
}), { threshold: .12, rootMargin: '0px 0px -40px' });
$$('.reveal').forEach(el => observer.observe(el));

if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  $$('.tilt-card').forEach(card => {
    const strength = Number(card.dataset.tiltStrength || 4);
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(1000px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.09}px, ${(e.clientY-r.top-r.height/2)*.13}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
}

$$('details').forEach(detail => detail.addEventListener('toggle', () => {
  if (!detail.open) return;
  const parent = detail.parentElement;
  $$('details', parent).forEach(other => { if (other !== detail) other.open = false; });
}));

// Lightweight ambient particle field—no framework or external runtime required.
const canvas = $('#ambient-canvas');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let particles = [], mx = innerWidth/2, my = innerHeight/2, raf;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.min(80, Math.floor(innerWidth / 18));
    particles = Array.from({length:count}, () => ({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12,r:Math.random()*1.4+.3}));
  };
  addEventListener('resize', resize); addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true}); resize();
  const draw = () => {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    particles.forEach((p,i) => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;
      const dx=mx-p.x,dy=my-p.y,d=Math.hypot(dx,dy); if(d<150){p.x-=dx*.00045;p.y-=dy*.00045;}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(154,199,239,.32)';ctx.fill();
      for(let j=i+1;j<particles.length;j++){const q=particles[j],dist=Math.hypot(p.x-q.x,p.y-q.y);if(dist<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(91,154,211,${.055*(1-dist/105)})`;ctx.stroke();}}
    });
    raf=requestAnimationFrame(draw);
  }; draw();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else draw();});
}
