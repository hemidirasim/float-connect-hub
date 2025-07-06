
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple rate limiting - məhdudlaşdırma
const requestCounts = new Map()
const RATE_LIMIT = 10 // 10 sorğu dəqiqədə
const RATE_WINDOW = 60000 // 1 dəqiqə

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const key = `${ip}-${Math.floor(now / RATE_WINDOW)}`
  
  const count = requestCounts.get(key) || 0
  if (count >= RATE_LIMIT) {
    return true
  }
  
  requestCounts.set(key, count + 1)
  
  // Köhnə məlumatları təmizlə
  for (const [k] of requestCounts) {
    if (k.split('-')[1] < Math.floor((now - RATE_WINDOW) / RATE_WINDOW)) {
      requestCounts.delete(k)
    }
  }
  
  return false
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting yoxla
    if (isRateLimited(clientIP)) {
      return new Response('Rate limit exceeded', { 
        status: 429,
        headers: corsHeaders 
      })
    }

    const { videoPath } = await req.json()
    
    if (!videoPath) {
      return new Response('Video path required', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Supabase client yarat
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 30 dəqiqəlik signed URL yarat
    const { data, error } = await supabaseClient.storage
      .from('videos')
      .createSignedUrl(videoPath, 1800) // 30 dəqiqə

    if (error) {
      console.error('Signed URL error:', error)
      return new Response('Error creating signed URL', { 
        status: 500,
        headers: corsHeaders 
      })
    }

    return new Response(JSON.stringify({ signedUrl: data.signedUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Get video URL error:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    })
  }
})
