/**
 * GLOW BY VEE - SYNC MANAGER UPDATE
 */

const SUPABASE_URL = "https://znanyxsycuhhykciwigi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYW55eHN5Y3VoaHlrY2l3aWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDg2ODcsImV4cCI6MjA5MDcyNDY4N30.yD3lulYttBU90u3jt4LUVVUeW53vGT9Em9W2YaZFkdA";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GlowSync = {
    // --- NEW ADMIN AUTH & ACTIVITY SYNC ---
    
    // Create New Admin Account
    async registerAdmin(email, password, fullName) {
        const { data, error } = await _supabase.auth.signUp({
            email, 
            password, 
            options: { data: { full_name: fullName } }
        });
        if (error) return { success: false, error: error.message };
        
        // Log the registration event
        await this.logActivity('REGISTER_ADMIN', `New admin registered: ${email}`, data.user?.id);
        return { success: true, data };
    },

    // Admin Login
    async loginAdmin(email, password) {
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        
        await this.logActivity('LOGIN', `Admin logged in: ${email}`, data.user?.id);
        return { success: true, data };
    },

    // Log Activity to Supabase 'admin_logs' table
    async logActivity(action, details, adminId = null) {
        try {
            const user = adminId || (await _supabase.auth.getUser()).data.user?.id;
            if (!user) return;

            await _supabase.from('admin_logs').insert([{
                admin_id: user,
                action: action,
                details: details,
                created_at: new Date()
            }]);
        } catch (e) {
            console.error("Logging failed", e);
        }
    },

    // Existing Product/Order methods below...
    async getProducts() { /* ... existing code ... */ },
    async addProduct(productData, imageFile) { /* ... existing code ... */ },
    async placeOrder(customerPhone, totalAmount, cartItems) { /* ... existing code ... */ },
    getImgUrl(fileName) { /* ... existing code ... */ }
};

window.GlowSync = GlowSync;
window._supabase = _supabase; // Ensure the client is globally accessible
