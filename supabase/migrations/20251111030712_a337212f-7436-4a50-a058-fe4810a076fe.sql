-- First, insert a default settings row
INSERT INTO public.settings (id, created_at, updated_at, poster_url, whatsapp_media_url)
VALUES (1, now(), now(), null, null)
ON CONFLICT (id) DO NOTHING;

-- Fix storage policies for posters bucket to allow public uploads
DROP POLICY IF EXISTS "Authenticated users can upload posters" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update posters" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete posters" ON storage.objects;

-- CREATE POLICY "Anyone can upload posters"
-- ON storage.objects
-- FOR INSERT
-- WITH CHECK (bucket_id = 'posters');

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Anyone can upload posters'
          AND tablename = 'objects'
          AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Anyone can upload posters"
        ON storage.objects
        FOR INSERT
        WITH CHECK (bucket_id = 'posters');
    END IF;
END $$;

CREATE POLICY "Anyone can update posters"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'posters');

CREATE POLICY "Anyone can delete posters"
ON storage.objects
FOR DELETE
USING (bucket_id = 'posters');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create team_members table for user management
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create leads table with all required fields
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  lead_type TEXT,
  status TEXT DEFAULT 'new',
  assigned_to UUID REFERENCES public.team_members(id),
  met_by UUID REFERENCES public.team_members(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create follow_ups table
CREATE TABLE public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.team_members(id)
);

-- Enable RLS on all tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_members
CREATE POLICY "Anyone can read team members"
ON public.team_members
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert team members"
ON public.team_members
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update team members"
ON public.team_members
FOR UPDATE
USING (true);

-- RLS Policies for user_roles
CREATE POLICY "Anyone can read user roles"
ON public.user_roles
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (true);

-- RLS Policies for leads
CREATE POLICY "Anyone can read leads"
ON public.leads
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update leads"
ON public.leads
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete leads"
ON public.leads
FOR DELETE
USING (true);

-- RLS Policies for follow_ups
CREATE POLICY "Anyone can read follow ups"
ON public.follow_ups
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert follow ups"
ON public.follow_ups
FOR INSERT
WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();