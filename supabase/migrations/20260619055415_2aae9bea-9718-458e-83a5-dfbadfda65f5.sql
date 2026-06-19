
-- Lock down SECURITY DEFINER functions: only callable by backend, not public API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- has_role must remain callable so RLS policies that reference it work for signed-in users
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;

-- Tighten booking insert: require basic non-empty fields, no admin status override
DROP POLICY IF EXISTS "anyone can create booking" ON public.bookings;
CREATE POLICY "anyone can create booking" ON public.bookings
  FOR INSERT
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 200
    AND email ~* '^.+@.+\..+$'
    AND status = 'new'
  );
