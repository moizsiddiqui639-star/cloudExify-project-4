const SUPABASE_URL = "https://pnodbyrryqozysbnuaom.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_gj4DmTUVfRfpv1KzEZAi3w_EtHISqSe";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);