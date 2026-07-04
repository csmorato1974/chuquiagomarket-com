-- Restore authenticated access to the seller_public view while keeping anonymous
-- visitors unable to directly execute the security definer helper.

DROP VIEW IF EXISTS public.seller_public;

CREATE VIEW public.seller_public
WITH (security_invoker = true)
AS SELECT * FROM public.get_seller_public();

GRANT SELECT ON public.seller_public TO authenticated;

-- Authenticated users need EXECUTE on the backing function because the view is security invoker.
GRANT EXECUTE ON FUNCTION public.get_seller_public() TO authenticated;
