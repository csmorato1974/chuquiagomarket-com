## Problema

Las imágenes de los anuncios no cargan. El bucket `listing-images` está en modo **privado**, pero en el código (`src/lib/listings.ts` y `src/pages/Publish.tsx`) usamos `supabase.storage.from('listing-images').getPublicUrl(...)`, que solo funciona con buckets públicos. El resultado: URLs `.../object/public/listing-images/...` que devuelven 400 y la ficha muestra el placeholder.

## Solución

Hacer público el bucket `listing-images` (marketplace: las imágenes de anuncios están pensadas para ser visibles a cualquier visitante). Se hace con `supabase--storage_update_bucket` — sin migración.

`verification-docs` se mantiene **privado** (documentos sensibles).

No hace falta tocar código: `getPublicUrl` empezará a devolver URLs válidas y las imágenes ya guardadas (incluida la del anuncio `2b87e09e…`) cargarán.

## Verificación

- Recargar `/producto/2b87e09e-…` → se ve la foto de portada.
- Home y `/productos` muestran miniaturas.
- El upload desde `/publicar` sigue funcionando (la política de INSERT del bucket no cambia).

## Fuera de alcance

- No se toca `verification-docs`.
- No se cambia diseño ni RLS.
