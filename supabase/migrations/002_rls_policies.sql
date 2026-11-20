-- ============================================================
-- MixoMarket Migration 002: Row Level Security Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_tryons ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Security Definer Helpers
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(auth.user_role() = 'admin', false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth.user_vendor_id()
RETURNS UUID AS $$
  SELECT id FROM public.vendors WHERE profile_id = auth.uid() AND status = 'approved';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- CATEGORIES (Public read, admin write)
CREATE POLICY "Categories viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (auth.is_admin());

-- PRODUCTS (Active viewable by everyone, vendor manages own)
CREATE POLICY "Active products viewable by everyone" ON products FOR SELECT USING (is_active = true OR auth.is_admin() OR vendor_id = auth.user_vendor_id());
CREATE POLICY "Vendors can insert products" ON products FOR INSERT WITH CHECK (vendor_id = auth.user_vendor_id() OR auth.is_admin());
CREATE POLICY "Vendors can update own products" ON products FOR UPDATE USING (vendor_id = auth.user_vendor_id() OR auth.is_admin());

-- PRODUCT VARIANTS & IMAGES
CREATE POLICY "Variants viewable by everyone" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Images viewable by everyone" ON product_images FOR SELECT USING (true);

-- DELIVERY ZONES & PROMOTIONS
CREATE POLICY "Delivery zones viewable by everyone" ON delivery_zones FOR SELECT USING (true);
CREATE POLICY "Active promotions viewable by everyone" ON promotions FOR SELECT USING (is_active = true AND starts_at <= NOW() AND ends_at > NOW());

-- REVIEWS (Visible reviews readable by all, authenticated users insert)
CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "Users can add reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FAVORITES
CREATE POLICY "Users can see own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- CARTS & CART ITEMS
CREATE POLICY "Users can view own cart" ON carts FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "Users can manage own cart" ON carts FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- ORDERS & ORDER ITEMS
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR auth.is_admin());
CREATE POLICY "Vendors can view order items for their products" ON order_items FOR SELECT USING (vendor_id = auth.user_vendor_id() OR auth.is_admin() OR EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- VIRTUAL TRY-ONS
CREATE POLICY "Users can view own try-ons" ON virtual_tryons FOR SELECT USING (auth.uid() = user_id OR auth.is_admin());
CREATE POLICY "Users can insert own try-ons" ON virtual_tryons FOR INSERT WITH CHECK (auth.uid() = user_id);
