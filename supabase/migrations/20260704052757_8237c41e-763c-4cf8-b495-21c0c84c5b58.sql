
-- 1) Replace seller_public SECURITY DEFINER view with a SECURITY INVOKER view
-- backed by a SECURITY DEFINER function that exposes only whitelisted columns.
DROP VIEW IF EXISTS public.seller_public;

CREATE OR REPLACE FUNCTION public.get_seller_public()
RETURNS TABLE (
  id uuid,
  display_name text,
  avatar_url text,
  zone text,
  whatsapp_phone text,
  verified boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id,
         p.display_name,
         p.avatar_url,
         p.zone,
         p.whatsapp_phone,
         COALESCE(sv.status = 'verified'::verification_status, false) AS verified
    FROM public.profiles p
    LEFT JOIN public.seller_verifications sv ON sv.user_id = p.id;
$$;

REVOKE ALL ON FUNCTION public.get_seller_public() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_seller_public() TO anon, authenticated;

CREATE VIEW public.seller_public
WITH (security_invoker = true)
AS SELECT * FROM public.get_seller_public();

GRANT SELECT ON public.seller_public TO anon, authenticated;

-- 2) Add UPDATE policy for staff on listing_flags (resolve flags)
CREATE POLICY "Staff can update listing flags"
ON public.listing_flags
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- 3) Add DELETE policy on profiles scoped to the owner
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);
