# MyBinder — Sito vetrina

Landing page statica per l'app iOS **MyBinder**.
Solo HTML, CSS e JavaScript vanilla: nessun build, nessuna dipendenza, pronta da caricare su qualsiasi hosting statico.

---

## Struttura del progetto

```
MyBinder-Site/
├─ index.html              ← la pagina (tutte le sezioni)
├─ privacy.html            ← Privacy Policy (richiesta da Apple)
├─ terms.html              ← Termini di servizio / EULA (richiesti con abbonamenti)
├─ robots.txt              ← SEO (ricordati di aggiornare il dominio)
├─ styles/
│  └─ style.css            ← tutto lo stile e la palette
├─ scripts/
│  └─ main.js              ← navbar, animazioni, form, link App Store
└─ assets/
   ├─ app-icon.png         ← icona dell'app (già inserita)
   ├─ og-image.png         ← (DA AGGIUNGERE) immagine social 1200×630
   └─ screenshots/
      ├─ screenshot-home.png
      ├─ screenshot-scan.png
      ├─ screenshot-binder.png
      ├─ screenshot-value.png
      └─ screenshot-premium.png
```

---

## Come avviarlo in locale

Essendo un sito statico, basta aprire `index.html` nel browser.
Per vederlo come in produzione (percorsi corretti) usa un piccolo server locale:

```bash
# con Python (già presente sul Mac)
cd MyBinder-Site
python3 -m http.server 8080
# poi apri http://localhost:8080
```

oppure, se hai Node:

```bash
npx serve .
```

---

## Cosa sostituire (le cose marcate con TODO nel codice)

1. **Link App Store** — apri `scripts/main.js` e incolla l'URL in `APP_STORE_URL`.
   Verrà applicato automaticamente a TUTTI i pulsanti "Scarica". Niente da toccare nell'HTML.

2. **Screenshot reali** — metti i file PNG nella cartella `assets/screenshots/`
   usando gli stessi nomi indicati sopra. Finché mancano, viene mostrato un
   placeholder blu elegante (nessun riquadro rotto).

3. **Icona app** — è già `assets/app-icon.png`. Per sostituirla, sovrascrivi quel file.

4. **Immagine social (Open Graph)** — aggiungi `assets/og-image.png` (1200×630 px):
   è l'anteprima che appare quando condividi il link su WhatsApp, X, Facebook, ecc.

5. **Privacy Policy e Termini** — già pronte (`privacy.html` e `terms.html`) e collegate nel footer.
   Dentro a ciascuna pagina compila le parti evidenziate in giallo (nome titolare, indirizzo,
   email, foro competente) e aggiorna la data quando le modifichi. Sono modelli di base, non
   consulenza legale: una revisione di un professionista è consigliata prima della pubblicazione.
   Su App Store Connect inserisci l'URL pubblico di `privacy.html` come "Privacy Policy URL".

6. **Email di contatto** — nel footer è `hello@mybinder.app`: cambiala con la tua.

7. **Dominio** — aggiorna `robots.txt` e i tag `og:url` / `canonical` in `index.html`
   con il dominio definitivo una volta acquistato.

8. **Form Android (waitlist)** — è statico (mostra solo un grazie). Per riceverlo
   davvero via email, segui i commenti in `scripts/main.js` → `handleWaitlist`
   (consigliato: Formspree, zero backend).

---

## Come pubblicarlo su hosting statico

Carica **l'intera cartella** (con la stessa struttura) sul tuo hosting. Opzioni gratuite/semplici:

- **Netlify** o **Vercel** — trascini la cartella e ottieni un sito online in pochi secondi; poi colleghi il dominio.
- **Cloudflare Pages** — stessa logica, velocissimo.
- **GitHub Pages** — carichi la cartella in un repo e attivi Pages.
- **Hosting classico (cPanel/FTP)** — carichi i file nella cartella `public_html` (o equivalente).

In tutti i casi `index.html` deve restare nella radice del sito.

---

## Note

- Mobile-first, responsive, accessibile (rispetta `prefers-reduced-motion`).
- SEO di base inclusa: `<title>`, meta description, Open Graph, Twitter card, favicon.
- Nessun prezzo è presentato come garantito: si parla sempre di "stime" e "prezzi di riferimento".
