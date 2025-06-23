
-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Create policy to allow authenticated users to upload videos
CREATE POLICY "Users can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Create policy to allow public access to videos
CREATE POLICY "Videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos');

-- Create policy to allow users to update their own videos
CREATE POLICY "Users can update their own videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to delete their own videos
CREATE POLICY "Users can delete their own videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
