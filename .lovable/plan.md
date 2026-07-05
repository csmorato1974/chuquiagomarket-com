## Diagnóstico

La vista `public.seller_public` está marcada `security_invoker=true` (cambio hecho para cerrar el finding `SUPA_security_definer_view`). Con esa configuración, la vista se ejecuta bajo el rol del cliente, por lo que las RLS de las tablas base aplican al leerla:

- `profiles.profiles_select_own` → `auth.uid() = id` (solo dueño)
- `seller_verifications.verif_select_own_or_staff` → dueño o staff

Resultado: `SELECT ... FROM seller_public WHERE id = <otro_vendedor>` devuelve **0 filas** para cualquier visitante o comprador logueado, incluso si ese vendedor está verificado y tiene productos publicados. Por eso:

- `/vendedor/:id` muestra "Vendedor no encontrado" (frontend hace `fetchSellerPublic` contra la vista).
- `ProductDetail` y `Products` no obtienen `whatsapp_phone` (frontend hace `hydrateSellers` contra la vista), así que el botón de WhatsApp queda deshabilitado.

La función `public.get_seller_public()` es `SECURITY DEFINER` y sí puede leer los datos, pero el frontend no la usa: consulta la vista directamente.

## Cambios

### 1. Backend — sobrecarga de `get_seller_public` para filtrar por ID

Añadir una segunda firma que acepte un array opcional de IDs y devuelva solo esos vendedores, manteniendo la existente para compatibilidad. Sigue siendo `SECURITY DEFINER` con `search_path` fijo (mismo patrón ya aprobado).

```sql
CREATE OR REPLACE FUNCTION public.get_seller_public(_ids uuid[])
RETURNS TABLE(id uuid, display_name text, avatar_url text, zone text, whatsapp_phone text, verified boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.display_name, p.avatar_url, p.zone, p.whatsapp_phone,
         COALESCE(sv.status = 'verified'::verification_status, false)
    FROM public.profiles p
    LEFT JOIN public.seller_verifications sv ON sv.user_id = p.id
   WHERE _ids IS NULL OR p.id = ANY(_ids);
$$;

GRANT EXECUTE ON FUNCTION public.get_seller_public(uuid[]) TO anon, authenticated, service_role;
```

Esto **no** reintroduce el finding `SUPA_security_definer_view`: sigue siendo una función, no una vista. El linter emite un `WARN` genérico para toda función `SECURITY DEFINER` invocable desde la API — es el patrón estándar recomendado por Supabase y ya está aceptado en este proyecto para `has_role` y `get_seller_public()`.

### 2. Frontend — `src/lib/listings.ts`

Reemplazar las dos consultas a la vista por llamadas RPC a la nueva sobrecarga:

- `hydrateSellers(rows)` → `supabase.rpc('get_seller_public', { _ids: ids })`.
- `fetchSellerPublic(sellerId)` → `supabase.rpc('get_seller_public', { _ids: [sellerId] })` y tomar el primer resultado.

Se mantienen los tipos y el shape del `SellerPublic` devuelto, así que ningún componente cambia.

## Fuera de alcance

- No se cambia la definición ni el `security_invoker` de la vista `seller_public` (permanece para compatibilidad y para el finding ya cerrado).
- No se tocan políticas RLS.
- No se modifican otros componentes ni buckets de Storage.
