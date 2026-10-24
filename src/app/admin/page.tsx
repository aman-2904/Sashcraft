'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import AdminAuthPortal from '@/components/Admin/AdminAuthPortal';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { ShieldCheck, Lock, Sparkles, Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check initial active session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Session check warning:', error.message);
        }
        if (mounted) {
          setUser(session?.user ?? null);
          setIsCheckingAuth(false);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        if (mounted) {
          setUser(null);
          setIsCheckingAuth(false);
        }
      }
    };

    checkSession();

    // Listen to real-time auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setIsCheckingAuth(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setUser(null);
    }
  };

  // State 1: Security Handshake / Loading Clearance
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#07090e] via-[#0d111a] to-[#07090e] text-white">
        <div className="relative flex flex-col items-center max-w-sm text-center">
          {/* Glowing background ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

          {/* Animated Emblem */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1c2233] to-[#0e121d] border border-amber-500/30 flex items-center justify-center shadow-2xl mb-6">
            <ShieldCheck className="w-10 h-10 text-amber-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
              <Lock className="w-3 h-3 text-amber-300" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            SashCraft Security Vault
          </div>

          <h2 className="text-xl font-bold text-gray-100 tracking-tight mb-2">
            Verifying Admin Clearance
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Establishing secure encrypted connection with Supabase authentication service...
          </p>

          <div className="flex items-center gap-2.5 text-xs text-amber-400/80 font-mono bg-black/40 px-4 py-2 rounded-lg border border-white/5">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Validating active session tokens...</span>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Unauthenticated - Strict Gatekeeping with Passkey Auth Portal
  if (!user) {
    return (
      <AdminAuthPortal
        onAuthSuccess={async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user ?? null);
        }}
      />
    );
  }

  // State 3: Authenticated Admin Session - Render Full Management Dashboard
  return <AdminDashboard user={user} onSignOut={handleSignOut} />;
}
