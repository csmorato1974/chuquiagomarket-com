## Diagnóstico

Al inspeccionar los privilegios reales en la base de datos, **ningún rol de la Data API (`anon`, `authenticated`, `service_role`) tiene GRANTs sobre las tablas `public`, la vista `seller_public`, ni sobre las funciones `has_role` / `get_seller_public`**. Las migraciones anteriores que intentaron restaurar los permisos no están reflejadas en el estado actual del proyecto, así que PostgREST rechaza todo lo que pasa por la Data API con "permission denied", incluida la lectura del teléfono del vendedor que usa el botón de WhatsApp.

Esto rompe (entre otros):

- Contactar por WhatsApp desde `ProductDetail` y `SellerProfile` (lectura de `seller_public.whatsapp_phone`).
- Ver y editar el perfil propio (`profiles`).
- Enviar / consultar verificación (`seller_verifications`).
- Listado de anuncios, imágenes, favoritos, categorías y eventos de lead.
- Chequeo de rol admin/moderator (`has_role` → `user_roles`).

Las políticas RLS ya existen y son correctas; falta únicamente la capa de GRANTs.

## Cambios (una sola migración SQL)

Restaurar los GRANTs mínimos por rol, respetando lo que cada tabla debería exponer:

**`service_role` — ALL en todas las tablas y vistas de `public`** (necesario para edge functions / admin).

**`authenticated` — SELECT/INSERT/UPDATE/DELETE** en tablas donde el usuario logueado necesita operar bajo RLS:
`profiles`, `seller_verifications`, `listings`, `listing_images`, `favorites`, `lead_events`, `listing_flags`, `user_roles` (solo SELECT), `audit_log` (solo SELECT), `categories` (solo SELECT), y `SELECT` en la vista `seller_public`.

**`anon` — SELECT** solo en lo que debe ser público:
`categories`, `listings`, `listing_images`, y la vista `seller_public`. Además `INSERT` en `lead_events` para poder registrar vistas anónimas.

**Funciones (`EXECUTE`)**:
- `has_role(uuid, app_role)` → `authenticated`, `service_role`.
- `get_seller_public()` → `anon`, `authenticated`.

`anon` **no** recibe acceso a `profiles`, `seller_verifications`, `user_roles`, `audit_log`, `favorites`, `listing_flags` ni `audit_log`. Los datos públicos del vendedor siguen sirviéndose exclusivamente por `seller_public`.

## Fuera de alcance

- No se cambian políticas RLS.
- No se toca la definición de `seller_public` ni de ninguna función.
- No se modifica código de frontend ni buckets de Storage.
- No se marca ni cambia ningún finding de seguridad.
