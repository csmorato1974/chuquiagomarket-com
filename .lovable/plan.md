
## Objetivo
Que el botón "Compartir" en `src/pages/ProductDetail.tsx` funcione, sin cambiar el diseño ni otras reglas.

## Comportamiento
1. Al hacer clic, construir el payload de compartir:
   - `title`: título del producto
   - `text`: `"{título} — {precio en Bs} en Chuquiago Market"`
   - `url`: `window.location.href`
2. Si el navegador soporta `navigator.share` (móviles y algunos desktop), usar la hoja nativa de compartir.
3. Si no, hacer fallback a `navigator.clipboard.writeText(url)` y mostrar un `toast.success('Enlace copiado al portapapeles')`.
4. Si el usuario cancela el share nativo (`AbortError`), no mostrar error. Cualquier otro fallo → fallback a clipboard; si clipboard también falla → `toast.error`.
5. Registrar de forma no bloqueante un `lead_events` con `type: 'share'` (compatible con anónimos, `user_id: user?.id ?? null`). Si el tipo no existe en el enum/constraint del backend, el insert simplemente falla en silencio (envuelto en `.then(ok, err)` como el `whatsapp_click` actual) y no rompe el flujo.

## Cambios de código
- **`src/pages/ProductDetail.tsx`**:
  - Añadir función `onShare` con la lógica descrita.
  - Cablear `onClick={onShare}` en el botón "Compartir" existente.
  - Sin cambios visuales ni de layout.

## Fuera de alcance
- No se toca el diseño, ni el botón de contacto, ni reglas de auth, ni migraciones.
