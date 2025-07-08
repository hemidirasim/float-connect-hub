
-- Update the icons storage bucket policy to allow authenticated users to upload their own icons
DROP POLICY IF EXISTS "Users can upload their own icons" ON storage.objects;

CREATE POLICY "Users can upload their own icons" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'icons' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update the policy to allow users to update their own icons
DROP POLICY IF EXISTS "Authenticated users can update icons" ON storage.objects;

CREATE POLICY "Authenticated users can update icons" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'icons' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update the policy to allow users to delete their own icons
DROP POLICY IF EXISTS "Authenticated users can delete icons" ON storage.objects;

CREATE POLICY "Authenticated users can delete icons" ON storage.objects
FOR DELETE USING (
  bucket_id = 'icons' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
