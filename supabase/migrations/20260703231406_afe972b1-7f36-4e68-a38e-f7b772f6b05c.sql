
-- 1. Enums
CREATE TYPE public.rejection_reason_code AS ENUM (
  'low_quality_images','insufficient_info','prohibited_item','suspected_fraud',
  'wrong_category','duplicate','price_unrealistic','other'
);
CREATE TYPE public.flag_resolution AS ENUM (
  'removed','warned_seller','no_action','duplicate_report','invalid'
);
CREATE TYPE public.verification_rejection AS ENUM (
  'document_illegible','document_mismatch','suspected_fraud','incomplete','other'
);

-- 2. New columns (keep listings.rejection_reason as legacy)
ALTER TABLE public.listings
  ADD COLUMN rejection_reason_code public.rejection_reason_code NULL,
  ADD COLUMN rejection_notes text NULL;
COMMENT ON COLUMN public.listings.rejection_reason IS 'Legacy free-text; new writes should also set rejection_reason_code + rejection_notes.';

ALTER TABLE public.listing_flags
  ADD COLUMN resolution public.flag_resolution NULL,
  ADD COLUMN resolved_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN resolved_at timestamptz NULL;
COMMENT ON COLUMN public.listing_flags.status IS 'open | resolved | dismissed';

ALTER TABLE public.seller_verifications
  ADD COLUMN rejection_code public.verification_rejection NULL;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_listings_status_created ON public.listings (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_seller_status ON public.listings (seller_id, status);
CREATE INDEX IF NOT EXISTS idx_flags_status_created ON public.listing_flags (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flags_listing ON public.listing_flags (listing_id);
CREATE INDEX IF NOT EXISTS idx_verif_status ON public.seller_verifications (status);
CREATE INDEX IF NOT EXISTS idx_lead_events_dedupe ON public.lead_events (listing_id, type, user_id, created_at DESC);

-- 4. Audit log
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('listing','seller_verification')),
  entity_id uuid NOT NULL,
  from_status text NULL,
  to_status text NULL,
  reason_code text NULL,
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_select_staff ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE INDEX idx_audit_entity ON public.audit_log (entity_type, entity_id, created_at DESC);

-- 5. Audit triggers
CREATE OR REPLACE FUNCTION public.audit_listing_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.audit_log(actor_id, entity_type, entity_id, from_status, to_status, notes)
  VALUES (auth.uid(), 'listing', NEW.id, NULL, NEW.status::text, NULL);
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.audit_listing_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.audit_log(actor_id, entity_type, entity_id, from_status, to_status, reason_code, notes)
    VALUES (auth.uid(), 'listing', NEW.id, OLD.status::text, NEW.status::text,
            NEW.rejection_reason_code::text, NEW.rejection_notes);
  END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.audit_verification_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.audit_log(actor_id, entity_type, entity_id, from_status, to_status, reason_code, notes)
    VALUES (auth.uid(), 'seller_verification', NEW.user_id, OLD.status::text, NEW.status::text,
            NEW.rejection_code::text, NEW.notes);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_audit_listing_insert AFTER INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.audit_listing_insert();
CREATE TRIGGER trg_audit_listing_status AFTER UPDATE OF status ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.audit_listing_status();
CREATE TRIGGER trg_audit_verification_status AFTER UPDATE OF status ON public.seller_verifications
  FOR EACH ROW EXECUTE FUNCTION public.audit_verification_status();

-- 6. First-listing forced review
CREATE OR REPLACE FUNCTION public.enforce_first_listing_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE has_prev boolean;
BEGIN
  IF NEW.status = 'draft' THEN RETURN NEW; END IF;
  SELECT EXISTS (
    SELECT 1 FROM public.listings
    WHERE seller_id = NEW.seller_id
      AND status IN ('published','sold','archived')
  ) INTO has_prev;
  IF NOT has_prev THEN
    NEW.status := 'pending_review';
    NEW.rejection_notes := COALESCE(NEW.rejection_notes,'') || CASE WHEN NEW.rejection_notes IS NULL THEN '' ELSE ' ' END;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_enforce_first_listing_review BEFORE INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.enforce_first_listing_review();

-- 7. lead_events dedupe (silent drop)
CREATE OR REPLACE FUNCTION public.lead_events_dedupe()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE window_seconds int; exists_prev boolean;
BEGIN
  window_seconds := CASE NEW.type
    WHEN 'view' THEN 60
    WHEN 'favorite' THEN 10
    WHEN 'contact_click' THEN 30
    WHEN 'whatsapp_click' THEN 30
    ELSE 10 END;
  IF NEW.user_id IS NULL THEN window_seconds := LEAST(window_seconds, 10); END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.lead_events
    WHERE listing_id = NEW.listing_id
      AND type = NEW.type
      AND COALESCE(user_id::text,'anon') = COALESCE(NEW.user_id::text,'anon')
      AND created_at > now() - make_interval(secs => window_seconds)
  ) INTO exists_prev;

  IF exists_prev THEN RETURN NULL; END IF;
  RETURN NEW;
END; $$;
COMMENT ON FUNCTION public.lead_events_dedupe() IS
  'Silently drops duplicate lead_events within a short window per (listing,type,user). Clients see success with 0 rows returned.';

CREATE TRIGGER trg_lead_events_dedupe BEFORE INSERT ON public.lead_events
  FOR EACH ROW EXECUTE FUNCTION public.lead_events_dedupe();

-- 8. storage.objects policies
DROP POLICY IF EXISTS listing_images_select_public ON storage.objects;
DROP POLICY IF EXISTS listing_images_select_owner ON storage.objects;
DROP POLICY IF EXISTS listing_images_select_staff ON storage.objects;
DROP POLICY IF EXISTS listing_images_insert_own ON storage.objects;
DROP POLICY IF EXISTS listing_images_update_own ON storage.objects;
DROP POLICY IF EXISTS listing_images_delete_own ON storage.objects;
DROP POLICY IF EXISTS verification_docs_select_own ON storage.objects;
DROP POLICY IF EXISTS verification_docs_select_admin ON storage.objects;
DROP POLICY IF EXISTS verification_docs_insert_own ON storage.objects;
DROP POLICY IF EXISTS verification_docs_update_own ON storage.objects;
DROP POLICY IF EXISTS verification_docs_delete_own ON storage.objects;

-- listing-images: SELECT public only for published listings
CREATE POLICY listing_images_select_public ON storage.objects FOR SELECT
  USING (
    bucket_id = 'listing-images'
    AND EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id::text = (storage.foldername(name))[1]
        AND l.status = 'published'
    )
  );

CREATE POLICY listing_images_select_owner ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id::text = (storage.foldername(name))[1]
        AND l.seller_id = auth.uid()
    )
  );

CREATE POLICY listing_images_select_staff ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'))
  );

CREATE POLICY listing_images_insert_own ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'listing-images'
    AND owner = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id::text = (storage.foldername(name))[1]
        AND l.seller_id = auth.uid()
    )
  );

CREATE POLICY listing_images_update_own ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'listing-images' AND owner = auth.uid()
    AND EXISTS (SELECT 1 FROM public.listings l WHERE l.id::text = (storage.foldername(name))[1] AND l.seller_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'listing-images' AND owner = auth.uid()
    AND EXISTS (SELECT 1 FROM public.listings l WHERE l.id::text = (storage.foldername(name))[1] AND l.seller_id = auth.uid())
  );

CREATE POLICY listing_images_delete_own ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'listing-images' AND owner = auth.uid()
    AND EXISTS (SELECT 1 FROM public.listings l WHERE l.id::text = (storage.foldername(name))[1] AND l.seller_id = auth.uid())
  );

-- verification-docs: private, owner-only + admin
CREATE POLICY verification_docs_select_own ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'verification-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY verification_docs_select_admin ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'verification-docs'
    AND public.has_role(auth.uid(),'admin')
  );

CREATE POLICY verification_docs_insert_own ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'verification-docs'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY verification_docs_update_own ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id='verification-docs' AND owner=auth.uid() AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id='verification-docs' AND owner=auth.uid() AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY verification_docs_delete_own ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id='verification-docs' AND owner=auth.uid() AND (storage.foldername(name))[1] = auth.uid()::text);
