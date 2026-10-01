import React from 'react';
import { Search, Heart, ShoppingBag, Send, ChevronDown, Ribbon } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-50">
      <nav className="flex items-center justify-between px-8 py-3 bg-white border border-black rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#dfad2d] to-[#a87e14] rounded-xl flex items-center justify-center text-white shadow-[0_4px_10px_rgba(184,134,11,0.3)]">
            <Ribbon size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[22px] font-bold text-gray-900 tracking-widest font-serif leading-tight">SASHCRAFT</span>
            <span className="text-[10px] font-bold text-[#b8860b] tracking-wider uppercase mt-0.5">Custom Apparel & Artisanal Crafts</span>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-10 m-0 p-0">
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

        {/* Actions */}
        <div className="flex items-center gap-6">
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
      </nav>
    </div>
  );
}
