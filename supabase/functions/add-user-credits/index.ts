
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { userId, credits } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current user credits
    const { data: currentCredits, error: fetchError } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch current credits: ${fetchError.message}`);
    }

    // Update user credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ 
        balance: currentCredits.balance + credits,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      throw new Error(`Failed to update credits: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, newBalance: currentCredits.balance + credits }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error adding user credits:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});
