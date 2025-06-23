
-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQ table  
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policy for blogs - allow public read access
CREATE POLICY "Anyone can view published blogs" 
  ON public.blogs 
  FOR SELECT 
  USING (status = 'published');

-- Create policy for blogs - only authors can manage their blogs
CREATE POLICY "Authors can manage their own blogs" 
  ON public.blogs 
  FOR ALL 
  USING (auth.uid() = author_id);

-- Add RLS for FAQ
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policy for FAQ - allow public read access
CREATE POLICY "Anyone can view active FAQs" 
  ON public.faqs 
  FOR SELECT 
  USING (is_active = true);

-- Insert sample FAQ data (in English)
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('What is Hiclient?', 'Hiclient is a platform that allows you to create interactive floating widgets for your website. It makes it easier to connect with your customers through multiple communication channels.', 'General', 1),
('How do I create a widget?', 'To create a widget, fill out the form on the main page, add your contact channels, customize the appearance, and then copy the generated code to add to your website.', 'Usage', 2),
('Which contact channels are supported?', 'We support WhatsApp, Telegram, Email, Phone, and other popular communication platforms.', 'Features', 3),
('What is a video widget?', 'A video widget allows you to show a personal video presentation to your customers. This creates better recognition and connection with your visitors.', 'Features', 4),
('How does the credit system work?', 'Each widget view consumes credits. Simple widgets cost 1 credit per view, while video widgets cost 2 credits per view.', 'Billing', 5),
('How can I get support?', 'You can contact us through the support section in your dashboard, and we will help you with any questions or issues.', 'Support', 6);

-- Insert sample blog data (in English)
INSERT INTO public.blogs (title, slug, content, excerpt, status) VALUES
('Strengthen Customer Relationships with Hiclient', 'strengthen-customer-relationships-with-hiclient', 
'<h2>The Importance of Customer Relationships in Modern Business</h2>
<p>In today''s competitive business environment, building effective customer relationships is the key to success. The Hiclient platform offers you significant advantages in this area.</p>

<h3>Advantages of Floating Widgets</h3>
<ul>
<li>24/7 availability</li>
<li>Multi-channel communication</li>
<li>Mobile compatibility</li>
<li>Quick setup</li>
</ul>

<p>With Hiclient, your customers can easily contact you via WhatsApp, email, phone, and other channels.</p>', 
'How to strengthen customer relationships with floating widgets', 'published'),

('Video Widgets: The Communication Tool of the Future', 'video-widgets-communication-tool-of-the-future',
'<h2>The Power of Video Widgets</h2>
<p>Video content is the most effective marketing tool today. With Hiclient''s video widget feature, you can build closer relationships with your customers.</p>

<h3>Benefits of Video Widgets</h3>
<ul>
<li>Personal introduction</li>
<li>Building trust</li>
<li>Product demonstration</li>
<li>Service explanation</li>
</ul>

<p>Upload videos up to 10MB and show your presentation to customers.</p>',
'Improving customer experience with video widgets', 'published'),

('About Hiclient Credit System', 'about-hiclient-credit-system',
'<h2>Transparent and Fair Pricing</h2>
<p>We use a credit-based pricing system on the Hiclient platform. This system allows you to pay only for the services you use.</p>

<h3>Credit Pricing</h3>
<ul>
<li>Simple widget: 1 credit</li>
<li>Video widget: 2 credits</li>
</ul>

<p>Choose the credit package that suits you and get the most out of the platform.</p>',
'How the credit system works and how cost-effective it is', 'published');
