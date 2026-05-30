import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gqpufacmvujvewezycum.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9wU2xZTDIgE-SqGsy8iKdg_KMQmGzTB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
