
-- Enable RLS on widgets table if not already enabled
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own widgets
CREATE POLICY "Users can view their own widgets" 
  ON public.widgets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to create their own widgets
CREATE POLICY "Users can create their own widgets" 
  ON public.widgets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own widgets
CREATE POLICY "Users can update their own widgets" 
  ON public.widgets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own widgets
CREATE POLICY "Users can delete their own widgets" 
  ON public.widgets 
  FOR DELETE 
  USING (auth.uid() = user_id);
