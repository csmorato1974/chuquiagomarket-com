## Objetivo

Endurecer la beta para usuarios semilla: previsualización de imágenes, flujo de revisión completo end-to-end, empty states útiles, favoritos/reportes/lead_events funcionando, y limpieza de tipado. Sin nuevas features de negocio, sin cambios de diseño general, sin pagos.

## Cambios

### 1. Previsualización robusta de imágenes (`/publicar` y `/anuncio/:id/editar`)
Reemplazar el input de imagen actual en `src/pages/Publish.tsx` por un componente reutilizable `ImagePicker`:
- Preview inmediato vía `URL.createObjectURL` con `URL.revokeObjectURL` al desmontar / cambiar archivo.
- Validación cliente: tipo (jpeg/png/webp) y tamaño (≤10MB) con toast en caso de error.
- Botón "Cambiar" y "Quitar" sobre la preview.
- Al editar, mostrar la portada actual (`existingCover`) y permitir reemplazarla; si el usuario quita la selección, se mantiene la existente.
- Mensaje explícito cuando no hay imagen en un envío a revisión.

### 2. Flujo de revisión end-to-end
El panel `/admin/moderacion` ya aprueba/rechaza. Reforzar la propagación al seller:
- `src/pages/ListingStatus.tsx`: refetch tras cambio de status y mostrar el bloque de rechazo con `rejection_reason_code` + `rejection_notes` traducidos (ya está, verificar edge cases y añadir botón "Reenviar a revisión" que pasa `rejected → pending_review` y limpia campos de rechazo).
- `src/pages/Profile.tsx`: badge visible por estado (ya presente) y CTA extra "Ver estado" siempre visible en anuncios `pending_review` / `rejected`.
- Confirmar que al aprobar en Moderación, el trigger `set_published_at` fija `published_at` (ya existe) y la fila aparece en `/productos` (RLS `status='published'`).

### 3. Correcciones de tipado / compilación
- `Publish.tsx`: quitar `as never` en enums usando tipos generados de Supabase; tipar `existing?.status` con `ListingStatus`.
- `ListingStatus.tsx`: reemplazar `(s as any)[e.type]++` por un `Record<'view'|'contact_click'|'favorite', number>` correctamente tipado.
- `Moderation.tsx`: reemplazar `as never` de `reasonCode` con el enum correcto de `Database['public']['Enums']`.
- Ejecutar `tsgo` al final y arreglar cualquier residuo.

### 4. Empty states más útiles
- **Home (`Index.tsx`)**: el bloque actual ya existe; añadir icono + subtítulo "Estamos en beta cerrada. Los primeros anuncios llegarán pronto." y CTA a `/publicar` solo si el usuario está logueado, si no a `/auth`.
- **Listados (`Products.tsx` / `ProductGrid`)**: cuando no hay resultados, mostrar icono + sugerencia "Limpiar filtros" si hay filtros activos, o "Sé el primero en publicar" si no.
- **Perfil (`Profile.tsx`)**: diferenciar "aún no tienes anuncios" (lista total vacía) de "no hay anuncios con este estado" (filtro), con CTA distintos.

### 5. Favoritos, reportes y lead_events end-to-end
- `ProductDetail.tsx`: manejar respuesta de `favorites.insert` (silenciar error de duplicado por unique key) y refrescar `isFavorite` correctamente.
- `ReportButton.tsx`: bloquear reenvío si ya existe un reporte abierto del mismo usuario para ese listing (query previo).
- `lead_events`: verificar que los inserts silenciosos (trigger dedupe → 0 filas) no muestren toast de error en ningún punto; ya documentado, revisar `Publish` y otros.

### 6. Verificación final
- Correr build/tsgo.
- Documentar en la respuesta final los flujos probados de punta a punta.

## Archivos afectados

Nuevo: `src/components/publish/ImagePicker.tsx`
Editados: `src/pages/Publish.tsx`, `src/pages/ListingStatus.tsx`, `src/pages/Profile.tsx`, `src/pages/Products.tsx`, `src/pages/Index.tsx`, `src/pages/admin/Moderation.tsx`, `src/components/products/ProductGrid.tsx`, `src/components/trust/ReportButton.tsx`, `src/pages/ProductDetail.tsx`.

Sin migraciones, sin cambios de RLS, sin cambios de diseño global.
