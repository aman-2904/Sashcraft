'use client';

import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Send, ChevronDown, Ribbon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-50">
      <nav className="flex items-center justify-between px-6 lg:px-8 py-3 bg-white/70 backdrop-blur-md border border-black rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        {/* Logo Section */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#dfad2d] to-[#a87e14] rounded-xl flex items-center justify-center text-white shadow-[0_4px_10px_rgba(184,134,11,0.3)]">
            <Ribbon size={24} className="lg:w-7 lg:h-7" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] lg:text-[22px] font-bold text-gray-900 tracking-widest font-serif leading-tight">SASHCRAFT</span>
            <span className="text-[8px] lg:text-[10px] font-bold text-[#b8860b] tracking-wider uppercase mt-0.5 whitespace-nowrap">Custom Apparel & Crafts</span>
          </div>
        </div>

        {/* Navigation Links (Desktop Only) */}
        <ul className="hidden lg:flex items-center gap-10 m-0 p-0">
          <li className="group text-[15px] font-semibold text-[#b8860b] cursor-pointer flex items-center gap-1.5 transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:-bottom-1 after:left-0 after:bg-[#b8860b] after:transition-all after:duration-300">
            Home
          </li>
          <li className="group text-[15px] font-semibold text-gray-800 hover:text-[#b8860b] cursor-pointer flex items-center gap-1.5 transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-[#b8860b] after:transition-all after:duration-300 group-hover:after:w-full">
            Categories <ChevronDown size={16} />
          </li>
          <li className="group text-[15px] font-semibold text-gray-800 hover:text-[#b8860b] cursor-pointer flex items-center gap-1.5 transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-[#b8860b] after:transition-all after:duration-300 group-hover:after:w-full">
            🪄 Customizer Studio
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
            <button className="relative flex items-center justify-center text-gray-800 cursor-pointer bg-transparent border-none transition-transform duration-200 hover:-translate-y-0.5 hover:text-[#b8860b]">
              <Search size={22} strokeWidth={2} />
            </button>
            <button className="relative flex items-center justify-center text-gray-800 cursor-pointer bg-transparent border-none transition-transform duration-200 hover:-translate-y-0.5 hover:text-[#b8860b]">
              <Heart size={22} strokeWidth={2} />
              <span className="absolute -top-1.5 -right-2 bg-[#dfad2d] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">2</span>
            </button>
            <button className="relative flex items-center justify-center text-gray-800 cursor-pointer bg-transparent border-none transition-transform duration-200 hover:-translate-y-0.5 hover:text-[#b8860b]">
              <ShoppingBag size={22} strokeWidth={2} />
              <span className="absolute -top-1.5 -right-2 bg-[#dfad2d] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">0</span>
            </button>
          </div>
          <button className="bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white border-none px-6 py-3 rounded-full text-sm font-bold tracking-wide cursor-pointer flex items-center gap-2.5 transition-all duration-300 shadow-[0_4px_15px_rgba(223,173,45,0.4)] hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_6px_20px_rgba(223,173,45,0.6)]">
            <Send size={16} strokeWidth={2.5} /> GET CUSTOM QUOTE
          </button>
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
        <div className="absolute top-full left-0 w-full mt-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl lg:hidden flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <ul className="flex flex-col gap-5">
            <li className="text-[17px] font-bold text-[#b8860b] border-b border-gray-100 pb-3">Home</li>
            <li className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-3 flex justify-between">Categories <ChevronDown size={20} /></li>
            <li className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-3">🪄 Customizer Studio</li>
            <li className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-3">About Us</li>
            <li className="text-[17px] font-bold text-gray-800 border-b border-gray-100 pb-3">Contact</li>
          </ul>

          <div className="flex items-center justify-around py-2 border-b border-gray-100 pb-6">
            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#b8860b]">
              <Search size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Search</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#b8860b] relative">
              <Heart size={24} />
              <span className="absolute -top-1 -right-2 bg-[#dfad2d] text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center">2</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Wishlist</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#b8860b] relative">
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-2 bg-[#dfad2d] text-white text-[10px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center">0</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Cart</span>
            </button>
          </div>

          <button className="w-full bg-gradient-to-br from-[#dfad2d] to-[#a87e14] text-white py-4 rounded-xl text-[13px] font-bold tracking-widest flex items-center justify-center gap-2 shadow-lg">
            <Send size={18} strokeWidth={2.5} /> GET CUSTOM QUOTE
          </button>
        </div>
      )}
    </div>
  );
}
