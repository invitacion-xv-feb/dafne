# AGENTS.md

Static, mobile-first digital invitation (Spanish). No build system, dependencies, tests, or lint. Do not add a bundler/framework unless asked.

## Run

```bash
python3 -m http.server 8080   # from repo root, open http://localhost:8080
npx serve .                  # alternative
```

## Layout

- `index.html` — markup and fixed Spanish copy (messages, dress code, modals, opening video, music button).
- `css/styles.css` — all styling/animations; mobile styles first, desktop overrides under `@media (min-width: 768px)`.
- `js/main.js` — all behavior. `CONFIG` at the top is the source of truth for name, date, venue and guests. The Apps Script URL and WhatsApp number are constants inside `setupRsvp()`, not in `CONFIG`. Dynamic values are injected with `textContent`.
- `formulario.html` + `js/formulario.js` — standalone validation form; not linked from the invitation and it sends nothing.
- `README.md` — detailed behavior and personalization docs; update it when changing user-facing features. `CHANGELOG.md` (Keep a Changelog) records notable changes.

## Gotchas

- Dynamic text (including `?para=` / `?inv=` URL names) must stay `textContent`/text nodes, never `innerHTML` — this is the XSS boundary. Known exception: `venueAddress` lines in `fillContent()` use `innerHTML` (source is `CONFIG`, not user input); do not extend that pattern.
- RSVP URL overrides: `?para=Familia-Rivera&inv=Ana-Rivera,Juan-Rivera`; hyphens become spaces. The 40 chars/name and 10 guests limits are documented as pending and are NOT enforced in code. Each identity gets its own `localStorage` key (`xv-rsvp-v1-<slug>`). The WhatsApp-only RSVP mode is not implemented.
- RSVP submit posts to Apps Script with `mode: "no-cors"` (response unreadable, success cannot be verified) and opens `wa.me`. The click handler duplicates the payload/fetch/WhatsApp logic for the `para`-only and list flows.
- Backgrounds: mobile images are the CSS defaults; desktop overrides use `@media (min-width: 768px)`. Hero always uses `desktop/01-hero.jpeg` on both breakpoints (no mobile hero).
- Section overlap/wavy edges come from `.section--wave` negative margin + CSS masks; changing it requires adjusting `--wave-h` and mask offsets together.
- Parallax/reveal are configured with `data-speed`, `data-mouse`, `data-down-only`, `data-fade`. `prefers-reduced-motion` disables JS parallax/reveal and removes the opening video, so keep the no-motion layout usable.
- Opening video (`.dream-video` inside `#mensaje`, `setupDreamVideo()`): covers the section and plays once at 1.2x. The circular reveal starts `LEAD_SECONDS` before the video ends, using a radial `mask-image` driven by the registered property `--hole`. `--hole` must start at `-40%` (not `0%`): at `0%` the mask center is semi-transparent and a white glow from the cream section shows through. Without JS (`.has-dream` missing) or on failure the video is hidden/removed. While `.has-dream:not(.is-finished)` the `.reveal` items in the section are held hidden.
- Music button (`#music-btn` + `#bg-music`): fixed bottom-right, play/pause toggle, loop, `preload="none"`, pauses on tab hide and resumes on return. It never autoplays.
- Rules modal opens only from `#open-rules` (dress-code section), not on page load. It has no × button (closes with ENTENDIDO or Esc). Both modals are native `<dialog>`; only the envelopes modal closes on backdrop click.
- Media is committed and large (`cabcion.mp3` ~11 MB, PNGs ~2 MB each). Do not move/rename assets without updating CSS; `desktop/-.png` and `mobile/-.png` are unused.
