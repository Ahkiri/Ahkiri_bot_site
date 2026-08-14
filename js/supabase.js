const SUPABASE_URL = "https://btvemlnxrzbzwujsibff.supabase.co";
const SUPABASE_KEY = "sb_publishable_0-PAlDp52ceYTuPJe8kqSg_cFr5J3gC";

const clientSupabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("✅ Ahkiri est connecté à Supabase");
