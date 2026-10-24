import { User } from '@supabase/supabase-js';
import { supabase } from './supabase/client';

export const REQUIRED_ADMIN_PASSKEY = 'SashCraft@2026';

/**
 * Strictly verifies whether a Supabase user possesses the 'admin' or 'superadmin' role.
 * Checks both Auth user_metadata and database tables (admin_users & user_profiles).
 */
export async function verifyAdminRole(user: User | null): Promise<boolean> {
  if (!user) return false;

  // 1. Direct metadata check
  const metaRole = user.user_metadata?.role;
  if (metaRole === 'admin' || metaRole === 'superadmin') {
    return true;
  }

  // 2. Query public.admin_users table if it exists
  try {
    const { data: byId } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (byId && (byId.role === 'admin' || byId.role === 'superadmin')) {
      return true;
    }

    if (user.email) {
      const { data: byEmail } = await supabase
        .from('admin_users')
        .select('role')
        .ilike('email', user.email.trim())
        .maybeSingle();

      if (byEmail && (byEmail.role === 'admin' || byEmail.role === 'superadmin')) {
        return true;
      }
    }
  } catch {
    // admin_users table might not be initialized yet
  }

  // 3. Query public.user_profiles table role column
  try {
    const { data: prof, error: profError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profError && prof && (prof.role === 'admin' || prof.role === 'superadmin')) {
      return true;
    }
  } catch {
    // user_profiles table might not have role column yet
  }

  return false;
}

/**
 * Elevates an authenticated user to 'admin' role if they provide the valid security passkey.
 */
export async function grantAdminRole(
  user: User,
  passkey: string
): Promise<{ success: boolean; error?: string }> {
  if (passkey.trim() !== REQUIRED_ADMIN_PASSKEY) {
    return {
      success: false,
      error: `Invalid security passkey. Expected the official SashCraft master passkey.`,
    };
  }

  try {
    // 1. Update Supabase Auth user metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        role: 'admin',
        passkey_verified: true,
        verified_at: new Date().toISOString(),
      },
    });

    if (metaError) {
      console.warn('Metadata update notice:', metaError.message);
    }

    // 2. Insert/Upsert into admin_users table
    try {
      await supabase.from('admin_users').upsert({
        id: user.id,
        email: user.email || '',
        role: 'admin',
        created_at: new Date().toISOString(),
      });
    } catch {}

    // 3. Upsert into user_profiles table with role: 'admin'
    try {
      await supabase.from('user_profiles').upsert({
        id: user.id,
        email: user.email || '',
        role: 'admin',
        updated_at: new Date().toISOString(),
      });
    } catch {}

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Could not grant admin role.',
    };
  }
}
