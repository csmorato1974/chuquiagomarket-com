ALTER VIEW public.seller_public SET (security_invoker = true);
GRANT EXECUTE ON FUNCTION public.get_seller_public() TO anon, authenticated;
GRANT SELECT ON public.seller_public TO anon, authenticated;