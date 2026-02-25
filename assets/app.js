const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const langToggle = $('.lang-toggle');
const langMenu = $('.lang-menu');
if (langToggle && langMenu) {
  langToggle.addEventListener('click', () => {
    const open = langMenu.classList.toggle('open');
    langToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-wrap')) {
      langMenu.classList.remove('open');
      langToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const drawer = $('.mobile-drawer');
const drawerPanel = $('.drawer-panel');
const burger = $('.burger');
const closeDrawer = $('.drawer-close');
let lastFocus = null;

const focusables = () => $$('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])', drawerPanel);
const openDrawer = () => {
  lastFocus = document.activeElement;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('lock');
  focusables()[0]?.focus();
};
const closeDrawerFn = () => {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('lock');
  lastFocus?.focus();
};
burger?.addEventListener('click', openDrawer);
closeDrawer?.addEventListener('click', closeDrawerFn);
drawer?.addEventListener('click', (e) => { if (e.target === drawer) closeDrawerFn(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawerFn();
    closeModal();
  }
  if (drawer?.classList.contains('open') && e.key === 'Tab') {
    const f = focusables();
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

$$('.faq-question').forEach((q) => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    $$('.faq-item').forEach((el) => {
      const active = el === item && !el.classList.contains('open');
      el.classList.toggle('open', active);
      $('.faq-question', el).setAttribute('aria-expanded', active ? 'true' : 'false');
    });
  });
});

const modal = $('.modal');
const modalPanel = $('.modal-panel');
const openModalBtn = $('[data-open-modal]');
const closeModalBtns = $$('[data-close-modal], .modal-x');
const openModal = () => {
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  $('.modal-x')?.focus();
};
const closeModal = () => {
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
};
openModalBtn?.addEventListener('click', openModal);
closeModalBtns.forEach((b) => b.addEventListener('click', closeModal));
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

document.addEventListener('submit', (e) => {
  if (e.target.matches('.lead-form')) e.preventDefault();
});

const cap = $('.calc-capital');
const horizon = $('.calc-horizon');
const currency = $('.calc-currency');
const fmt = (symbol, num) => `${symbol}${Math.round(num).toLocaleString()}`;
const updateCalc = () => {
  if (!cap || !horizon || !currency) return;
  const c = +cap.value;
  const h = +horizon.value / 12;
  $$('.calc-value').forEach((v) => {
    const rate = +v.dataset.rate;
    v.textContent = fmt(currency.value, c * (1 + rate * h));
  });
};
[cap, horizon, currency].forEach((el) => el?.addEventListener('input', updateCalc));
updateCalc();

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: .12 });
$$('.section, .review-card, .kpi-strip article').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});
