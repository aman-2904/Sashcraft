'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  User,
  Package,
  Heart,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Lock,
  KeyRound,
  ExternalLink,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Trash2,
  Building,
  Calendar
} from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import {
  getUserProfile,
  saveUserProfile,
  fetchUserOrders,
  UserProfile,
  UserOrderEnquiry
} from '@/utils/userProfile';
import { getWishlist, toggleWishlist, WISHLIST_UPDATED_EVENT } from '@/utils/wishlist';
import { sashesCatalog, SashProductConfig } from '@/data/sashesData';
import UserAuthModal from '@/components/Auth/UserAuthModal';
import { getWhatsAppSupportUrl, WHATSAPP_DISPLAY_NUMBER } from '@/utils/contact';
import { extractHexFromColor } from '@/utils/colorPalette';

function AccountDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tab State: 'profile' | 'orders' | 'wishlist'
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>(
    tabParam === 'orders' ? 'orders' : tabParam === 'wishlist' ? 'wishlist' : 'profile'
  );

  // Sync tab with URL
  useEffect(() => {
    if (tabParam === 'orders' || tabParam === 'wishlist' || tabParam === 'profile') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Auth & Profile State
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<UserOrderEnquiry[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Wishlist State
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);

  // 1. Check user session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoadingAuth(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSessionUser(session.user);
        const profile = await getUserProfile(session.user.id, session.user.email);
        setProfileForm({
          fullName: profile.fullName || session.user.user_metadata?.full_name || '',
          email: session.user.email || '',
          phone: profile.phone || session.user.user_metadata?.phone || '',
          address: profile.address || session.user.user_metadata?.address || '',
        });
        loadOrders(session.user.email || '');
      } else {
        setSessionUser(null);
      }
      setIsLoadingAuth(false);
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSessionUser(session.user);
        const profile = await getUserProfile(session.user.id, session.user.email);
        setProfileForm({
          fullName: profile.fullName || session.user.user_metadata?.full_name || '',
          email: session.user.email || '',
          phone: profile.phone || session.user.user_metadata?.phone || '',
          address: profile.address || session.user.user_metadata?.address || '',
        });
        loadOrders(session.user.email || '');
      } else {
        setSessionUser(null);
      }
    });

    // Load initial wishlist
    setWishlistSlugs(getWishlist());
    const handleWishlistChange = () => {
      setWishlistSlugs(getWishlist());
    };
    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistChange);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistChange);
    };
  }, []);

  const loadOrders = async (email: string) => {
    setIsLoadingOrders(true);
    const userOrders = await fetchUserOrders(email);
    setOrders(userOrders);
    setIsLoadingOrders(false);
  };

  // Profile Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;
    setIsSavingProfile(true);
    setProfileMessage(null);

    const result = await saveUserProfile({
      ...profileForm,
      id: sessionUser.id,
      email: sessionUser.email,
    });
    if (result.success) {
      setProfileMessage({ type: 'success', text: 'Profile & delivery address updated successfully!' });
    } else {
      setProfileMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
    }
    setIsSavingProfile(false);
    setTimeout(() => setProfileMessage(null), 4000);
  };

  // Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordMessage({ type: 'error', text: error.message });
      } else {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'An unexpected error occurred while updating password.' });
    } finally {
      setIsUpdatingPassword(false);
      setTimeout(() => setPasswordMessage(null), 4000);
    }
  };

  // Forgot Password / Password Reset Link Trigger
  const handleSendResetEmail = async () => {
    if (!sessionUser?.email) return;
    setIsSendingResetEmail(true);
    setPasswordMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(sessionUser.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setPasswordMessage({ type: 'error', text: error.message });
      } else {
        setPasswordMessage({
          type: 'success',
          text: `A password reset link has been dispatched to ${sessionUser.email}. Please check your inbox.`,
        });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Failed to send password reset email.' });
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sashcraft_user_profile');
    setSessionUser(null);
    router.push('/');
  };

  // Remove from Wishlist
  const handleRemoveWishlist = (slug: string) => {
    toggleWishlist(slug);
    setWishlistSlugs(getWishlist());
  };

  // Order status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed & Delivered',
          color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
          step: 5,
        };
      case 'approved':
        return {
          label: 'Approved & In Production',
          color: 'bg-indigo-500/10 text-indigo-700 border-indigo-300',
          step: 4,
        };
      case 'quoted':
        return {
          label: 'Quote Shared',
          color: 'bg-blue-500/10 text-blue-700 border-blue-300',
          step: 3,
        };
      case 'contacted':
        return {
          label: 'Concierge Reviewing',
          color: 'bg-amber-500/10 text-amber-700 border-amber-300',
          step: 2,
        };
      default:
        return {
          label: 'Enquiry Received',
          color: 'bg-gray-500/10 text-gray-700 border-gray-300',
          step: 1,
        };
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#faf8f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#dfad2d] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Loading your SashCraft account...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show luxury guest gateway
  if (!sessionUser) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#faf8f5] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#dfad2d]/20 to-[#a87e14]/20 border border-[#dfad2d]/40 flex items-center justify-center text-[#a87e14] mx-auto shadow-sm">
            <User size={38} strokeWidth={2} />
          </div>

          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              Customer Account & Orders
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
              Sign in to track your custom sash enquiries, check quotes, view what you liked, and manage your delivery addresses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Package size={20} className="text-[#dfad2d] mb-1.5" />
              <div className="text-xs font-bold text-gray-900">Live Order Tracking</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Real-time status updates from production to dispatch.</div>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <Heart size={20} className="text-rose-500 mb-1.5" />
              <div className="text-xs font-bold text-gray-900">What You Liked</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Saved designs and favorite ceremonial sashes.</div>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <MapPin size={20} className="text-[#dfad2d] mb-1.5" />
              <div className="text-xs font-bold text-gray-900">Saved Address</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Quick 1-click quotes with saved shipping info.</div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <User size={16} /> Sign In or Create Account
            </button>
            <Link
              href="/"
              className="px-6 py-3.5 rounded-full font-semibold text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <UserAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#faf8f5] text-gray-900 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#241f17] to-[#141414] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-900/30 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#dfad2d]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#dfad2d] to-[#a87e14] flex items-center justify-center text-white text-2xl font-bold font-serif shadow-lg border-2 border-white/20">
                {profileForm.fullName?.[0]?.toUpperCase() || sessionUser.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
                    {profileForm.fullName || 'Valued SashCraft Member'}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#dfad2d]/20 text-[#dfad2d] border border-[#dfad2d]/30">
                    Verified Customer
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail size={13} className="text-[#dfad2d]" /> {sessionUser.email}
                  </span>
                  {profileForm.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={13} className="text-[#dfad2d]" /> {profileForm.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                onClick={handleSignOut}
                className="bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-white/10"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-t border-white/10 pt-4 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('profile');
                router.replace('/account?tab=profile');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#dfad2d] to-[#a87e14] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User size={15} /> My Profile & Address
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                router.replace('/account?tab=orders');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#dfad2d] to-[#a87e14] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package size={15} /> Order & Enquiry Status
              {orders.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('wishlist');
                router.replace('/account?tab=wishlist');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-gradient-to-r from-[#dfad2d] to-[#a87e14] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart size={15} /> What I Liked
              {wishlistSlugs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px]">
                  {wishlistSlugs.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PROFILE & DELIVERY ADDRESS                              */}
        {/* ============================================================== */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Profile Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User size={20} className="text-[#dfad2d]" /> Personal Profile & Delivery Address
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Keep your details updated for swift order quote calculations and accurate parcel shipping.
                </p>
              </div>

              {profileMessage && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    profileMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {profileMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {profileMessage.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Aryan Sharma"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Gmail / Registered Email Address</span>
                    <span className="text-[11px] font-normal text-gray-400">Used for official invoices & order tracking</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      disabled
                      value={sessionUser.email}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#dfad2d]" /> Complete Delivery / Shipping Address *
                    </span>
                    <span className="text-[11px] font-normal text-gray-400">Courier doorstep delivery</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Flat / Office Number, Building Name, Street, Landmark, City, State, and Pincode (e.g. 104 Grand Avenue, Civil Lines, New Delhi - 110054)"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save size={15} />
                    {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Col: Security & Password Management */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 space-y-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                    <KeyRound size={18} className="text-[#dfad2d]" /> Change Password
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Set a new password for your SashCraft customer account.
                  </p>
                </div>

                {passwordMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      passwordMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {passwordMessage.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        required
                        placeholder="Re-type new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>

                <div className="border-t border-gray-100 pt-4">
                  <div className="text-xs text-gray-500 mb-2">Forgot or lost your password?</div>
                  <button
                    type="button"
                    onClick={handleSendResetEmail}
                    disabled={isSendingResetEmail}
                    className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Mail size={14} />
                    {isSendingResetEmail ? 'Sending Link...' : 'Email Me Password Reset Link'}
                  </button>
                </div>
              </div>

              {/* Concierge Support Box */}
              <div className="bg-[#fdfaf2] border border-[#dfad2d]/30 rounded-3xl p-6 text-xs text-gray-700 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Sparkles size={16} className="text-[#dfad2d]" /> Dedicated Concierge
                </div>
                <p className="leading-relaxed">
                  Need custom urgent sample delivery or specialized metallic gold zari embroidery? Our master artisans are available on WhatsApp 7 days a week.
                </p>
                <a
                  href={getWhatsAppSupportUrl('Hello SashCraft, I would like assistance with my account and orders.')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-[#b8860b] hover:text-[#916b09]"
                >
                  <MessageCircle size={15} /> Chat on WhatsApp ({WHATSAPP_DISPLAY_NUMBER}) <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ORDER & ENQUIRY STATUS                                  */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package size={22} className="text-[#dfad2d]" /> Order & Enquiry Tracking
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Track progress, digital mockups, and dispatched shipments for quotes submitted under{' '}
                  <strong className="text-gray-900">{sessionUser.email}</strong>.
                </p>
              </div>

              <button
                onClick={() => loadOrders(sessionUser.email)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Refresh Orders
              </button>
            </div>

            {isLoadingOrders ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-[#dfad2d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-500">Checking active order status in database...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#dfad2d] flex items-center justify-center mx-auto border border-amber-100">
                  <Package size={32} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">No Orders or Enquiries Found Yet</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                    When you request a quote or order ceremonial sashes using your registered email, live tracking will appear right here.
                  </p>
                </div>
                <Link
                  href="/sashes/satinsashes"
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                >
                  Explore Sash Catalog <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5 hover:border-[#dfad2d]/40 transition-all"
                    >
                      {/* Top Bar: Ref + Date + Status */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-[#a87e14]">
                              #{ord.reference_id}
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            Placed on {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>

                        <a
                          href={getWhatsAppSupportUrl(
                            `Hello SashCraft, I am checking the status of my order #${ord.reference_id} for ${ord.quantity}x ${ord.product_name}.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle size={14} /> WhatsApp Support
                        </a>
                      </div>

                      {/* Visual Stepper */}
                      <div className="py-2">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Production & Dispatch Timeline
                        </div>
                        <div className="grid grid-cols-5 gap-1 relative">
                          {[
                            { name: 'Submitted', num: 1 },
                            { name: 'Reviewing', num: 2 },
                            { name: 'Quoted', num: 3 },
                            { name: 'Approved', num: 4 },
                            { name: 'Delivered', num: 5 },
                          ].map((step) => {
                            const isDone = badge.step >= step.num;
                            const isCurrent = badge.step === step.num;
                            return (
                              <div key={step.num} className="flex flex-col items-center text-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1 ${
                                    isDone
                                      ? 'bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white shadow-sm'
                                      : 'bg-gray-100 text-gray-400'
                                  } ${isCurrent ? 'ring-4 ring-[#dfad2d]/20 scale-110' : ''}`}
                                >
                                  {isDone ? <CheckCircle2 size={14} /> : step.num}
                                </div>
                                <span
                                  className={`text-[10px] font-semibold ${
                                    isCurrent ? 'text-[#a87e14] font-bold' : isDone ? 'text-gray-800' : 'text-gray-400'
                                  }`}
                                >
                                  {step.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/80 rounded-2xl text-xs">
                        <div>
                          <span className="text-gray-400 block mb-0.5">Sash Product</span>
                          <strong className="text-gray-900 block">{ord.product_name}</strong>
                          <div className="text-gray-600 text-[11px] flex items-center gap-1.5 mt-0.5">
                            <span>{ord.variant}</span>
                            <span>•</span>
                            {extractHexFromColor(ord.color) && (
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-gray-400 shrink-0 shadow-xs inline-block"
                                style={{ backgroundColor: extractHexFromColor(ord.color)! }}
                                title={`HEX: ${extractHexFromColor(ord.color)}`}
                              />
                            )}
                            <span className="font-medium text-gray-800">{ord.color}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-400 block mb-0.5">Quantity & Estimated Cost</span>
                          <strong className="text-gray-900 block">{ord.quantity} units</strong>
                          <span className="text-[#a87e14] font-serif font-bold text-sm">
                            ₹{ord.total_price.toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-400 block mb-0.5">Organization / Event</span>
                          <strong className="text-gray-900 block">{ord.organization || 'Individual Order'}</strong>
                          {ord.event_date && (
                            <span className="text-gray-600 text-[11px] flex items-center gap-1 mt-0.5">
                              <Calendar size={11} className="text-[#dfad2d]" /> Due: {ord.event_date}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-gray-400 block mb-0.5">Delivery Address</span>
                          {ord.address ? (
                            <span className="text-gray-800 text-[11px] leading-snug flex items-start gap-1">
                              <MapPin size={12} className="text-[#dfad2d] shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{ord.address}</span>
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px] italic">Not provided</span>
                          )}
                        </div>
                      </div>

                      {ord.notes && (
                        <div className="text-xs bg-amber-50/60 border border-amber-200/50 rounded-xl p-3 text-amber-900">
                          <strong className="font-bold text-gray-900 block mb-0.5">Embroidery & Customization Notes:</strong>
                          <p className="text-gray-700 font-mono text-[11px]">{ord.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: WHAT I LIKED (WISHLIST)                                 */}
        {/* ============================================================== */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart size={22} className="text-rose-500 fill-rose-500" /> What You Liked ({wishlistSlugs.length})
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Your curated collection of premium satin, velvet, and heavy fabric ceremonial sashes.
                </p>
              </div>

              {wishlistSlugs.length > 0 && (
                <Link
                  href="/sashes/satinsashes"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Browse More Sashes
                </Link>
              )}
            </div>

            {wishlistSlugs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
                  <Heart size={32} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">Your Wishlist is Currently Empty</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                    Click the heart icon on any ceremonial sash to save it for quick review and custom quote generation.
                  </p>
                </div>
                <Link
                  href="/sashes/satinsashes"
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                >
                  Explore Sash Collections <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistSlugs.map((slug) => {
                  const product: SashProductConfig | undefined = sashesCatalog[slug];
                  if (!product) return null;

                  const previewImage =
                    product.variants.withLace?.images[0] ||
                    product.variants.withoutLace?.images[0] ||
                    '/media_1792315186668.jpg';

                  const price = product.variants.withoutLace?.discountedPrice || 450;

                  return (
                    <div
                      key={slug}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                        <Image
                          src={previewImage}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveWishlist(slug)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-md transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          {product.category}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="font-serif font-bold text-gray-900 text-base group-hover:text-[#b8860b] transition-colors leading-snug">
                            {product.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {product.tagline}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Starts at</span>
                            <span className="font-serif font-bold text-gray-900 text-base text-[#a87e14]">
                              ₹{price} / pc
                            </span>
                          </div>

                          <Link
                            href={`/sashes/${slug}`}
                            className="bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                          >
                            Customize & Quote <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#faf8f5]">
          <div className="w-10 h-10 border-4 border-[#dfad2d] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AccountDashboardContent />
    </Suspense>
  );
}
