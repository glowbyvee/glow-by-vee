/**
 * GLOW BY VEE - SYNC MANAGER
 * Centralized Database & Storage Controller
 */

const SUPABASE_URL = "https://znanyxsycuhhykciwigi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYW55eHN5Y3VoaHlrY2l3aWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDg2ODcsImV4cCI6MjA5MDcyNDY4N30.yD3lulYttBU90u3jt4LUVVUeW53vGT9Em9W2YaZFkdA";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GlowSync = {
    // 1. SYNC PRODUCTS (Fetch from DB)
    async getProducts() {
        const { data, error } = await _supabase.from('products').select('*');
        if (error) {
            console.error("❌ Sync Error [Fetch Products]:", error.message);
            return [];
        }
        return data;
    },

    // 2. SYNC NEW PRODUCT (Upload Image + Insert Row)
    async addProduct(productData, imageFile) {
        try {
            // Upload Image
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error: storageError } = await _supabase.storage
                .from('product-images')
                .upload(fileName, imageFile);

            if (storageError) throw storageError;

            // Insert Product Row
            const { data, error: dbError } = await _supabase
                .from('products')
                .insert([{ ...productData, img: fileName }]);

            if (dbError) throw dbError;
            return { success: true };
        } catch (err) {
            console.error("❌ Sync Error [Add Product]:", err.message);
            return { success: false, error: err.message };
        }
    },

    // 3. SYNC ORDERS (Create New Order)
    async placeOrder(customerPhone, totalAmount, cartItems) {
        const { data, error } = await _supabase
            .from('orders')
            .insert([{
                customer_phone: customerPhone,
                total_amount: totalAmount,
                items: JSON.stringify(cartItems),
                status: 'Pending'
            }]);

        if (error) {
            console.error("❌ Sync Error [Place Order]:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true };
    },

    // 4. GET IMAGE URL
    getImgUrl(fileName) {
        if (!fileName) return 'https://via.placeholder.com/300?text=No+Image';
        const { data } = _supabase.storage.from('product-images').getPublicUrl(fileName);
        return data.publicUrl;
    }
};

// Export for use in other scripts
window.GlowSync = GlowSync;
