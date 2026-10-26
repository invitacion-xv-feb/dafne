# Invitación Digital — Mis XVI Años

Página web de invitación (mobile-first) con animaciones: hero, mensaje con video de apertura y cuenta regresiva, recepción, lluvia de sobres, confirmación personalizada, código de vestimenta con normas del evento y agradecimiento.

## Prerrequisitos

- Cualquier navegador moderno (Chrome, Edge, Firefox, Safari).
- Opcional: Node.js o Python para servir los archivos localmente. No requiere build ni dependencias.
- Conexión a internet para cargar las fuentes de Google Fonts (Cormorant Garamond y Montserrat); sin ella se usan fuentes del sistema.

## Variables de entorno

No aplica: el proyecto es estático y no usa variables de entorno. Los valores de configuración están en `CONFIG` y dentro de `setupRsvp()` en `js/main.js` (ver [Personalización](#personalización)).

## Estructura de carpetas

```text
./
├── index.html          # Estructura de la página y textos fijos
├── css/
│   └── styles.css      # Estilos y animaciones
├── js/
│   ├── main.js         # Interacciones y configuración (CONFIG)
│   └── formulario.js   # Validación de formulario.html (independiente)
├── formulario.html     # Formulario suelto de validación; no está enlazado desde la invitación
├── cabcion.mp3         # Música de fondo (~11 MB; se descarga solo al presionar play)
├── van-gogh-violin.mp4 # Video de apertura de la sección 2 (4.3 s, sin audio)
├── desktop/            # Fondos para pantallas >= 768 px
│   ├── 01-hero.jpeg
│   ├── 02 … 07-*.png
│   └── icono-lluvia-de-sobres.svg
├── mobile/             # Fondos para móvil (02 … 07-*.png)
├── web.jpeg            # Diseño de referencia
├── AGENTS.md           # Guía para agentes de código
├── CHANGELOG.md        # Historial de cambios
└── README.md
```

> `desktop/-.png` y `mobile/-.png` no se usan en la página.
>
> El hero usa `desktop/01-hero.jpeg` tanto en escritorio como en móvil (recortado y enfocado en la festejada). Si más adelante agregas `mobile/01-hero.jpeg`, cambia la regla `.hero__bg` en `css/styles.css`.

## Setup local

Opción 1 — abrir `index.html` con doble clic.

Opción 2 — servidor local:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Abrir `http://localhost:8080`.

## Llevar el proyecto a otra máquina

1. Copia **toda** la carpeta del proyecto (incluidas `desktop/` y `mobile/`), por ejemplo en un `.zip` o USB.
2. Descomprime y abre `index.html`. Las rutas son relativas, no necesitas reconfigurar nada.

## Personalización

Edita el objeto `CONFIG` al inicio de `js/main.js`:

| Campo | Descripción |
|---|---|
| `celebrantName` | Nombre de la festejada |
| `eventDate` | Fecha/hora del evento (`AAAA-MM-DDTHH:mm:ss`), alimenta la cuenta regresiva |
| `timeLabel`, `venueName` | Hora y nombre del lugar de la recepción |
| `venueAddress` | Dirección: una lista de renglones (o un solo texto) |
| `mapUrl` | Enlace de Google Maps (si está vacío se genera una búsqueda con el lugar) |
| `family`, `guests` | Familia y lista de invitados |
| `storageKey` | Prefijo de la clave de `localStorage` donde se guarda la confirmación |

El destino del envío de confirmaciones y el número de WhatsApp **no están en `CONFIG`**: son las constantes `WEBAPP_URL` (Google Apps Script) y `WHATSAPP_NUMBER` (con lada de país y sin `+`) al inicio de `setupRsvp()` en `js/main.js`.

Los textos fijos (mensaje, lluvia de sobres, vestimenta, normas del evento) están en `index.html`.

## Enlaces personalizados

La sección de confirmación se puede rellenar desde la URL (los guiones se muestran como espacios):

```text
https://TU-DOMINIO/?para=Familia-Rivera&inv=Daniel-Rivera,Juan-Rivera,Ana-Rivera
```

| Parámetro | Efecto |
|---|---|
| `para` | Nombre de la familia (ej. `Familia-Rivera` → "Familia Rivera") |
| `inv` | Lista de invitados separados por comas. Si no existe, solo se muestra el botón de confirmar y se confirma con el valor de `para` como único invitado |

- Al llegar por URL **no se muestra** la frase de asientos y **no hay** invitados premarcados.
- Los textos se insertan con `textContent` (nunca como HTML).
- Cualquiera que tenga el enlace puede cambiar los parámetros: es personalización visual, no validación de identidad.
- Cada enlace guarda su confirmación en `localStorage` con una clave derivada de `para`/`inv`: las respuestas de distintas familias no se mezclan en el mismo navegador.
- Sin parámetros, `CONFIG.family` y `CONFIG.guests` están vacíos, por lo que la lista de invitados queda vacía y, al confirmar, se pide seleccionar al menos un invitado.

> **Pendiente:** no hay límite de longitud (40 caracteres por nombre) ni de cantidad (10 invitados) aplicado en el código. Los parámetros de la URL solo se limpian de guiones y espacios.
>
> **Pendiente:** el modo "confirmación solo por WhatsApp" con `family` y `guests` vacíos no está implementado.

## Confirmación de asistencia

Al presionar **Confirmar asistencia**:

1. Se guarda la selección en `localStorage`.
2. Se envía un POST (`mode: "no-cors"`) al Google Apps Script con familia, invitados, cantidad, URL de origen y `userAgent`. Al ser `no-cors`, la página **no puede verificar** si el registro se guardó.
3. Se abre WhatsApp (`wa.me`) con un mensaje prellenado.

Si hay lista de invitados, hay que seleccionar al menos uno.

## Animaciones incluidas

- Hero con zoom lento (Ken Burns), estrellas titilantes y botones con brillo.
- Aparición progresiva de textos al hacer scroll.
- Parallax multicapa (desktop y móvil): fondos, textos, estrellas y luciérnagas se mueven a distinta velocidad al hacer scroll; en desktop el hero reacciona además al mouse y en móvil a la inclinación del dispositivo (Android). Se ajusta con `data-speed`, `data-mouse`, `data-down-only` y `data-fade` en `index.html`.
- Transiciones entre secciones: el hero queda fijo y la siguiente sección lo cubre como cortina; la sección que sale se aleja y se atenúa; los fondos que entran hacen zoom-out; destellos dorados flotan en cada borde ondulado.
- **Video de apertura en la sección 2** (`van-gogh-violin.mp4`, `setupDreamVideo`): cubre la sección al llegar (60% visible), se reproduce una vez a 1.2x y, cuando faltan unos 2 s para que termine (`LEAD_SECONDS`), se desvanece en círculo desde el centro (máscara radial con `@property --hole`) mientras sigue en movimiento, para dejar ver el mensaje y la cuenta regresiva. Los textos esperan para revelarse hasta que se abre el círculo. Si el video falla, el navegador bloquea el autoplay o el usuario prefiere movimiento reducido, no se muestra el video y la sección se ve directamente. En navegadores sin soporte de `@property`, el video desaparece sin efecto circular.
- Cuenta regresiva en vivo con efecto al cambiar cada dígito.
- Luciérnagas en la recepción, ícono de regalo flotante.
- Confirmación: casillas animadas, contador en vivo y chispas doradas al confirmar.
- **Música de fondo** (`cabcion.mp3`): botón flotante abajo a la derecha (`#music-btn`) que alterna play y pausa, con estilo del indicador de scroll. Reproduce en bucle, no suena sola por la política de autoplay de los navegadores, se pausa si cambias de pestaña y se reanuda al volver.
- **Modal "Información importante"** (normas del evento): se abre con el botón "Ver normas del evento" de la sección de vestimenta y se cierra con ENTENDIDO o la tecla Esc (no tiene botón ×). Su texto está en `index.html` (`#rules-modal`).
- Modal para "Ver cómo participar" (lluvia de sobres); este sí se cierra también al hacer clic en el fondo.
- Respeta `prefers-reduced-motion` (desactiva animaciones y el video de apertura).

## Notas

- La confirmación se envía a un Google Sheet mediante Apps Script y a WhatsApp, y además se guarda en `localStorage` para recordar la selección en ese navegador. El Web App de Apps Script es público: conviene validar y limitar los datos del lado del script.
- Los datos dinámicos se renderizan con `textContent` para evitar XSS. Excepción conocida: `venueAddress` (lista de renglones) se inserta con `innerHTML`; su origen es `CONFIG`, no el usuario, pero conviene migrarlo a nodos de texto.
- Hay `console.log` del payload de confirmación; conviene retirarlo en producción.
- Si quieres desplegarla: sube la carpeta a cualquier hosting estático (GitHub Pages, Azure Static Web Apps, Netlify).
