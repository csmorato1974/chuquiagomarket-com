## Objetivo

Rehacer el fondo animado del hero para que evoque claramente el **Illimani** (silueta realista al atardecer) en lugar de la actual línea genérica de montañas. Mantener paraguas flotantes, bokeh y overlay legibles.

Nota: en la iteración anterior ya se aplicó este cambio y el MP4 fue re-renderizado y subido. Este plan re-confirma la dirección por si quieres ajustar algún detalle antes de una nueva pasada.

## Cambios de dirección visual

- **Silueta del Illimani** al centro-derecha: tres cumbres características (Pico del Indio a la izq., Pico Central, Pico Sur dominante), con laderas largas cayendo hacia los flancos.
- **Nieve sutil**: parches blanco cálido (`#F5EEDC`) sólo sobre las cumbres, con brillo alpenglow tenue (`#FFB27A` → `#FF8C55`) en el lado derecho por la luz del sol.
- **Atmósfera de atardecer**:
  - Cielo: gradiente `#F4C27A` → `#E88A5C` → `#B85A3E`.
  - Sol bajo detrás del Pico Sur (glow radial ámbar semi-oculto por la cumbre).
  - Neblina cálida horizontal entre cordillera lejana e Illimani.
- **Capas de profundidad** (parallax lento, loop perfecto):
  1. Cordillera Real lejana (`#7A6A8A`, opacidad 0.45).
  2. Illimani nítido (`#2A2340`) con sombra en el flanco izquierdo.
  3. Colinas urbanas de La Paz en primer término (`#0F0A1F`) con ventanas ámbar titilantes.
- **Paraguas**: reducidos a 14 y confinados al lado izquierdo (`x < 0.55`) para no tapar la cumbre.
- **Bokeh**: reducido a 24 partículas, tonos ámbar/blanco cálido.
- **Vignette izquierda**: se conserva para legibilidad del copy.

## Producción (skill video-creator)

1. Editar `remotion/src/HeroLoop.tsx` con los cambios anteriores; mantener 300 frames a 30fps, 1920×1080, loop sin costura.
2. Spot-check con un frame extraído del render (`ffmpeg -ss 2 …`) para validar que el Illimani se lee.
3. Renderizar con `node scripts/render-remotion.mjs` → `/mnt/documents/hero-loop.mp4`.
4. Subir con `lovable-assets create` → sobrescribir `src/assets/hero-loop.mp4.asset.json`.

## Integración web

- **Sin cambios** en `src/components/home/HeroSection.tsx` (ya usa `heroLoop.url`).
- **Sin cambios** en `src/index.css`, textos, botones, badge ni layout.

## Fuera de alcance

- No se cambia `heroBanner.jpg` (poster/fallback de `prefers-reduced-motion`).
- No se añaden librerías ni se toca lógica/backend.
- Sin audio.
