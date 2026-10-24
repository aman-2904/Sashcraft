'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, User, Send, ChevronDown, ChevronRight, Ribbon, Menu, X, LogOut, Package, Sparkles } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { getUserProfile, UserProfile } from '@/utils/userProfile';
import { getWishlist, WISHLIST_UPDATED_EVENT } from '@/utils/wishlist';
import UserAuthModal from '@/components/Auth/UserAuthModal';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileSashesOpen, setIsMobileSashesOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const isCategory = pathname.startsWith('/sashes') || pathname.startsWith('/categories');

  useEffect(() => {
    // 1. Initial Wishlist count and listener
    setWishlistCount(getWishlist().length);
    const handleWishlistChange = () => {
      setWishlistCount(getWishlist().length);
    };
    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistChange);

    // 2. Auth state monitoring
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const p = await getUserProfile(session.user.id, session.user.email);
        setUserProfile(p);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const p = await getUserProfile(session.user.id, session.user.email);
        setUserProfile(p);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistChange);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sashcraft_user_profile');
    setCurrentUser(null);
    setUserProfile(null);
    setIsUserDropdownOpen(false);
    router.push('/');
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-50">
      <nav className="flex items-center justify-between px-6 lg:px-8 py-3 bg-white/70 backdrop-blur-md border border-black rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 lg:gap-4 shrink-0 hover:opacity-95 transition-opacity">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#dfad2d] to-[#a87e14] rounded-xl flex items-center justify-center text-white shadow-[0_4px_10px_rgba(184,134,11,0.3)]">
            <Ribbon size={24} className="lg:w-7 lg:h-7" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] lg:text-[22px] font-bold text-gray-900 tracking-widest font-serif leading-tight">SASHCRAFT</span>
            <span className="text-[8px] lg:text-[10px] font-bold text-[#b8860b] tracking-wider uppercase mt-0.5 whitespace-nowrap">Custom Apparel & Crafts</span>
          </div>
        </Link>

        {/* Navigation Links (Desktop Only) */}
        <ul className="hidden lg:flex items-center gap-10 m-0 p-0">
          <li className={`group text-[15px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-300 relative py-2 after:content-[''] after:absolute after:h-0.5 after:bottom-0 after:left-0 after:bg-[#b8860b] after:transition-all after:duration-300 ${
            isHome 
              ? 'text-[#b8860b] after:w-full' 
              : 'text-gray-800 hover:text-[#b8860b] after:w-0 group-hover:after:w-full'
          }`}>
            <Link href="/">Home</Link>
          </li>
          <li className={`group text-[15px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-300 relative py-2 after:content-[''] after:absolute after:h-0.5 after:bottom-0 after:left-0 after:bg-[#b8860b] after:transition-all after:duration-300 ${
            isCategory 
              ? 'text-[#b8860b] after:w-full' 
              : 'text-gray-800 hover:text-[#b8860b] after:w-0 group-hover:after:w-full'
          }`}>
            Categories <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
            
            {/* Desktop Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-60 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xl flex flex-col p-2">
                
                {/* Nested Sashes Dropdown */}
                <div className={`group/sash relative rounded-xl transition-colors ${
                  isCategory ? 'bg-[#fdfaf2]' : 'hover:bg-[#fdfaf2]'
                }`}>
                  <Link 
                    href="/sashes/satinsashes"
                    className={`px-4 py-2.5 text-[14px] font-semibold flex items-center justify-between transition-colors w-full ${
                      isCategory ? 'text-[#b8860b]' : 'text-gray-700 hover:text-[#b8860b]'
                    }`}
                  >
                    <span>Sashes</span>
                    <ChevronRight size={14} className={isCategory ? 'text-[#b8860b]' : 'text-gray-400 group-hover/sash:text-[#b8860b]'} />
                  </Link>
                  
                  {/* Continuous hover bridge using pl-2 without margin gap */}
                  <div className="absolute left-full top-0 pl-2 w-64 opacity-0 invisible group-hover/sash:opacity-100 group-hover/sash:visible transition-all duration-200 z-50">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl flex flex-col p-2">
                      <Link 
                        href="/sashes/satinsashes" 
                        className={`px-4 py-2.5 text-[14px] font-semibold transition-colors whitespace-nowrap block w-full rounded-xl ${
                          pathname === '/sashes/satinsashes'
                            ? 'text-[#b8860b] bg-[#fdfaf2] font-bold'
                            : 'text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2]'
                        }`}
                      >
                        Satin Sashes
                      </Link>
                      <Link 
                        href="/sashes/velvetsashes" 
                        className={`px-4 py-2.5 text-[14px] font-semibold transition-colors whitespace-nowrap block w-full rounded-xl ${
                          pathname === '/sashes/velvetsashes'
                            ? 'text-[#b8860b] bg-[#fdfaf2] font-bold'
                            : 'text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2]'
                        }`}
                      >
                        Velvet Sashes
                      </Link>
                      <Link 
                        href="/sashes/doublelayer" 
                        className={`px-4 py-2.5 text-[14px] font-semibold transition-colors whitespace-nowrap block w-full rounded-xl ${
                          pathname === '/sashes/doublelayer'
                            ? 'text-[#b8860b] bg-[#fdfaf2] font-bold'
                            : 'text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2]'
                        }`}
                      >
                        Double Layer Heavy Fabric
                      </Link>
                      <Link 
                        href="/sashes/singlelayer" 
                        className={`px-4 py-2.5 text-[14px] font-semibold transition-colors whitespace-nowrap block w-full rounded-xl ${
                          pathname === '/sashes/singlelayer'
                            ? 'text-[#b8860b] bg-[#fdfaf2] font-bold'
                            : 'text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2]'
                        }`}
                      >
                        Single Layer Heavy Fabric
                      </Link>
                    </div>
                  </div>
                </div>

                <a href="#" className="px-4 py-2.5 text-[14px] font-semibold text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2] rounded-xl transition-colors whitespace-nowrap">Gowns & Caps</a>
                <a href="#" className="px-4 py-2.5 text-[14px] font-semibold text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2] rounded-xl transition-colors whitespace-nowrap">Custom Aprons & Tees</a>
                <a href="#" className="px-4 py-2.5 text-[14px] font-semibold text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2] rounded-xl transition-colors whitespace-nowrap">Jute & Tote Bags</a>
                <a href="#" className="px-4 py-2.5 text-[14px] font-semibold text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2] rounded-xl transition-colors whitespace-nowrap">Flags</a>
              </div>
            </div>
          </li>
          <li className="relative">
            <Link 
              href="/CustomizerStudio"
              className={`text-[15px] font-semibold flex items-center gap-1.5 transition-all duration-300 relative py-1 ${
                pathname === '/CustomizerStudio' || pathname === '/customizerstudio'
                  ? 'text-[#b8860b] font-bold after:content-[\'\'] after:absolute after:w-full after:h-0.5 after:-bottom-1 after:left-0 after:bg-[#b8860b]'
                  : 'text-gray-800 hover:text-[#b8860b] after:content-[\'\'] after:absolute after:w-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-[#b8860b] after:transition-all after:duration-300 hover:after:w-full'
              }`}
            >
              🪄 Customizer Studio
            </Link>
          </li>
          <li className="group text-[15px] font-semibold text-gray-800 hover:text-[#b8860b] cursor-pointer flex items-center gap-1.5 transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-[#b8860b] after:transition-all after:duration-300 group-hover:after:w-full">
            About Us
          </li>
          <li className="group text-[15px] font-semibold text-gray-800 hover:text-[#b8860b] cursor-pointer flex items-center gap-1.5 transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-[#b8860b] after:transition-all after:duration-300 group-hover:after:w-full">
            Contact
          </li>
        </ul>

        {/* Actions (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-5 mr-4">
            <button 
              onClick={() => router.push('/sashes/satinsashes')}
              className="relative flex items-center justify-center text-gray-800 cursor-pointer bg-transparent border-none transition-transform duration-200 hover:-translate-y-0.5 hover:text-[#b8860b]"
              title="Search Catalog"
            >
              <Search size={22} strokeWidth={2} />
            </button>

            {/* Wishlist Link & Counter */}
            <Link 
              href="/account?tab=wishlist"
              className="relative flex items-center justify-center text-gray-800 cursor-pointer bg-transparent border-none transition-transform duration-200 hover:-translate-y-0.5 hover:text-[#b8860b]"
              title="What I Liked (Saved Sashes)"
            >
              <Heart size={22} strokeWidth={2} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#dfad2d] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white font-bold text-xs shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-all"
                  title="My Account"
                >
                  {userProfile?.fullName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <div className="font-bold text-gray-900 text-xs truncate">
                        {userProfile?.fullName || 'SashCraft Customer'}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">{currentUser.email}</div>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2] transition-colors"
                    >
                      <User size={15} /> My Profile & Address
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2] transition-colors"
                    >
                      <Package size={15} /> Order & Enquiry Status
                    </Link>
                    <Link
                      href="/account?tab=wishlist"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#b8860b] hover:bg-[#fdfaf2] transition-colors"
                    >
                      <Heart size={15} /> What I Liked ({wishlistCount})
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="relative flex items-center justify-center text-gray-800 cursor-pointer bg-transparent border-none transition-transform duration-200 hover:-translate-y-0.5 hover:text-[#b8860b]"
                title="Sign In / Register"
              >
                <User size={22} strokeWidth={2} />
              </button>
            )}
          </div>

          <Link
            href="/sashes/satinsashes"
            className="bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white border-none px-6 py-3 rounded-full text-sm font-bold tracking-wide cursor-pointer flex items-center gap-2.5 transition-all duration-300 shadow-[0_4px_15px_rgba(223,173,45,0.4)] hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_6px_20px_rgba(223,173,45,0.6)]"
          >
            <Send size={16} strokeWidth={2.5} /> GET CUSTOM QUOTE
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-800 hover:text-[#b8860b] transition-colors p-2"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full mt-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl lg:hidden flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in duration-200 h-[80vh] overflow-y-auto">
          <ul className="flex flex-col gap-5">
            <li className={`text-[17px] font-bold border-b border-gray-100 pb-3 ${
              isHome ? 'text-[#b8860b]' : 'text-gray-800'
            }`}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            </li>
            <li className="border-b border-gray-100 pb-3">
              <div
                className={`flex justify-between items-center text-[17px] font-bold cursor-pointer ${
                  isCategory ? 'text-[#b8860b]' : 'text-gray-800'
                }`}
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              >
                Categories <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Mobile Categories Accordion */}
              {isMobileCategoriesOpen && (
                <ul className="flex flex-col gap-2 mt-4 pl-4 border-l-2 border-[#b8860b]/20 animate-in slide-in-from-top-2 fade-in duration-200">
                  
                  {/* Nested Sashes Accordion */}
                  <li className="py-1">
                    <div 
                      className={`flex justify-between items-center text-[15px] font-semibold cursor-pointer ${
                        isCategory ? 'text-[#b8860b]' : 'text-gray-700 hover:text-[#b8860b]'
                      }`}
                      onClick={() => setIsMobileSashesOpen(!isMobileSashesOpen)}
                    >
                      Sashes <ChevronDown size={16} className={`transition-transform duration-300 ${isMobileSashesOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isMobileSashesOpen && (
                      <ul className="flex flex-col gap-3 mt-3 pl-4 border-l border-gray-200 animate-in slide-in-from-top-2 fade-in duration-200">
                        <li>
                          <Link 
                            href="/sashes/satinsashes" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-[14px] font-medium flex items-center gap-2 ${
                              pathname === '/sashes/satinsashes' ? 'text-[#b8860b] font-bold' : 'text-gray-500 hover:text-[#b8860b]'
                            }`}
                          >
                            <ChevronRight size={14} className="text-[#b8860b]" /> Satin Sashes
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href="/sashes/velvetsashes" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-[14px] font-medium flex items-center gap-2 ${
                              pathname === '/sashes/velvetsashes' ? 'text-[#b8860b] font-bold' : 'text-gray-500 hover:text-[#b8860b]'
                            }`}
                          >
                            <ChevronRight size={14} className="text-[#b8860b]" /> Velvet Sashes
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href="/sashes/doublelayer" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-[14px] font-medium flex items-center gap-2 ${
                              pathname === '/sashes/doublelayer' ? 'text-[#b8860b] font-bold' : 'text-gray-500 hover:text-[#b8860b]'
                            }`}
                          >
                            <ChevronRight size={14} className="text-[#b8860b]" /> Double Layer Heavy Fabric
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href="/sashes/singlelayer" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-[14px] font-medium flex items-center gap-2 ${
                              pathname === '/sashes/singlelayer' ? 'text-[#b8860b] font-bold' : 'text-gray-500 hover:text-[#b8860b]'
                            }`}
                          >
                            <ChevronRight size={14} className="text-[#b8860b]" /> Single Layer Heavy Fabric
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li><a href="#" className="text-gray-600 hover:text-[#b8860b] text-[15px] font-semibold block py-1 mt-1">Gowns & Caps</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#b8860b] text-[15px] font-semibold block py-1 mt-1">Custom Aprons & Tees</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#b8860b] text-[15px] font-semibold block py-1 mt-1">Jute & Tote Bags</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-[#b8860b] text-[15px] font-semibold block py-1 mt-1">Flags</a></li>
                </ul>
              )}
            </li>
            <li className="border-b border-gray-100 pb-3">
              <Link
                href="/CustomizerStudio"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-[17px] font-bold block transition-colors ${
                  pathname === '/CustomizerStudio' || pathname === '/customizerstudio'
                    ? 'text-[#b8860b]'
                    : 'text-gray-800 hover:text-[#b8860b]'
                }`}
              >
                🪄 Customizer Studio
              </Link>
            </li>
            <li className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-3">About Us</li>
            <li className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-3">Contact</li>
          </ul>

          <div className="flex items-center justify-around py-2 border-b border-gray-100 pb-6">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push('/sashes/satinsashes');
              }}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#b8860b]"
            >
              <Search size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Search</span>
            </button>
            <Link
              href="/account?tab=wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#b8860b] relative"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#dfad2d] text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Wishlist</span>
            </Link>

            {currentUser ? (
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-1 text-[#b8860b]"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {userProfile?.fullName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Profile</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#b8860b]"
              >
                <User size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Sign In</span>
              </button>
            )}
          </div>

          <Link
            href="/sashes/satinsashes"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white py-4 rounded-xl text-[13px] font-bold tracking-widest flex items-center justify-center gap-2 shadow-lg mb-8"
          >
            <Send size={18} strokeWidth={2.5} /> GET CUSTOM QUOTE
          </Link>
        </div>
      )}
      </div>

      {/* Customer Authentication Modal (Rendered outside transformed container) */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={async () => {
          setIsAuthModalOpen(false);
          const p = await getUserProfile();
          setUserProfile(p);
        }}
      />
    </>
  );
}
