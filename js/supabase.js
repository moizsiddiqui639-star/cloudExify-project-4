// Project URL (Usi Settings -> API page par top par likha hoga)
const SUPABASE_URL = "https://supabase.com/dashboard/project/pnodbyrryqozysbnuaom"; 

// Publishable Key (Jo screenshot se aapne copy ki hai)
const SUPABASE_ANON_KEY = "sb_publishable_YaK-jySKrNStad6lPq9qpQ_KvDubsxM";

// Connection setup
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);