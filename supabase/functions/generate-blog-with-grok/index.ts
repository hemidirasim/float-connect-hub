
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting blog generation with Grok API...');

    // Get environment variables
    const grokApiKey = Deno.env.get('GROK_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!grokApiKey) {
      console.error('GROK_API_KEY not found');
      return new Response(JSON.stringify({ error: 'GROK_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not found');
      return new Response(JSON.stringify({ error: 'Supabase credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Blog topics about Hiclient services
    const blogTopics = [
      'The Ultimate Guide to Floating Chat Widgets for Website Conversion',
      'How Floating Contact Buttons Boost Customer Engagement by 300%',
      'Mobile-First Website Design: Why Floating Widgets Are Essential',
      'Comparing Live Chat vs Floating Contact Widgets: Which Converts Better?',
      'The Psychology Behind Floating Action Buttons on Websites',
      'From WhatsApp to Telegram: Multi-Channel Contact Strategies',
      'Video Integration in Floating Widgets: The New Customer Experience Trend',
      'ROI Analysis: How Floating Contact Widgets Pay for Themselves',
      'Accessibility and Floating Widgets: Making Your Site Inclusive',
      'The Evolution of Customer Support: From Call Centers to Smart Widgets'
    ];

    // Select a random topic
    const randomTopic = blogTopics[Math.floor(Math.random() * blogTopics.length)];
    
    console.log('Selected blog topic:', randomTopic);

    // Generate blog content with Grok API
    const grokPrompt = `Write a comprehensive, SEO-optimized blog post about "${randomTopic}" for Hiclient.co - a service that provides floating chat widgets for websites. 

Requirements:
- Write in English
- 800-1200 words
- Include practical tips and benefits
- Mention how Hiclient's floating widgets can help businesses
- Include statistics where relevant
- Use engaging subheadings
- Write in a professional but approachable tone
- Focus on benefits for website owners and businesses
- Include actionable advice

The blog should highlight how Hiclient's floating contact widgets improve customer engagement, conversion rates, and user experience on websites.`;

    console.log('Calling Grok API...');

    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-2-1212',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer specializing in SaaS and website optimization topics. Write engaging, SEO-friendly blog posts that provide real value to readers.'
          },
          {
            role: 'user',
            content: grokPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('Grok API error:', errorText);
      throw new Error(`Grok API error: ${grokResponse.status} - ${errorText}`);
    }

    const grokData = await grokResponse.json();
    
    if (!grokData.choices || !grokData.choices[0] || !grokData.choices[0].message) {
      console.error('Invalid Grok API response:', grokData);
      throw new Error('Invalid response from Grok API');
    }

    const blogContent = grokData.choices[0].message.content;

    console.log('Blog content generated successfully');

    // Generate slug from title
    const slug = randomTopic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create excerpt from first paragraph
    const excerpt = blogContent.split('\n\n')[1] || blogContent.substring(0, 200) + '...';

    // Save blog to database
    console.log('Saving blog to database...');

    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .insert({
        title: randomTopic,
        slug: slug,
        content: blogContent,
        excerpt: excerpt,
        status: 'published',
        featured_image: 'https://hiclient.co/logo.png', // Default featured image
      })
      .select()
      .single();

    if (blogError) {
      console.error('Database error:', blogError);
      throw new Error(`Database error: ${blogError.message}`);
    }

    console.log('Blog saved successfully:', blogData.id);

    return new Response(JSON.stringify({
      success: true,
      message: 'Blog post generated and published successfully',
      blog: {
        id: blogData.id,
        title: blogData.title,
        slug: blogData.slug,
        url: `https://hiclient.co/${blogData.slug}`
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-blog-with-grok function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
