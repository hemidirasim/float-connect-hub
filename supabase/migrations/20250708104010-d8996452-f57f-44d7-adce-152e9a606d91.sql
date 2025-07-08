
-- First, let's check and drop all existing policies for icons bucket
DROP POLICY IF EXISTS "Users can upload their own icons" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update icons" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete icons" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload icons" ON storage.objects;
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;

-- Create a simple policy that allows authenticated users to upload to icons bucket
CREATE POLICY "Allow authenticated users to upload icons" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'icons' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update icons
CREATE POLICY "Allow authenticated users to update icons" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'icons' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete icons  
CREATE POLICY "Allow authenticated users to delete icons" ON storage.objects
FOR DELETE USING (
  bucket_id = 'icons' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to icons
CREATE POLICY "Allow public read access to icons" ON storage.objects
FOR SELECT USING (bucket_id = 'icons');
