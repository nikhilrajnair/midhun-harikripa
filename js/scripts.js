// ── COUNTDOWN ──────────────────────────────────────────────────
// ★ Change this date/time to your actual wedding muhurtham
const WEDDING_DATE = new Date(2026, 3, 20, 11, 20, 0);
function tick() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    ['cd-d','cd-h','cd-m','cd-s'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const pad = n => String(n).padStart(2,'0');
  document.getElementById('cd-d').textContent = pad(Math.floor(diff / 86400000));
  document.getElementById('cd-h').textContent = pad(Math.floor((diff % 86400000) / 3600000));
  document.getElementById('cd-m').textContent = pad(Math.floor((diff % 3600000) / 60000));
  document.getElementById('cd-s').textContent = pad(Math.floor((diff % 60000) / 1000));
}
tick(); setInterval(tick, 1000);

// ── NAVBAR ─────────────────────────────────────────────────────
const navbar  = document.getElementById('navbar');
const navLogo = document.getElementById('nav-logo');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.style.background    = scrolled ? 'rgba(255,248,240,.95)' : 'transparent';
  navbar.style.backdropFilter= scrolled ? 'blur(14px)' : 'none';
  navbar.style.boxShadow     = scrolled ? '0 2px 20px rgba(201,168,76,.1)' : 'none';
  navbar.style.paddingTop    = scrolled ? '.6rem' : '1rem';
  navbar.style.paddingBottom = scrolled ? '.6rem' : '1rem';
  navLogo.style.opacity      = scrolled ? '1' : '0';
}, { passive:true });

// ── SCROLL REVEAL ──────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold:0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── FLOATING PETALS ────────────────────────────────────────────
const PETALS = [
  `<svg width="14" height="18" viewBox="0 0 14 18" fill="none"><path d="M7 18C7 18 0 12 0 7C0 3.1 3.1 0 7 0C10.9 0 14 3.1 14 7C14 12 7 18 7 18Z" fill="#FFCBA4" opacity=".65"/></svg>`,
  `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 11C5.5 11 0 8 0 4.5C0 2 2 0 4.5 0C4.5 0 4.5 2.5 5.5 5.5C6.5 2.5 6.5 0 6.5 0C9 0 11 2 11 4.5C11 8 5.5 11 5.5 11Z" fill="#D4E8D4" opacity=".7"/></svg>`,
  `<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M4.5 0L5.8 3.7L9 4.5L5.8 5.3L4.5 9L3.2 5.3L0 4.5L3.2 3.7Z" fill="#C9A84C" opacity=".4"/></svg>`,
  `<svg width="10" height="13" viewBox="0 0 10 13" fill="none"><path d="M5 13C5 13 0 9 0 5C0 2.2 2.2 0 5 0C7.8 0 10 2.2 10 5C10 9 5 13 5 13Z" fill="#E8956D" opacity=".5"/></svg>`,
];
const petalWrap = document.getElementById('petal-wrap');
function spawnPetal() {
  const el = document.createElement('div');
  el.classList.add('petal');
  el.innerHTML = PETALS[Math.floor(Math.random() * PETALS.length)];
  const dur = 9 + Math.random() * 14;
  el.style.left = (Math.random() * 100) + 'vw';
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = (Math.random() * 6) + 's';
  petalWrap.appendChild(el);
  setTimeout(() => el.remove(), (dur + 6) * 1000);
}
for (let i = 0; i < 6; i++) spawnPetal();
setInterval(spawnPetal, 2400);

// ── LIGHTBOX ───────────────────────────────────────────────────
// All photos available in lightbox:
// index 0-2 = story photos, 3+ = gallery photos
const LB_PHOTOS = [
  'photo/IMG_3631.JPG',
  'photo/IMG_3644.JPG',
  'photo/IMG_3642.JPG',
  'photo/IMG_3645.JPG',
  'photo/IMG_3640.JPG',
  'photo/IMG_3633.JPG',
  'photo/IMG_3624.JPG',
  'photo/IMG_3626.JPG',
  'photo/IMG_3636.JPG',
  'photo/IMG_3637.JPG',
  'photo/IMG_3641.JPG',
  'photo/IMG_3643.JPG',
];
let lbIndex = 0;
const lb     = document.getElementById('lightbox');
const lbImg  = document.getElementById('lb-img');
const lbCnt  = document.getElementById('lb-counter');

function openLB(idx) {
  lbIndex = ((idx % LB_PHOTOS.length) + LB_PHOTOS.length) % LB_PHOTOS.length;
  lbImg.classList.add('fading');
  lbImg.src = LB_PHOTOS[lbIndex];
  lbImg.onload = () => lbImg.classList.remove('fading');
  lbCnt.textContent = (lbIndex + 1) + ' / ' + LB_PHOTOS.length;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}
function navLB(dir) {
  openLB(lbIndex + dir);
}

lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')       closeLB();
  if (e.key === 'ArrowRight')   navLB(1);
  if (e.key === 'ArrowLeft')    navLB(-1);
});

// Touch swipe in lightbox
let lbTouchX = 0;
lb.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive:true });
lb.addEventListener('touchend',   e => {
  const diff = lbTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) navLB(diff > 0 ? 1 : -1);
}, { passive:true });

// ── RSVP — RADIO PILLS ─────────────────────────────────────────
function selectAttending(val) {
  document.getElementById('attending-val').value = val;
  const yes = document.getElementById('pill-yes');
  const no  = document.getElementById('pill-no');
  yes.classList.remove('selected-yes','selected-no');
  no.classList.remove('selected-yes','selected-no');
  if (val === 'yes') yes.classList.add('selected-yes');
  else               no.classList.add('selected-no');
}

// ── RSVP — CHECKBOXES ──────────────────────────────────────────
function toggleCB(label) {
  const box  = label.querySelector('.cb-box');
  const real = label.querySelector('input[type=checkbox]');
  real.checked = !real.checked;
  box.classList.toggle('checked', real.checked);
}

// ── RSVP — GUESTS ──────────────────────────────────────────────
function adjustGuests(delta) {
  const inp = document.getElementById('guest-count');
  inp.value = Math.max(1, Math.min(20, parseInt(inp.value) + delta));
}

// ── RSVP — SUBMIT ──────────────────────────────────────────────
function handleRSVP(e) {
  e.preventDefault();
  const form = document.getElementById('rsvp-form');
  const err  = document.getElementById('form-err');
  const name = form.querySelector('[name=name]').value.trim();
  const email= form.querySelector('[name=email]').value.trim();
  const att  = document.getElementById('attending-val').value;
  if (!name || !email || !att) { err.classList.remove('hidden'); return; }
  err.classList.add('hidden');

  const payload = {
    name, email,
    phone:    form.querySelector('[name=phone]').value,
    attending: att,
    guests:   document.getElementById('guest-count').value,
    dietary:  form.querySelector('[name=dietary]').value,
    message:  form.querySelector('[name=message]').value,
  };

  // ── FORMSPREE INTEGRATION ──────────────────────────────────
  // 1. Create free account → formspree.io
  // 2. New form → copy form ID (looks like: xrgvjkwp)
  // 3. Uncomment below and replace YOUR_FORM_ID:
  //
  // fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //   method: 'POST',
  //   body: JSON.stringify(payload),
  //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  // }).then(r => r.ok ? showRSVPSuccess() : alert('Submission failed. Please try again.'));
  // return;

  console.log('RSVP:', payload);
  showRSVPSuccess();
}
function showRSVPSuccess() {
  document.getElementById('rsvp-form').style.display = 'none';
  const s = document.getElementById('rsvp-success');
  s.classList.remove('hidden');
  s.scrollIntoView({ behavior:'smooth', block:'center' });
}

// ── SMOOTH SCROLL ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 64, behavior:'smooth' });
  });
});


// ── BACKGROUND MUSIC ────────────────────────────────────────────
const music    = document.getElementById('bg-music');
const btnEl    = document.getElementById('music-btn');
const pulse    = document.getElementById('music-pulse');
const iconPlay = document.getElementById('icon-play');
const iconPause= document.getElementById('icon-pause');
let   playing  = false;

function setPlaying(state) {
  playing = state;
  iconPlay.style.display  = state ? 'none'  : '';
  iconPause.style.display = state ? ''      : 'none';
  pulse.classList.toggle('active', state);
  btnEl.style.backgroundPosition = state ? 'right center' : '';
}

function toggleMusic() {
  if (playing) {
    music.pause();
    setPlaying(false);
  } else {
    music.play().then(() => setPlaying(true)).catch(() => {});
  }
}

// ── VOLUME CONTROL ──────────────────────────────────────────────
const volPanel  = document.getElementById('volume-panel');
const volSlider = document.getElementById('volume-slider');
const volLabel  = document.getElementById('vol-label');
const controls  = document.getElementById('music-controls');
let   volTimeout;

function setVolume(v) {
  const val = parseInt(v, 10);
  music.volume = val / 100;
  volLabel.textContent = val + '%';
}

function showVolume() {
  clearTimeout(volTimeout);
  volPanel.style.opacity = '1';
  volPanel.style.pointerEvents = 'auto';
  volPanel.style.transform = 'translateY(0)';
}
function hideVolume() {
  volTimeout = setTimeout(() => {
    volPanel.style.opacity = '0';
    volPanel.style.pointerEvents = 'none';
    volPanel.style.transform = 'translateY(8px)';
  }, 400);
}

controls.addEventListener('mouseenter', showVolume);
controls.addEventListener('mouseleave', hideVolume);
// Long-press on mobile to show volume
let lpTimer;
controls.addEventListener('touchstart', () => { lpTimer = setTimeout(showVolume, 400); }, { passive:true });
controls.addEventListener('touchend', () => { clearTimeout(lpTimer); hideVolume(); }, { passive:true });
volPanel.addEventListener('touchstart', (e) => { e.stopPropagation(); clearTimeout(volTimeout); showVolume(); }, { passive:true });

// Try auto-playing immediately (works for file:// and localhost)
music.volume = 0.35;
music.play().then(() => setPlaying(true)).catch(() => {
  // Browser blocked autoplay — start on first user interaction instead
  function startOnInteraction() {
    music.play().then(() => setPlaying(true)).catch(() => {});
    document.removeEventListener('click',      startOnInteraction);
    document.removeEventListener('touchstart', startOnInteraction);
    document.removeEventListener('scroll',     startOnInteraction);
  }
  document.addEventListener('click',      startOnInteraction, { once: true });
  document.addEventListener('touchstart', startOnInteraction, { once: true, passive: true });
  document.addEventListener('scroll',     startOnInteraction, { once: true, passive: true });
});
