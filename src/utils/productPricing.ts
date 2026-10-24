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
  let parsedImages: string[] | undefined = undefined;
  if (Array.isArray(row.images)) {
    parsedImages = row.images;
  } else if (typeof row.images === 'string') {
    try {
      const p = JSON.parse(row.images);
      if (Array.isArray(p)) parsedImages = p;
    } catch {
      if (row.images.startsWith('http') || row.images.startsWith('/') || row.images.startsWith('data:')) {
        parsedImages = [row.images];
      }
    }
  }

  let withLaceImgs: string[] | undefined = undefined;
  if (Array.isArray(row.with_lace_images)) {
    withLaceImgs = row.with_lace_images;
  } else if (typeof row.with_lace_images === 'string') {
    try {
      const p = JSON.parse(row.with_lace_images);
      if (Array.isArray(p)) withLaceImgs = p;
    } catch {}
  }

  let withoutLaceImgs: string[] | undefined = undefined;
  if (Array.isArray(row.without_lace_images)) {
    withoutLaceImgs = row.without_lace_images;
  } else if (typeof row.without_lace_images === 'string') {
    try {
      const p = JSON.parse(row.without_lace_images);
      if (Array.isArray(p)) withoutLaceImgs = p;
    } catch {}
  }

  return {
    id: row.id || row.slug,
    slug: row.slug,
    title: row.title || '',
    inStock: row.in_stock !== undefined ? Boolean(row.in_stock) : true,
    withoutLaceActual: Number(row.without_lace_actual) || 0,
    withoutLaceDiscounted: Number(row.without_lace_discounted) || 0,
    withLaceActual: Number(row.with_lace_actual) || 0,
    withLaceDiscounted: Number(row.with_lace_discounted) || 0,
    images: parsedImages,
    withLaceImages: withLaceImgs,
    withoutLaceImages: withoutLaceImgs,
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

  // Determine dynamic images from database override if present
  const withLaceImages =
    override.withLaceImages !== undefined && Array.isArray(override.withLaceImages)
      ? override.withLaceImages
      : override.images !== undefined && Array.isArray(override.images)
      ? override.images
      : product.variants.withLace.images;

  const withoutLaceImages =
    override.withoutLaceImages !== undefined && Array.isArray(override.withoutLaceImages)
      ? override.withoutLaceImages
      : override.images !== undefined && Array.isArray(override.images)
      ? override.images
      : product.variants.withoutLace.images;

  return {
    ...product,
    title: override.title && override.title.trim().length > 0 ? override.title.trim() : product.title,
    inStock: override.inStock !== undefined ? override.inStock : product.inStock,
    variants: {
      ...product.variants,
      withoutLace: {
        ...product.variants.withoutLace,
        images: withoutLaceImages,
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
        images: withLaceImages,
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
  // 1. Always emit instant local broadcast event and BroadcastChannel first
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(
        new CustomEvent(PRICING_UPDATED_EVENT, { detail: override })
      );
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel(PRICING_CHANNEL_NAME);
        bc.postMessage(override);
        bc.close();
      }
    } catch (e) {
      console.warn('Failed to emit pricing broadcast event:', e);
    }

    // 2. Safely cache into localStorage without breaking if quota is exceeded
    try {
      const local = getLocalStoredOverrides();
      local[override.slug] = {
        ...override,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    } catch (quotaErr) {
      console.warn('LocalStorage quota limit reached, saving metadata fallback:', quotaErr);
      try {
        const local = getLocalStoredOverrides();
        local[override.slug] = {
          ...override,
          images: override.images?.filter((img) => !img.startsWith('data:')),
          withLaceImages: override.withLaceImages?.filter((img) => !img.startsWith('data:')),
          withoutLaceImages: override.withoutLaceImages?.filter((img) => !img.startsWith('data:')),
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
      } catch {}
    }
  }

  // 3. Persist into Supabase sash_products table
  try {
    const updateFields: Record<string, any> = {
      title: override.title,
      in_stock: override.inStock,
      without_lace_actual: override.withoutLaceActual,
      without_lace_discounted: override.withoutLaceDiscounted,
      with_lace_actual: override.withLaceActual,
      with_lace_discounted: override.withLaceDiscounted,
      updated_at: new Date().toISOString(),
    };

    if (override.images !== undefined) {
      updateFields.images = override.images;
    }
    if (override.withLaceImages !== undefined) {
      updateFields.with_lace_images = override.withLaceImages;
    }
    if (override.withoutLaceImages !== undefined) {
      updateFields.without_lace_images = override.withoutLaceImages;
    }

    // First attempt direct update by slug (guarantees seamless update on existing records across all browsers)
    const { data: updatedRows, error: updateError } = await supabase
      .from('sash_products')
      .update(updateFields)
      .eq('slug', override.slug)
      .select('id, slug, title');

    if (!updateError && updatedRows && updatedRows.length > 0) {
      return { success: true };
    }

    // If row didn't exist yet, perform upsert / insert
    const payload = {
      id: override.id || override.slug,
      slug: override.slug,
      ...updateFields,
    };

    const { error: upsertSlugError } = await supabase
      .from('sash_products')
      .upsert(payload, { onConflict: 'slug' });

    if (!upsertSlugError) {
      return { success: true };
    }

    // Fallback upsert on primary key id
    const { error: upsertIdError } = await supabase
      .from('sash_products')
      .upsert(payload, { onConflict: 'id' });

    if (!upsertIdError) {
      return { success: true };
    }

    const errMessage = upsertIdError.message || upsertSlugError.message || updateError?.message;
    console.warn('Supabase save warning (ensure title column exists):', errMessage);
    return { success: false, error: errMessage };
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
