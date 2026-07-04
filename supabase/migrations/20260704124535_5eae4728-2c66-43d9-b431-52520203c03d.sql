
-- Restrict profiles SELECT to the profile owner only.
-- Public seller information (display_name, avatar, zone, verified badge and
-- contact phone) continues to be served via the get_seller_public() function
-- and its seller_public view wrapper.
DROP POLICY IF EXISTS profiles_select_authenticated ON public.profiles;

CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Remove anonymous EXECUTE on the SECURITY DEFINER helper and its view wrapper.
-- Authenticated users retain access, which is what listing pages need.
REVOKE EXECUTE ON FUNCTION public.get_seller_public() FROM anon, PUBLIC;
REVOKE SELECT ON public.seller_public FROM anon;
