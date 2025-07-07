
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...data } = await req.json()

    switch (action) {
      case 'create_session':
        const { widget_id, visitor_id, visitor_name, visitor_email, user_agent, ip_address } = data
        const { data: sessionData, error: sessionError } = await supabase.rpc('create_chat_session', {
          p_widget_id: widget_id,
          p_visitor_id: visitor_id,
          p_visitor_name: visitor_name,
          p_visitor_email: visitor_email,
          p_user_agent: user_agent,
          p_ip_address: ip_address
        })

        if (sessionError) throw sessionError

        return new Response(JSON.stringify({ success: true, session_id: sessionData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'send_message':
        const { session_id, sender_type, sender_id, message, message_type } = data
        const { data: messageData, error: messageError } = await supabase.rpc('send_chat_message', {
          p_session_id: session_id,
          p_sender_type: sender_type,
          p_sender_id: sender_id,
          p_message: message,
          p_message_type: message_type || 'text'
        })

        if (messageError) throw messageError

        return new Response(JSON.stringify({ success: true, message_id: messageData }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_messages':
        const { session_id: sessionId } = data
        const { data: messages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })

        if (messagesError) throw messagesError

        return new Response(JSON.stringify({ success: true, messages }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'close_session':
        const { session_id: closeSessionId } = data
        const { error: closeError } = await supabase
          .from('chat_sessions')
          .update({ status: 'closed', closed_at: new Date().toISOString() })
          .eq('id', closeSessionId)

        if (closeError) throw closeError

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Live chat error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
