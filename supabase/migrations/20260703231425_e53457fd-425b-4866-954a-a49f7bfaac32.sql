
REVOKE EXECUTE ON FUNCTION public.audit_listing_insert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_listing_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_verification_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_first_listing_review() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.lead_events_dedupe() FROM PUBLIC, anon, authenticated;
