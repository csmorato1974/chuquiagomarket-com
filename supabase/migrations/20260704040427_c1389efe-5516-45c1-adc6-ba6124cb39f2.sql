
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS whatsapp_phone text;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_whatsapp_phone_format;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_whatsapp_phone_format
  CHECK (whatsapp_phone IS NULL OR whatsapp_phone ~ '^[0-9]{8,15}$');

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS pickup_address text,
  ADD COLUMN IF NOT EXISTS pickup_maps_url text;

ALTER TABLE public.listings
  DROP CONSTRAINT IF EXISTS listings_pickup_maps_url_https;
ALTER TABLE public.listings
  ADD CONSTRAINT listings_pickup_maps_url_https
  CHECK (pickup_maps_url IS NULL OR pickup_maps_url ~* '^https://');

-- Public seller view: exposes only fields safe for anonymous visitors.
CREATE OR REPLACE VIEW public.seller_public
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.display_name,
  p.avatar_url,
  p.zone,
  p.whatsapp_phone,
  COALESCE(sv.status = 'verified', false) AS verified
FROM public.profiles p
LEFT JOIN public.seller_verifications sv ON sv.user_id = p.id;

REVOKE ALL ON public.seller_public FROM PUBLIC;
GRANT SELECT ON public.seller_public TO anon, authenticated;

-- Ensure the anon role can read verified status via the view.
-- We do NOT grant public.profiles or public.seller_verifications to anon;
-- the view is defined with security_invoker so it uses caller RLS.
-- To make it work for anon, add narrow policies that only expose the
-- columns already shown by the view.
DROP POLICY IF EXISTS "profiles_select_public_min" ON public.profiles;
CREATE POLICY "profiles_select_public_min"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "verif_select_public_status" ON public.seller_verifications;
CREATE POLICY "verif_select_public_status"
  ON public.seller_verifications FOR SELECT
  TO anon
  USING (true);

GRANT SELECT (id, display_name, avatar_url, zone, whatsapp_phone) ON public.profiles TO anon;
GRANT SELECT (user_id, status) ON public.seller_verifications TO anon;
