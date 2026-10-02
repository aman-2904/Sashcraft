import React from 'react';
import { Ribbon } from 'lucide-react';

export default function Footer() {
  return (
    <div className="w-full bg-[#f4f1ea] px-4 pb-4 md:px-8 md:pb-8">
      <footer className="relative w-full bg-[#111111] rounded-[30px] md:rounded-[40px] overflow-hidden pt-16 md:pt-24 flex flex-col justify-between">

        <div className="max-w-[1400px] mx-auto px-8 md:px-16 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative z-10">

            {/* Brand Info */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-transparent border border-white/20 p-2 rounded-lg text-white">
                  <Ribbon size={24} strokeWidth={2} />
                </div>
                <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">
                  SASHCRAFT
                </span>
              </div>
              <p className="text-gray-400 text-[14px] leading-relaxed max-w-sm">
                Curating the finest bespoke sashes, ceremonial stoles, and premium academic regalia. Handcrafted elegance in every thread.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-6 lg:ml-12">
              <h4 className="font-bold text-[#b8860b] text-[12px] tracking-widest uppercase mb-2">Quick Links</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-gray-400 hover:text-white text-[14px] font-medium transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-[14px] font-medium transition-colors">Categories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-[14px] font-medium transition-colors">Customizer Studio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-[14px] font-medium transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-[#b8860b] text-[12px] tracking-widest uppercase mb-2">Support</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-gray-400 hover:text-white text-[14px] font-medium transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-[14px] font-medium transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-[14px] font-medium transition-colors">Shipping & Delivery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-[14px] font-medium transition-colors">Returns Policy</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-[#b8860b] text-[12px] tracking-widest uppercase mb-2">Follow Us</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#b8860b] hover:text-white hover:border-[#b8860b] transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#b8860b] hover:text-white hover:border-[#b8860b] transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#b8860b] hover:text-white hover:border-[#b8860b] transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#b8860b] hover:text-white hover:border-[#b8860b] transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
              </div>
              <p className="text-gray-500 text-[12px] mt-4">
                © 2026 SashCraft
              </p>
            </div>

          </div>
        </div>

        {/* Massive Watermark */}
        <div className="w-full overflow-hidden flex justify-center items-end mt-4 pointer-events-none select-none relative z-0">
          <span className="text-[12.5vw] lg:text-[13.5vw] font-black text-[#b8860b]/[0.20] leading-[0.75] tracking-tighter whitespace-nowrap">
            SASHCRAFT
          </span>
        </div>

      </footer>
    </div>
  );
}
