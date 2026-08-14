const SUPABASE_URL = "MET_TON_PROJECT_URL_ICI";
const SUPABASE_KEY = "MET_TA_PUBLISHABLE_KEY_ICI";

const clientSupabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("✅ Ahkiri est connecté à Supabase");
