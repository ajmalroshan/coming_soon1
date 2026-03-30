/* ============================================================
   ARKBITS — COMING SOON TEMPLATE  |  main.js
   ============================================================
   CUSTOMISATION GUIDE:

   🗓  LAUNCH DATE
     launchDate    — set your target date below

   ✦  PARTICLES
     PARTICLE_COUNT — number of floating particles (default 55)
     PARTICLE_COLOR — r,g,b values matching your --accent color

   ✉  FORM SUBMISSION
     Find the comment "EDIT: Replace console.log" below and
     add your own newsletter / form API call there.
============================================================ */

/* ── EDIT THESE ─────────────────────────────────────────── */

// 🗓  Set your launch date (ISO format: 'YYYY-MM-DDTHH:MM:SS')
const launchDate = new Date('2026-12-31T00:00:00');

// ✦  Particle appearance
const PARTICLE_COUNT = 55;
const PARTICLE_COLOR = '232,255,71'; // r,g,b — match your --accent

/* ─────────────────────────────────────────────────────────── */


/* ── Custom Cursor ──────────────────────────────────────── */
const ring = document.getElementById('cursor-ring');
const dot  = document.getElementById('cursor-dot');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

function lerpCursor() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(lerpCursor);
}
lerpCursor();

document.querySelectorAll('[data-hover], button, input, a').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});


/* ── Particle System ────────────────────────────────────── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true); }

  reset(init) {
    this.x       = Math.random() * W;
    this.y       = init ? Math.random() * H : H + 10;
    this.r       = Math.random() * 1.4 + .3;
    this.vx      = (Math.random() - .5) * .3;
    this.vy      = -(Math.random() * .5 + .2);
    this.a       = 0;
    this.ta      = Math.random() * .55 + .1;
    this.life    = 0;
    this.maxLife = Math.random() * 300 + 200;
  }

  update() {
    this.life++;
    this.a = this.life < 60
      ? this.life / 60 * this.ta
      : this.life > this.maxLife - 60
        ? (this.maxLife - this.life) / 60 * this.ta
        : this.ta;
    this.x += this.vx;
    this.y += this.vy;
    if (this.life > this.maxLife) this.reset(false);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${PARTICLE_COLOR},${this.a})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* ── Countdown Timer ────────────────────────────────────── */
const elD = document.getElementById('cd-days');
const elH = document.getElementById('cd-hours');
const elM = document.getElementById('cd-mins');
const elS = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function flipUpdate(el, val) {
  const v = pad(val);
  if (el.textContent !== v) {
    el.classList.remove('flip');
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add('flip');
    el.textContent = v;
  }
}

function tick() {
  const now  = Date.now();
  const diff = launchDate - now;

  if (diff <= 0) {
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  const s = Math.floor(diff / 1000);
  flipUpdate(elD, Math.floor(s / 86400));
  flipUpdate(elH, Math.floor((s % 86400) / 3600));
  flipUpdate(elM, Math.floor((s % 3600) / 60));
  flipUpdate(elS, s % 60);
}

tick();
setInterval(tick, 1000);


/* ── Progress Bar ───────────────────────────────────────── */
const fill = document.getElementById('progressFill');
const pct  = parseInt(fill.dataset.pct, 10) || 72;
document.getElementById('pctLabel').textContent = pct + '%';

// Delay so the CSS transition plays after page load
setTimeout(() => { fill.style.width = pct + '%'; }, 1400);


/* ── Notify / Email Form ────────────────────────────────── */
document.getElementById('notifyBtn').addEventListener('click', () => {
  const emailInput = document.getElementById('emailInput');
  const email      = emailInput.value.trim();
  const re         = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!re.test(email)) {
    // Flash invalid state
    const accent2 = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent2').trim();
    emailInput.style.outline = `1px solid ${accent2}`;
    setTimeout(() => { emailInput.style.outline = ''; }, 1200);
    return;
  }

  // ✉  EDIT: Replace this console.log with your own submission logic.
  // Examples:
  //   fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
  //   mailchimp.subscribe(email);
  console.log('Subscriber email:', email);

  document.getElementById('notifyForm').style.display    = 'none';
  document.getElementById('notifySuccess').style.display = 'block';
});

document.getElementById('emailInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('notifyBtn').click();
});


/* ── Hero Tilt (mouse parallax) ─────────────────────────── */
const hero = document.querySelector('.hero');

document.addEventListener('mousemove', e => {
  const nx = (e.clientX / window.innerWidth  - .5) * 6;
  const ny = (e.clientY / window.innerHeight - .5) * 4;
  hero.style.transform =
    `perspective(900px) rotateY(${nx}deg) rotateX(${-ny}deg)`;
});
