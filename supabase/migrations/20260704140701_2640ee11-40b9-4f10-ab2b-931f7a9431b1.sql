-- Remove public/API execution access from SECURITY DEFINER helpers that should not be called directly.
REVOKE EXECUTE ON FUNCTION public.get_seller_public() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;

-- Rebuild seller_public as a security-invoker view over narrowly exposed columns.
-- This avoids public execution of a SECURITY DEFINER function while keeping the
-- marketplace contact fields available to anonymous visitors.
DROP VIEW IF EXISTS public.seller_public;

CREATE VIEW public.seller_public
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.display_name,
  p.avatar_url,
  p.zone,
  p.whatsapp_phone,
  COALESCE(sv.status = 'verified'::public.verification_status, false) AS verified
FROM public.profiles p
LEFT JOIN public.seller_verifications sv ON sv.user_id = p.id;

REVOKE ALL ON public.seller_public FROM PUBLIC;
GRANT SELECT ON public.seller_public TO anon, authenticated;

-- Public seller fields needed by the security-invoker view. Grants are column-scoped.
GRANT SELECT (id, display_name, avatar_url, zone, whatsapp_phone) ON public.profiles TO anon;
GRANT SELECT (user_id, status) ON public.seller_verifications TO anon;

DROP POLICY IF EXISTS "profiles_select_public_min" ON public.profiles;
CREATE POLICY "profiles_select_public_min"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "verif_select_public_status" ON public.seller_verifications;
CREATE POLICY "verif_select_public_status"
  ON public.seller_verifications
  FOR SELECT
  TO anon
  USING (true);