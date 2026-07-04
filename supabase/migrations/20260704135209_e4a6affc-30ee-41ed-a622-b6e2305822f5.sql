-- Revert seller_public to the previous security-fix state:
-- security-invoker view over get_seller_public(), with no public grants.

DROP VIEW IF EXISTS public.seller_public;

CREATE VIEW public.seller_public
WITH (security_invoker = true)
AS SELECT * FROM public.get_seller_public();

-- No grants: anonymous and authenticated users cannot query this view directly.
-- The previous security fix already revoked EXECUTE on get_seller_public() from anon and PUBLIC.
