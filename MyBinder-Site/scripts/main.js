/* ===================================================================
   MyBinder — Landing page · interazioni
   JavaScript vanilla, nessuna dipendenza.
   =================================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------------
     1) Navbar: aggiunge ombra/bordo dopo lo scroll
  ------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------------------------------
     2) Reveal on scroll (animazioni leggere)
  ------------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
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
    // Fallback: mostra tutto
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* -------------------------------------------------------------
     3) Form waitlist Android (statico)

     Per ora NON invia nulla: mostra solo un messaggio di conferma.
     Per attivarlo davvero scegli un servizio e scommenta la parte
     corrispondente in handleWaitlist().
  ------------------------------------------------------------- */
  const form = document.getElementById('waitlist-form');
  const msg = document.getElementById('waitlist-msg');

  function handleWaitlist(event) {
    event.preventDefault();
    const email = form.querySelector('input[name="email"]').value.trim();
    if (!email) return;

    // ---- OPZIONE A · Formspree (consigliata, zero backend) ----
    // 1. Crea un form su https://formspree.io e copia il tuo endpoint.
    // 2. Sostituisci l'action del <form> in index.html con quell'URL
    //    e rimuovi questo handler, oppure usa il fetch qui sotto:
    //
    // fetch('https://formspree.io/f/XXXXXXXX', {
    //   method: 'POST',
    //   headers: { 'Accept': 'application/json' },
    //   body: new FormData(form)
    // })
    //   .then(() => showThanks())
    //   .catch(() => showError());
    // return;

    // ---- OPZIONE B · Supabase / Firebase ----
    // Inserisci qui la chiamata al tuo backend (insert su tabella email).

    // ---- Comportamento attuale (statico) ----
    showThanks();
  }

  function showThanks() {
    if (msg) msg.textContent = 'Grazie! Ti avviseremo appena MyBinder arriva su Android.';
    if (form) form.reset();
  }

  function showError() {
    if (msg) msg.textContent = 'Qualcosa è andato storto. Riprova più tardi.';
  }

  if (form) form.addEventListener('submit', handleWaitlist);

  /* -------------------------------------------------------------
     4) Link App Store centralizzato

     Imposta qui una sola volta l'URL reale dell'App Store: verrà
     applicato a TUTTI i pulsanti con attributo data-appstore.
  ------------------------------------------------------------- */
  const APP_STORE_URL = ''; // <-- TODO: incolla qui l'URL App Store (es. https://apps.apple.com/app/id000000000)
  if (APP_STORE_URL) {
    document.querySelectorAll('[data-appstore]').forEach((a) => {
      a.setAttribute('href', APP_STORE_URL);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  }
})();
