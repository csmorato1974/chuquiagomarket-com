## Objetivo

Que la imagen del hero de la home deje de sentirse estática, manteniendo el mismo diseño, textos, botones y overlay actuales. Sin dependencias nuevas y sin sustituir la imagen.

## Enfoque

Aplicar un **efecto Ken Burns** (zoom + paneo muy lento e infinito) sobre `hero-banner.jpg`, usando solo CSS. Es la solución más ligera, no consume red, funciona offline y no afecta rendimiento en móvil.

- Duración: ~20s por ciclo, `ease-in-out`, `alternate infinite` (va y vuelve, sin saltos).
- Movimiento: zoom de `scale(1)` a `scale(1.08)` con leve desplazamiento horizontal.
- Se respeta `prefers-reduced-motion: reduce` → la animación se desactiva para usuarios que piden menos movimiento (accesibilidad).
- Overlay oscuro y contenido (badge, título, párrafo, botones) se mantienen intactos y por encima.

## Cambios técnicos

1. **`src/components/home/HeroSection.tsx`**
   - Separar la imagen de fondo en un `div` absoluto propio (`absolute inset-0`) con `bg-cover bg-center` + clase `hero-kenburns`, en lugar de aplicar `backgroundImage` al contenedor principal.
   - Añadir `overflow-hidden` al contenedor para contener el zoom.
   - Overlay y contenido quedan encima con `z-10`, sin cambios visuales.

2. **`src/index.css`**
   - Añadir un `@keyframes kenburns` (scale + translate).
   - Clase `.hero-kenburns { animation: kenburns 20s ease-in-out infinite alternate; transform-origin: center; will-change: transform; }`.
   - Regla `@media (prefers-reduced-motion: reduce) { .hero-kenburns { animation: none; } }`.

## Fuera de alcance

- No se cambia la imagen del hero ni se generan videos.
- No se tocan textos, botones, badge ni overlay.
- No se añaden librerías (nada de Framer/GSAP/Remotion).
