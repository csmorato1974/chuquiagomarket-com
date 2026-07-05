## Diagnóstico

La migración de seguridad anterior (que eliminó el acceso público a `profiles` y `seller_verifications`) usó `REVOKE ALL` y dejó ambas tablas **sin ningún GRANT** para los roles `authenticated` y `service_role`. Sin esos GRANTs, la Data API (PostgREST) rechaza cualquier lectura o escritura con "permission denied", aunque las políticas RLS sean correctas.

Esto rompe:
- Subir/cambiar foto de perfil (UPDATE en `profiles.avatar_url`).
- Guardar teléfono WhatsApp (UPDATE en `profiles.whatsapp_phone`).
- Enviar solicitud de verificación (UPSERT en `seller_verifications`).
- Leer el propio perfil y estado de verificación en `/perfil` y `/perfil/verificacion`.

Las políticas de Storage (buckets `avatars` y `verification-docs`) están correctas; el problema es solo de GRANTs en las tablas.

## Cambios (una migración SQL)

Restaurar los GRANTs mínimos necesarios sin volver a exponer datos a `anon`:

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seller_verifications TO authenticated;
GRANT ALL ON public.seller_verifications TO service_role;
```

- `anon` sigue **sin** acceso a estas tablas (los datos públicos se sirven por la vista `seller_public`, que ya tiene su propio GRANT).
- Las políticas RLS existentes (`profiles_select_own`, `profiles_update_own`, `verif_insert_own`, etc.) siguen restringiendo cada fila al dueño.

## Fuera de alcance

- No se cambian políticas RLS ni la vista `seller_public`.
- No se modifica código de frontend ni buckets de Storage.
