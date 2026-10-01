"use client";

import { useState } from "react";
import { ShoppingCart, Plus } from "lucide-react";

export default function Customizer() {
  const [baseColor, setBaseColor] = useState("#111111");
  const [singleBorderColor, setSingleBorderColor] = useState("#c42323");
  const [doubleBorderColor, setDoubleBorderColor] = useState("#d7be82");
  const [text, setText] = useState("CLASS OF 2026");
  const [fontStyle, setFontStyle] = useState("Serif"); // Serif, Modern, Classic
  const [openPicker, setOpenPicker] = useState<string | null>(null);

  // Extended color palette for the grid
  const extendedPalette = [
    // Greys/Neutrals
    "#ffffff", "#f2f2f2", "#d9d9d9", "#bfbfbf", "#a6a6a6", "#737373", "#404040", "#000000",
    // Reds
    "#ffebeb", "#ffc2c2", "#ff9999", "#ff4d4d", "#ff0000", "#cc0000", "#990000", "#660000",
    // Oranges
    "#fff0e6", "#ffcc99", "#ffa366", "#ff7733", "#ff5500", "#cc4400", "#993300", "#662200",
    // Yellows
    "#ffffe6", "#ffffb3", "#ffff80", "#ffff4d", "#ffff00", "#cccc00", "#999900", "#666600",
    // Greens
    "#e6ffe6", "#99ff99", "#4dff4d", "#00ff00", "#00cc00", "#009900", "#006600", "#003300",
    // Cyans/Teals
    "#e6ffff", "#99ffff", "#4dffff", "#00ffff", "#00cccc", "#009999", "#006666", "#003333",
    // Blues
    "#e6f0ff", "#b3d1ff", "#80b3ff", "#4d94ff", "#1a75ff", "#005ce6", "#0044cc", "#002266",
    // Purples
    "#f2e6ff", "#d9b3ff", "#bf80ff", "#a64dff", "#8c1aff", "#7300e6", "#5900b3", "#400080",
    // Pinks
    "#ffe6f2", "#ffb3d9", "#ff80bf", "#ff4da6", "#ff1a8c", "#e60073", "#b30059", "#800040",
  ];

  const renderPalette = (onSelect: (color: string) => void, id: string) => {
    if (openPicker !== id) return null;
    return (
      <div className="absolute top-12 left-0 z-50 bg-white p-3 rounded-xl shadow-2xl border border-gray-100 grid grid-cols-8 gap-1 w-max">
        {extendedPalette.map(color => (
          <button 
            key={color}
            onClick={(e) => { 
              e.stopPropagation();
              onSelect(color); 
              setOpenPicker(null); 
            }}
            className="w-5 h-5 rounded-[3px] hover:scale-125 transition-transform shadow-sm border border-black/5"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    );
  };

  // Base colors mapping
  const baseColors = [
    { name: "Black", hex: "#111111" },
    { name: "White", hex: "#ffffff" },
    { name: "Navy Blue", hex: "#0f172a" },
    { name: "Forest Green", hex: "#14532d" },
    { name: "Burgundy", hex: "#7f1d1d" },
  ];

  const singleBorderColors = [
    { name: "Red", hex: "#c42323" },
    { name: "Gold", hex: "#c19b38" },
    { name: "White", hex: "#ffffff" },
    { name: "Silver", hex: "#94a3b8" },
  ];

  const doubleBorderColors = [
    { name: "Champagne", hex: "#d7be82" },
    { name: "Gold", hex: "#c19b38" },
    { name: "Silver", hex: "#94a3b8" },
    { name: "None", hex: "transparent" },
  ];

  const getFontFamily = () => {
    switch (fontStyle) {
      case "Modern": return "font-sans font-bold tracking-[0.3em]";
      case "Classic": return "font-serif italic font-semibold tracking-widest";
      default: return "font-serif font-bold tracking-widest";
    }
  };

  return (
    <section className="w-full bg-[#fdfbfb] px-8 md:px-16 pt-8 pb-16 flex flex-col items-center">
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
                backgroundColor: baseColor,
                border: `6px solid ${singleBorderColor}`,
                outline: doubleBorderColor !== 'transparent' ? `4px solid ${doubleBorderColor}` : 'none',
                outlineOffset: '-10px',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px',
                borderTopLeftRadius: '6px',
                borderTopRightRadius: '6px'
              }}
            >
              <div
                className={`text-[#c19b38] text-[1.6rem] leading-none flex flex-col items-center justify-center gap-1 transition-all duration-300 drop-shadow-md py-8 ${getFontFamily()}`}
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
              >
                {text.toUpperCase() || " "}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between mt-6 px-4 text-[14px]">
            <div className="text-gray-500">
              Selected Item: <span className="font-bold text-gray-900">Custom Graduation Sash</span>
            </div>
            <div className="text-gray-500">
              Estimated Price: <span className="font-bold text-[#c19b38]">$79.00</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex-1 bg-white border border-gray-100 rounded-[2rem] p-6 lg:p-8 flex flex-col gap-5 shadow-md">

          {/* Base Color Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">1. BASE COLOR</label>
            <div className="relative flex flex-wrap gap-4">
              {baseColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setBaseColor(c.hex)}
                  className={`w-9 h-9 rounded-full border-[3px] transition-all duration-200 ${baseColor === c.hex ? 'border-[#c19b38] scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              <div className="relative w-9 h-9 group">
                <button 
                  onClick={() => setOpenPicker(openPicker === 'base' ? null : 'base')}
                  className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 group-hover:border-[#c19b38] group-hover:text-[#c19b38] transition-colors bg-white outline-none focus:outline-none z-10"
                  title="Pick custom base color"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
                {renderPalette(setBaseColor, 'base')}
              </div>
            </div>
          </div>

          {/* Single Border Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">2. SINGLE BORDER COLOR</label>
            <div className="relative flex flex-wrap gap-4">
              {singleBorderColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSingleBorderColor(c.hex)}
                  className={`w-9 h-9 rounded-full border-[3px] transition-all duration-200 ${singleBorderColor === c.hex ? 'border-[#c19b38] scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              <div className="relative w-9 h-9 group">
                <button 
                  onClick={() => setOpenPicker(openPicker === 'single' ? null : 'single')}
                  className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 group-hover:border-[#c19b38] group-hover:text-[#c19b38] transition-colors bg-white outline-none focus:outline-none z-10"
                  title="Pick custom single border color"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
                {renderPalette(setSingleBorderColor, 'single')}
              </div>
            </div>
          </div>

          {/* Double Border Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">3. DOUBLE BORDER COLOR</label>
            <div className="relative flex flex-wrap gap-4 items-center">
              {doubleBorderColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setDoubleBorderColor(c.hex)}
                  className={`w-9 h-9 rounded-full border-[3px] transition-all duration-200 flex items-center justify-center ${doubleBorderColor === c.hex ? 'border-[#c19b38] scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'}`}
                  style={{ backgroundColor: c.hex === 'transparent' ? '#f8f8f8' : c.hex }}
                  title={c.name}
                >
                  {c.hex === 'transparent' && <span className="text-[8px] font-bold text-gray-400">NONE</span>}
                </button>
              ))}
              <div className="relative w-9 h-9 group">
                <button 
                  onClick={() => setOpenPicker(openPicker === 'double' ? null : 'double')}
                  className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 group-hover:border-[#c19b38] group-hover:text-[#c19b38] transition-colors bg-white outline-none focus:outline-none z-10"
                  title="Pick custom double border color"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
                {renderPalette(setDoubleBorderColor, 'double')}
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">4. EMBROIDERY TEXT</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter custom text..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-[14px] px-5 py-3 text-sm font-semibold focus:outline-none focus:border-[#c19b38] focus:bg-white transition-all shadow-sm focus:shadow-md"
            />
          </div>

          {/* Font Style Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-[#c19b38] text-[10.5px] font-bold tracking-widest uppercase">5. FONT STYLE</label>
            <div className="flex gap-3">
              {['Serif', 'Modern', 'Classic'].map(f => (
                <button
                  key={f}
                  onClick={() => setFontStyle(f)}
                  className={`flex-1 rounded-[12px] py-2.5 text-sm transition-all duration-200 ${fontStyle === f ? 'bg-gray-900 border border-gray-900 text-white shadow-md font-bold' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400 font-medium'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-2 pt-5 border-t border-gray-100 flex flex-col items-center gap-3">
            <button className="w-full bg-[#b8860b] hover:bg-[#a07409] text-white rounded-xl py-3.5 h-12 font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg">
              <ShoppingCart size={18} strokeWidth={2.5} />
              ADD CUSTOM DESIGN TO CART
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
