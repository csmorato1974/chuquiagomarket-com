
-- service_role: full access to all public tables/views
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.seller_verifications TO service_role;
GRANT ALL ON public.listings TO service_role;
GRANT ALL ON public.listing_images TO service_role;
GRANT ALL ON public.listing_flags TO service_role;
GRANT ALL ON public.favorites TO service_role;
GRANT ALL ON public.lead_events TO service_role;
GRANT ALL ON public.categories TO service_role;
GRANT ALL ON public.user_roles TO service_role;
GRANT ALL ON public.audit_log TO service_role;
GRANT ALL ON public.seller_public TO service_role;

-- authenticated: standard CRUD under RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seller_verifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_images TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listing_flags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT SELECT, INSERT ON public.lead_events TO authenticated;
GRANT SELECT ON public.categories TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.audit_log TO authenticated;
GRANT SELECT ON public.seller_public TO authenticated;

-- anon: only truly public read surfaces
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.listings TO anon;
GRANT SELECT ON public.listing_images TO anon;
GRANT SELECT ON public.seller_public TO anon;
GRANT INSERT ON public.lead_events TO anon;

-- Functions
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_seller_public() TO anon, authenticated, service_role;
