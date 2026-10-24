'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Ribbon,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface AdminAuthPortalProps {
  onAuthSuccess?: () => void;
}

export const REQUIRED_ADMIN_PASSKEY = 'SashCraft@2026';

export default function AdminAuthPortal({ onAuthSuccess }: AdminAuthPortalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [passkey, setPasskey] = useState('');

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      if (data.session || data.user) {
        setSuccessMessage('Authentication verified! Redirecting to command dashboard...');
        if (onAuthSuccess) onAuthSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication service error. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();

    // 1. Strict Passkey Validation
    if (passkey.trim() !== REQUIRED_ADMIN_PASSKEY) {
      setErrorMessage(
        `❌ Access Denied: Invalid Security Passkey! Only authorized personnel with the official SashCraft security key ('${REQUIRED_ADMIN_PASSKEY}') can create an admin account.`
      );
      return;
    }

    // 2. Password Match Validation
    if (password !== confirmPassword) {
      setErrorMessage('❌ Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('❌ Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: 'admin',
            passkey_verified: true,
            verified_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Failed to create admin account.');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        if (data.session) {
          setSuccessMessage('Admin credentials created and authorized! Entering dashboard...');
          if (onAuthSuccess) onAuthSuccess();
        } else {
          setSuccessMessage(
            'Admin account successfully created! If email confirmation is enabled in your Supabase project, check your inbox to confirm, or proceed to Sign In.'
          );
          setMode('signin');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register admin account.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0d14] text-gray-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#dfad2d]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a87e14]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#dfad2d] to-[#a87e14] rounded-2xl flex items-center justify-center text-white shadow-[0_8px_25px_rgba(223,173,45,0.4)] group-hover:scale-105 transition-transform">
              <Ribbon size={28} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="font-serif text-2xl font-bold tracking-widest text-white leading-tight">
                SASHCRAFT
              </div>
              <div className="text-[10px] font-bold text-[#dfad2d] tracking-widest uppercase">
                Executive Administration
              </div>
            </div>
          </Link>

          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Admin Security Portal' : 'Register New Administrator'}
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {mode === 'signin'
              ? 'Authorized personnel only. Supabase cloud authentication required.'
              : 'Passkey verification required. Enter master key to provision credentials.'}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#121622]/90 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-black/40 rounded-2xl border border-gray-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                resetForm();
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-[#b8860b] to-[#dfad2d] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                resetForm();
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-[#b8860b] to-[#dfad2d] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <KeyRound size={13} />
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* ================= SIGN IN FORM ================= */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sashcraft.com"
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dfad2d] focus:ring-1 focus:ring-[#dfad2d] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-black/40 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dfad2d] focus:ring-1 focus:ring-[#dfad2d] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-[#b8860b] via-[#dfad2d] to-[#a87e14] hover:from-[#a07409] hover:to-[#8c670b] text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#dfad2d]/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating Credentials...
                  </span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Secure Admin Sign In
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= SIGN UP WITH PASSKEY FORM ================= */
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Passkey Alert Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                <KeyRound size={16} className="text-[#dfad2d] shrink-0" />
                <span>
                  Admin Passkey required: <strong className="font-mono text-white">SashCraft@2026</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Full Name / Admin Title *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Master Regalia Admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dfad2d] focus:ring-1 focus:ring-[#dfad2d] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@sashcraft.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dfad2d] focus:ring-1 focus:ring-[#dfad2d] transition-all"
                  />
                </div>
              </div>

              {/* Passkey Input Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#dfad2d] uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound size={13} />
                    Master Admin Passkey *
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">Required</span>
                </div>
                <div className="relative">
                  <input
                    type={showPasskey ? 'text' : 'password'}
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter passkey (SashCraft@2026)"
                    className="w-full pl-4 pr-10 py-2.5 bg-black/60 border-2 border-[#dfad2d]/50 focus:border-[#dfad2d] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#dfad2d] font-mono tracking-wider transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasskey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Access key provided by SashCraft executive management: <code className="text-[#dfad2d]">SashCraft@2026</code>
                </p>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Create Password *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-black/40 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dfad2d] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Confirm Password *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-black/40 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#dfad2d] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-gradient-to-r from-[#b8860b] via-[#dfad2d] to-[#a87e14] hover:from-[#a07409] hover:to-[#8c670b] text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#dfad2d]/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Validating Passkey & Creating Account...
                  </span>
                ) : (
                  <>
                    <KeyRound size={18} />
                    Verify Passkey & Create Account
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Info */}
          <div className="mt-6 pt-5 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-[#dfad2d]" />
              Supabase 256-bit Encrypted
            </span>
            <Link
              href="/"
              className="text-gray-400 hover:text-[#dfad2d] transition-colors flex items-center gap-1"
            >
              Back to Storefront <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Passkey Quick Hint for Developer/User */}
        <div className="mt-4 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-gray-800 text-[11px] text-gray-400">
            <Sparkles size={12} className="text-[#dfad2d]" />
            Official Passkey: <code className="text-[#dfad2d] font-bold">{REQUIRED_ADMIN_PASSKEY}</code>
          </span>
        </div>
      </div>
    </div>
  );
}
