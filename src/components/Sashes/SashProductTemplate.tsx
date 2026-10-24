'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  CheckCircle2,
  Heart,
  Maximize2,
  ArrowRight,
  HelpCircle,
  Bookmark,
  Wand2,
  Award,
  Scissors,
  Palette,
  Pipette,
  Plus,
  X
} from 'lucide-react';
import {
  SashProductConfig,
  VariantDetails,
  ProductColor
} from '@/data/sashesData';
import { 
  FULL_COLOR_PALETTE, 
  COLOR_PALETTE_ROWS, 
  getColorNameFromHex, 
  formatColorWithHex 
} from '@/utils/colorPalette';
import EnquiryModal from '@/components/Sashes/EnquiryModal';
import Customizer from '@/components/Customizer/Customizer';
import {
  applyOverrideToProduct,
  fetchProductOverride,
  getLocalStoredOverrides,
  subscribeToProductPricing,
} from '@/utils/productPricing';
import {
  isWishlisted as checkWishlisted,
  toggleWishlist,
  WISHLIST_UPDATED_EVENT,
} from '@/utils/wishlist';

interface SashProductTemplateProps {
  initialProduct: SashProductConfig;
}

export default function SashProductTemplate({ initialProduct }: SashProductTemplateProps) {
  // Initialize with initialProduct directly so SSR and client initial HTML match 100%
  const [product, setProduct] = useState<SashProductConfig>(initialProduct);

  const [selectedVariantKey, setSelectedVariantKey] = useState<'withoutLace' | 'withLace'>('withLace');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(initialProduct.colors[0]);
  const [showFullPalette, setShowFullPalette] = useState<boolean>(false);
  const [customHex, setCustomHex] = useState<string>(initialProduct.colors[0]?.hex || '#d4af37');
  const [isCustomColorActive, setIsCustomColorActive] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string>(initialProduct.variants.withLace.images[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isQtySaved, setIsQtySaved] = useState<boolean>(false);
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'faqs'>('details');
  const [customizerNotes, setCustomizerNotes] = useState<string>('');
  const [isMatrixPickerOpen, setIsMatrixPickerOpen] = useState<boolean>(false);

  // Update internal product when initialProduct changes (e.g. page navigation)
  // and load live overrides from Supabase & cache post-hydration
  useEffect(() => {
    // 1. Client-only cache load (runs after hydration, so zero hydration mismatch)
    const cached = getLocalStoredOverrides()[initialProduct.slug];
    if (cached) {
      setProduct((prev) => applyOverrideToProduct(prev, cached));
    }

    // 2. Fetch live from Supabase
    fetchProductOverride(initialProduct.slug).then((liveOverride) => {
      if (liveOverride) {
        setProduct((prev) => applyOverrideToProduct(prev, liveOverride));
      }
    });

    // 3. Real-time subscription to database changes and admin events
    const unsubscribe = subscribeToProductPricing(initialProduct.slug, (latestOverride) => {
      setProduct((prev) => applyOverrideToProduct(prev, latestOverride));
    });

    // 4. Wishlist state sync
    setIsWishlisted(checkWishlisted(initialProduct.slug));
    const handleWishlistChange = () => {
      setIsWishlisted(checkWishlisted(initialProduct.slug));
    };
    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistChange);

    return () => {
      unsubscribe();
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistChange);
    };
  }, [initialProduct.slug]);

  // Dynamically synchronize the browser tab title with the live database title in all browsers
  useEffect(() => {
    if (product.title && typeof document !== 'undefined') {
      document.title = `${product.title} | SashCraft Artisanal Regalia`;
    }
  }, [product.title]);

  // Automatically sync activeImage when product images are updated dynamically from the database
  useEffect(() => {
    const variantImgs = product.variants[selectedVariantKey]?.images || [];
    if (variantImgs.length > 0 && !variantImgs.includes(activeImage)) {
      setActiveImage(variantImgs[0]);
    }
  }, [product, selectedVariantKey, activeImage]);

  const currentVariant: VariantDetails = product.variants[selectedVariantKey];

  // Whenever variant changes, default the active image to that variant's primary image
  const handleVariantSelect = (key: 'withoutLace' | 'withLace') => {
    setSelectedVariantKey(key);
    if (product.variants[key]?.images?.length > 0) {
      setActiveImage(product.variants[key].images[0]);
    }
  };

  const handleSelectColor = (color: ProductColor) => {
    setSelectedColor(color);
    setCustomHex(color.hex);
    setIsCustomColorActive(false);
  };

  const handleCustomColorChange = (hexValue: string) => {
    let clean = hexValue.trim();
    if (!clean.startsWith('#') && clean.length > 0) {
      clean = `#${clean}`;
    }
    setCustomHex(clean);
    if (/^#[0-9A-Fa-f]{3,6}$/.test(clean)) {
      setSelectedColor({
        id: 'custom',
        name: `Custom Shade (${clean.toUpperCase()})`,
        hex: clean,
        borderHex: '#dfad2d',
      });
      setIsCustomColorActive(true);
    }
  };

  // Determine bulk discount tier based on quantity
  const getBulkTier = (qty: number) => {
    const sortedTiers = [...product.bulkTiers].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sortedTiers) {
      if (qty >= tier.minQty) {
        return tier;
      }
    }
    return product.bulkTiers[0];
  };

  const activeBulkTier = getBulkTier(quantity);

  // Price calculations
  const baseActualUnitPrice = currentVariant.actualPrice;
  const baseDiscountedUnitPrice = currentVariant.discountedPrice;

  // Extra tier discount applied on bulk orders
  const bulkMultiplier = (100 - activeBulkTier.discountPercent) / 100;
  const effectiveUnitPrice = Math.round(baseDiscountedUnitPrice * bulkMultiplier);

  const totalActualPrice = baseActualUnitPrice * quantity;
  const totalDiscountedPrice = effectiveUnitPrice * quantity;
  const totalSaved = totalActualPrice - totalDiscountedPrice;
  const percentSaved = Math.round(((totalActualPrice - totalDiscountedPrice) / totalActualPrice) * 100);

  // Load saved quantity from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sashcraft_saved_qty_${product.slug}`);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed > 0) {
          setQuantity(parsed);
          setIsQtySaved(true);
        }
      }
    } catch {
      // ignore
    }
  }, [product.slug]);

  const handleSaveQuantity = () => {
    try {
      localStorage.setItem(`sashcraft_saved_qty_${product.slug}`, quantity.toString());
      setIsQtySaved(true);
      setSaveToastMessage(`Quantity of ${quantity} units saved for ${product.title}!`);
      setTimeout(() => setSaveToastMessage(null), 3500);
    } catch {
      // ignore
    }
  };

  const handleQuantityChange = (val: number) => {
    const cleanVal = Math.max(1, Math.min(10000, val));
    setQuantity(cleanVal);
    setIsQtySaved(false);
  };

  const allGalleryImages = Array.from(
    new Set([
      ...product.variants.withLace.images,
      ...product.variants.withoutLace.images,
    ])
  );

  return (
    <div className="w-full min-h-screen bg-[#fcfbfa] text-gray-900 pb-20">
      {/* Toast Notification */}
      {saveToastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#dfad2d] animate-in slide-in-from-top duration-300">
          <CheckCircle2 size={18} className="text-[#dfad2d]" />
          <span className="text-xs font-semibold">{saveToastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation (Upward) */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-6 pb-4">
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link href="/" className="hover:text-[#b8860b] transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <Link href="/sashes" className="hover:text-[#b8860b] transition-colors">
            Sashes & Stoles
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-[#b8860b] font-bold">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Container */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ================= LEFT SIDE: IMAGE GALLERY ================= */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4 sticky top-28">
            
            {/* Vertical / Upward Thumbnail Selector */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[580px] pb-2 md:pb-0 scrollbar-none shrink-0">
              {allGalleryImages.map((imgSrc, idx) => {
                const isSelected = activeImage === imgSrc;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgSrc)}
                    className={`relative w-16 h-20 md:w-20 md:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white group ${
                      isSelected
                        ? 'border-[#dfad2d] shadow-md ring-2 ring-[#dfad2d]/20 scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`${product.title} preview angle ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#dfad2d]/10 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Stage Image with Zoom & Badges */}
            <div className="relative flex-1 bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden aspect-[3/4] flex items-center justify-center group">
              {/* Floating Badges on Image */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-gradient-to-r from-[#dfad2d] to-[#a87e14] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles size={12} />
                  {selectedVariantKey === 'withLace' ? 'With Royal Lace' : 'Without Lace'}
                </span>
                {percentSaved > 0 && (
                  <span
                    suppressHydrationWarning
                    className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm w-fit"
                  >
                    {percentSaved}% OFF
                  </span>
                )}
              </div>

              {/* Action Buttons Top Right */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const isAdded = toggleWishlist(product.slug);
                    setIsWishlisted(isAdded);
                  }}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-500 border border-rose-200'
                      : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200 shadow-sm'
                  }`}
                  title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart size={16} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 border border-gray-200 shadow-sm backdrop-blur-md flex items-center justify-center transition-all hover:scale-105"
                  title="Fullscreen image view"
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Main Image Display */}
              <div className="relative w-full h-full p-4 flex items-center justify-center">
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Bottom Quick-Filter Pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-4 py-1.5 shadow-md flex items-center gap-4 text-[11px] font-semibold text-gray-600">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVariantKey('withoutLace');
                    setActiveImage(product.variants.withoutLace.images[0]);
                  }}
                  className={`hover:text-[#b8860b] transition-colors ${
                    selectedVariantKey === 'withoutLace' ? 'text-[#b8860b] font-bold' : ''
                  }`}
                >
                  Without Lace
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVariantKey('withLace');
                    setActiveImage(product.variants.withLace.images[0]);
                  }}
                  className={`hover:text-[#b8860b] transition-colors ${
                    selectedVariantKey === 'withLace' ? 'text-[#b8860b] font-bold' : ''
                  }`}
                >
                  With Lace
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: CONFIGURATION & CONTROLS ================= */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#b8860b] bg-[#fdfaf2] border border-[#dfad2d]/20 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Ratings and review badge */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-[#dfad2d]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#dfad2d]" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviewCount} verified client reviews)</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> {product.inStock ? 'In Stock (Ready to Craft)' : 'Made to Order'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* DYNAMIC PRICE DISPLAY */}
            <div className="p-5 bg-gradient-to-br from-[#fdfbf7] via-white to-[#fbf9f4] border border-[#dfad2d]/30 rounded-3xl shadow-sm space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Unit Price:
                </span>
                <span
                  suppressHydrationWarning
                  className="text-3xl sm:text-4xl font-serif font-bold text-gray-900"
                >
                  {product.currency.symbol}{effectiveUnitPrice.toLocaleString()}
                </span>
                <span
                  suppressHydrationWarning
                  className="text-lg text-gray-400 line-through"
                >
                  {product.currency.symbol}{baseActualUnitPrice.toLocaleString()}
                </span>
                <span
                  suppressHydrationWarning
                  className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200"
                >
                  Save {percentSaved}%
                </span>
              </div>

              {/* Total calculation row */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs text-gray-600">
                <span>
                  Estimated Total ({quantity} {quantity === 1 ? 'unit' : 'units'}):{' '}
                  <strong
                    suppressHydrationWarning
                    className="text-gray-900 text-sm font-serif"
                  >
                    {product.currency.symbol}{totalDiscountedPrice.toLocaleString()}
                  </strong>
                </span>
                {totalSaved > 0 && (
                  <span
                    suppressHydrationWarning
                    className="text-emerald-700 font-semibold"
                  >
                    Total Savings: {product.currency.symbol}{totalSaved.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Bulk Tier Notification */}
              {activeBulkTier.discountPercent > 0 && (
                <div className="text-[11px] text-[#a87e14] font-semibold flex items-center gap-1.5 pt-1">
                  <Sparkles size={13} />
                  Bulk Tier Applied: {activeBulkTier.label}
                </div>
              )}
            </div>

            {/* LACE SELECTION (WITHOUT LACE vs WITH LACE) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors size={14} className="text-[#b8860b]" />
                  Select Border Style:
                </label>
                <span className="text-xs font-semibold text-[#b8860b]">
                  {selectedVariantKey === 'withLace' ? 'With Royal Lace' : 'Without Lace'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option 1: Without Lace */}
                <button
                  type="button"
                  onClick={() => handleVariantSelect('withoutLace')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                    selectedVariantKey === 'withoutLace'
                      ? 'border-[#dfad2d] bg-[#fdfaf2] shadow-md ring-2 ring-[#dfad2d]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                        Without Lace
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{product.variants.withoutLace.tagline}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        selectedVariantKey === 'withoutLace'
                          ? 'border-[#dfad2d] bg-[#dfad2d] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedVariantKey === 'withoutLace' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-baseline gap-2">
                    <span
                      suppressHydrationWarning
                      className="text-base font-serif font-bold text-gray-900"
                    >
                      {product.currency.symbol}{product.variants.withoutLace.discountedPrice}
                    </span>
                    <span
                      suppressHydrationWarning
                      className="text-xs text-gray-400 line-through"
                    >
                      {product.currency.symbol}{product.variants.withoutLace.actualPrice}
                    </span>
                  </div>
                </button>

                {/* Option 2: With Lace */}
                <button
                  type="button"
                  onClick={() => handleVariantSelect('withLace')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                    selectedVariantKey === 'withLace'
                      ? 'border-[#dfad2d] bg-[#fdfaf2] shadow-md ring-2 ring-[#dfad2d]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Badge */}
                  {product.variants.withLace.popularBadge && (
                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#dfad2d] to-[#a87e14] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      {product.variants.withLace.popularBadge}
                    </span>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                        {product.variants.withLace.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{product.variants.withLace.tagline}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        selectedVariantKey === 'withLace'
                          ? 'border-[#dfad2d] bg-[#dfad2d] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedVariantKey === 'withLace' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-baseline gap-2">
                    <span
                      suppressHydrationWarning
                      className="text-base font-serif font-bold text-gray-900"
                    >
                      {product.currency.symbol}{product.variants.withLace.discountedPrice}
                    </span>
                    <span
                      suppressHydrationWarning
                      className="text-xs text-gray-400 line-through"
                    >
                      {product.currency.symbol}{product.variants.withLace.actualPrice}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* FULL COLOR PALETTE & CUSTOM COLOR SELECTION */}
            <div className="space-y-3 p-4 bg-white rounded-3xl border border-gray-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 flex-wrap">
                  <span
                    className="w-4 h-4 rounded-full inline-block border border-gray-400 shadow-xs shrink-0"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span>
                    Fabric Color: <strong className="text-[#b8860b] normal-case">{selectedColor.name}</strong>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-50 text-[#b8860b] px-1.5 py-0.5 rounded border border-[#dfad2d]/30">
                    {selectedColor.hex}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowFullPalette(!showFullPalette)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] hover:text-[#8f6906] transition-colors cursor-pointer self-start sm:self-auto bg-amber-50/70 hover:bg-amber-100/60 px-2.5 py-1 rounded-full border border-[#dfad2d]/20"
                >
                  <Palette size={13} />
                  <span>{showFullPalette ? 'Show Signature Colors' : `Full Color Palette (${FULL_COLOR_PALETTE.length}+ Shades)`}</span>
                </button>
              </div>

              {/* Swatches Grid */}
              <div className="flex items-center gap-2.5 flex-wrap pt-1">
                {(showFullPalette ? FULL_COLOR_PALETTE : product.colors).map((color) => {
                  const isColorActive = !isCustomColorActive && selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleSelectColor(color)}
                      className={`group relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center cursor-pointer shadow-xs ${
                        isColorActive
                          ? 'border-[#dfad2d] ring-2 ring-[#dfad2d]/40 scale-105'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} (${color.hex})`}
                    >
                      {isColorActive && (
                        <Check
                          size={14}
                          className={
                            color.id === 'white' || color.hex.toLowerCase() === '#fcfcfc' || color.hex.toLowerCase() === '#ffffff' || color.id === 'gold'
                              ? 'text-gray-900'
                              : 'text-white'
                          }
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Circular Dashed Button with + icon opening COLORS popover card */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMatrixPickerOpen(!isMatrixPickerOpen)}
                    className={`w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                      isMatrixPickerOpen
                        ? 'border-[#dfad2d] text-[#b8860b] bg-amber-50 ring-2 ring-[#dfad2d]/40 scale-105'
                        : 'border-[#dfad2d] text-[#b8860b] hover:bg-amber-50/50 hover:scale-105'
                    }`}
                    title="Open 72-color matrix popover"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>

                  {/* Popover Card matching the user design */}
                  {isMatrixPickerOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-black/5"
                        onClick={() => setIsMatrixPickerOpen(false)}
                      />
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute z-50 bg-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150 top-12 left-0 sm:left-auto sm:right-0 md:left-full md:right-auto md:ml-3 md:-top-6 w-[232px] sm:w-[248px]"
                      >
                        <div className="flex justify-between items-center w-full pb-0.5">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                            COLORS
                          </span>
                          <button 
                            type="button"
                            onClick={() => setIsMatrixPickerOpen(false)}
                            className="text-gray-400 hover:text-gray-800 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer"
                            title="Close palette"
                          >
                            <X size={15} strokeWidth={2.5} />
                          </button>
                        </div>

                        <div className="flex flex-col gap-1">
                          {COLOR_PALETTE_ROWS.map((row, rowIdx) => (
                            <div key={rowIdx} className="grid grid-cols-8 gap-1">
                              {row.map((item) => {
                                const isSelected = selectedColor.hex.toLowerCase() === item.hex.toLowerCase();
                                return (
                                  <button
                                    key={item.hex}
                                    type="button"
                                    onClick={() => {
                                      handleSelectColor({
                                        id: `matrix-${item.hex.replace('#', '')}`,
                                        name: item.name,
                                        hex: item.hex,
                                        borderHex: '#dfad2d',
                                      });
                                      setIsMatrixPickerOpen(false);
                                    }}
                                    className={`w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] rounded-[4px] transition-all cursor-pointer relative shadow-xs hover:scale-125 hover:z-20 hover:shadow-md ${
                                      isSelected
                                        ? "ring-2 ring-black ring-offset-1 scale-110 z-10"
                                        : "border border-black/10 hover:border-black/30"
                                    }`}
                                    style={{ backgroundColor: item.hex }}
                                    title={`${item.name} (${item.hex.toUpperCase()})`}
                                  />
                                );
                              })}
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                          <span className="truncate font-medium">{selectedColor.name}</span>
                          <span className="font-mono font-bold text-[10px] bg-amber-50 text-[#b8860b] px-1.5 py-0.5 rounded border border-[#dfad2d]/30">
                            {selectedColor.hex.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Show toggle button when not in full palette mode */}
                {!showFullPalette && (
                  <button
                    type="button"
                    onClick={() => setShowFullPalette(true)}
                    className="h-9 px-3 rounded-full border border-dashed border-[#dfad2d] text-[#b8860b] hover:bg-amber-50/50 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="View all 20+ fabric shades"
                  >
                    <Plus size={12} />
                    <span>+{FULL_COLOR_PALETTE.length - product.colors.length} More Shades</span>
                  </button>
                )}
              </div>

              {/* Custom Color Wheel & HEX Input Bar */}
              <div className="pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50/70 p-3 rounded-2xl border border-gray-200/80">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-gray-300 shrink-0 cursor-pointer shadow-xs hover:border-[#dfad2d] transition-colors">
                    <input
                      type="color"
                      value={customHex.startsWith('#') && customHex.length === 7 ? customHex : '#d4af37'}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer border-0 p-0"
                      title="Click to open full color wheel"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Pipette size={11} className="text-[#dfad2d]" /> Custom Color Wheel & HEX:
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input
                        type="text"
                        value={customHex}
                        onChange={(e) => handleCustomColorChange(e.target.value)}
                        placeholder="#7B1FA2"
                        maxLength={7}
                        className="w-24 px-2 py-0.5 bg-white border border-gray-300 focus:border-[#dfad2d] rounded-lg text-xs font-mono font-bold text-gray-900 uppercase focus:outline-none shadow-xs"
                      />
                      <span className="text-[11px] text-gray-500 hidden sm:inline">Pick any shade or enter college HEX</span>
                    </div>
                  </div>
                </div>

                {isCustomColorActive && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1">
                    <CheckCircle2 size={12} /> Custom Color Active
                  </span>
                )}
              </div>
            </div>

            {/* QUANTITY SELECTION & SAVE QUANTITY BUTTON */}
            <div className="space-y-3 p-4 bg-gray-50/70 border border-gray-200 rounded-3xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Select Order Quantity:
                </label>
                {isQtySaved && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 size={12} /> Quantity Saved
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1 shadow-sm shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent font-bold text-lg transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center font-bold text-gray-900 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Save Quantity Button */}
                <button
                  type="button"
                  onClick={handleSaveQuantity}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isQtySaved
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-white border border-[#dfad2d] text-[#a87e14] hover:bg-[#fdfaf2]'
                  }`}
                >
                  <Bookmark size={15} />
                  {isQtySaved ? 'Quantity Saved' : 'Save Quantity'}
                </button>
              </div>

              {/* Fast Presets */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                  Presets:
                </span>
                {[1, 10, 25, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleQuantityChange(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      quantity === preset
                        ? 'bg-[#b8860b] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {preset} {preset === 1 ? 'pc' : 'pcs'}
                  </button>
                ))}
              </div>
            </div>

            {/* CALL TO ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              {/* PRIMARY: ENQUIRE NOW BUTTON */}
              <button
                type="button"
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full bg-gradient-to-r from-[#b8860b] via-[#dfad2d] to-[#a87e14] hover:from-[#a07409] hover:via-[#c19b38] hover:to-[#916d10] text-white py-4 px-8 rounded-2xl font-bold text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(223,173,45,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(223,173,45,0.5)] active:scale-98"
              >
                <Sparkles size={18} />
                ENQUIRE NOW & GET QUOTE
                <ArrowRight size={18} />
              </button>

              {/* SECONDARY: CUSTOMIZER STUDIO LINK */}
              <a
                href="#customizer-studio"
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs hover:border-[#dfad2d] cursor-pointer"
              >
                <Wand2 size={16} className="text-[#b8860b]" />
                Design in Live Customizer Studio Below
              </a>
            </div>

            {/* TRUST & SERVICE GUARANTEES */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-gray-100">
                <Truck size={20} className="text-[#b8860b] mb-1.5" />
                <span className="text-[11px] font-bold text-gray-800">Fast Dispatch</span>
                <span className="text-[10px] text-gray-400">24-48 hrs delivery</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-gray-100">
                <ShieldCheck size={20} className="text-[#b8860b] mb-1.5" />
                <span className="text-[11px] font-bold text-gray-800">Quality Certified</span>
                <span className="text-[10px] text-gray-400">{product.fabricDetails.weight}</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white border border-gray-100">
                <Award size={20} className="text-[#b8860b] mb-1.5" />
                <span className="text-[11px] font-bold text-gray-800">Direct Artisanal</span>
                <span className="text-[10px] text-gray-400">{product.fabricDetails.origin}</span>
              </div>
            </div>

          </div>

        </div>

        {/* ================= LIVE CUSTOMIZER STUDIO SECTION ================= */}
        <div className="mt-16 bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden p-2 sm:p-6">
          <Customizer
            productTitle={product.title}
            productPrice={`${product.currency.symbol}${effectiveUnitPrice}`}
            initialBaseColor={selectedColor.hex}
            buttonLabel="Transfer Custom Design To Enquiry"
            onEnquireCustom={({ baseColor, singleBorderColor, doubleBorderColor, text, fontStyle }) => {
              const baseName = getColorNameFromHex(baseColor);
              const customCol: ProductColor = {
                id: `custom-${baseColor.replace('#', '')}`,
                name: baseName,
                hex: baseColor,
                borderHex: '#dfad2d',
              };
              setSelectedColor(customCol);
              const notes = `Custom Design Specifications:\n• Custom Lettering: "${text}"\n• Typography: ${fontStyle}\n• Base Fabric Color: ${formatColorWithHex(baseName, baseColor)}\n• Primary Border: ${singleBorderColor === 'transparent' ? 'None' : formatColorWithHex(getColorNameFromHex(singleBorderColor), singleBorderColor)}\n• Accent Border: ${doubleBorderColor === 'transparent' ? 'None' : formatColorWithHex(getColorNameFromHex(doubleBorderColor), doubleBorderColor)}`;
              setCustomizerNotes(notes);
              setIsEnquiryOpen(true);
            }}
          />
        </div>

        {/* ================= TABS: SPECIFICATIONS, CARE & FAQS ================= */}
        <div className="mt-20 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 px-6 sm:px-10 bg-gray-50/70 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-[#b8860b] text-[#b8860b]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Fabric & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-[#b8860b] text-[#b8860b]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Detailed Specifications
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`py-4 px-5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'faqs'
                  ? 'border-[#b8860b] text-[#b8860b]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Frequently Asked Questions
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    Artisanal {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.tagline} Engineered with {product.fabricDetails.material} and tailored with meticulous care to deliver a prestigious milestone experience.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-gray-700">
                        <CheckCircle2 size={16} className="text-[#b8860b] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                  <Image
                    src={product.variants.withLace.images[0] || activeImage}
                    alt={`${product.title} craft detail`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-semibold">
                      {product.variants.withLace.tagline}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-none">
                        <td className="py-3.5 pr-6 font-bold text-gray-900 w-1/3 bg-gray-50/50 pl-4 rounded-l-lg">
                          {spec.label}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'faqs' && (
              <div className="space-y-4 max-w-3xl">
                {product.faqs.map((faq, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-[#fdfbf7] space-y-2">
                    <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <HelpCircle size={16} className="text-[#b8860b]" />
                      {faq.question}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed pl-6">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-4xl w-full h-[85vh] flex items-center justify-center">
            <Image
              src={activeImage}
              alt="Zoomed view"
              fill
              unoptimized
              className="object-contain"
            />
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ENQUIRY POPUP MODAL */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        product={product}
        variant={currentVariant}
        selectedColor={selectedColor}
        quantity={quantity}
        unitPrice={effectiveUnitPrice}
        totalPrice={totalDiscountedPrice}
        discountSaved={totalSaved}
        initialNotes={customizerNotes}
      />
    </div>
  );
}
