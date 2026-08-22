# PWA QA

## Generated icon

- Mode: built-in ImageGen
- Master: `public/pwa/busan-app-icon-master.png` — 1024 × 1024
- Install icons:
  - `public/pwa/icon-192.png` — 192 × 192
  - `public/pwa/icon-512.png` — 512 × 512
  - `public/pwa/icon-maskable-512.png` — 512 × 512 with a mask-safe inset
  - `public/pwa/apple-touch-icon.png` — 180 × 180
- Visual direction: Gwangan Bridge, rising lime sun, and marine waves on a deep forest-green field; no text or small-detail dependency.

## Installability checks

- `manifest.webmanifest` parses as valid JSON.
- Manifest response: HTTP 200 with `application/manifest+json`.
- Service worker response: HTTP 200 with `text/javascript`.
- Manifest includes `name`, `short_name`, `id`, `start_url`, `scope`, `standalone` display, theme/background colors, 192 px and 512 px any-purpose icons, and a 512 px maskable icon.
- Rendered HTML includes the manifest link, theme color, Apple web-app metadata, and Apple Touch icon.
- Production browser session at `http://localhost:4174/` reported `data-pwa-status="activated"` after registration and `navigator.serviceWorker.ready` resolved.
- Service worker install only activates after the core shell, manifest, and all install icons enter the versioned cache.
- Same-origin navigation uses network-first with cached-root fallback; same-origin assets use stale-while-revalidate. External Google Maps and Naver requests are not intercepted.
- Install prompt UI is progressive: the header button only appears after `beforeinstallprompt` and is removed after the prompt is used or the app is installed.

## Regression checks

- Production build: passed.
- ESLint: 0 errors; existing `next/no-img-element` performance warnings remain.
- Manifest syntax: passed.
- Service worker syntax: passed.
- Mobile viewport: no document-level overflow; all rendered images loaded.

final result: passed
