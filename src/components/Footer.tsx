import React from 'react';
import { Ribbon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-[#b8860b] bg-[#b8860b] overflow-hidden">

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg text-[#b8860b] shadow-sm">
                <Ribbon size={20} strokeWidth={2.5} />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                SASHCRAFT
              </span>
            </div>
            <p className="text-white/80 text-[14px] leading-relaxed">
              Custom handcrafted sashes, stoles, gowns, eco tote bags, aprons, caps, flags, and bespoke apparel.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-white mb-2">Categories</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-white/70 hover:text-white text-[14px] transition-colors">Graduation Sashes</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-[14px] transition-colors">Gowns & Caps</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-[14px] transition-colors">Custom Aprons & Tees</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-[14px] transition-colors">Jute & Tote Bags</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-white mb-2">Customer Service</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-white/70 hover:text-white text-[14px] transition-colors">Customizer Studio</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-[14px] transition-colors">Bulk Quote Request</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-[14px] transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="text-white/70 hover:text-white text-[14px] transition-colors">Returns Policy</a></li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="flex flex-col gap-5">
            <h4 className="font-bold text-white mb-2">Stay Connected</h4>
            <p className="text-white/80 text-[14px]">
              Subscribe for custom crafting updates & special offers.
            </p>
            <div className="flex mt-1">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/20 rounded-l-lg px-4 py-2.5 text-sm w-full text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all"
              />
              <button className="bg-white hover:bg-white/90 text-[#b8860b] px-5 py-2.5 rounded-r-lg font-bold text-sm transition-colors shadow-sm">
                Join
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/70 text-[13px]">
            © 2026 SashCraft. All Rights Reserved. Premium Handcrafted Artisanal Apparel.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/70 hover:text-white text-[13px] transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/70 hover:text-white text-[13px] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
