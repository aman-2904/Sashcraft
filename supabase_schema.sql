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

-- 2. Create enquiries table (Customer quote requests & custom orders)
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
    notes TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.sash_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for sash_products:
-- Allow anyone (public storefront) to read live products and pricing
DROP POLICY IF EXISTS "Public Read Access on sash_products" ON public.sash_products;
CREATE POLICY "Public Read Access on sash_products"
    ON public.sash_products
    FOR SELECT
    USING (true);

-- Allow inserting and updating products (authenticated admin or service)
DROP POLICY IF EXISTS "Allow All Updates on sash_products" ON public.sash_products;
CREATE POLICY "Allow All Updates on sash_products"
    ON public.sash_products
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. RLS Policies for enquiries:
-- Allow customers to insert enquiries from the public storefront
DROP POLICY IF EXISTS "Public Insert on enquiries" ON public.enquiries;
CREATE POLICY "Public Insert on enquiries"
    ON public.enquiries
    FOR INSERT
    WITH CHECK (true);

-- Allow reading, updating status, and managing enquiries
DROP POLICY IF EXISTS "Allow All Access on enquiries" ON public.enquiries;
CREATE POLICY "Allow All Access on enquiries"
    ON public.enquiries
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. Enable Realtime Replication for instant live updates on the website
-- Note: If these tables are already in the publication, Supabase will safely skip.
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
END $$;

-- 7. Seed Initial Catalog Data (with updated pricing for all 4 sash lines)
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
