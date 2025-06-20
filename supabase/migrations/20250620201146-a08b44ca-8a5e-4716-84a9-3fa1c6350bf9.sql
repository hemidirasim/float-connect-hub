
-- Create widgets table to store user widgets
CREATE TABLE public.widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Widget',
  website_url TEXT NOT NULL,
  button_color TEXT NOT NULL DEFAULT '#25d366',
  position TEXT NOT NULL DEFAULT 'right',
  tooltip TEXT,
  video_enabled BOOLEAN DEFAULT false,
  button_style TEXT DEFAULT 'circle',
  custom_icon_url TEXT,
  show_on_mobile BOOLEAN DEFAULT true,
  show_on_desktop BOOLEAN DEFAULT true,
  channels JSONB DEFAULT '[]',
  total_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create user_credits table to track user balance
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance INTEGER DEFAULT 100,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create widget_views table to track widget usage
CREATE TABLE public.widget_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id UUID REFERENCES public.widgets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 1,
  view_date TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for widgets
CREATE POLICY "Users can view own widgets" ON public.widgets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own widgets" ON public.widgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own widgets" ON public.widgets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own widgets" ON public.widgets
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_credits
CREATE POLICY "Users can view own credits" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credits" ON public.user_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own credits" ON public.user_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for widget_views
CREATE POLICY "Users can view own widget views" ON public.widget_views
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert widget views" ON public.widget_views
  FOR INSERT WITH CHECK (true);

-- RLS Policies for support_tickets
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to initialize user credits when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance)
  VALUES (NEW.id, 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create credits when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- Function to update widget views and deduct credits
CREATE OR REPLACE FUNCTION public.record_widget_view(
  p_widget_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  widget_record RECORD;
  credits_to_deduct INTEGER;
  user_balance INTEGER;
BEGIN
  -- Get widget info
  SELECT w.*, uc.balance INTO widget_record
  FROM public.widgets w
  JOIN public.user_credits uc ON w.user_id = uc.user_id
  WHERE w.id = p_widget_id AND w.is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Widget not found or inactive');
  END IF;
  
  -- Calculate credits (video enabled = 2 credits, standard = 1 credit)
  credits_to_deduct := CASE WHEN widget_record.video_enabled THEN 2 ELSE 1 END;
  
  -- Check if user has enough credits
  IF widget_record.balance < credits_to_deduct THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits');
  END IF;
  
  -- Record the view
  INSERT INTO public.widget_views (widget_id, user_id, credits_used, ip_address, user_agent)
  VALUES (p_widget_id, widget_record.user_id, credits_to_deduct, p_ip_address, p_user_agent);
  
  -- Update widget total views
  UPDATE public.widgets 
  SET total_views = total_views + 1, updated_at = now()
  WHERE id = p_widget_id;
  
  -- Deduct credits
  UPDATE public.user_credits 
  SET balance = balance - credits_to_deduct, 
      total_spent = total_spent + credits_to_deduct,
      updated_at = now()
  WHERE user_id = widget_record.user_id;
  
  RETURN json_build_object(
    'success', true, 
    'credits_used', credits_to_deduct,
    'remaining_balance', widget_record.balance - credits_to_deduct
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
