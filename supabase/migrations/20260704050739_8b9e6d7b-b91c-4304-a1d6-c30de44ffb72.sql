
-- 1) Drop anon SELECT policies that leaked all columns of these tables
DROP POLICY IF EXISTS "profiles_select_public_min" ON public.profiles;
DROP POLICY IF EXISTS "verif_select_public_status" ON public.seller_verifications;

-- 2) Revoke anon direct table access (defense in depth; RLS already blocks it without a policy)
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.seller_verifications FROM anon;

-- 3) Switch seller_public view to run with definer rights so anon can read
--    only the whitelisted columns without needing table-level access.
ALTER VIEW public.seller_public SET (security_invoker = false);

-- 4) Ensure the view is readable by anon and authenticated (safe: only public seller fields)
GRANT SELECT ON public.seller_public TO anon, authenticated;
