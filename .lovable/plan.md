# Rediseño del Illimani en el video del hero

## Problema
La silueta actual en `remotion/src/HeroLoop.tsx` dibuja un pico dominante y afilado desplazado a la derecha (x 1400–1600). Esto no coincide con la referencia — el Illimani real es un **macizo ancho y horizontal** con una **cresta cumbrera de varios picos nevados juntos** y hombros largos que descienden a los lados. Además, como el video se renderiza a 1920×1080 y se muestra con `object-cover`, en móvil (viewport angosto) el navegador recorta los laterales y la montaña, al estar a la derecha, **desaparece del encuadre**.

## Cambios

### 1. Redibujar la silueta según la referencia
En `remotion/src/HeroLoop.tsx`, reemplazar `illimaniPath` y `snowPath`:

- **Macizo ancho y bajo**: base horizontal larga, cumbre a ~y=340 (no y=150). Menos altura, más anchura.
- **Cresta cumbrera de 4–5 picos pequeños agrupados** en la parte superior, no un pico único puntiagudo. Espaciados en ~500px horizontales con variaciones sutiles de altura (el pico principal ligeramente a la derecha del centro, como en la foto).
- **Hombros largos y suaves** que caen a ambos lados con quiebres tipo morrena (siluetas de aristas menores).
- **Nieve dominante y ancha**: cubre casi toda la cresta y baja por canaletas verticales entre los picos (lenguas de glaciar), no solo un parche en la cima.
- Silueta base color `#2A2340`; una capa intermedia azul-violeta (`#3B3560`) para las laderas medias que aparecen en la referencia; nieve `#F5EEDC` con alpenglow cálido encima.

### 2. Recentrar para móvil
Mover el macizo al **centro horizontal** (x ~480 → 1440, centro en ~960) en lugar de la derecha. Así, cuando `object-cover` recorta los laterales en móvil vertical, la montaña queda visible.

- Reposicionar el sol para que quede detrás del pico principal en la nueva posición central.
- Ajustar los paraguas: en vez de confinarlos a `x < 0.55`, confinarlos a **las bandas laterales** (`x < 0.28` o `x > 0.78`) para no cubrir el macizo central.
- Ajustar el `vignette` izquierdo para que siga oscureciendo la zona del copy sin apagar la montaña.

### 3. Integración con el estilo gráfico
Mantener el lenguaje visual actual (silueta plana, atardecer, bokeh cálido, paraguas flotantes). Añadir:

- Una **capa de ladera intermedia** con color `#3B3560` para dar volumen al macizo (como en la referencia, donde se ven planos azulados entre el negro y la nieve).
- **Lenguas glaciares** verticales cortas (`#F5EEDC` @ 0.7) bajando desde la cresta para el look de nevado real.

### 4. Verificación
- Spot-check con `bunx remotion still` en frame 0 y frame 150.
- Re-render del MP4 completo a `/mnt/documents/hero-loop.mp4`.
- Subir con `lovable-assets create` y actualizar `src/assets/hero-loop.mp4.asset.json`.
- Probar visualmente el hero en viewport móvil (390px) para confirmar que la montaña se ve.

## Archivos afectados
- `remotion/src/HeroLoop.tsx` (rediseño de paths y reposicionamiento)
- `src/assets/hero-loop.mp4.asset.json` (nuevo asset renderizado)

No se tocan `HeroSection.tsx`, `index.css` ni otros componentes.
