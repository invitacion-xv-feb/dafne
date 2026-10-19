# Invitación Digital — Mis XV Años

Página web de invitación (mobile-first) con animaciones: hero, mensaje con cuenta regresiva, recepción, lluvia de sobres, confirmación personalizada, código de vestimenta y agradecimiento.

## Prerrequisitos

- Cualquier navegador moderno (Chrome, Edge, Firefox, Safari).
- Opcional: Node.js o Python para servir los archivos localmente. No requiere build ni dependencias.
- Conexión a internet para cargar las fuentes de Google Fonts (Marcellus y Lato); sin ella se usan fuentes del sistema.

## Estructura de carpetas

```text
we/
├── index.html          # Estructura de la página
├── css/
│   └── styles.css      # Estilos y animaciones
├── js/
│   └── main.js         # Interacciones y configuración (CONFIG)
├── desktop/            # Fondos para pantallas >= 768 px
│   ├── 01-hero.jpeg
│   └── 02 … 07-*.png
├── mobile/             # Fondos para móvil (02 … 07-*.png)
├── web.jpeg            # Diseño de referencia
└── README.md
```

> El hero usa `desktop/01-hero.jpeg` tanto en escritorio como en móvil (recortado y enfocado en la quinceañera). Si más adelante agregas `mobile/01-hero.jpeg`, cambia la regla `.hero__bg` en `css/styles.css`.

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

1. Copia **toda** la carpeta `we/` (incluidas `desktop/` y `mobile/`), por ejemplo en un `.zip` o USB.
2. Descomprime y abre `index.html`. Las rutas son relativas, no necesitas reconfigurar nada.

## Personalización

Edita el objeto `CONFIG` al inicio de `js/main.js`:

| Campo | Descripción |
|---|---|
| `celebrantName` | Nombre de la quinceañera |
| `eventDate` | Fecha/hora del evento (`AAAA-MM-DDTHH:mm:ss`), alimenta la cuenta regresiva |
| `timeLabel`, `venueName`, `venueAddress` | Datos de la recepción |
| `mapUrl` | Enlace de Google Maps (si está vacío se genera una búsqueda con el lugar) |
| `family`, `guests`, `preselected` | Familia, lista de invitados e índices preseleccionados |

Los textos fijos (mensaje, lluvia de sobres, vestimenta) están en `index.html`.

## Animaciones incluidas

- Hero con zoom lento (Ken Burns), estrellas titilantes y botones con brillo.
- Aparición progresiva de textos al hacer scroll.
- Parallax multicapa (desktop y móvil): fondos, textos, estrellas y luciérnagas se mueven a distinta velocidad al hacer scroll; en desktop el hero reacciona además al mouse y en móvil a la inclinación del dispositivo (Android). Se ajusta con `data-speed`, `data-mouse`, `data-down-only` y `data-fade` en `index.html`.
- Transiciones entre secciones: el hero queda fijo y la siguiente sección lo cubre como cortina; la sección que sale se aleja y se atenúa; los fondos que entran hacen zoom-out; destellos dorados flotan en cada borde ondulado.
- Cuenta regresiva en vivo con efecto al cambiar cada dígito.
- Luciérnagas en la recepción, ícono de regalo flotante.
- Confirmación: casillas animadas, contador en vivo y chispas doradas al confirmar.
- Modal para "Ver cómo participar".
- Respeta `prefers-reduced-motion` (desactiva animaciones).

## Notas

- La confirmación se guarda únicamente en `localStorage` del navegador (demo). Para registrarla realmente se necesita un backend/API; los datos se renderizan con `textContent` para evitar XSS.
- Si quieres desplegarla: sube la carpeta a cualquier hosting estático (GitHub Pages, Azure Static Web Apps, Netlify).
