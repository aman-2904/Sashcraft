'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/utils/supabase/client';
import { saveUserProfile } from '@/utils/userProfile';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Ribbon,
  KeyRound
} from 'lucide-react';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export default function UserAuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}: UserAuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [mounted, setMounted] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMessage('Welcome back! Logging you in...');
        setTimeout(() => {
          setIsLoading(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign in.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
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
            phone: phone.trim(),
            address: address.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Upsert to user_profiles
        await saveUserProfile({
          id: data.user.id,
          email: email.trim(),
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
        });

        setSuccessMessage('Account created successfully! Welcome to SashCraft.');
        setTimeout(() => {
          setIsLoading(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/reset-password`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(
          `Password reset link has been sent to ${email}. Please check your inbox and spam folder.`
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#171717] via-[#241e12] to-[#171717] px-6 py-5 text-white flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#dfad2d]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#dfad2d]/20 border border-[#dfad2d]/40 flex items-center justify-center text-[#dfad2d]">
              <Ribbon size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {mode === 'signin' && 'Welcome to SashCraft'}
                {mode === 'signup' && 'Create Customer Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-[11px] text-[#dfad2d] font-medium tracking-wide">
                {mode === 'signin' && 'Sign in to track orders, quotes & saved regalia'}
                {mode === 'signup' && 'Complete your profile for faster delivery & tracking'}
                {mode === 'forgot' && "Enter your email to receive recovery instructions"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors relative z-10 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher (if not in forgot mode) */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1.5 bg-gray-100 border-b border-gray-200 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => {
                resetMessages();
                setMode('signin');
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Customer Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                resetMessages();
                setMode('signup');
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: SIGN IN */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address / Gmail ID *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com / university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      resetMessages();
                      setMode('forgot');
                    }}
                    className="text-xs font-semibold text-[#b8860b] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#b8860b] to-[#dfad2d] hover:from-[#a07409] hover:to-[#c19b38] text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#dfad2d]/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">Don&apos;t have an account yet? </span>
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setMode('signup');
                  }}
                  className="text-xs font-bold text-[#b8860b] hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aryan Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#dfad2d] focus:bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Gmail / Email ID *
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="aryan@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#dfad2d] focus:bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#dfad2d] focus:bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Complete Delivery / Shipping Address *
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  <textarea
                    rows={2}
                    required
                    placeholder="House/Flat No., Street, Landmark, City, State, PIN Code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#dfad2d] focus:bg-white text-gray-900 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#dfad2d] focus:bg-white text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-type password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#dfad2d] focus:bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#b8860b] to-[#dfad2d] hover:from-[#a07409] hover:to-[#c19b38] text-white py-3 px-6 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#dfad2d]/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Create Customer Account
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-gray-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setMode('signin');
                  }}
                  className="text-xs font-bold text-[#b8860b] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                Enter your registered email address or Gmail ID. We will send you a secure link to reset your password.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Email Address *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#b8860b] to-[#dfad2d] hover:from-[#a07409] hover:to-[#c19b38] text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#dfad2d]/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending Link...
                  </>
                ) : (
                  <>
                    <KeyRound size={16} /> Send Reset Link
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setMode('signin');
                  }}
                  className="text-xs font-bold text-gray-600 hover:text-gray-900 hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
