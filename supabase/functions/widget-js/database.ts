
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { Widget, ViewResult } from './types.ts'

export async function getWidget(widgetId: string): Promise<Widget | null> {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  console.log('Fetching widget from database...')
  const { data: widget, error } = await supabaseClient
    .from('widgets')
    .select('*')
    .eq('id', widgetId)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Database error:', error)
    return null
  }

  return widget
}

export async function recordWidgetView(
  widgetId: string,
  ipAddress: string,
  userAgent: string
): Promise<ViewResult> {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data: viewResult } = await supabaseClient.rpc('record_widget_view', {
    p_widget_id: widgetId,
    p_ip_address: ipAddress,
    p_user_agent: userAgent
  })

  return viewResult || { success: false, error: 'Failed to record view' }
}
