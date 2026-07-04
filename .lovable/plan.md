## Objetivo

Rehacer el fondo animado del hero para que evoque claramente el **Illimani** (silueta realista al atardecer) en lugar de la actual línea genérica de montañas. Mantener paraguas flotantes, bokeh y overlay legibles.

## Cambios de dirección visual

- **Silueta del Illimani** al centro-derecha: tres cumbres características (Pico Sur dominante al centro, Pico Central a la derecha, Pico del Indio más bajo a la izquierda), con laderas largas cayendo hacia los flancos. Basado en el perfil real visto desde La Paz.
- **Nieve sutil**: parches blanco cálido (`#F5EEDC`) en las cumbres, con bordes irregulares (path SVG separado, opacidad ~0.85). Nada de degradados neón.
- **Atmósfera de atardecer**:
  - Cielo: gradiente `#F4C27A` (arriba) → `#E88A5C` (medio) → `#B85A3E` (bajo, cerca del horizonte).
  - Sol bajo detrás del Illimani (glow radial ámbar, semi-oculto por la cumbre).
  - Neblina/haze horizontal cálida delante de la sierra lejana para dar profundidad.
- **Capas de profundidad** (parallax lento, loop perfecto):
  1. Sierra lejana muy tenue (`#7A6A8A`, opacidad 0.45) — insinuación de la Cordillera Real detrás.
  2. Illimani nítido (`#2A2340`) — masa principal.
  3. Colinas urbanas de La Paz en primer término (`#0F0A1F`) — línea quebrada baja con puntitos de luz cálidos (ventanas) que titilan.
- **Paraguas**: se mantienen pero reducidos a ~14 (antes 22) y desplazados a la franja superior-izquierda para no tapar la cumbre del Illimani.
- **Bokeh**: se mantiene, densidad menor (~24), tonos ámbar/blanco cálido.
- **Vignette izquierda**: se conserva para legibilidad del copy.

## Producción (skill video-creator)

1. Editar `remotion/src/HeroLoop.tsx`:
   - Reemplazar los dos `path` de montañas genéricas por:
     - `path` "cordillera lejana" con curva suave.
     - `path` "Illimani" construido a mano con vértices explícitos que dibujen los tres picos (proporciones tomadas de foto de referencia de La Paz).
     - `path` "nieve" superpuesto sólo sobre las cumbres del Illimani.
     - `path` "ciudad" con silueta baja quebrada + `rect`s de ventanas titilantes.
   - Ajustar paleta de cielo (`SKY_TOP/MID/LOW`) a tonos atardecer descritos.
   - Reposicionar sol: `right: 42%`, `top: 55%` (justo detrás del Pico Sur), radio menor, glow más denso.
   - Añadir capa de neblina horizontal (`linear-gradient` cálido con opacidad baja) entre cordillera lejana e Illimani.
   - Reducir array `UMBRELLAS` a 14 elementos y forzar `x < 0.55` para dejar la mitad derecha para la montaña.
   - Reducir `BOKEH` a 24 partículas.
   - Mantener periodicidad seno/coseno para loop sin costura (300 frames, 30fps, 1920×1080).
2. Spot-check con `bunx remotion still` en frames 0, 75, 150, 225, 299 → validar que el Illimani se lee y el loop cierra.
3. Renderizar con `node scripts/render-remotion.mjs` → sobrescribe `/mnt/documents/hero-loop.mp4`.
4. Volver a subir el MP4 con `lovable-assets create` → sobrescribir `src/assets/hero-loop.mp4.asset.json`.

## Integración web

- **Sin cambios** en `src/components/home/HeroSection.tsx` (ya usa `heroLoop.url`).
- **Sin cambios** en `src/index.css`.
- **Sin cambios** en textos, botones, badge ni layout.

## Fuera de alcance

- No se cambia el `heroBanner` (JPG usado como poster/fallback de `prefers-reduced-motion`).
- No se añaden nuevas librerías.
- No se toca lógica, rutas ni backend.
- No se genera audio.
