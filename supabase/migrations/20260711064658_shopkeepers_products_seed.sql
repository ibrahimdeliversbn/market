-- Migration: Create shopkeepers and products tables, enable RLS, and seed data

-- 1. Create shopkeepers table
CREATE TABLE IF NOT EXISTS shopkeepers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopkeeper_id uuid REFERENCES shopkeepers(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE shopkeepers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. Public read-only policies
CREATE POLICY "Public read access" ON shopkeepers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

-- 5. Seed shopkeepers
INSERT INTO shopkeepers (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ibrahim''s Textiles'),
  ('22222222-2222-2222-2222-222222222222', 'Ibrahim''s Hardware');

-- 6. Seed Textiles products (23)
INSERT INTO products (shopkeeper_id, name, price, image_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ibrahims Textiles', 14.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image0.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Ibrahims Textiles', 15.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image1.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'LA Blouse', 12.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image2.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'JC Fibre', 12.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image3.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Jersey Muslimah', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image4.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'T-Shirt JC Lengan', 12.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image5.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Jersey Muslimah', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image6.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Jersey Muslimah - Red', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image7.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Blue Dress', 15.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image8.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'T-Shirt JC Lengan', 12.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image9.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Blue Floral Dress', 15.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image10.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Pink Floral Dress', 15.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image11.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Orange Floral Dress', 15.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image12.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Jersey Muslimah - Multi', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image13.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Jersey Muslimah - Blue Ladies', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image14.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Jersey Muslimah - Blue & Pink Ladies', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image15.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'T-Shirt JC Lengan', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image16.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'T-Shirt JC Lengan', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image17.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Jersey Muslimah - Blue & Pink Ladies', 13.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image18.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Wide Sleeve - Pink/Blue', 16.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image19.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Wide Sleeve - Blue/Grey', 16.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image20.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Wide Sleeve - Green/Brown', 16.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image21.jpeg'),
  ('11111111-1111-1111-1111-111111111111', 'Wide Sleeve - Red/Blue', 16.99, 'https://kruvilcjyrxfsihvtwjm.supabase.co/storage/v1/object/public/product-images/image22.jpeg');

-- 7. Seed Hardware placeholder products (5, distinct verified Unsplash images)
INSERT INTO products (shopkeeper_id, name, price, image_url) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Hammer & Screwdriver Set', 9.99, 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80'),
  ('22222222-2222-2222-2222-222222222222', 'Assorted Hand Tool Rack', 24.99, 'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?auto=format&fit=crop&w=800&q=80'),
  ('22222222-2222-2222-2222-222222222222', 'Cordless Power Drill', 49.99, 'https://images.unsplash.com/photo-1606676539940-12768ce0e762?auto=format&fit=crop&w=800&q=80'),
  ('22222222-2222-2222-2222-222222222222', 'Carpentry Tool Bundle', 34.99, 'https://images.unsplash.com/photo-1567361808960-dec9cb578182?auto=format&fit=crop&w=800&q=80'),
  ('22222222-2222-2222-2222-222222222222', 'Mechanics Tool Set', 44.99, 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80');

-- End of migration
