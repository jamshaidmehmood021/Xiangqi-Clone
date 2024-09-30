import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://emmiaqzgxczelhtfzvmr.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbWlhcXpneGN6ZWxodGZ6dm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NjQxOTgsImV4cCI6MjA0MTU0MDE5OH0.vL5E8sMswIoqlp-RU9E15uaefK2Tf5oBeblKE6-Yv9M'
);