-- Restore authenticated access to seller public data and RLS helper functions
-- while keeping anonymous visitors blocked from the security definer functions.

GRANT SELECT ON public.seller_public TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_seller_public() TO authenticated;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
