/* ==========================================================
   Invitación XV Años — comportamiento e interacciones
   Edita CONFIG para personalizar la invitación.
   ========================================================== */
(function () {
    'use strict';

    /* ---------- Configuración ---------- */
    const CONFIG = {
        celebrantName: 'Dafne Cuevas',
        // Fecha y hora local del evento (AAAA-MM-DDTHH:mm:ss)
        eventDate: '2027-02-27T19:00:00',
        timeLabel: '7:00 P. M.',
        venueName: '',
        // Cada elemento es un renglón (también se acepta un solo texto)
        venueAddress: ['P. de La Escondida Mz 51-Lt 7,', 'Hacienda Ojo de Agua,', '55770 Edo de Méx.'],
        mapUrl: 'https://maps.app.goo.gl/vukj82pesnh1y87v7', // Si se deja vacío se genera una búsqueda en Google Maps
        family: '',
        guests: [],
        storageKey: 'xv-rsvp-v1'
    };

    /* ---------- Personalización desde la URL ----------
        Ejemplo: ?para=Familia-Rivera&inv=Daniel-Rivera,Juan-Rivera,Ana-Rivera
        Los guiones se muestran como espacios. No hay asientos ni
        preselección cuando la llegada es por URL. */
    function applyUrlOverrides() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('para') && !params.has('inv')) return;

        const decode = (value) => (value || '').replace(/-/g, ' ').trim();

        const family = decode(params.get('para'));
        if (family) CONFIG.family = family;

        if (params.has('para') && (!params.has('inv') || !params.get('inv') || !params.get('inv').trim())) {
            CONFIG.guests = [family];
            const intro = document.querySelector('.rsvp__intro');
            const guestList = document.getElementById('guest-list');
            const count = document.querySelector('.rsvp__count');
            const note = document.querySelector('.rsvp__note');
            if (intro) intro.style.display = 'none';
            if (guestList) guestList.style.display = 'none';
            if (count) count.style.display = 'none';
            if (note) note.style.display = 'none';
            $('#seats-line').hidden = true;
        } else {
            const guests = (params.get('inv') || '')
                .split(',')
                .map(decode)
                .filter(Boolean);
            if (guests.length) CONFIG.guests = guests;
            $('#seats-line').hidden = true;
        }

        const identity = family || (CONFIG.guests && CONFIG.guests.join('|'));
        if (identity) {
            const slug = identity
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            if (slug) {
                CONFIG.storageKey = `${CONFIG.storageKey}-${slug}`;
            } else {
                let hash = 5381;
                for (let i = 0; i < identity.length; i++) {
                    hash = ((hash << 5) + hash + identity.charCodeAt(i)) >>> 0;
                }
                CONFIG.storageKey = `${CONFIG.storageKey}-${hash.toString(36)}`;
            }
        }
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (selector, root = document) => root.querySelector(selector);

    /* Lectura/escritura segura de localStorage */
    const storage = {
        get(key) {
            try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
        },
        set(key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin almacenamiento */ }
        }
    };

    const eventDate = new Date(CONFIG.eventDate);
    const pad = (n, size = 2) => String(n).padStart(size, '0');

    /* ---------- Contenido dinámico (siempre con textContent) ---------- */
    function fillContent() {
        $('#celebrant-name').textContent = CONFIG.celebrantName;
        $('#event-time').textContent = CONFIG.timeLabel;
        $('#venue-name').textContent = CONFIG.venueName;
        const venueAddressEl = $('#venue-address');
        if (Array.isArray(CONFIG.venueAddress)) {
            venueAddressEl.innerHTML = CONFIG.venueAddress.map(line => `<span>${line}</span>`).join('<br>');
        } else {
            venueAddressEl.textContent = CONFIG.venueAddress;
        }
        $('#family-name').textContent = CONFIG.family;
        $('#seats-total').textContent = CONFIG.guests.length;

        if (!isNaN(eventDate)) {
            $('#event-date-short').textContent =
                `${pad(eventDate.getDate())} · ${pad(eventDate.getMonth() + 1)} · ${eventDate.getFullYear()}`;
        }

        const query = encodeURIComponent(`${CONFIG.venueName} ${CONFIG.venueAddress}`);
        const mapUrl = CONFIG.mapUrl || `https://www.google.com/maps/search/?api=1&query=${query}`;
        $('#map-link').href = mapUrl;
    }

    /* ---------- Estrellas y luciérnagas ---------- */
    function buildStars() {
        document.querySelectorAll('.stars').forEach((layer) => {
            const count = layer.classList.contains('stars--dense') ? 46 : 28;
            const frag = document.createDocumentFragment();
            for (let i = 0; i < count; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                star.style.cssText =
                    `left:${Math.random() * 100}%;top:${Math.random() * 100}%;` +
                    `--s:${(Math.random() * 5 + 2).toFixed(1)}px;` +
                    `--d:${(Math.random() * 3 + 2).toFixed(1)}s;` +
                    `--delay:${(Math.random() * 4).toFixed(1)}s`;
                frag.appendChild(star);
            }
            layer.appendChild(frag);
        });

        document.querySelectorAll('.fireflies').forEach((layer) => {
            const frag = document.createDocumentFragment();
            for (let i = 0; i < 16; i++) {
                const fly = document.createElement('span');
                fly.className = 'firefly';
                fly.style.cssText =
                    `left:${Math.random() * 100}%;top:${40 + Math.random() * 55}%;` +
                    `--x:${(Math.random() * 80 - 40).toFixed(0)}px;` +
                    `--d:${(Math.random() * 5 + 5).toFixed(1)}s;` +
                    `--delay:${(Math.random() * 6).toFixed(1)}s`;
                frag.appendChild(fly);
            }
            layer.appendChild(frag);
        });
    }

    /* ---------- Revelado al hacer scroll ---------- */
    function setupReveal() {
        const items = document.querySelectorAll('.reveal');
        items.forEach((el) => el.style.setProperty('--i', el.dataset.delay || 0));

        if (!('IntersectionObserver' in window) || prefersReducedMotion) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        items.forEach((el) => observer.observe(el));
    }

    /* Destellos que flotan en el borde ondulado entre secciones */
    function buildSeamStars(sections) {
        sections.filter((s) => s.classList.contains('section--wave')).forEach((section) => {
            const layer = document.createElement('div');
            layer.className = 'seam';
            layer.setAttribute('aria-hidden', 'true');
            layer.dataset.parallax = '';
            layer.dataset.speed = '-130';

            for (let i = 0; i < 7; i++) {
                const spark = document.createElement('span');
                spark.className = 'seam__star';
                spark.textContent = '✦';
                spark.style.cssText =
                    `left:${(6 + Math.random() * 88).toFixed(1)}%;top:${(Math.random() * 90).toFixed(0)}px;` +
                    `--fs:${(0.6 + Math.random() * 1.1).toFixed(2)}rem;` +
                    `--d:${(2 + Math.random() * 3).toFixed(1)}s;--delay:${(Math.random() * 3).toFixed(1)}s`;
                layer.appendChild(spark);
            }
            section.appendChild(layer);
        });
    }

    /* ---------- Parallax (scroll + mouse/inclinación) ----------
       data-speed : px de desplazamiento por scroll (negativo = más rápido que la página)
       data-mouse : px de desplazamiento según mouse (desktop) o inclinación (móvil)
       data-down-only : el scroll solo desplaza hacia abajo (fondos del hero)
       data-fade  : se desvanece al salir de pantalla */
    function setupParallax() {
        if (prefersReducedMotion) return;

        const sections = [...document.querySelectorAll('.section')];
        buildSeamStars(sections);

        const layers = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
            el,
            host: el.closest('.section'),
            speed: parseFloat(el.dataset.speed) || 0,
            mouse: parseFloat(el.dataset.mouse) || 0,
            downOnly: el.hasAttribute('data-down-only'),
            fade: el.hasAttribute('data-fade'),
            // Fondos de secciones que entran: zoom-out al aparecer
            zoom: el.classList.contains('section__bg') && !el.closest('.hero'),
            visible: false
        }));

        // Efecto "cortina": la sección que sale se aleja y se atenúa mientras la siguiente la cubre
        const recede = sections
            .map((section, i) => ({
                inner: section.querySelector('.section__inner'),
                next: sections[i + 1]
            }))
            .filter((item) => item.inner && item.next);

        // El hero es sticky: calculamos su posición "natural" a partir del scroll
        const stickyRect = (host) => {
            // offsetTop de un sticky ya "pegado" cambia, por eso se usa el inicio de <main>
            const top = host.parentElement.offsetTop - window.scrollY;
            return { top, height: host.offsetHeight, bottom: top + host.offsetHeight };
        };

        const pointer = { x: 0, y: 0, tx: 0, ty: 0 }; // -1 .. 1
        let scrollDirty = true;
        let running = false;
        const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

        const render = () => {
            const vh = window.innerHeight;
            pointer.x += (pointer.tx - pointer.x) * 0.08;
            pointer.y += (pointer.ty - pointer.y) * 0.08;

            layers.forEach((layer) => {
                const rect = layer.host.classList.contains('hero')
                    ? stickyRect(layer.host)
                    : layer.host.getBoundingClientRect();
                layer.visible = rect.bottom > -100 && rect.top < vh + 100;
                if (!layer.visible) return;

                let progress = clamp((rect.top + rect.height / 2 - vh / 2) / vh, -1, 1);
                if (layer.downOnly) progress = Math.min(progress, 0);

                const y = -progress * layer.speed + pointer.y * layer.mouse;
                const x = pointer.x * layer.mouse;
                layer.el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;

                if (layer.zoom) {
                    layer.el.style.scale = (1 + Math.max(progress, 0) * 0.14).toFixed(3);
                }

                if (layer.fade) {
                    const out = clamp(-rect.top / (rect.height * 0.6), 0, 1);
                    layer.el.style.opacity = (1 - out).toFixed(2);
                }
            });

            recede.forEach(({ inner, next }) => {
                const coverage = clamp(1 - next.getBoundingClientRect().top / vh, 0, 1);
                inner.style.scale = (1 - coverage * 0.07).toFixed(3);
                inner.style.opacity = (1 - coverage * 0.55).toFixed(2);
            });
            scrollDirty = false;
        };

        const loop = () => {
            const settling = Math.abs(pointer.tx - pointer.x) > 0.001 || Math.abs(pointer.ty - pointer.y) > 0.001;
            if (scrollDirty || settling) render();
            requestAnimationFrame(loop);
        };
        const start = () => { if (!running) { running = true; requestAnimationFrame(loop); } };

        window.addEventListener('scroll', () => { scrollDirty = true; start(); }, { passive: true });
        window.addEventListener('resize', () => { scrollDirty = true; start(); });

        // Desktop: mouse
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            window.addEventListener('pointermove', (e) => {
                pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
                pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
                start();
            }, { passive: true });
        }

        // Móvil: inclinación del dispositivo (donde no requiere permiso, p. ej. Android)
        if ('DeviceOrientationEvent' in window &&
            typeof DeviceOrientationEvent.requestPermission !== 'function' &&
            window.matchMedia('(pointer: coarse)').matches) {
            window.addEventListener('deviceorientation', (e) => {
                if (e.gamma == null || e.beta == null) return;
                pointer.tx = clamp(e.gamma / 30, -1, 1);
                pointer.ty = clamp((e.beta - 45) / 30, -1, 1);
                start();
            }, { passive: true });
        }

        render();
        start();
    }

    /* ---------- Cuenta regresiva ---------- */
    function setupCountdown() {
        const targets = {
            days: $('#cd-days'),
            hours: $('#cd-hours'),
            minutes: $('#cd-minutes'),
            seconds: $('#cd-seconds')
        };

        const setValue = (el, text) => {
            if (el.textContent === text) return;
            el.textContent = text;
            el.classList.remove('tick');
            void el.offsetWidth; // reinicia la animación
            el.classList.add('tick');
        };

        const render = () => {
            const diff = Math.max(0, eventDate - new Date());
            const total = isNaN(diff) ? 0 : Math.floor(diff / 1000);
            setValue(targets.days, pad(Math.floor(total / 86400), 3));
            setValue(targets.hours, pad(Math.floor((total % 86400) / 3600)));
            setValue(targets.minutes, pad(Math.floor((total % 3600) / 60)));
            setValue(targets.seconds, pad(total % 60));
        };
        render();
        setInterval(render, 1000);
    }

    /* ---------- Confirmación de asistencia ---------- */
    function setupRsvp() {
        const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzX53aD-yfrq88ZdeL_66w30zDqs46hNpHxckBJZal8IEJl3b_p3dx_3rthrzPyg3tI/exec";
        const WHATSAPP_NUMBER = "525576886503";
        
        const list = $('#guest-list');
        const summary = $('#guest-summary');
        const countBox = summary.parentElement;
        const button = $('#confirm-btn');
        const label = $('#confirm-label');
        const status = $('#rsvp-status');
        const total = CONFIG.guests.length;

        const saved = storage.get(CONFIG.storageKey);
        const selected = new Set(
            saved && Array.isArray(saved.selected) ? saved.selected : []
        );
        let confirmed = Boolean(saved && saved.confirmed);

        const buttons = CONFIG.guests.map((name, index) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'guest';
            btn.setAttribute('role', 'checkbox');

            const box = document.createElement('span');
            box.className = 'guest__box';
            const text = document.createElement('span');
            text.textContent = name;

            btn.append(box, text);
            li.appendChild(btn);
            list.appendChild(li);

            btn.addEventListener('click', () => {
                if (selected.has(index)) selected.delete(index); else selected.add(index);
                confirmed = false;
                refresh(true);
            });
            return btn;
        });

        function refresh(animate) {
            buttons.forEach((btn, i) => {
                const on = selected.has(i);
                btn.classList.toggle('is-selected', on);
                btn.setAttribute('aria-checked', String(on));
            });
            const n = selected.size;
            summary.textContent = `${n} de ${total} ${n === 1 ? 'persona asistirá' : 'personas asistirán'}`;
            if (animate) {
                countBox.classList.remove('bump');
                void countBox.offsetWidth;
                countBox.classList.add('bump');
            }
            button.classList.toggle('is-confirmed', confirmed);
            label.textContent = confirmed ? 'ASISTENCIA CONFIRMADA' : 'CONFIRMAR ASISTENCIA';
            status.lastChild.textContent = confirmed
                ? ' ¡Gracias! Tu respuesta fue registrada.'
                : ' Su respuesta quedará registrada.';
        }

        button.addEventListener('click', () => {
            const paramsUrl = new URLSearchParams(window.location.search);
            if (paramsUrl.has('para') && (!paramsUrl.has('inv') || !paramsUrl.get('inv') || !paramsUrl.get('inv').trim())) {
                confirmed = true;
                const selectedNames = [CONFIG.family];
                const payload = {
                    family: CONFIG.family,
                    selectedNames: selectedNames,
                    count: selectedNames.length,
                    storageKey: CONFIG.storageKey,
                    origin: window.location.href,
                    userAgent: navigator.userAgent
                };
                
                storage.set(CONFIG.storageKey, { selected: [0], confirmed: true });
                selected.clear();
                selected.add(0);
                refresh(false);
                burst(button);
                
                try {
                    console.log("Enviando RSVP a Google Sheets:", payload);
                    fetch(WEBAPP_URL, {
                        method: "POST",
                        mode: "no-cors",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify(payload)
                    });
                    console.log("Petición RSVP enviada (no-cors)");
                } catch (e) {
                    console.warn("No se pudo enviar al Google Sheet:", e);
                }
                
            try {
                const waText = 
                    `*CONFIRMACIÓN XVI AÑOS*\n\n` +
                    `Familia: ${CONFIG.family}\n` +
                    `Invitados que asistirán: ${selectedNames.join(", ")}\n` +
                    `Total de personas: ${selectedNames.length}\n\n` +
                    `Confirmado desde: ${window.location.href}`;
                
                const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
                window.open(waUrl, '_blank');
            } catch (e) {
                console.warn("No se pudo abrir WhatsApp:", e);
            }
                return;
            }
            
            if (selected.size === 0) {
                alert("Selecciona al menos un invitado para confirmar.");
                return;
            }
            
            confirmed = true;
            const selectedNames = [...selected].map(i => CONFIG.guests[i]);
            const payload = {
                family: CONFIG.family,
                selectedNames: selectedNames,
                count: selectedNames.length,
                storageKey: CONFIG.storageKey,
                origin: window.location.href,
                userAgent: navigator.userAgent
            };
            
            storage.set(CONFIG.storageKey, { selected: [...selected], confirmed: true });
            refresh(false);
            burst(button);
            
            try {
                console.log("Enviando RSVP a Google Sheets:", payload);
                fetch(WEBAPP_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(payload)
                });
                console.log("Petición RSVP enviada (no-cors)");
            } catch (e) {
                console.warn("No se pudo enviar al Google Sheet:", e);
            }
            
            try {
                const waText = 
                    `*CONFIRMACIÓN XVI AÑOS*\n\n` +
                    `Familia: ${CONFIG.family}\n` +
                    `Invitados que asistirán: ${selectedNames.join(", ")}\n` +
                    `Total de personas: ${selectedNames.length}\n\n` +
                    `Confirmado desde: ${window.location.href}`;
                
                const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
                window.open(waUrl, '_blank');
            } catch (e) {
                console.warn("No se pudo abrir WhatsApp:", e);
            }
        });

        refresh(false);
    }

    /* Chispas doradas desde un elemento */
    function burst(origin) {
        if (prefersReducedMotion) return;
        const rect = origin.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const colors = ['#e8cc88', '#c9a14a', '#ffffff', '#f6e3b0'];

        for (let i = 0; i < 28; i++) {
            const spark = document.createElement('span');
            const angle = Math.random() * Math.PI * 2;
            const dist = 60 + Math.random() * 120;
            spark.className = 'spark';
            spark.style.cssText =
                `left:${cx}px;top:${cy}px;--c:${colors[i % colors.length]};` +
                `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px`;
            document.body.appendChild(spark);
            spark.addEventListener('animationend', () => spark.remove());
        }
    }

    /* ---------- Modal de lluvia de sobres ---------- */
    function setupModal() {
        const modal = $('#envelopes-modal');
        $('#open-envelopes').addEventListener('click', () => {
            if (typeof modal.showModal === 'function') modal.showModal();
        });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) modal.close(); // clic en el fondo
        });
    }

    /* ---------- Inicio ---------- */
    applyUrlOverrides();
    fillContent();
    buildStars();
    setupReveal();
    setupParallax();
    setupCountdown();
    setupRsvp();
    setupModal();
})();
