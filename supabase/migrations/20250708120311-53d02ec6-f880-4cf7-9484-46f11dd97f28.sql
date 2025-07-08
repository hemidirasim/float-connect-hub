-- Update the record_widget_view function to use different credit costs based on video type
CREATE OR REPLACE FUNCTION public.record_widget_view(p_widget_id uuid, p_ip_address text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  widget_record RECORD;
  credits_to_deduct INTEGER;
  user_balance INTEGER;
  is_video_link BOOLEAN;
BEGIN
  -- Get widget info
  SELECT w.*, uc.balance INTO widget_record
  FROM public.widgets w
  JOIN public.user_credits uc ON w.user_id = uc.user_id
  WHERE w.id = p_widget_id AND w.is_active = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Widget not found or inactive');
  END IF;
  
  -- Check if video URL is a link (YouTube, Vimeo, Dailymotion, etc.) vs uploaded file
  is_video_link := widget_record.video_url IS NOT NULL AND (
    widget_record.video_url LIKE '%youtube.com%' OR 
    widget_record.video_url LIKE '%youtu.be%' OR
    widget_record.video_url LIKE '%vimeo.com%' OR
    widget_record.video_url LIKE '%dailymotion.com%' OR
    widget_record.video_url LIKE '%twitch.tv%'
  );
  
  -- Calculate credits based on video type:
  -- - Video link (YouTube, Vimeo, etc.): 1 credit
  -- - Video upload: 2 credits  
  -- - No video: 1 credit
  IF widget_record.video_enabled AND widget_record.video_url IS NOT NULL THEN
    credits_to_deduct := CASE WHEN is_video_link THEN 1 ELSE 2 END;
  ELSE
    credits_to_deduct := 1;
  END IF;
  
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
    'remaining_balance', widget_record.balance - credits_to_deduct,
    'video_type', CASE WHEN is_video_link THEN 'link' ELSE 'upload' END
  );
END;
$function$;