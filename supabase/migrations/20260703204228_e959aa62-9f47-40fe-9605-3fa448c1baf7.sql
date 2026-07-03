
-- listing-images: read = public (via signed/public URL API), writes by owner of the listing (path = <listing_id>/...)
CREATE POLICY "listing_images_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

CREATE POLICY "listing_images_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'listing-images'
    AND EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id::text = (storage.foldername(name))[1] AND l.seller_id = auth.uid()
    )
  );

CREATE POLICY "listing_images_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'listing-images'
    AND EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id::text = (storage.foldername(name))[1] AND l.seller_id = auth.uid()
    )
  );

-- verification-docs: private, path = <user_id>/...
CREATE POLICY "verif_docs_read_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'verification-docs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "verif_docs_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'verification-docs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "verif_docs_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'verification-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
