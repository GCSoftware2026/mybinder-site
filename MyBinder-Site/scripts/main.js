/* ===================================================================
   MyBinder — Landing page · interazioni + i18n
   JavaScript vanilla, nessuna dipendenza.
   =================================================================== */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------
     0) Link App Store centralizzato
     Imposta UNA volta l'URL: si applica a tutti i [data-appstore].
  ------------------------------------------------------------- */
  const APP_STORE_URL = ''; // <-- TODO: incolla qui l'URL App Store (es. https://apps.apple.com/app/idXXXXXXXXX)
  if (APP_STORE_URL) {
    document.querySelectorAll('[data-appstore]').forEach((a) => {
      a.setAttribute('href', APP_STORE_URL);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }

  /* -------------------------------------------------------------
     1) i18n — lingua IT / EN
     Le due versioni sono nel DOM (span data-lang); il CSS mostra
     solo quella attiva in base a <html lang>. Qui gestiamo scelta,
     persistenza, auto-detect, placeholder e <title>.
  ------------------------------------------------------------- */
  const SUPPORTED = ['it', 'en'];
  const STORE_KEY = 'mybinder.lang';

  // Le singole pagine possono sovrascrivere title/description definendo
  // window.MB_META prima di caricare questo script (vedi privacy.html / terms.html).
  const META = window.MB_META || {
    it: {
      title: 'MyBinder — Il tuo binder digitale per carte collezionabili',
      desc: "MyBinder è l'app premium per iPhone e iPad per scansionare, organizzare e monitorare il valore della tua collezione di carte TCG."
    },
    en: {
      title: 'MyBinder — Your digital binder for collectible cards',
      desc: 'MyBinder is the premium iPhone and iPad app to scan, organize and track the value of your TCG card collection.'
    }
  };

  function detectLang() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || 'it').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : 'it';
  }

  function setLang(lang, persist) {
    if (!SUPPORTED.includes(lang)) lang = 'it';
    document.documentElement.lang = lang;
    if (persist) localStorage.setItem(STORE_KEY, lang);

    // <title> + meta description
    const m = META[lang];
    if (m) {
      document.title = m.title;
      const md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute('content', m.desc);
    }

    // Placeholder dei campi (attributo, non testo)
    document.querySelectorAll('[data-ph-' + lang + ']').forEach((el) => {
      el.setAttribute('placeholder', el.getAttribute('data-ph-' + lang));
    });

    // Stato dei bottoni switch
    document.querySelectorAll('[data-setlang]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-setlang') === lang);
    });
  }

  // bottoni switch
  document.querySelectorAll('[data-setlang]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.getAttribute('data-setlang'), true));
  });

  // init
  setLang(detectLang(), false);

  /* -------------------------------------------------------------
     2) Navbar: ombra dopo lo scroll + barra di progresso
  ------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');

  function onScroll() {
    const y = window.scrollY || 0;
    if (nav) nav.classList.toggle('is-scrolled', y > 8);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------------------------------
     3) Reveal on scroll (a cascata via data-delay nel CSS)
  ------------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* -------------------------------------------------------------
     4) Count-up dei numeri (stats)
  ------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          const dur = 1100;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------------------
     5) Tilt 3D leggero sui mockup (solo dispositivi con mouse)
  ------------------------------------------------------------- */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && !prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const MAX = 8; // gradi
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'rotateY(' + (px * MAX) + 'deg) rotateX(' + (-py * MAX) + 'deg) translateZ(0)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'rotateY(0) rotateX(0)';
      });
    });
  }

  /* -------------------------------------------------------------
     6) Form waitlist Android (statico)
     Per attivarlo davvero scegli un servizio e scommenta sotto.
  ------------------------------------------------------------- */
  const form = document.getElementById('waitlist-form');
  const msg = document.getElementById('waitlist-msg');

  function handleWaitlist(event) {
    event.preventDefault();
    const input = form.querySelector('input[name="email"]');
    if (!input || !input.value.trim()) return;

    // ---- OPZIONE A · Formspree (consigliata, zero backend) ----
    // 1. Crea un form su https://formspree.io e copia l'endpoint.
    // 2. Sostituisci con:
    // fetch('https://formspree.io/f/XXXXXXXX', {
    //   method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form)
    // }).then(() => showMsg(true)).catch(() => showMsg(false));
    // return;

    // ---- OPZIONE B · Supabase / Firebase ----
    // Inserisci qui la chiamata al tuo backend.

    // ---- Comportamento attuale (statico) ----
    showMsg(true);
  }

  function showMsg(ok) {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'it';
    const txt = {
      it: ok ? 'Grazie! Ti avviseremo appena MyBinder arriva su Android.' : 'Qualcosa è andato storto. Riprova più tardi.',
      en: ok ? "Thanks! We'll let you know as soon as MyBinder lands on Android." : 'Something went wrong. Please try again later.'
    };
    if (msg) msg.textContent = txt[lang];
    if (ok && form) form.reset();
  }

  if (form) form.addEventListener('submit', handleWaitlist);
})();
