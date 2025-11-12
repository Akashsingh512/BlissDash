-- Create settings table to store poster URL and other global settings
CREATE TABLE IF NOT EXISTS public.settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  poster_url TEXT,
  whatsapp_media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings
CREATE POLICY "Anyone can read settings"
ON public.settings FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can update settings"
ON public.settings FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert settings"
ON public.settings FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create storage bucket for posters


insert into storage.buckets (id, public)
values ('posters', true)
on conflict (id) do nothing;


-- RLS policies for posters bucket
CREATE POLICY "Anyone can view posters"
ON storage.objects FOR SELECT
USING (bucket_id = 'posters');

CREATE POLICY "Authenticated users can upload posters"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'posters' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update posters"
ON storage.objects FOR UPDATE
USING (bucket_id = 'posters' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete posters"
ON storage.objects FOR DELETE
USING (bucket_id = 'posters' AND auth.role() = 'authenticated');

-- Update storage policies to allow public uploads (since app has no auth)
DROP POLICY IF EXISTS "Authenticated users can upload posters" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update posters" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete posters" ON storage.objects;

CREATE POLICY "Anyone can upload posters"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'posters');

CREATE POLICY "Anyone can update posters"
ON storage.objects FOR UPDATE
USING (bucket_id = 'posters');

CREATE POLICY "Anyone can delete posters"
ON storage.objects FOR DELETE
USING (bucket_id = 'posters');
