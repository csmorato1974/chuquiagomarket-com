
CREATE OR REPLACE FUNCTION public.get_seller_public(_ids uuid[])
RETURNS TABLE(id uuid, display_name text, avatar_url text, zone text, whatsapp_phone text, verified boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.display_name, p.avatar_url, p.zone, p.whatsapp_phone,
         COALESCE(sv.status = 'verified'::verification_status, false)
    FROM public.profiles p
    LEFT JOIN public.seller_verifications sv ON sv.user_id = p.id
   WHERE _ids IS NULL OR p.id = ANY(_ids);
$$;

GRANT EXECUTE ON FUNCTION public.get_seller_public(uuid[]) TO anon, authenticated, service_role;
