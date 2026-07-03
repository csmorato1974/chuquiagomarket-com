# Plan: Conectar Chuquiago Market a Lovable Cloud (backend real)

Convertimos la beta en un marketplace funcional con base de datos, autenticación, subida de imágenes, verificación de vendedores y seguridad por fila (RLS). Sin pagos.

## 1. Activar Lovable Cloud
Se habilita el backend gestionado (base de datos Postgres, Auth y Storage). No requiere cuentas externas.

## 2. Autenticación
- Email + contraseña (auto-confirm activado para beta, sin verificación de correo).
- Página `/auth` conectada de verdad (hoy es mock): login, registro y logout.
- Listener `onAuthStateChange` + `getUser()` para proteger rutas.
- Al registrarse se crea `profiles` automáticamente vía trigger.

## 3. Esquema de base de datos

### Tablas
- **profiles** — 1 a 1 con `auth.users`. Campos: `id`, `display_name`, `avatar_url`, `zone`, `phone`, `bio`, `created_at`.
- **user_roles** — tabla separada con enum `app_role` (`admin`, `moderator`, `user`). Nunca en profiles (evita escalada de privilegios).
- **categories** — catálogo (`id`, `slug`, `name`, `description`, `sort_order`). Se siembra con las 6 categorías actuales.
- **listings** — anuncio. Campos clave: `id`, `seller_id`, `category_id`, `title`, `description`, `price_bs` (numeric), `zone`, `condition`, `delivery_methods` (text[]), `status` (enum), `published_at`, `created_at`, `updated_at`, `cover_image_url`.
- **listing_images** — múltiples imágenes por listing (`id`, `listing_id`, `path`, `sort_order`).
- **listing_flags** — reportes (`id`, `listing_id`, `reporter_id`, `reason` enum, `note`, `created_at`, `status`).
- **seller_verifications** — 1 por usuario (`user_id`, `status` enum `unverified|pending|verified|rejected`, `submitted_at`, `reviewed_at`, `notes`, `id_document_path`).
- **favorites** — (`user_id`, `listing_id`, `created_at`), PK compuesta.
- **lead_events** — analítica de interés (`id`, `listing_id`, `user_id` nullable, `type` enum `view|contact_click|whatsapp_click|favorite`, `created_at`).

### Enums
`listing_status`: `draft | pending_review | published | paused | rejected | sold | archived`
`listing_condition`: `new | like_new | good | fair`
`flag_reason`: `fraud | prohibited | spam | other`
`verification_status`: `unverified | pending | verified | rejected`
`app_role`: `admin | moderator | user`
`lead_type`: `view | contact_click | whatsapp_click | favorite`

### Función helper
`public.has_role(_user_id uuid, _role app_role)` — SECURITY DEFINER, para políticas sin recursión.

## 4. Row Level Security (todas las tablas)

- **profiles**: SELECT público (para mostrar nombre del vendedor); UPDATE solo dueño.
- **categories**: SELECT público; escritura solo admin.
- **listings**:
  - SELECT público solo si `status = 'published'`.
  - SELECT del propio seller para cualquier estado.
  - SELECT total para admin/moderator.
  - INSERT: `seller_id = auth.uid()`; el status permitido al crear es `draft` o `pending_review`.
  - UPDATE/DELETE: solo el seller propietario (o admin).
- **listing_images**: SELECT si el listing es visible para el usuario; INSERT/DELETE solo dueño del listing.
- **listing_flags**: INSERT autenticado (`reporter_id = auth.uid()`); SELECT solo admin/moderator.
- **seller_verifications**: SELECT/UPDATE propio dueño; admin puede cambiar `status`.
- **favorites**: SELECT/INSERT/DELETE solo dueño (`user_id = auth.uid()`).
- **lead_events**: INSERT abierto (incluye anon para `view`); SELECT solo admin y el seller del listing referenciado.

Todas las tablas incluyen `GRANT` explícitos a `authenticated` / `service_role` (y `anon` solo en las de lectura pública).

## 5. Storage
- Bucket **listing-images** público (lectura), con RLS de escritura por dueño: rutas `listings/{listing_id}/{uuid}.jpg`.
- Bucket **verification-docs** privado: rutas `verifications/{user_id}/...`, solo dueño y admin acceden.

## 6. Pantallas conectadas (mínimas)

- **/auth** — login / registro reales.
- **/perfil/anuncios** ("Mis anuncios") — lista del seller con filtros por estado (`draft`, `pending_review`, `published`, `paused`, `rejected`, `sold`, `archived`), badges de color y acciones: pausar, marcar vendido, archivar, editar, eliminar.
- **/publicar** — ahora inserta en `listings` con `status = pending_review` o `draft`. Sube imágenes al bucket, crea filas en `listing_images`, la primera es `cover_image_url`.
- **/anuncio/:id/editar** — edición si `seller_id = auth.uid()`. Al editar un `published` vuelve a `pending_review`.
- **/anuncio/:id/estado** — vista de estado del anuncio para el seller: timeline (creado → en revisión → publicado / rechazado con motivo), estadísticas básicas de `lead_events`, acciones rápidas.
- **/perfil/verificacion** — envía verificación (sube documento a `verification-docs`, marca `pending`), muestra estado.
- **Home / listados / ficha** — leen solo `listings` con `status = published`; ficha muestra badge "Vendedor verificado" si aplica; botón favoritos y reporte ya conectados a `favorites` / `listing_flags`; se registra `lead_event` al ver y al contactar.

## 7. Fuera de alcance (explícito)
Pagos, mensajería interna, notificaciones por email, moderación con IA, panel admin completo. Quedan preparados los datos y estados para añadirlos después.

## 8. Detalles técnicos

- Migraciones SQL con orden estricto: `CREATE TABLE` → `GRANT` → `ENABLE RLS` → `CREATE POLICY`.
- Trigger `on_auth_user_created` que inserta en `profiles` y `seller_verifications (status='unverified')`.
- Trigger `updated_at` en `listings`.
- `mockProducts.ts` deja de usarse en las páginas conectadas; se mantiene solo como semilla opcional.
- `src/integrations/supabase/client.ts` autogenerado por la integración.
- Reemplazo de fetch de datos en `Index`, `Products`, `ProductDetail`, `Profile`, `Publish` por consultas a Supabase; tipos derivados del `Database` generado.

## 9. Entregable final
Al terminar te explicaré: esquema real creado, políticas RLS por tabla, buckets y sus reglas, y qué pantalla escribe/lee cada tabla.
