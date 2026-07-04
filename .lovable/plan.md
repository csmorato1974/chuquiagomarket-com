## Problema

Al abrir un producto desde /admin/moderacion la ficha no carga. La red muestra:

```
PGRST200: Could not find a relationship between 'listings' and 'seller_id'
```

`listings.seller_id` tiene FK a `auth.users`, no a `profiles` ni `seller_verifications`. Por eso los embeds `profiles:seller_id(...)` y `seller_verifications:seller_id(...)` en `src/lib/listings.ts` fallan con 400 en todas las páginas que usan `fetchListingById`, `fetchPublishedListings` y `fetchMyListings` (Home, Products, ProductDetail, Profile).

## Solución (solo frontend, sin migración)

Editar `src/lib/listings.ts`:

1. Quitar los embeds problemáticos del `SELECT`:
   ```
   profiles:seller_id ( display_name )
   seller_verifications:seller_id ( status )
   ```
   Dejar solo `categories:category_id(...)` y `listing_images(...)`, que sí tienen FK válidas.

2. Tras obtener las filas de `listings`, hacer dos consultas auxiliares en paralelo (`in('id', sellerIds)` y `in('user_id', sellerIds)`) contra `profiles` y `seller_verifications`, e inyectar `display_name` y `status` en cada row antes de pasarlas a `mapListing`.

3. Aplicar el mismo helper en las tres funciones: `fetchPublishedListings`, `fetchListingById` (con un solo id), `fetchMyListings`.

4. Mantener firma de `mapListing` y el tipo `Row` — solo cambia cómo se rellenan `profiles` y `seller_verifications`.

## Verificación

- Abrir `/producto/2b87e09e-…` desde /admin/moderacion → la ficha carga con título, precio, nombre del vendedor y badge de verificación si aplica.
- Home y /productos vuelven a listar sin 400.
- /perfil muestra "Mis anuncios" del usuario autenticado.
- Sin cambios en diseño, RLS ni esquema.

## Fuera de alcance

- No se añaden FKs nuevas a `profiles`/`seller_verifications` (evita migración y mantener compatibilidad).
- No se toca moderación ni ningún otro flujo.
