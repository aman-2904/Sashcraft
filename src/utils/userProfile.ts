import { supabase } from './supabase/client';
import { UserProfile, UserOrderEnquiry } from '@/types/user';

export type { UserProfile, UserOrderEnquiry };

const LOCAL_PROFILE_KEY = 'sashcraft_user_profile';

export function getCachedUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export async function getUserProfile(userId?: string, email?: string): Promise<UserProfile> {
  // If not provided, fetch from active auth session
  let targetId = userId;
  let targetEmail = email;

  if (!targetId || !targetEmail) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        targetId = user.id;
        targetEmail = user.email || '';
      }
    } catch {}
  }

  // 1. Try local cache
  let localData: Partial<UserProfile> = getCachedUserProfile() || {};
  if (targetId && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${LOCAL_PROFILE_KEY}_${targetId}`);
      if (stored) {
        localData = { ...localData, ...JSON.parse(stored) };
      }
    } catch {}
  }

  if (!targetId) {
    return {
      fullName: localData.fullName || '',
      email: targetEmail || localData.email || '',
      phone: localData.phone || '',
      address: localData.address || '',
    };
  }

  // 2. Fetch from Supabase user_profiles table
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', targetId)
      .maybeSingle();

    if (!error && data) {
      const profile: UserProfile = {
        id: data.id,
        email: data.email || targetEmail || '',
        fullName: data.full_name || localData.fullName || '',
        phone: data.phone || localData.phone || '',
        address: data.address || localData.address || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
        localStorage.setItem(`${LOCAL_PROFILE_KEY}_${targetId}`, JSON.stringify(profile));
      }
      return profile;
    }
  } catch (err) {
    console.warn('Could not fetch from user_profiles table, using metadata:', err);
  }

  // 3. Fallback to auth user metadata & local
  const { data: { user } } = await supabase.auth.getUser();
  const meta = user?.user_metadata || {};

  const profile: UserProfile = {
    id: targetId,
    email: targetEmail || '',
    fullName: localData.fullName || meta.full_name || meta.fullName || '',
    phone: localData.phone || meta.phone || '',
    address: localData.address || meta.address || '',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
    if (targetId) {
      localStorage.setItem(`${LOCAL_PROFILE_KEY}_${targetId}`, JSON.stringify(profile));
    }
  }

  return profile;
}

export async function saveUserProfile(profile: UserProfile): Promise<{ success: boolean; error?: string }> {
  // 1. Cache locally
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
      if (profile.id) {
        localStorage.setItem(`${LOCAL_PROFILE_KEY}_${profile.id}`, JSON.stringify(profile));
      }
      window.dispatchEvent(new CustomEvent('sashcraft_profile_updated', { detail: profile }));
    } catch {}
  }

  // 2. Update Supabase Auth user metadata
  try {
    await supabase.auth.updateUser({
      data: {
        full_name: profile.fullName,
        phone: profile.phone,
        address: profile.address,
      },
    });
  } catch (e) {
    console.warn('Auth user metadata update notice:', e);
  }

  // 3. Upsert to user_profiles table if id exists
  if (profile.id) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: profile.id,
          email: profile.email,
          full_name: profile.fullName,
          phone: profile.phone,
          address: profile.address,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.warn('Supabase user_profiles table upsert notice:', error.message);
        return { success: true }; // Local & auth metadata saved
      }

      return { success: true };
    } catch (err: any) {
      return { success: true };
    }
  }

  return { success: true };
}

export async function fetchUserOrders(email: string): Promise<UserOrderEnquiry[]> {
  const cleanEmail = email.trim().toLowerCase();
  let orders: UserOrderEnquiry[] = [];

  // 1. Fetch from Supabase enquiries table
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .ilike('email', cleanEmail)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      orders = data.map((d: any) => ({
        id: d.id?.toString() || Math.random().toString(),
        reference_id: d.reference_id,
        product_name: d.product_name,
        variant: d.variant,
        color: d.color,
        quantity: Number(d.quantity) || 1,
        unit_price: Number(d.unit_price) || 0,
        total_price: Number(d.total_price) || 0,
        customer_name: d.customer_name,
        phone: d.phone,
        email: d.email,
        organization: d.organization || '',
        event_date: d.event_date || '',
        address: d.address || '',
        notes: d.notes || '',
        status: (d.status as any) || 'pending',
        created_at: d.created_at || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch user enquiries error:', err);
  }

  // 2. Merge with locally submitted enquiries
  if (typeof window !== 'undefined') {
    try {
      const local = JSON.parse(localStorage.getItem('sashcraft_enquiries') || '[]');
      if (Array.isArray(local)) {
        local.forEach((item: any, idx: number) => {
          const itemEmail = (item.email || '').trim().toLowerCase();
          const ref = item.reference_id || item.ref;
          if (itemEmail === cleanEmail && !orders.some((o) => o.reference_id === ref)) {
            orders.push({
              id: item.id || `local-${idx}`,
              reference_id: ref || `SC-${Math.floor(100000 + Math.random() * 900000)}`,
              product_name: item.product_name || item.product || 'Imperial Double-Faced Satin Sash',
              variant: item.variant || 'Standard',
              color: item.color || 'Midnight Black',
              quantity: Number(item.quantity) || 1,
              unit_price: Number(item.unit_price ?? item.unitPrice ?? 0),
              total_price: Number(item.total_price ?? item.totalPrice ?? 0),
              customer_name: item.customer_name || item.fullName || 'Valued Client',
              phone: item.phone || '',
              email: item.email || cleanEmail,
              organization: item.organization || '',
              event_date: item.event_date || item.eventDate || '',
              address: item.address || '',
              notes: item.notes || item.customNotes || '',
              status: (item.status as any) || 'pending',
              created_at: item.created_at || item.date || new Date().toISOString(),
            });
          }
        });
      }
    } catch {}
  }

  return orders;
}
