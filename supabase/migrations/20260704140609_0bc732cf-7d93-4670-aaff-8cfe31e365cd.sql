-- Allow anonymous visitors to read the public seller contact view used by listing pages.
-- The underlying profile table remains protected by RLS; only the curated seller_public
-- view/function exposes seller-facing fields needed for marketplace contact.
GRANT SELECT ON public.seller_public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_seller_public() TO anon, authenticated;