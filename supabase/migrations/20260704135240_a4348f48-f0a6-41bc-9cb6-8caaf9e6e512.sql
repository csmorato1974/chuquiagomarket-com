-- Revert the temporary authenticated grant to restore the previous security posture.
-- The security definer helper is not directly executable by anonymous or authenticated users.

REVOKE EXECUTE ON FUNCTION public.get_seller_public() FROM authenticated;
