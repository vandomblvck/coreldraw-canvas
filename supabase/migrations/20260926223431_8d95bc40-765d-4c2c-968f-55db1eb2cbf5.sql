CREATE TABLE public.transfer_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id uuid NOT NULL REFERENCES public.transfers(id) ON DELETE RESTRICT,
  status text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);
GRANT SELECT ON public.transfer_events TO authenticated;
GRANT ALL ON public.transfer_events TO service_role;
ALTER TABLE public.transfer_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view transfer events" ON public.transfer_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX transfer_events_transfer_created_idx ON public.transfer_events (transfer_id, created_at, id);
CREATE OR REPLACE FUNCTION public.record_transfer_event() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.transfer_events (transfer_id, status, title, description, created_by)
    VALUES (NEW.id, NEW.status, CASE lower(replace(trim(NEW.status), '_', ' '))
      WHEN 'completed' THEN 'Delivered'
      WHEN 'delivered' THEN 'Delivered'
      WHEN 'in progress' THEN 'In progress'
      WHEN 'on hold' THEN 'On hold'
      WHEN 'cancelled' THEN 'Cancelled'
      WHEN 'failed' THEN 'Failed'
      WHEN 'available for pickup' THEN 'Available for pickup'
      WHEN 'sent' THEN 'Sent'
      ELSE 'Status updated' END,
      coalesce(NEW.status_detail, ''), auth.uid());
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER record_transfer_event_on_insert AFTER INSERT ON public.transfers FOR EACH ROW EXECUTE FUNCTION public.record_transfer_event();
CREATE TRIGGER record_transfer_event_on_status_change AFTER UPDATE OF status ON public.transfers FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public.record_transfer_event();
INSERT INTO public.transfer_events (transfer_id, status, title, description, created_at)
SELECT t.id, t.status, CASE lower(replace(trim(t.status), '_', ' ')) WHEN 'completed' THEN 'Delivered' WHEN 'delivered' THEN 'Delivered' WHEN 'in progress' THEN 'In progress' WHEN 'on hold' THEN 'On hold' WHEN 'cancelled' THEN 'Cancelled' WHEN 'failed' THEN 'Failed' WHEN 'available for pickup' THEN 'Available for pickup' WHEN 'sent' THEN 'Sent' ELSE 'Status updated' END, coalesce(t.status_detail, ''), t.updated_at
FROM public.transfers t WHERE NOT EXISTS (SELECT 1 FROM public.transfer_events e WHERE e.transfer_id = t.id);