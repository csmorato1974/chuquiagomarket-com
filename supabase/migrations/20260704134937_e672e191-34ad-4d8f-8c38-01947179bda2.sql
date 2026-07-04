-- Restore public read access to the seller_public view while keeping the underlying
-- SECURITY DEFINER function get_seller_public() non-executable by anonymous visitors.
-- The view is rebuilt as a security definer view directly over the public tables,
-- so public visitors can read public seller info without invoking the helper directly.

DROP VIEW IF EXISTS public.seller_public;

CREATE VIEW public.seller_public AS
  SELECT p.id,
         p.display_name,
         p.avatar_url,
         p.zone,
         p.whatsapp_phone,
         COALESCE(sv.status = 'verified'::verification_status, false) AS verified
    FROM public.profiles p
    LEFT JOIN public.seller_verifications sv ON sv.user_id = p.id;

GRANT SELECT ON public.seller_public TO anon, authenticated;
