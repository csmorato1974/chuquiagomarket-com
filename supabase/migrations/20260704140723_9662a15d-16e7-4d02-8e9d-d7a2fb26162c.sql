-- Prevent direct Data API calls to the internal role helper.
-- It remains available to database policies as an internal SECURITY DEFINER helper.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;