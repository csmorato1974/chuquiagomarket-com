# Plan: Endurecer beta para pruebas con usuarios semilla (v2)

Sin nuevas features de negocio, sin cambios de diseño, sin pagos. Solo moderación, seguridad y trazabilidad.

## 1. Vista operativa interna de moderación

Ruta nueva **`/admin/moderacion`**, protegida por `has_role(auth.uid(), 'admin' | 'moderator')`. Si no tiene rol → 404/redirect.

Tres pestañas simples, misma UI existente (tabs + tablas):

- **Anuncios pendientes** — `listings` con `status = 'pending_review'`. Acciones: Aprobar (→ `published`) o Rechazar (obliga elegir motivo estandarizado + nota opcional → `status = 'rejected'`).
- **Reportes abiertos** — `listing_flags` con `status = 'open'`. Acciones: Resolver (motivo estandarizado) o Descartar. Enlace al anuncio.
- **Verificaciones pendientes** — `seller_verifications` con `status = 'pending'`. Acciones: Aprobar (→ `verified`) o Rechazar (motivo + nota → `rejected`).

Cada fila incluye un botón **"Ver historial"** que abre un panel/drawer con las filas de `audit_log` del `entity_id` correspondiente (listing o seller_verification), ordenadas por `created_at desc`: quién, cuándo, de qué estado a qué estado, motivo y notas. En la pestaña de flags, el historial mostrado corresponde al listing reportado.

## 2. Primer anuncio siempre requiere revisión manual

Trigger `BEFORE INSERT` en `listings`: si el seller **nunca** ha tenido un listing con `status IN ('published','sold','archived')` y el `NEW.status != 'draft'`, forzar `NEW.status = 'pending_review'`. Deja rastro en `audit_log` marcando `notes = 'first_listing_forced_review'`.

La policy `listings_insert_own` ya limita a `draft|pending_review`, así que no hay riesgo de auto-publicación desde el cliente. El trigger es defensa en profundidad + auditoría explícita.

## 3. Motivos estandarizados de moderación

Nuevos enums:

- `rejection_reason_code`: `low_quality_images | insufficient_info | prohibited_item | suspected_fraud | wrong_category | duplicate | price_unrealistic | other`.
- `flag_resolution`: `removed | warned_seller | no_action | duplicate_report | invalid`.
- `verification_rejection`: `document_illegible | document_mismatch | suspected_fraud | incomplete | other`.

Columnas nuevas (sin romper nada existente):

- `listings.rejection_reason_code rejection_reason_code NULL` (nuevo enum).
- `listings.rejection_notes text NULL` (nuevo campo libre). **No se toca `listings.rejection_reason`**: se mantiene tal cual para no romper el frontend actual. Cuando el admin rechaza, escribimos ambos: `rejection_notes` con las notas y `rejection_reason` (texto legado) con la etiqueta humana del código, para compatibilidad. El frontend puede migrar a `rejection_reason_code + rejection_notes` progresivamente; se deja `rejection_reason` marcada como legacy en comentario SQL.
- `listing_flags.resolution flag_resolution NULL`, `listing_flags.resolved_by uuid NULL`, `listing_flags.resolved_at timestamptz NULL`. `listing_flags.status` acepta valores `open | resolved | dismissed` (ya es text; se documenta).
- `seller_verifications.rejection_code verification_rejection NULL`.

## 4. Anti-spam en `lead_events`

Trigger `BEFORE INSERT` en `lead_events` con `RETURN NULL` cuando detecta duplicado en ventana:

- `view`: 60 s
- `favorite`: 10 s
- `contact_click`, `whatsapp_click`: 30 s

Clave de deduplicación: `(listing_id, type, coalesce(user_id::text, 'anon'))`. Para anon la ventana efectiva se reduce a 10 s (sin IP fiable, solo amortigua dobles clics).

**Comportamiento con el frontend:** un trigger `BEFORE INSERT` que retorna `NULL` **cancela el INSERT sin lanzar error** — PostgREST devuelve `201` con `0` filas afectadas (o un array vacío si se usa `.select()`). El cliente no ve excepción. Se documenta en:

- Comentario SQL en la función (`comment on function ... is 'Silently drops duplicates within short window; clients receive success with 0 rows'`).
- Código de `ProductDetail.tsx` / donde se registren eventos: comentario breve explicando que un array vacío en respuesta es esperado y no debe tratarse como error.

## 5. Endurecer policies de `storage.objects`

**Bucket `listing-images`** (público a nivel de bucket, pero acceso controlado por policy):

- DROP y recreación de policies.
- SELECT anon/authenticated: solo si el listing referenciado por `(storage.foldername(name))[1]::uuid` está `status = 'published'`.
- SELECT adicional para owner (`l.seller_id = auth.uid()`) y admin/moderator (para revisar drafts en la vista de moderación).
- INSERT/UPDATE/DELETE: `bucket_id = 'listing-images'` AND `l.seller_id = auth.uid()` AND `owner = auth.uid()`.

**Bucket `verification-docs`**:

- Forzar `public = false` vía `supabase--storage_update_bucket`.
- SELECT: solo `(storage.foldername(name))[1] = auth.uid()::text` o admin.
- INSERT/UPDATE/DELETE: mismo criterio + `owner = auth.uid()`.
- Ninguna policy anon.

## 6. Log de auditoría mínimo

Nueva tabla `public.audit_log`:

- `id`, `actor_id uuid null`, `entity_type text` (`listing` | `seller_verification`), `entity_id uuid`, `from_status text`, `to_status text`, `reason_code text null`, `notes text null`, `created_at`.
- RLS: SELECT solo admin/moderator (via `has_role`). No policy INSERT desde cliente; los triggers usan `SECURITY DEFINER`.
- GRANT SELECT a `authenticated` (la policy filtra por rol), GRANT ALL a `service_role`.

Triggers `SECURITY DEFINER`:

- `AFTER INSERT` en `listings`: fila con `from_status = NULL`, `to_status = NEW.status`.
- `AFTER UPDATE OF status` en `listings`: fila con `from_status`, `to_status`, `reason_code = NEW.rejection_reason_code`, `notes = NEW.rejection_notes`.
- `AFTER UPDATE OF status` en `seller_verifications`: fila con `from_status`, `to_status`, `reason_code = NEW.rejection_code`, `notes = NEW.notes`.

## 7. Índices

Añadidos para soportar policies, joins de moderación y storage:

- `listings (status, created_at desc)` — listado de `pending_review` en moderación.
- `listings (seller_id, status)` — trigger primer-anuncio + "mis anuncios".
- `listing_flags (status, created_at desc)` — pestaña flags abiertos.
- `listing_flags (listing_id)` — join con listings en moderación.
- `seller_verifications (status)` — pestaña verificaciones.
- `lead_events (listing_id, type, user_id, created_at desc)` — dedupe + métricas de seller.
- `listing_images (listing_id)` — verificar existente; crear si falta.
- `audit_log (entity_type, entity_id, created_at desc)` — panel de historial.

Índice sobre `storage.objects` no se toca (Supabase-gestionado); las policies usan `storage.foldername(name)[1]` que ya es rápido con el índice existente.

## 8. Pantallas y código frontend

- `src/pages/admin/Moderation.tsx` — nueva, 3 tabs, cada fila con acción principal + botón "Historial" (drawer/dialog que consulta `audit_log`).
- `src/components/admin/AuditHistoryPanel.tsx` — nuevo, reutilizable, recibe `entityType` + `entityId`.
- `src/App.tsx` — ruta `/admin/moderacion` protegida por rol.
- `src/hooks/useRole.ts` — helper `useIsStaff()` que consulta `user_roles` una vez.
- `Header.tsx` — enlace "Moderación" visible solo si staff.
- `ListingStatus.tsx` — mostrar `rejection_reason_code` (etiqueta legible) + `rejection_notes` si existen; sigue leyendo `rejection_reason` como fallback.
- Registro de `lead_events`: comentario explicando el comportamiento silencioso de dedupe.

Sin rediseño: reutilizar tokens y componentes shadcn existentes.

## 9. Migraciones (orden)

1. Enums + columnas nuevas (`rejection_reason_code`, `rejection_notes`, `resolution`, `resolved_by`, `resolved_at`, `rejection_code`). **No se renombra ni borra `rejection_reason`.**
2. Índices nuevos.
3. Tabla `audit_log` + GRANTS + RLS + triggers de auditoría.
4. Trigger primer-anuncio en `listings`.
5. Trigger dedupe `lead_events`.
6. DROP + CREATE policies en `storage.objects` para ambos buckets.
7. `supabase--storage_update_bucket` para `verification-docs` privado.

## 10. Fuera de alcance
Rediseño, pagos, notificaciones por email, panel admin completo, rate limiting por IP real, validación de mime/tamaño en Storage.

## 11. Entregable
Al terminar te explicaré: enums/columnas/índices añadidos, triggers creados (con la nota de comportamiento silencioso del dedupe), políticas finales de `storage.objects` por bucket, y la vista `/admin/moderacion` con sus tres listas y el panel de historial.
