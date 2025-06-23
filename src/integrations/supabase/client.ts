import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ttzioshkresaqmsodhfb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0emlvc2hrcmVzYXFtc29kaGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDM3NjksImV4cCI6MjA2NjAxOTc2OX0.2haK7pikLtZOmf4nsmcb8wcvjbYaZLzR7ESug0R4oX0'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // This enables automatic handling of OAuth and magic link URLs
    flowType: 'pkce' // Use PKCE flow for better security
  }
})