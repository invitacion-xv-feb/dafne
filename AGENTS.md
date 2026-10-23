# AGENTS.md

Static, mobile-first digital invitation (Spanish). No build system, dependencies, tests, or lint. Do not add a bundler/framework unless asked.

## Run

```bash
python3 -m http.server 8080   # from repo root, open http://localhost:8080
npx serve .                  # alternative
```

## Layout

- `index.html` — markup and fixed Spanish copy (messages, dress code, modals).
- `css/styles.css` — all styling/animations; mobile styles first, desktop overrides under `@media (min-width: 768px)`.
- `js/main.js` — all behavior. `CONFIG` at the top is the source of truth for name, date, venue, guests, and WhatsApp; values are injected with `textContent`.
- `README.md` — detailed behavior and personalization docs; update it when changing user-facing features.

## Gotchas

- Dynamic text (including `?para=` / `?inv=` URL names) must stay `textContent`/text nodes, never `innerHTML` — this is the XSS boundary.
- RSVP URL overrides: `?para=Familia-Rivera&inv=Ana-Rivera,Juan-Rivera`; hyphens become spaces, max 40 chars/name and 10 guests. Each identity gets its own `localStorage` key (`xv-rsvp-v1-<slug>`). Empty `CONFIG.family`/`guests` switches to WhatsApp-only RSVP.
- Backgrounds: mobile images are the CSS defaults; desktop overrides use `@media (min-width: 768px)`. Hero always uses `desktop/01-hero.jpeg` on both breakpoints (no mobile hero).
- Section overlap/wavy edges come from `.section--wave` negative margin + CSS masks; changing it requires adjusting `--wave-h` and mask offsets together.
- Parallax/reveal are configured with `data-speed`, `data-mouse`, `data-down-only`, `data-fade`. `prefers-reduced-motion` disables JS parallax/reveal/video, so keep the no-motion layout usable.
- Rules modal opens only from `#open-rules`, not on page load (the `index.html` comment near `#rules-modal` is stale). Both modals are native `<dialog>`; only the envelopes modal closes on backdrop click.
- Media is committed and large (`cabcion.mp3` ~11 MB, PNGs ~2 MB each). Do not move/rename assets without updating CSS; `desktop/-.png` and `mobile/-.png` are unused.
