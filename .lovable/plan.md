## Objetivo

Reemplazar el fondo estático del hero de la home por un **video corto en loop** generado con Remotion, manteniendo textos, botones, badge y overlay exactamente como están.

Nota: en la iteración anterior ya se aplicó un efecto Ken Burns por CSS. Este plan lo **sustituye** por un video MP4 real (más rico visualmente) generado con la skill `video-creator`.

## Video a generar

- **Duración:** 10s en loop (300 frames a 30fps).
- **Resolución:** 1920×1080, H.264, sin audio (mute).
- **Dirección creativa — "La Paz market drift":**
  - Paleta: azul primario `#1D4ED8`, acento cálido `#F59E0B`, neutros `#0F172A` y `#F8FAFC`, base cielo `#DCE7F5`.
  - Tipografía: no aplica (el video es solo fondo, sin texto — el copy vive en el DOM encima).
  - Motion: cámara lenta tipo "drift" con parallax de 3 capas — cielo con paraguas de colores flotando, siluetas de puestos del mercado en midground con leve sway, y en foreground granos/partículas de luz que atraviesan el encuadre. Sin cortes: un solo plano continuo que respira.
  - Motivos: paraguas triangulares/redondos como shapes SVG animados, líneas finas de "cables" oscilando, luces bokeh suaves.
- **Sin texto en el video** (para que el título/CTAs del DOM sean legibles y editables).
- **Overlay compatible:** el lado izquierdo debe quedar más oscuro/sencillo para no competir con el copy blanco; el lado derecho puede tener más color.

## Producción (skill video-creator)

1. Scaffold `remotion/` con `bun init`, instalar `remotion`, `@remotion/cli`, `@remotion/renderer`, `@remotion/bundler`, `@remotion/transitions`, `@remotion/compositor-linux-x64-musl`, react, react-dom, typescript, @types/react. Parchear el binario compositor gnu y symlinks de ffmpeg/ffprobe.
2. `src/Root.tsx`: composición `id="hero-loop"`, 1920×1080, 30fps, 300 frames.
3. `src/HeroLoop.tsx`: una sola escena con capas persistentes (sin `TransitionSeries`, para que el loop no tenga costura):
   - **Sky layer:** gradiente animado + ~14 paraguas SVG posicionados con parallax lento (`interpolate` sinusoidal por frame, distintos offsets/velocidades).
   - **Mid layer:** siluetas de edificios/puestos con leve translateY oscilante.
   - **Front layer:** ~30 partículas de luz (bokeh) desplazándose diagonalmente, opacidad pulsante.
   - **Vignette:** overlay radial oscuro por la izquierda (para asegurar contraste con el copy del hero).
   - Movimiento pensado como **loop perfecto**: valores en frame 0 y frame 300 coinciden (funciones sin/cos con periodo múltiplo de la duración).
4. Render con script programático (`scripts/render-remotion.mjs`, `chromeMode: "chrome-for-testing"`, `muted: true`, concurrency 1) → `/mnt/documents/hero-loop.mp4`.
5. Spot-check con `bunx remotion still` en frames 0/75/150/225/299 para validar continuidad del loop.

## Integración en la web

1. Subir el MP4 renderizado como asset de Lovable: `lovable-assets create --file /mnt/documents/hero-loop.mp4 --filename hero-loop.mp4 > src/assets/hero-loop.mp4.asset.json`.
2. En `src/components/home/HeroSection.tsx`:
   - Reemplazar el `div.hero-kenburns` por un `<video>` con `autoPlay muted loop playsInline preload="metadata"` y `poster={heroBanner}` (fallback al JPG actual mientras carga o si el usuario tiene datos limitados).
   - Clases: `absolute inset-0 w-full h-full object-cover`.
   - Mantener overlay, contenido, badge y botones sin cambios.
3. En `src/index.css`: retirar `@keyframes kenburns` y la clase `.hero-kenburns` (ya no se usa).
4. Accesibilidad: `<video>` con `aria-hidden="true"`, sin controles, respeta autoplay policies (muted).
5. `prefers-reduced-motion: reduce` → no reproducir el video: renderizar solo la imagen `heroBanner` como fondo. Se maneja con un pequeño hook `useReducedMotion` (o `matchMedia` inline en el componente, sin dependencias).

## Fuera de alcance

- No se toca copy, botones, badge ni layout del hero.
- No se generan otros videos ni se cambian otras páginas.
- No se añaden librerías al bundle de la web (Remotion vive solo en `remotion/` y se usa offline para renderizar).
- No se sube audio (video muted).
