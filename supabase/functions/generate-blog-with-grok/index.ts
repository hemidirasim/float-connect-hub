
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

    // Blog topics about Hiclient services with corresponding images
    const blogTopicsWithImages = [
      {
        topic: 'The Ultimate Guide to Floating Chat Widgets for Website Conversion',
        image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=630&fit=crop'
      },
      {
        topic: 'How Floating Contact Buttons Boost Customer Engagement by 300%',
        image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=630&fit=crop'
      },
      {
        topic: 'Mobile-First Website Design: Why Floating Widgets Are Essential',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=630&fit=crop'
      },
      {
        topic: 'Comparing Live Chat vs Floating Contact Widgets: Which Converts Better?',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop'
      },
      {
        topic: 'The Psychology Behind Floating Action Buttons on Websites',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop'
      },
      {
        topic: 'From WhatsApp to Telegram: Multi-Channel Contact Strategies',
        image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=630&fit=crop'
      },
      {
        topic: 'Video Integration in Floating Widgets: The New Customer Experience Trend',
        image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=630&fit=crop'
      },
      {
        topic: 'ROI Analysis: How Floating Contact Widgets Pay for Themselves',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop'
      },
      {
        topic: 'Accessibility and Floating Widgets: Making Your Site Inclusive',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=630&fit=crop'
      },
      {
        topic: 'The Evolution of Customer Support: From Call Centers to Smart Widgets',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop'
      }
    ];

    // Select a random topic with image
    const randomBlogData = blogTopicsWithImages[Math.floor(Math.random() * blogTopicsWithImages.length)];
    const randomTopic = randomBlogData.topic;
    const featuredImage = randomBlogData.image;
    
    console.log('Selected blog topic:', randomTopic);
    console.log('Selected featured image:', featuredImage);

    // Generate blog content with Grok API - improved prompt for better formatting
    const grokPrompt = `Write a comprehensive, SEO-optimized blog post about "${randomTopic}" for Hiclient.co - a service that provides floating chat widgets for websites. 

IMPORTANT FORMATTING REQUIREMENTS:
- Use proper HTML formatting with clear paragraph breaks
- Use <h2> and <h3> tags for section headings
- Use <p> tags for paragraphs with proper spacing
- Use <ul> and <li> tags for lists
- Use <strong> tags for emphasis
- Ensure proper line breaks between sections
- Make content visually appealing and easy to read

Content Requirements:
- Write in English
- 800-1200 words
- Include practical tips and benefits
- Mention how Hiclient's floating widgets can help businesses
- Include statistics where relevant (use realistic but impressive numbers)
- Use engaging subheadings with HTML formatting
- Write in a professional but approachable tone
- Focus on benefits for website owners and businesses
- Include actionable advice
- Add a compelling introduction and conclusion

Structure the blog post with these sections:
1. Introduction (hook the reader)
2. Main content with 3-4 well-organized sections using <h2> headings
3. Benefits specific to Hiclient's floating widgets
4. Practical implementation tips
5. Conclusion with call-to-action

The blog should highlight how Hiclient's floating contact widgets improve customer engagement, conversion rates, and user experience on websites. Format everything with proper HTML tags for excellent readability.`;

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
            content: 'You are an expert content writer specializing in SaaS and website optimization topics. Write engaging, SEO-friendly blog posts with proper HTML formatting that provide real value to readers. Always use proper HTML tags for headings, paragraphs, lists, and emphasis to ensure excellent readability.'
          },
          {
            role: 'user',
            content: grokPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
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

    let blogContent = grokData.choices[0].message.content;

    // Clean up and improve formatting
    blogContent = blogContent
      .replace(/\n\n\n+/g, '\n\n') // Remove excessive line breaks
      .replace(/([.!?])\s*([A-Z])/g, '$1\n\n<p>$2') // Add paragraph breaks after sentences
      .replace(/^([^<\n])/gm, '<p>$1') // Wrap lines that don't start with HTML tags
      .replace(/<p>(<h[1-6])/g, '$1') // Remove <p> before headings
      .replace(/(<\/h[1-6]>)\s*<p>/g, '$1\n\n<p>') // Add spacing after headings
      .replace(/(<\/p>)\s*(<h[1-6])/g, '$1\n\n$2') // Add spacing before headings
      .replace(/\n\s*\n/g, '\n\n'); // Clean up whitespace

    console.log('Blog content generated and formatted successfully');

    // Generate slug from title
    const slug = randomTopic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create excerpt from first paragraph - extract clean text
    const excerptMatch = blogContent.match(/<p[^>]*>(.*?)<\/p>/);
    const excerpt = excerptMatch ? 
      excerptMatch[1].replace(/<[^>]*>/g, '').substring(0, 180) + '...' : 
      blogContent.replace(/<[^>]*>/g, '').substring(0, 180) + '...';

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
        featured_image: featuredImage,
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
        featured_image: blogData.featured_image,
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
