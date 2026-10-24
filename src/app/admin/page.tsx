'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import AdminAuthPortal from '@/components/Admin/AdminAuthPortal';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { verifyAdminRole, grantAdminRole, REQUIRED_ADMIN_PASSKEY } from '@/utils/adminAuth';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Sparkles,
  Loader2,
  KeyRound,
  ArrowRight,
  LogOut,
  Store,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Elevation passkey state for customer-to-admin elevation
  const [elevationPasskey, setElevationPasskey] = useState('');
  const [isElevating, setIsElevating] = useState(false);
  const [elevationError, setElevationError] = useState<string | null>(null);
  const [elevationSuccess, setElevationSuccess] = useState<string | null>(null);

  const checkUserAdminStatus = async (currentUser: User | null) => {
    if (!currentUser) {
      setUser(null);
      setIsAdmin(false);
      setIsCheckingAuth(false);
      return;
    }

    setUser(currentUser);
    const hasAdminClearance = await verifyAdminRole(currentUser);
    setIsAdmin(hasAdminClearance);
    setIsCheckingAuth(false);
  };

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
          await checkUserAdminStatus(session?.user ?? null);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setIsCheckingAuth(false);
        }
      }
    };

    checkSession();

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        await checkUserAdminStatus(session?.user ?? null);
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
      setIsAdmin(false);
    } catch (err) {
      console.error('Error signing out:', err);
      setUser(null);
      setIsAdmin(false);
    }
  };

  // Handler to elevate logged-in customer account using the official admin passkey
  const handleElevateWithPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setElevationError(null);
    setElevationSuccess(null);
    setIsElevating(true);

    const result = await grantAdminRole(user, elevationPasskey);
    if (result.success) {
      setElevationSuccess('Security passkey verified! Admin privileges activated.');
      setTimeout(async () => {
        setIsAdmin(true);
        setIsElevating(false);
      }, 1000);
    } else {
      setElevationError(result.error || `Invalid passkey. Master key is required.`);
      setIsElevating(false);
    }
  };

  // =========================================================================
  // State 1: Security Handshake / Loading Clearance
  // =========================================================================
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#07090e] via-[#0d111a] to-[#07090e] text-white">
        <div className="relative flex flex-col items-center max-w-sm text-center">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

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
            Validating administrator role and security clearance level...
          </p>

          <div className="flex items-center gap-2.5 text-xs text-amber-400/80 font-mono bg-black/40 px-4 py-2 rounded-lg border border-white/5">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Checking role permissions in database...</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // State 2: Unauthenticated - Strict Gatekeeping with Passkey Auth Portal
  // =========================================================================
  if (!user) {
    return (
      <AdminAuthPortal
        onAuthSuccess={async () => {
          const { data: { session } } = await supabase.auth.getSession();
          await checkUserAdminStatus(session?.user ?? null);
        }}
      />
    );
  }

  // =========================================================================
  // State 3: Customer Logged In But Has No 'admin' Role -> Access Denied
  // =========================================================================
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#090b11] via-[#120d11] to-[#090b11] text-gray-100 relative overflow-hidden">
        {/* Ambient Red/Amber Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-lg z-10 bg-[#111420]/90 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40 text-center space-y-6">
          {/* Emblem */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-950 to-rose-900 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-900/30">
            <ShieldAlert size={40} />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              <AlertTriangle size={13} /> Restricted Access • Role: Customer
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Administrator Clearance Required
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
              You are currently signed in as <strong className="text-white font-mono">{user.email}</strong>, which does not have the <span className="text-rose-400 font-bold">&apos;admin&apos;</span> role.
            </p>
          </div>

          <div className="bg-black/50 border border-gray-800 rounded-2xl p-4 text-left text-xs text-gray-300 space-y-2">
            <div className="font-semibold text-rose-300 flex items-center gap-1.5">
              <Lock size={14} /> Security Protocol Notice
            </div>
            <p className="text-[11px] text-gray-400 leading-normal">
              Only authorized staff with verified administrative credentials can access the SashCraft Command Center to view live order enquiries, customer delivery addresses, and alter catalog pricing.
            </p>
          </div>

          {/* Form to elevate account with admin passkey */}
          <div className="bg-[#181d2c]/80 border border-amber-500/30 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound size={14} /> Are you a Store Administrator?
              </span>
              <span className="text-[10px] text-gray-500">Master Passkey</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Enter the official master passkey to verify and elevate this account (<strong className="text-white">{user.email}</strong>) to the <span className="text-amber-400 font-bold">&apos;admin&apos;</span> role:
            </p>

            {elevationError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0 text-rose-400" />
                <span>{elevationError}</span>
              </div>
            )}

            {elevationSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                <span>{elevationSuccess}</span>
              </div>
            )}

            <form onSubmit={handleElevateWithPasskey} className="space-y-3 pt-1">
              <input
                type="password"
                required
                placeholder="Enter Admin Passkey"
                value={elevationPasskey}
                onChange={(e) => setElevationPasskey(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#dfad2d] focus:ring-1 focus:ring-[#dfad2d] font-mono"
              />
              <button
                type="submit"
                disabled={isElevating}
                className="w-full bg-gradient-to-r from-[#b8860b] to-[#dfad2d] hover:from-[#a07409] hover:to-[#8c670b] text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {isElevating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Verifying Passkey...
                  </>
                ) : (
                  <>
                    Verify Passkey & Grant Admin Access <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10 cursor-pointer"
            >
              <LogOut size={14} /> Sign Out / Switch Account
            </button>
            <Link
              href="/"
              className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <Store size={14} /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // State 4: Authenticated Administrator - Full Dashboard Access
  // =========================================================================
  return <AdminDashboard user={user} onSignOut={handleSignOut} />;
}
