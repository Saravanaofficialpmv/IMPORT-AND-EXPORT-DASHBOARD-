-- Allow service role to insert users (for signup via admin client)
-- The admin client uses the service role key which bypasses RLS,
-- but this policy also allows anon role to insert for account creation

-- Drop existing insert policy if any
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;

-- Allow anyone to INSERT a new user (signup)
-- The password is hashed server-side before insertion
CREATE POLICY "Allow user registration"
  ON public.users
  FOR INSERT
  WITH CHECK (true);
