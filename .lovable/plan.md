## Objetivo

Reducir la fricción del botón "Contactar vendedor": permitir que usuarios no logueados abran WhatsApp directamente, sin tocar el resto de reglas de autenticación ni el diseño general.

## Cambios

**Único archivo tocado:** `src/pages/ProductDetail.tsx`

1. **`onContact` — permitir anónimos:**
   - Eliminar la rama `if (!user) navigate('/auth')`.
   - Si no hay `waUrl` o `id`, salir.
   - Registrar el evento `whatsapp_click` en `lead_events` con `user_id: user?.id ?? null` (la política `lead_insert_scoped` ya acepta `user_id IS NULL` y `anon` tiene GRANT). El insert va sin `await` y sin bloquear; si falla no rompe el flujo (se abre WhatsApp igualmente).
   - Abrir `waUrl` en nueva pestaña.

2. **Botón principal:**
   - Texto siempre `"Contactar por WhatsApp"` (o `"Contacto no disponible"` si el vendedor no tiene WhatsApp).
   - `disabled` = `!waUrl` (para logueados y anónimos por igual).
   - Quitar el `title` que dice "Inicia sesión para contactar".

3. **Aviso de apoyo (reemplaza el `Alert` de login):**
   - Sustituir el bloque `{!user && <Alert>…}` por un texto pequeño (`text-xs text-muted-foreground`) visible siempre debajo del botón:
     > "El contacto se realiza por WhatsApp con el vendedor. Sigue las [recomendaciones de seguridad](/ayuda#comprar-seguro) de la plataforma."
   - Sin componente `Alert`, sin cambios de layout ni colores; encaja en el `flex flex-col gap-3` actual.
   - Se puede quitar el import de `Alert`, `AlertDescription`, `AlertTitle` y `Info` si dejan de usarse.

## Fuera de alcance

- Favoritos, reportar, publicar/editar, perfil: siguen requiriendo login (sin cambios).
- `SafetyNotice` y el link "Consejos para comprar seguro" del sidebar se mantienen tal cual.
- Sin cambios en RLS, esquema, ni en `Auth.tsx`.

## Verificación

- Build.
- Playwright en sesión anónima: abrir `/producto/:id`, click en "Contactar por WhatsApp" → se abre `wa.me/...` en nueva pestaña, sin redirección a `/auth`.
- Confirmar que "Guardar" sigue mostrando el toast "Inicia sesión para guardar" para anónimos.
