/* ═══════════════════════════════════════════════════
   Portfolio — script.js  (Optimized + Fast)
   Path: static/js/script.js
   ═══════════════════════════════════════════════════ */
'use strict';

/* ── Preloader ──────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) { pre.classList.add('done'); setTimeout(() => pre.remove(), 600); }
    AOS.init({ duration:700, easing:'cubic-bezier(.4,0,.2,1)', once:true, offset:65 });
    initCounters();
  }, 1700);
});

/* ── Scroll progress bar ────────────────────────── */
const spb = document.getElementById('spb');
window.addEventListener('scroll', () => {
  if (spb) {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    spb.style.width = pct + '%';
  }
  navbar.classList.toggle('scrolled', window.scrollY > 55);
  highlightNav();
}, { passive: true });

/* ── Custom Cursor ──────────────────────────────── */
const dot  = document.getElementById('curDot');
const ring = document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (dot) { dot.style.left = mx+'px'; dot.style.top = my+'px'; }
});
(function followRing() {
  rx += (mx-rx)*.12; ry += (my-ry)*.12;
  if (ring) { ring.style.left = rx+'px'; ring.style.top = ry+'px'; }
  requestAnimationFrame(followRing);
})();
document.querySelectorAll('a,button,.pcard,.tcard,.ch,.pillar').forEach(el => {
  el.addEventListener('mouseenter', () => ring?.classList.add('big'));
  el.addEventListener('mouseleave', () => ring?.classList.remove('big'));
});

/* ── Navbar ─────────────────────────────────────── */
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');

burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});
navMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => {
  if (navMenu?.classList.contains('open') && !navMenu.contains(e.target) && !burger.contains(e.target)) closeMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
function closeMenu() {
  burger?.classList.remove('open');
  navMenu?.classList.remove('open');
  document.body.style.overflow = '';
}

function highlightNav() {
  const sy = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(s => {
    const link = document.querySelector(`.nav-item[href="#${s.id}"]`);
    if (link) link.classList.toggle('active', sy >= s.offsetTop && sy < s.offsetTop + s.offsetHeight);
  });
}

/* ── Smooth scroll ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 82, behavior: 'smooth' }); }
  });
});

/* ── Typing Effect ──────────────────────────────── */
const PHRASES = ['AI Developer','Python Expert','ML Engineer','Data Scientist','Problem Solver'];
let pi=0,ci=0,del=false;
function typeLoop() {
  const el = document.getElementById('typedEl');
  if (!el) return;
  const cur = PHRASES[pi];
  del ? ci-- : ci++;
  el.textContent = cur.slice(0, ci);
  if (!del && ci === cur.length)  { del=true;  setTimeout(typeLoop,1900); return; }
  if (del && ci === 0)            { del=false; pi=(pi+1)%PHRASES.length; setTimeout(typeLoop,420); return; }
  setTimeout(typeLoop, del ? 46 : 86);
}
setTimeout(typeLoop, 900);

/* ── Hero Canvas ────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes=[], raf, W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildNodes();
  }
  function buildNodes() {
    nodes=[];
    const n = Math.min(Math.floor(W*H/17000), 60);
    for (let i=0; i<n; i++) nodes.push({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.38, vy:(Math.random()-.5)*.38,
      r:Math.random()*1.7+1, op:Math.random()*.45+.22
    });
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    const MAX=150;
    nodes.forEach(n => {
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
    });
    for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
      const dx=nodes[j].x-nodes[i].x, dy=nodes[j].y-nodes[i].y;
      const d=Math.hypot(dx,dy);
      if (d<MAX) {
        ctx.beginPath();
        ctx.strokeStyle=`rgba(99,102,241,${(1-d/MAX)*.2})`;
        ctx.lineWidth=.65;
        ctx.moveTo(nodes[i].x,nodes[i].y);
        ctx.lineTo(nodes[j].x,nodes[j].y);
        ctx.stroke();
      }
    }
    nodes.forEach(n => {
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*2.4);
      g.addColorStop(0,`rgba(139,92,246,${n.op})`);
      g.addColorStop(1,'rgba(99,102,241,0)');
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r*2.4,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(165,140,250,${n.op})`; ctx.fill();
    });
    raf=requestAnimationFrame(draw);
  }
  resize(); draw();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { cancelAnimationFrame(raf); resize(); draw(); }, 200);
  }, {passive:true});
})();

/* ── Skill Bars ─────────────────────────────────── */
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bfill').forEach(b => b.classList.add('on'));
    }
  });
}, { threshold:.3 }).observe(document.querySelector('.skills-layout') || document.body);

/* ── Accuracy Bar ───────────────────────────────── */
new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.accbar').forEach(b => b.classList.add('on')); });
}, { threshold:.5 }).observe(document.querySelector('.pfc') || document.body);

/* ── Number Counters ────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      let cur=0; const step=target/52;
      const t = setInterval(() => {
        cur = Math.min(cur+step, target);
        el.textContent = Math.floor(cur);
        if (cur>=target) clearInterval(t);
      }, 26);
      obs.unobserve(el);
    });
  }, {threshold:.6});
  document.querySelectorAll('.nval[data-count]').forEach(el => obs.observe(el));
}

/* ── Card Tilt ──────────────────────────────────── */
document.querySelectorAll('.pcard,.pfc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r=card.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transform=`perspective(800px) rotateX(${dy*-3.5}deg) rotateY(${dx*3.5}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition='transform .4s cubic-bezier(.4,0,.2,1)';
    card.style.transform='';
    setTimeout(()=>card.style.transition='',420);
  });
});

/* ── Contact Form — Vercel Backend ──────────────── */
const cfForm   = document.getElementById('contactForm');
const cfSubmit = document.getElementById('cfSubmit');
const cfStatus = document.getElementById('cfStatus');

cfForm?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateForm()) return;
  const body = {
    name:    document.getElementById('cf-name').value.trim(),
    email:   document.getElementById('cf-email').value.trim(),
    phone:   document.getElementById('cf-phone').value.trim(),
    subject: document.getElementById('cf-subject').value,
    message: document.getElementById('cf-message').value.trim(),
  };
  setBtnState('loading');
  try {
    const res  = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    const data = await res.json();
    if (res.ok && data.success) {
      setBtnState('idle');
      showStatus('ok', '✅ Message sent! I\'ll reply within 24 hours.');
      cfForm.reset();
    } else throw new Error(data.error || 'Server error');
  } catch (err) {
    setBtnState('idle');
    const fallbackEmail = 'amazaikhan6677@gmail.com';
    const mb = encodeURIComponent(`Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`);
    showStatus('err', `❌ Could not send. <a href="mailto:${fallbackEmail}?subject=${encodeURIComponent('Portfolio contact from '+body.name)}&body=${mb}" style="color:#f87171;text-decoration:underline">Send via email instead →</a>`);
  }
});

function validateForm() {
  let ok=true;
  [{id:'cf-name',err:'err-name',fn:v=>v.length>=2,msg:'Name required (min 2 chars).'},
   {id:'cf-email',err:'err-email',fn:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),msg:'Valid email required.'},
   {id:'cf-message',err:'err-message',fn:v=>v.length>=10,msg:'Message too short (min 10 chars).'}
  ].forEach(({id,err,fn,msg}) => {
    const el=document.getElementById(id), e=document.getElementById(err);
    const v=(el?.value||'').trim();
    if (!fn(v)) { if(e)e.textContent=msg; el?.classList.add('invalid'); ok=false; }
    else        { if(e)e.textContent='';  el?.classList.remove('invalid'); }
  });
  if (!document.getElementById('cf-subject')?.value) { showStatus('err','⚠️ Please select a subject.'); ok=false; }
  return ok;
}

function setBtnState(state) {
  const inn  = cfSubmit?.querySelector('.cf-binn');
  const load = cfSubmit?.querySelector('.cf-bload');
  if (!inn||!load) return;
  if (state==='loading') { inn.style.display='none'; load.style.display='flex'; cfSubmit.disabled=true; }
  else                   { inn.style.display='flex'; load.style.display='none'; cfSubmit.disabled=false; }
}
function showStatus(type, html) {
  if (!cfStatus) return;
  cfStatus.innerHTML=html; cfStatus.className=`cf-status ${type}`;
  if (type==='ok') setTimeout(()=>{ cfStatus.textContent=''; cfStatus.className='cf-status'; },7000);
}
['cf-name','cf-email','cf-message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', function() {
    this.classList.remove('invalid');
    const e=document.getElementById('err-'+id.replace('cf-',''));
    if(e) e.textContent='';
  });
});

/* ── Page reveal ────────────────────────────────── */
document.documentElement.style.cssText='opacity:0;transition:opacity .45s ease';
document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(()=>document.documentElement.style.opacity='1'));
