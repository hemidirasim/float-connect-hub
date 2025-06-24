
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
  // For public widgets, we'll skip the credit system and just record basic stats
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Just update widget total views without credit check
    const { error } = await supabaseClient
      .from('widgets')
      .update({ 
        total_views: supabaseClient.raw('total_views + 1'),
        updated_at: new Date().toISOString()
      })
      .eq('id', widgetId)

    if (error) {
      console.error('Error updating widget views:', error)
    }

    return { success: true }
  } catch (error) {
    console.error('Error in recordWidgetView:', error)
    return { success: true } // Still allow widget to work even if view tracking fails
  }
}
