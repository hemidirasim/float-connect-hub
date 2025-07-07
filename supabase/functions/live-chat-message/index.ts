import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()
    console.log('Live chat action:', action, 'with data:', data)

    if (action === 'start_session') {
      // Create a new chat session
      const { data: session, error: sessionError } = await supabaseClient
        .from('chat_sessions')
        .insert({
          widget_id: data.widget_id,
          visitor_name: data.visitor_name,
          visitor_email: data.visitor_email || null,
          visitor_phone: data.visitor_phone || null,
          custom_fields: data.custom_fields || {},
          status: 'active'
        })
        .select()
        .single()

      if (sessionError) {
        console.error('Error creating session:', sessionError)
        throw sessionError
      }

      console.log('Chat session created:', session.id)
      return new Response(
        JSON.stringify({ session_id: session.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'send_message') {
      // Add a new message to the session
      const { error: messageError } = await supabaseClient
        .from('live_chat_messages')
        .insert({
          widget_id: data.widget_id,
          session_id: data.session_id,
          message: data.message,
          sender_name: data.sender_name,
          sender_email: data.sender_email || null,
          is_from_visitor: data.is_from_visitor || true
        })

      if (messageError) {
        console.error('Error saving message:', messageError)
        throw messageError
      }

      console.log('Message saved successfully')
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'end_session') {
      // End the chat session
      const { error: endError } = await supabaseClient
        .from('chat_sessions')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', data.session_id)

      if (endError) {
        console.error('Error ending session:', endError)
        throw endError
      }

      console.log('Chat session ended:', data.session_id)
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Live chat error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})