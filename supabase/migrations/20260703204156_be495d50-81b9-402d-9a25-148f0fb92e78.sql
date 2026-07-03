
DROP POLICY IF EXISTS "lead_insert_any" ON public.lead_events;
CREATE POLICY "lead_insert_scoped" ON public.lead_events FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
