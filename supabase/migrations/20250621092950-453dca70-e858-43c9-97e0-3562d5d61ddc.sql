
-- Create icons storage bucket for custom icons
INSERT INTO storage.buckets (id, name, public) 
VALUES ('icons', 'icons', true);

-- Create policy to allow authenticated users to upload their own icons
CREATE POLICY "Users can upload their own icons" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'icons' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow public access to icons
CREATE POLICY "Icons are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'icons');
