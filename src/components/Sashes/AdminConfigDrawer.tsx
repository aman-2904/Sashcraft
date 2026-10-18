'use client';

import React, { useState } from 'react';
import { Settings2, X, RotateCcw, Check, Database, Sliders, Eye } from 'lucide-react';
import { SatinSashProductConfig } from '@/data/satinSashData';

interface AdminConfigDrawerProps {
  config: SatinSashProductConfig;
  onChange: (updated: SatinSashProductConfig) => void;
  onReset: () => void;
}

export default function AdminConfigDrawer({ config, onChange, onReset }: AdminConfigDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pricing' | 'stock' | 'database'>('pricing');

  const handlePriceChange = (
    variantKey: 'withoutLace' | 'withLace',
    field: 'actualPrice' | 'discountedPrice',
    val: number
  ) => {
    onChange({
      ...config,
      variants: {
        ...config.variants,
        [variantKey]: {
          ...config.variants[variantKey],
          [field]: Math.max(0, val),
        },
      },
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gray-900/90 hover:bg-black text-white px-4 py-2.5 rounded-full shadow-2xl border border-[#dfad2d]/40 backdrop-blur-md transition-all hover:scale-105 group text-xs font-semibold"
          title="Admin Control Simulator"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Settings2 size={16} className="text-[#dfad2d] group-hover:rotate-45 transition-transform" />
          <span>Admin Controls Simulator</span>
        </button>
      </div>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dfad2d]/20 border border-[#dfad2d]/40 flex items-center justify-center text-[#dfad2d]">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Admin Control Preview</h3>
                  <p className="text-[11px] text-gray-400">Live test product pricing & admin options</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Notice */}
            <div className="bg-[#fdfaf2] border-b border-[#dfad2d]/20 px-5 py-3 text-[12px] text-gray-700 leading-snug">
              💡 <strong>Admin Notice:</strong> As requested, this page is fully dynamic. When you build your admin dashboard later, all these fields will be retrieved directly from your Supabase / API backend!
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-5 bg-gray-50">
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'pricing'
                    ? 'border-[#b8860b] text-[#b8860b]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Pricing Controls
              </button>
              <button
                onClick={() => setActiveTab('stock')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'stock'
                    ? 'border-[#b8860b] text-[#b8860b]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Stock & Badges
              </button>
              <button
                onClick={() => setActiveTab('database')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'database'
                    ? 'border-[#b8860b] text-[#b8860b]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Data Schema
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  {/* Without Lace Pricing */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-gray-900">
                        1. Without Lace Option
                      </span>
                      <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono font-bold">
                        without_lace
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                          Actual Price (₹)
                        </label>
                        <input
                          type="number"
                          value={config.variants.withoutLace.actualPrice}
                          onChange={(e) =>
                            handlePriceChange('withoutLace', 'actualPrice', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#dfad2d]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                          Discounted Price (₹)
                        </label>
                        <input
                          type="number"
                          value={config.variants.withoutLace.discountedPrice}
                          onChange={(e) =>
                            handlePriceChange('withoutLace', 'discountedPrice', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-emerald-700 focus:outline-none focus:border-[#dfad2d]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* With Lace Pricing */}
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-amber-900">
                        2. With Royal Lace Option
                      </span>
                      <span className="text-[10px] bg-[#dfad2d]/20 text-[#a87e14] px-2 py-0.5 rounded font-mono font-bold">
                        with_lace
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                          Actual Price (₹)
                        </label>
                        <input
                          type="number"
                          value={config.variants.withLace.actualPrice}
                          onChange={(e) =>
                            handlePriceChange('withLace', 'actualPrice', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#dfad2d]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                          Discounted Price (₹)
                        </label>
                        <input
                          type="number"
                          value={config.variants.withLace.discountedPrice}
                          onChange={(e) =>
                            handlePriceChange('withLace', 'discountedPrice', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-emerald-700 focus:outline-none focus:border-[#dfad2d]"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 italic">
                    Changes take effect immediately on the page so you can test price calculations, discounts, and order totals.
                  </p>
                </div>
              )}

              {activeTab === 'stock' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <div className="font-bold text-sm text-gray-900">In-Stock Status</div>
                      <div className="text-xs text-gray-500">Toggle if this product is currently active for orders</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.inStock}
                        onChange={(e) => onChange({ ...config, inStock: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8860b]"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-800">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => onChange({ ...config, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#dfad2d]"
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-800">
                      Product Tagline
                    </label>
                    <textarea
                      rows={3}
                      value={config.tagline}
                      onChange={(e) => onChange({ ...config, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#dfad2d] resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'database' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <Database size={16} className="text-[#b8860b]" />
                    Backend JSON Representation
                  </div>
                  <pre className="p-4 bg-gray-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-72">
                    {JSON.stringify({
                      id: config.id,
                      sku: config.sku,
                      pricing: {
                        withoutLace: config.variants.withoutLace,
                        withLace: config.variants.withLace,
                      },
                      stock: config.inStock,
                    }, null, 2)}
                  </pre>
                  <p className="text-xs text-gray-500">
                    Ready for Supabase table: <code className="bg-gray-100 px-1 py-0.5 rounded text-[#b8860b]">products</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-[#b8860b]">product_variants</code>.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors"
              >
                <RotateCcw size={14} /> Reset Defaults
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Check size={14} /> Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
