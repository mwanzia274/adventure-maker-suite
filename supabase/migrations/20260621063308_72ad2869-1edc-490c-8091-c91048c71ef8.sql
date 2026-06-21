
-- Add admin notes column to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS admin_notes text;

-- Reply history table
CREATE TABLE IF NOT EXISTS public.booking_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email text,
  channel text NOT NULL DEFAULT 'email',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_replies TO authenticated;
GRANT ALL ON public.booking_replies TO service_role;

ALTER TABLE public.booking_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read replies" ON public.booking_replies FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert replies" ON public.booking_replies FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update replies" ON public.booking_replies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete replies" ON public.booking_replies FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS booking_replies_booking_id_idx ON public.booking_replies(booking_id, created_at DESC);
