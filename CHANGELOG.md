# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]

### Added
- Modal "Información importante" (normas del evento), con botón "Ver normas del evento" en la sección de vestimenta.
- Video de apertura (`van-gogh-violin.mp4`) en la sección "Un sueño hecho realidad", con desvanecimiento circular que inicia antes de que termine el video.
- Botón flotante de música (play/pausa) para `cabcion.mp3`, con el estilo del indicador de scroll.
- `CHANGELOG.md`.

### Changed
- Video de apertura reproducido a 1.2x y desvanecimiento circular más suave (borde difuso y mayor duración).
- `README.md` y `AGENTS.md` actualizados para reflejar el comportamiento real: envío de confirmaciones a Google Sheets y WhatsApp, estructura de carpetas, fuentes, y limitaciones conocidas.

### Fixed
- Resplandor blanco en el centro del video de apertura (la máscara circular ahora inicia opaca).
