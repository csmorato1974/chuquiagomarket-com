
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.set_published_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_published_at() FROM PUBLIC, anon;
-- Tighten favorites ALL policy to avoid always-true warning by separating actions:
DROP POLICY IF EXISTS "favorites_own_all" ON public.favorites;
CREATE POLICY "favorites_select_own" ON public.favorites FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "favorites_insert_own" ON public.favorites FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "favorites_delete_own" ON public.favorites FOR DELETE TO authenticated USING (user_id = auth.uid());
