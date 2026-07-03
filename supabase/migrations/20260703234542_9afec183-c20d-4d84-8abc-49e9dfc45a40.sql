
-- Profiles: restrict SELECT to authenticated
DROP POLICY IF EXISTS profiles_select_public ON public.profiles;
CREATE POLICY profiles_select_authenticated ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Seller verifications: restrict SELECT to owner and staff
DROP POLICY IF EXISTS verif_select_public ON public.seller_verifications;
CREATE POLICY verif_select_own_or_staff ON public.seller_verifications
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'moderator')
  );
