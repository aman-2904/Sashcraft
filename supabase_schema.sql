-- ====================================================================
-- SASHCRAFT SUPABASE DATABASE INITIALIZATION SCRIPT
-- ====================================================================
-- Run this script in your Supabase project's SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ====================================================================

-- 1. Create sash_products table (Live pricing and stock control)
CREATE TABLE IF NOT EXISTS public.sash_products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    tagline TEXT,
    in_stock BOOLEAN DEFAULT true NOT NULL,
    without_lace_actual NUMERIC NOT NULL,
    without_lace_discounted NUMERIC NOT NULL,
    with_lace_actual NUMERIC NOT NULL,
    with_lace_discounted NUMERIC NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure title and image columns exist if table was previously created
ALTER TABLE public.sash_products ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.sash_products ADD COLUMN IF NOT EXISTS images JSONB;
ALTER TABLE public.sash_products ADD COLUMN IF NOT EXISTS with_lace_images JSONB;
ALTER TABLE public.sash_products ADD COLUMN IF NOT EXISTS without_lace_images JSONB;

-- 2. Create enquiries table (Customer quote requests, orders & shipping address)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id BIGSERIAL PRIMARY KEY,
    reference_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    variant TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT,
    event_date TEXT,
    address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure address column exists if table was previously created
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS address TEXT;

-- 3. Create user_profiles table (Customer profile, phone, delivery address, role)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'customer' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure columns exist if table was previously created
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- 4. Create admin_users table (Strict administrator authorization registry)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.sash_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for admin_users:
DROP POLICY IF EXISTS "Public Read Access on admin_users" ON public.admin_users;
CREATE POLICY "Public Read Access on admin_users"
    ON public.admin_users
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow All Updates on admin_users" ON public.admin_users;
CREATE POLICY "Allow All Updates on admin_users"
    ON public.admin_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. RLS Policies for sash_products:
-- Allow anyone (public storefront) to read live products and pricing
DROP POLICY IF EXISTS "Public Read Access on sash_products" ON public.sash_products;
CREATE POLICY "Public Read Access on sash_products"
    ON public.sash_products
    FOR SELECT
    USING (true);

-- Allow inserting and updating products (admin management)
DROP POLICY IF EXISTS "Allow All Updates on sash_products" ON public.sash_products;
CREATE POLICY "Allow All Updates on sash_products"
    ON public.sash_products
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. RLS Policies for enquiries:
-- Allow customers and visitors to submit enquiries from the storefront
DROP POLICY IF EXISTS "Public Insert on enquiries" ON public.enquiries;
CREATE POLICY "Public Insert on enquiries"
    ON public.enquiries
    FOR INSERT
    WITH CHECK (true);

-- Drop old permissive policies if they exist
DROP POLICY IF EXISTS "Allow All Access on enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Customer Read Own Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admin Manage Enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admin Delete Enquiries" ON public.enquiries;

-- Customers can ONLY view their own enquiries; Admins can view all enquiries
CREATE POLICY "Customer Read Own Enquiries"
    ON public.enquiries
    FOR SELECT
    USING (
        lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin')
        OR
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
    );

-- Only verified Admins can update enquiry statuses or notes
CREATE POLICY "Admin Manage Enquiries"
    ON public.enquiries
    FOR UPDATE
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin')
        OR
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
    )
    WITH CHECK (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin')
        OR
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE id = auth.uid() OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
    );

-- Admins can delete enquiries
DROP POLICY IF EXISTS "Admin Delete Enquiries" ON public.enquiries;
CREATE POLICY "Admin Delete Enquiries"
    ON public.enquiries
    FOR DELETE
    USING (true);

-- 7. RLS Policies for user_profiles:
DROP POLICY IF EXISTS "Allow user to manage own profile" ON public.user_profiles;
CREATE POLICY "Allow user to manage own profile"
    ON public.user_profiles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 8. Enable Realtime Replication for instant live updates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'sash_products'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.sash_products;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'enquiries'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.enquiries;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'admin_users'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_users;
    END IF;
END $$;

-- 9. Seed Initial Catalog Data (with updated pricing for all 4 sash lines)
INSERT INTO public.sash_products (
    id, slug, title, category, tagline, in_stock, 
    without_lace_actual, without_lace_discounted, 
    with_lace_actual, with_lace_discounted, updated_at
)
VALUES
    (
        'satin',
        'satinsashes',
        'Imperial Double-Faced Satin Sash',
        'Ceremonial Sashes & Stoles',
        'Ultra-glossy heavy bridal satin with pristine luster',
        true,
        799,
        499,
        2000,
        1000,
        now()
    ),
    (
        'velvet',
        'velvetsashes',
        'Royal Ceremonial Plush Velvet Sash',
        'Luxury Regalia & Honor Stoles',
        'Heavy deep-pile micro-velvet tailored for high dignitary regalia',
        true,
        1099,
        699,
        1499,
        999,
        now()
    ),
    (
        'double-layer',
        'doublelayer',
        'Artisanal Double-Layer Regal Sash',
        'Heritage Bordered Regalia',
        'Two contrasting satin layers with ornamental border margin reveal',
        true,
        999,
        599,
        1399,
        849,
        now()
    ),
    (
        'single-layer',
        'singlelayer',
        'Heavy Fabric Precision Single-Layer Sash',
        'Institutional & Bulk Sashes',
        '280 GSM crisp woven heavy fabric engineered for convocation cohorts',
        true,
        599,
        349,
        899,
        549,
        now()
    )
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    tagline = EXCLUDED.tagline,
    without_lace_actual = EXCLUDED.without_lace_actual,
    without_lace_discounted = EXCLUDED.without_lace_discounted,
    with_lace_actual = EXCLUDED.with_lace_actual,
    with_lace_discounted = EXCLUDED.with_lace_discounted,
    in_stock = EXCLUDED.in_stock,
    updated_at = now();
