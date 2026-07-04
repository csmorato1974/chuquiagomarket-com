
-- 1) Quitar políticas RLS permisivas para anon en profiles y seller_verifications
DROP POLICY IF EXISTS profiles_select_public_min ON public.profiles;
DROP POLICY IF EXISTS verif_select_public_status ON public.seller_verifications;

-- 2) Revocar cualquier privilegio SELECT (nivel columna o tabla) que anon tuviera sobre estas tablas
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.seller_verifications FROM anon;
REVOKE SELECT (id, display_name, avatar_url, zone, whatsapp_phone) ON public.profiles FROM anon;
REVOKE SELECT (user_id, status) ON public.seller_verifications FROM anon;

-- 3) Hacer que la vista pública se ejecute como su owner (bypass de RLS), exponiendo
--    solo las columnas seguras ya definidas en la vista.
ALTER VIEW public.seller_public SET (security_invoker = false);

-- 4) Garantizar acceso de lectura a la vista pública para anon y authenticated
GRANT SELECT ON public.seller_public TO anon, authenticated;
