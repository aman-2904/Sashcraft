"use client";

import { useState } from "react";
import { ShoppingCart, Plus, X } from "lucide-react";
import { COLOR_PALETTE_ROWS, getColorNameFromHex } from "@/utils/colorPalette";

export interface CustomizerProps {
  productTitle?: string;
  productPrice?: string;
  initialBaseColor?: string;
  initialBorderColor?: string;
  buttonLabel?: string;
  onEnquireCustom?: (customDetails: {
    baseColor: string;
    singleBorderColor: string;
    doubleBorderColor: string;
    text: string;
    fontStyle: string;
  }) => void;
}

export default function Customizer({
  productTitle,
  productPrice,
  initialBaseColor,
  initialBorderColor,
  buttonLabel,
  onEnquireCustom,
}: CustomizerProps = {}) {
  const [baseColor, setBaseColor] = useState(initialBaseColor || "#111111");
  const [singleBorderColor, setSingleBorderColor] = useState(initialBorderColor || "#c42323");
  const [doubleBorderColor, setDoubleBorderColor] = useState("#c9aa66");
  const [text, setText] = useState("CLASS OF 2026");
  const [fontStyle, setFontStyle] = useState("Serif"); // Serif, Modern, Classic
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  const extendedFonts = [
    // Standard Fonts
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Times New Roman", value: "'Times New Roman', serif" },
    { name: "Courier New", value: "'Courier New', monospace" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { name: "Impact", value: "Impact, sans-serif" },
    { name: "Tahoma", value: "Tahoma, sans-serif" },
    { name: "Garamond", value: "Garamond, serif" },
    { name: "Comic Sans MS", value: "'Comic Sans MS', cursive" },

    // Calligraphic & Script Fonts
    { name: "Brush Script MT", value: "'Brush Script MT', cursive" },
    { name: "Lucida Handwriting", value: "'Lucida Handwriting', cursive" },
    { name: "Bradley Hand", value: "'Bradley Hand', cursive" },
    { name: "Snell Roundhand", value: "'Snell Roundhand', cursive" },
    { name: "Edwardian Script", value: "'Edwardian Script ITC', cursive" },
    { name: "Papyrus", value: "Papyrus, fantasy" },
    { name: "Apple Chancery", value: "'Apple Chancery', cursive" }
  ];

  // Base colors mapping
  const baseColors = [
    { name: "Black", hex: "#111111" },
    { name: "White", hex: "#ffffff" },
    { name: "Navy Blue", hex: "#0b1a30" },
    { name: "Forest Green", hex: "#14532d" },
    { name: "Burgundy", hex: "#7f1d1d" },
  ];

  const singleBorderColors = [
    { name: "Red", hex: "#c42323" },
    { name: "Gold", hex: "#c19b38" },
    { name: "White", hex: "#ffffff" },
    { name: "Slate Blue", hex: "#859bb0" },
    { name: "None", hex: "transparent" },
  ];

  const doubleBorderColors = [
    { name: "Champagne", hex: "#c9aa66" },
    { name: "Gold", hex: "#c19b38" },
    { name: "Slate Blue", hex: "#859bb0" },
    { name: "None", hex: "transparent" },
  ];

  const renderPalette = (
    onSelect: (color: string) => void,
    id: string,
    currentColor: string
  ) => {
    if (openPicker !== id) return null;
    return (
      <>
        {/* Transparent backdrop to easily dismiss when clicking outside */}
        <div
          className="fixed inset-0 z-40 bg-black/5"
          onClick={(e) => {
            e.stopPropagation();
            setOpenPicker(null);
          }}
        />

        {/* Floating popover card matching the design screenshot */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 bg-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-gray-100/90 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150 top-12 left-0 sm:left-auto sm:right-0 md:left-full md:right-auto md:ml-3 md:-top-6 w-[232px] sm:w-[248px]"
        >
          {/* Popover Header */}
          <div className="flex justify-between items-center w-full pb-0.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              COLORS
            </span>
            <button 
              type="button"
              onClick={() => setOpenPicker(null)}
              className="text-gray-400 hover:text-gray-800 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer"
              title="Close palette"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>

          {/* 8-Column x 9-Row Color Matrix Grid */}
          <div className="flex flex-col gap-1">
            {COLOR_PALETTE_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-8 gap-1">
                {row.map((item) => {
                  const isSelected = currentColor.toLowerCase() === item.hex.toLowerCase();
                  return (
                    <button
                      key={item.hex}
                      type="button"
                      onClick={() => {
                        onSelect(item.hex);
                        setOpenPicker(null);
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

          {/* Active color readout footer */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
            <span className="truncate font-medium">{getColorNameFromHex(currentColor)}</span>
            <span className="font-mono font-bold text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">
              {currentColor.toUpperCase()}
            </span>
          </div>
        </div>
      </>
    );
  };

  const renderFontPalette = () => {
    if (openPicker !== 'font') return null;
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/5"
          onClick={(e) => {
            e.stopPropagation();
            setOpenPicker(null);
          }}
        />
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-full right-0 mb-2 z-50 bg-white p-2 pb-3 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-1 w-56 max-h-[18rem] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 pt-1 pb-2 mb-1 border-b border-gray-100 px-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">More Fonts</span>
            <button 
              type="button"
              onClick={() => setOpenPicker(null)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
          {extendedFonts.map(font => (
            <button
              key={font.name}
              type="button"
              onClick={() => {
                setFontStyle(font.value);
                setOpenPicker(null);
              }}
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </>
    );
  };

  const getFontFamily = () => {
    if (fontStyle === "Modern") return { className: "font-sans font-bold tracking-[0.3em]", style: {} };
    if (fontStyle === "Classic") return { className: "font-serif italic font-semibold tracking-widest", style: {} };
    if (fontStyle === "Serif") return { className: "font-serif font-bold tracking-widest", style: {} };

    // Custom MS Word Font selected
    return { className: "font-bold tracking-widest", style: { fontFamily: fontStyle } };
  };

  const fontProps = getFontFamily();

  // Helper to check if current selection matches preset or custom palette
  const isCustomBase = !baseColors.some(c => c.hex.toLowerCase() === baseColor.toLowerCase());
  const isCustomSingle = singleBorderColor !== 'transparent' && !singleBorderColors.some(c => c.hex.toLowerCase() === singleBorderColor.toLowerCase());
  const isCustomDouble = doubleBorderColor !== 'transparent' && !doubleBorderColors.some(c => c.hex.toLowerCase() === doubleBorderColor.toLowerCase());

  return (
    <section id="customizer-studio" className="w-full bg-[#fdfbfb] px-4 sm:px-8 md:px-16 pt-12 pb-16 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="bg-white border border-[#c19b38]/30 text-[#c19b38] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
          LIVE CUSTOMIZER STUDIO
        </div>
        <h2 className="text-4xl md:text-[2.75rem] font-serif font-bold text-gray-900 mb-4 tracking-tight">Design Your Custom Product</h2>
        <p className="text-gray-500 text-[1.1rem] max-w-2xl">
          Customize colors, borders, text, typography, and preview real-time changes prior to placing your order.
        </p>
      </div>

      {/* Layout */}
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row gap-8">

        {/* Left Preview */}
        <div className="flex-[1.2] bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col shadow-md hover:shadow-xl transition-shadow duration-500">
          <div className="flex-1 bg-gradient-to-b from-[#fdfbf6] to-[#f4f1ea] rounded-[1.5rem] w-full flex items-center justify-center py-8 relative min-h-[440px] overflow-hidden">

            {/* Live CSS Sash Render */}
            <div
              className="relative w-[130px] min-h-[380px] h-fit shadow-2xl flex flex-col items-center justify-center transition-all duration-500"
              style={{
                backgroundColor: singleBorderColor !== 'transparent' ? singleBorderColor : baseColor,
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 25px), 50% 100%, 0 calc(100% - 25px))'
              }}
            >
              {/* Inner Base Color (if single border exists) */}
              <div 
                className="absolute inset-[6px]"
                style={{
                  backgroundColor: baseColor,
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 23px), 50% 100%, 0 calc(100% - 23px))'
                }}
              />

              {/* Double Border (Outline) */}
              {doubleBorderColor !== 'transparent' && (
                <div 
                  className="absolute inset-[10px]"
                  style={{
                    backgroundColor: doubleBorderColor,
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 21px), 50% 100%, 0 calc(100% - 21px))'
                  }}
                />
              )}

              {/* Double Border Inner Background (Hollow out the outline) */}
              {doubleBorderColor !== 'transparent' && (
                <div 
                  className="absolute inset-[14px]"
                  style={{
                    backgroundColor: baseColor,
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 19px), 50% 100%, 0 calc(100% - 19px))'
                  }}
                />
              )}

              <div
                className={`relative z-10 text-[#c19b38] text-[1.6rem] leading-none transition-all duration-300 drop-shadow-md pt-16 pb-24 px-2 ${fontProps.className}`}
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright', ...fontProps.style }}
              >
                {text.toUpperCase() || " "}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between mt-6 px-4 text-[14px]">
            <div className="text-gray-500">
              Selected Item: <span className="font-bold text-gray-900">{productTitle || "Custom Graduation Sash"}</span>
            </div>
            <div className="text-gray-500">
              Estimated Price: <span className="font-bold text-[#c19b38]">{productPrice || "₹499.00"}</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex-1 bg-white border border-gray-100 rounded-[2rem] p-6 lg:p-8 flex flex-col gap-5 shadow-md">

          {/* 1. Base Color Select */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">
                1. BASE COLOR
              </label>
              <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                {baseColor.toUpperCase()}
              </span>
            </div>
            <div className="relative flex flex-wrap gap-4 items-center">
              {baseColors.map(c => {
                const isActive = baseColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setBaseColor(c.hex)}
                    className={`w-9 h-9 rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border-[3px] border-[#c19b38] ring-2 ring-offset-2 ring-[#c19b38]/50 scale-110 shadow-md'
                        : 'border border-gray-200 hover:scale-105 shadow-xs'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                );
              })}
              
              {/* Circular Dashed Button with + icon opening COLORS popover card */}
              <div className="relative w-9 h-9">
                <button
                  type="button"
                  onClick={() => setOpenPicker(openPicker === 'base' ? null : 'base')}
                  className={`w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                    openPicker === 'base' || isCustomBase
                      ? 'border-[#c19b38] text-[#c19b38] bg-amber-50/50 scale-105 ring-2 ring-[#c19b38]/30 shadow-xs'
                      : 'border-[#c19b38] text-[#c19b38] hover:bg-amber-50/40 hover:scale-105'
                  }`}
                  title="Choose from full 72-color palette"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
                {renderPalette(setBaseColor, 'base', baseColor)}
              </div>
            </div>
          </div>

          {/* 2. Single Border Select */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">
                2. SINGLE BORDER COLOR
              </label>
              <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                {singleBorderColor === 'transparent' ? 'NONE' : singleBorderColor.toUpperCase()}
              </span>
            </div>
            <div className="relative flex flex-wrap gap-4 items-center">
              {singleBorderColors.map(c => {
                const isActive = singleBorderColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSingleBorderColor(c.hex)}
                    className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'border-[3px] border-[#c19b38] ring-2 ring-offset-2 ring-[#c19b38]/50 scale-110 shadow-md'
                        : 'border border-gray-200 hover:scale-105 shadow-xs'
                    }`}
                    style={{ backgroundColor: c.hex === 'transparent' ? '#f8f8f8' : c.hex }}
                    title={c.name}
                  >
                    {c.hex === 'transparent' && <span className="text-[8px] font-bold text-gray-400">NONE</span>}
                  </button>
                );
              })}

              {/* Circular Dashed Button with + icon for Single Border */}
              <div className="relative w-9 h-9">
                <button
                  type="button"
                  onClick={() => setOpenPicker(openPicker === 'single' ? null : 'single')}
                  className={`w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                    openPicker === 'single' || isCustomSingle
                      ? 'border-[#c19b38] text-[#c19b38] bg-amber-50/50 scale-105 ring-2 ring-[#c19b38]/30 shadow-xs'
                      : 'border-gray-300 text-gray-400 hover:border-[#c19b38] hover:text-[#c19b38] hover:scale-105'
                  }`}
                  title="Pick custom single border color"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
                {renderPalette(setSingleBorderColor, 'single', singleBorderColor)}
              </div>
            </div>
          </div>

          {/* 3. Double Border Select */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">
                3. DOUBLE BORDER COLOR
              </label>
              <span className="text-[11px] font-mono font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                {doubleBorderColor === 'transparent' ? 'NONE' : doubleBorderColor.toUpperCase()}
              </span>
            </div>
            <div className="relative flex flex-wrap gap-4 items-center">
              {doubleBorderColors.map(c => {
                const isActive = doubleBorderColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setDoubleBorderColor(c.hex)}
                    className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'border-[3px] border-[#c19b38] ring-2 ring-offset-2 ring-[#c19b38]/50 scale-110 shadow-md'
                        : 'border border-gray-200 hover:scale-105 shadow-xs'
                    }`}
                    style={{ backgroundColor: c.hex === 'transparent' ? '#f8f8f8' : c.hex }}
                    title={c.name}
                  >
                    {c.hex === 'transparent' && <span className="text-[8px] font-bold text-gray-400">NONE</span>}
                  </button>
                );
              })}

              {/* Circular Dashed Button with + icon for Double Border */}
              <div className="relative w-9 h-9">
                <button
                  type="button"
                  onClick={() => setOpenPicker(openPicker === 'double' ? null : 'double')}
                  className={`w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                    openPicker === 'double' || isCustomDouble
                      ? 'border-[#c19b38] text-[#c19b38] bg-amber-50/50 scale-105 ring-2 ring-[#c19b38]/30 shadow-xs'
                      : 'border-gray-300 text-gray-400 hover:border-[#c19b38] hover:text-[#c19b38] hover:scale-105'
                  }`}
                  title="Pick custom double border color"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
                {renderPalette(setDoubleBorderColor, 'double', doubleBorderColor)}
              </div>
            </div>
          </div>

          {/* 4. Embroidery Text Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">
              4. EMBROIDERY TEXT
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="CLASS OF 2026"
              className="w-full bg-gray-50/80 border border-gray-200 text-gray-900 rounded-[14px] px-5 py-3 text-sm font-semibold focus:outline-none focus:border-[#c19b38] focus:bg-white transition-all shadow-xs focus:shadow-md uppercase tracking-wider"
            />
          </div>

          {/* 5. Font Style Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">
              5. FONT STYLE
            </label>
            <div className="flex gap-3">
              {['Serif', 'Modern', 'Classic'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFontStyle(f)}
                  className={`flex-1 rounded-[12px] py-2.5 text-sm transition-all duration-200 cursor-pointer ${
                    fontStyle === f 
                      ? 'bg-gray-900 border border-gray-900 text-white shadow-md font-bold' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400 font-medium'
                  }`}
                >
                  {f}
                </button>
              ))}
              <div className="relative w-[3.25rem]">
                <button
                  type="button"
                  onClick={() => setOpenPicker(openPicker === 'font' ? null : 'font')}
                  className={`w-full h-full flex items-center justify-center rounded-[12px] border transition-colors outline-none focus:outline-none cursor-pointer ${
                    !['Serif', 'Modern', 'Classic'].includes(fontStyle)
                      ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                      : 'border-gray-200 text-gray-400 hover:border-[#c19b38] hover:text-[#c19b38] bg-white'
                  }`}
                  title="More fonts"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
                {renderFontPalette()}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-2 pt-5 border-t border-gray-100 flex flex-col items-center gap-3">
            <button 
              type="button"
              onClick={() => {
                if (onEnquireCustom) {
                  onEnquireCustom({ baseColor, singleBorderColor, doubleBorderColor, text, fontStyle });
                }
              }}
              className="w-full bg-[#b8860b] hover:bg-[#a07409] text-white rounded-xl py-3.5 h-12 font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              {buttonLabel || "ADD CUSTOM DESIGN TO QUOTE / CART"}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
