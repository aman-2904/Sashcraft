'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wand2, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Layers, 
  Award, 
  Palette,
  MessageCircle
} from 'lucide-react';
import Customizer from '@/components/Customizer/Customizer';
import EnquiryModal from '@/components/Sashes/EnquiryModal';
import { 
  sashesCatalog, 
  satinSashData, 
  SashProductConfig, 
  ProductColor 
} from '@/data/sashesData';
import { 
  applyOverrideToProduct, 
  fetchProductOverride, 
  getLocalStoredOverrides, 
  subscribeToProductPricing 
} from '@/utils/productPricing';
import { 
  getColorNameFromHex, 
  formatColorWithHex 
} from '@/utils/colorPalette';
import { WHATSAPP_DISPLAY_NUMBER } from '@/utils/contact';

export default function CustomizerStudioPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>('satinsashes');
  const [product, setProduct] = useState<SashProductConfig>(satinSashData);
  const [selectedVariantKey, setSelectedVariantKey] = useState<'withoutLace' | 'withLace'>('withLace');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(satinSashData.colors[0]);
  const [customizerNotes, setCustomizerNotes] = useState<string>('');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  // When selected slug changes, switch base product and load overrides
  useEffect(() => {
    const baseProd = sashesCatalog[selectedSlug] || satinSashData;
    setProduct(baseProd);
    setSelectedColor(baseProd.colors[0]);

    // Apply cached overrides if available
    const cached = getLocalStoredOverrides()[selectedSlug];
    if (cached) {
      setProduct((prev) => applyOverrideToProduct(prev, cached));
    }

    // Fetch live from Supabase
    fetchProductOverride(selectedSlug).then((liveOverride) => {
      if (liveOverride) {
        setProduct((prev) => applyOverrideToProduct(prev, liveOverride));
      }
    });

    // Real-time subscription to database updates
    const unsubscribe = subscribeToProductPricing(selectedSlug, (latestOverride) => {
      setProduct((prev) => applyOverrideToProduct(prev, latestOverride));
    });

    return () => {
      unsubscribe();
    };
  }, [selectedSlug]);

  const currentVariant = product.variants[selectedVariantKey];
  const unitPrice = currentVariant.discountedPrice;
  const totalPrice = unitPrice * quantity;
  const discountSaved = (currentVariant.actualPrice - currentVariant.discountedPrice) * quantity;

  // Handle custom design enquiry trigger
  const handleEnquireCustom = ({
    baseColor,
    singleBorderColor,
    doubleBorderColor,
    text,
    fontStyle,
  }: {
    baseColor: string;
    singleBorderColor: string;
    doubleBorderColor: string;
    text: string;
    fontStyle: string;
  }) => {
    const baseName = getColorNameFromHex(baseColor);
    const customCol: ProductColor = {
      id: `custom-${baseColor.replace('#', '')}`,
      name: baseName,
      hex: baseColor,
      borderHex: '#dfad2d',
    };
    setSelectedColor(customCol);

    const notes = `Custom Design Studio Specifications:\n• Product Style: ${product.title}\n• Custom Lettering: "${text}"\n• Typography: ${fontStyle}\n• Base Fabric Color: ${formatColorWithHex(baseName, baseColor)}\n• Primary Border: ${singleBorderColor === 'transparent' ? 'None' : formatColorWithHex(getColorNameFromHex(singleBorderColor), singleBorderColor)}\n• Accent Border: ${doubleBorderColor === 'transparent' ? 'None' : formatColorWithHex(getColorNameFromHex(doubleBorderColor), doubleBorderColor)}`;
    setCustomizerNotes(notes);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfbfb] flex flex-col items-center">
      
      {/* Breadcrumb Header */}
      <div className="w-full bg-[#f9f8f6] border-b border-gray-200/70 py-4 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-[#b8860b] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-[#b8860b] font-bold">Customizer Studio</span>
        </div>
      </div>

      {/* Main Studio Container */}
      <main className="w-full max-w-[1400px] px-4 sm:px-8 md:px-16 pt-8 pb-16 flex flex-col items-center">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#fdfaf2] border border-[#c19b38]/30 text-[#c19b38] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-4 shadow-xs">
            <Wand2 size={13} className="text-[#c19b38]" />
            LIVE CUSTOMIZER STUDIO • 2D / 3D REGALIA MAKER
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-4">
            Personalize Your Ceremonial Sash
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Choose your base regalia style, personalize colors with our 72-shade ceremonial palette, customize border trims, select bespoke embroidery typography, and preview real-time changes before requesting a tailored quote.
          </p>
        </div>

        {/* Step 1: Select Sash Base Style */}
        <div className="w-full max-w-[1100px] mb-8 bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b8860b] flex items-center gap-1.5">
              <Layers size={14} /> SELECT SASH STYLE BASE:
            </span>
            <span className="text-xs font-bold text-gray-900">
              {product.title}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { slug: 'satinsashes', name: 'Imperial Satin', badge: 'Most Popular' },
              { slug: 'velvetsashes', name: 'Plush Velvet', badge: 'Ultra Luxury' },
              { slug: 'doublelayer', name: 'Double-Layer', badge: 'Contrasting' },
              { slug: 'singlelayer', name: 'Single-Layer', badge: 'Cohort Bulk' },
            ].map((s) => {
              const isSelected = selectedSlug === s.slug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setSelectedSlug(s.slug)}
                  className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'border-[#c19b38] bg-amber-50/30 ring-2 ring-[#c19b38]/30 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {s.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 size={14} className="text-[#c19b38]" />
                    )}
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-[#c19b38]' : 'text-gray-800'}`}>
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Interactive Customizer Studio */}
        <div className="w-full">
          <Customizer
            productTitle={product.title}
            productPrice={`${product.currency.symbol}${unitPrice}`}
            initialBaseColor={selectedColor.hex}
            buttonLabel="Transfer Custom Design To Enquiry / Quote"
            onEnquireCustom={handleEnquireCustom}
          />
        </div>

        {/* Benefits & Value Proposition Section */}
        <div className="w-full max-w-[1100px] mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center shrink-0">
              <Palette size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">72-Color Matrix</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Exact hex shade matching for university, corporate & pageantry colors.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">Gold Cord & Trim</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Optional bullion lace, double-stitched borders, and velvet backing.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">Express 24-48h</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Rapid turnaround for graduation ceremonies, galas, and last-minute events.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">Bulk Discounts</h4>
              <p className="text-xs text-gray-500 leading-normal">
                Tiered wholesale pricing up to 35% off for cohorts and institutes.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Assistance Banner */}
        <div className="w-full max-w-[1100px] mt-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Need Custom Embroidery Logos or Crests?</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Our master artisans can vectorize your institute seal and stitch custom bullion embroidery.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/919354953769?text=${encodeURIComponent('Hi SashCraft! I am designing in the Customizer Studio and would like assistance with custom crest embroidery.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow transition-all"
          >
            <MessageCircle size={16} />
            <span>Chat on WhatsApp (+91 {WHATSAPP_DISPLAY_NUMBER})</span>
          </a>
        </div>

      </main>

      {/* Enquiry Modal with Custom Design Details */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        product={product}
        variant={currentVariant}
        selectedColor={selectedColor}
        quantity={quantity}
        unitPrice={unitPrice}
        totalPrice={totalPrice}
        discountSaved={discountSaved}
        initialNotes={customizerNotes}
      />
    </div>
  );
}
