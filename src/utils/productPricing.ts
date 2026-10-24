import { supabase } from './supabase/client';
import { SashProductConfig } from '@/data/sashesData';
import { AdminProductOverride } from '@/types/admin';

export const PRICING_UPDATED_EVENT = 'sashcraft_pricing_updated';
export const PRICING_CHANNEL_NAME = 'sashcraft_pricing_sync';
const LOCAL_STORAGE_KEY = 'sashcraft_product_overrides';

/**
 * Format raw database row into an AdminProductOverride
 */
export function mapRowToOverride(row: any): AdminProductOverride {
  return {
    id: row.id || row.slug,
    slug: row.slug,
    title: row.title || '',
    inStock: row.in_stock !== undefined ? Boolean(row.in_stock) : true,
    withoutLaceActual: Number(row.without_lace_actual) || 0,
    withoutLaceDiscounted: Number(row.without_lace_discounted) || 0,
    withLaceActual: Number(row.with_lace_actual) || 0,
    withLaceDiscounted: Number(row.with_lace_discounted) || 0,
    lastUpdated: row.updated_at || new Date().toISOString(),
  };
}

/**
 * Get all cached overrides from localStorage
 */
export function getLocalStoredOverrides(): Record<string, AdminProductOverride> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Could not read cached product overrides:', err);
    return {};
  }
}

/**
 * Apply override values on top of a static SashProductConfig
 */
export function applyOverrideToProduct(
  product: SashProductConfig,
  override?: Partial<AdminProductOverride> | null
): SashProductConfig {
  if (!override) return product;

  return {
    ...product,
    inStock: override.inStock !== undefined ? override.inStock : product.inStock,
    variants: {
      ...product.variants,
      withoutLace: {
        ...product.variants.withoutLace,
        actualPrice:
          override.withoutLaceActual !== undefined && override.withoutLaceActual > 0
            ? override.withoutLaceActual
            : product.variants.withoutLace.actualPrice,
        discountedPrice:
          override.withoutLaceDiscounted !== undefined && override.withoutLaceDiscounted > 0
            ? override.withoutLaceDiscounted
            : product.variants.withoutLace.discountedPrice,
      },
      withLace: {
        ...product.variants.withLace,
        actualPrice:
          override.withLaceActual !== undefined && override.withLaceActual > 0
            ? override.withLaceActual
            : product.variants.withLace.actualPrice,
        discountedPrice:
          override.withLaceDiscounted !== undefined && override.withLaceDiscounted > 0
            ? override.withLaceDiscounted
            : product.variants.withLace.discountedPrice,
      },
    },
  };
}

/**
 * Fetch a single product's live pricing from Supabase, falling back to localStorage
 */
export async function fetchProductOverride(slug: string): Promise<AdminProductOverride | null> {
  // 1. Check local cache first
  const localOverrides = getLocalStoredOverrides();
  const cached = localOverrides[slug] || null;

  try {
    // 2. Fetch live from Supabase sash_products table
    const { data, error } = await supabase
      .from('sash_products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      const override = mapRowToOverride(data);
      // Update local cache with latest database state
      localOverrides[slug] = override;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localOverrides));
      }
      return override;
    }
  } catch (err) {
    console.warn('Supabase fetch failed, using local cache:', err);
  }

  return cached;
}

/**
 * Fetch all product overrides from Supabase, falling back to localStorage
 */
export async function fetchAllProductOverrides(): Promise<Record<string, AdminProductOverride>> {
  const localOverrides = getLocalStoredOverrides();

  try {
    const { data, error } = await supabase
      .from('sash_products')
      .select('*');

    if (!error && data && Array.isArray(data) && data.length > 0) {
      const updatedMap: Record<string, AdminProductOverride> = { ...localOverrides };
      data.forEach((row) => {
        if (row.slug) {
          updatedMap[row.slug] = mapRowToOverride(row);
        }
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMap));
      }
      return updatedMap;
    }
  } catch (err) {
    console.warn('Supabase fetch all products failed, using local cache:', err);
  }

  return localOverrides;
}

/**
 * Save an override for a product:
 * 1. Writes to LocalStorage immediately
 * 2. Emits CustomEvent and BroadcastChannel for same/other tabs
 * 3. Upserts to Supabase sash_products table
 */
export async function saveProductOverride(
  override: AdminProductOverride
): Promise<{ success: boolean; error?: string }> {
  // 1. Save locally
  try {
    const local = getLocalStoredOverrides();
    local[override.slug] = {
      ...override,
      lastUpdated: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));

      // 2. Emit instant local broadcast event
      window.dispatchEvent(
        new CustomEvent(PRICING_UPDATED_EVENT, { detail: local[override.slug] })
      );

      // BroadcastChannel for cross-tab immediate synchronization
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel(PRICING_CHANNEL_NAME);
        bc.postMessage(local[override.slug]);
        bc.close();
      }
    }
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }

  // 3. Upsert into Supabase
  try {
    const payload = {
      id: override.id || override.slug,
      slug: override.slug,
      title: override.title,
      in_stock: override.inStock,
      without_lace_actual: override.withoutLaceActual,
      without_lace_discounted: override.withoutLaceDiscounted,
      with_lace_actual: override.withLaceActual,
      with_lace_discounted: override.withLaceDiscounted,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('sash_products')
      .upsert(payload, { onConflict: 'slug' });

    if (error) {
      console.warn('Supabase upsert warning (check if table exists):', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Supabase save error:', err);
    return { success: false, error: err?.message || 'Database connection error' };
  }
}

/**
 * Check if the Supabase database connection and tables are ready
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  productCount: number;
  message: string;
}> {
  try {
    const { data, error, count } = await supabase
      .from('sash_products')
      .select('id', { count: 'exact' });

    if (error) {
      return {
        connected: false,
        tableExists: false,
        productCount: 0,
        message: error.message,
      };
    }

    return {
      connected: true,
      tableExists: true,
      productCount: count ?? (data?.length || 0),
      message: 'Supabase table `sash_products` is live and reachable!',
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      productCount: 0,
      message: err?.message || 'Unable to connect to Supabase.',
    };
  }
}

/**
 * Real-time subscription hook helper for storefront product pages
 */
export function subscribeToProductPricing(
  slug: string,
  onUpdate: (override: AdminProductOverride) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Listen to intra-window custom event
  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail && detail.slug === slug) {
      onUpdate(detail);
    }
  };
  window.addEventListener(PRICING_UPDATED_EVENT, handleCustomEvent);

  // 2. Listen to cross-tab BroadcastChannel
  let bc: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    bc = new BroadcastChannel(PRICING_CHANNEL_NAME);
    bc.onmessage = (event) => {
      if (event.data && event.data.slug === slug) {
        onUpdate(event.data);
      }
    };
  }

  // 3. Listen to window storage event (standard cross-tab fallback)
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed[slug]) {
          onUpdate(parsed[slug]);
        }
      } catch {
        // ignore
      }
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  // 4. Listen to Supabase Realtime Postgres Changes
  const channel = supabase
    .channel(`sash_product_${slug}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sash_products',
        filter: `slug=eq.${slug}`,
      },
      (payload) => {
        if (payload.new) {
          const override = mapRowToOverride(payload.new);
          onUpdate(override);
        }
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    window.removeEventListener(PRICING_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (bc) bc.close();
    supabase.removeChannel(channel);
  };
}
