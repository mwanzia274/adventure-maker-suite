
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Tours
CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  days INT NOT NULL DEFAULT 1,
  category TEXT NOT NULL,
  group_size TEXT NOT NULL DEFAULT '2-6 guests',
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  img TEXT,
  short_desc TEXT NOT NULL,
  long_desc TEXT NOT NULL DEFAULT '',
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  excludes JSONB NOT NULL DEFAULT '[]'::jsonb,
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tours TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tours TO authenticated;
GRANT ALL ON public.tours TO service_role;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read published tours" ON public.tours FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert tours" ON public.tours FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update tours" ON public.tours FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete tours" ON public.tours FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tours_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bookings (enquiries)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  trip TEXT,
  travel_date DATE,
  travellers TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon;
GRANT INSERT ON public.bookings TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can create booking" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  location TEXT,
  rating INT NOT NULL DEFAULT 5,
  text TEXT NOT NULL,
  trip TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read approved reviews" ON public.reviews FOR SELECT USING (approved = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Gallery
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read published gallery" ON public.gallery_items FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert gallery" ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update gallery" ON public.gallery_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete gallery" ON public.gallery_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER gallery_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Profile auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed admin user
DO $$
DECLARE
  admin_id UUID := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@admin.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_id, 'authenticated', 'authenticated',
      'admin@admin.com',
      crypt('admin12345', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Admin"}'::jsonb,
      false, '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), admin_id,
      jsonb_build_object('sub', admin_id::text, 'email', 'admin@admin.com', 'email_verified', true),
      'email', admin_id::text,
      now(), now(), now()
    );

    INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'admin');
  END IF;
END $$;
