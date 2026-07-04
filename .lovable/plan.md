## Plan: Restaurar imagen estática en el hero

### Contexto
Actualmente `src/components/home/HeroSection.tsx` muestra un video animado (`hero-loop.mp4`) encima de la imagen original `hero-banner.jpg`. El usuario quiere eliminar el video y dejar solo la imagen de fondo original.

### Cambios propuestos
1. **Eliminar el video del hero** (`src/components/home/HeroSection.tsx`):
   - Quitar el bloque `<video>` y su `<source>`.
   - Quitar el estado `reducedMotion` y el `useEffect` de `prefers-reduced-motion` (ya no hacen falta).
   - Quitar la importación de `hero-loop.mp4.asset.json`.
   - Mantener la imagen de fondo `hero-banner.jpg` y el degradado overlay.
   - Mantener el texto, botones y el badge "La Paz · Beta".

2. **Limpiar el asset pointer sin uso** (`src/assets/hero-loop.mp4.asset.json`):
   - Eliminar el archivo porque el video ya no se referenciará en la app.

### Fuera de alcance
- No se modifica `remotion/src/Root.tsx` ni el script de render (pueden quedar como proyecto de video independiente, pero no se usan en la web).
- No se cambian colores, tipografía, layout ni contenido del hero.
- No se afecta la lógica de negocio ni otras páginas.

### Resultado esperado
El hero vuelve a mostrar solo la foto original de La Paz con el degradado y el texto, sin reproducción de video.