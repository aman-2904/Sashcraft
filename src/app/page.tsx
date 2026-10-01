import Image from "next/image";
import { Crown, Wand2, ArrowRight, Ribbon, GraduationCap, Shirt, ShoppingBag, Flag, Gem, PenLine, Plane, Package, Star } from "lucide-react";
import Customizer from "@/components/Customizer/Customizer";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[#fdfbfb]">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-[#fdfbfb] to-[#f4f1ea] pt-32 pb-16 px-8 md:px-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative">

        {/* Left Side: Content */}
        <div className="flex-1 flex flex-col items-start z-10">
          {/* Badge */}
          <div className="flex items-center gap-2 bg-white border border-[#dfad2d]/30 text-[#b8860b] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-8 shadow-sm">
            <Crown size={14} strokeWidth={2.5} />
            HANDCRAFTED ARTISANAL EXCELLENCE
          </div>

          {/* Headline */}
          <h1 className="text-[4rem] lg:text-[4.5rem] font-bold leading-[1.1] mb-6 font-serif">
            <span className="text-[#1a1a1a]">Crafting Memories</span><br />
            <span className="text-[#c19b38]">In Every Thread</span>
          </h1>

          {/* Paragraph */}
          <p className="text-gray-600 text-[1.1rem] leading-relaxed max-w-xl mb-10">
            SashCraft designs bespoke sashes, ceremonial stoles, academic gowns, eco totes, custom flags, aprons, caps, and custom apparel designed for your finest milestones.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-5 mb-16">
            <button className="bg-[#b8860b] hover:bg-[#a07409] text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 transition-all shadow-[0_8px_20px_rgba(184,134,11,0.3)] hover:-translate-y-1">
              <Wand2 size={18} strokeWidth={2.5} />
              LAUNCH CUSTOMIZER STUDIO
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 transition-all shadow-sm hover:-translate-y-1">
              Explore Collection
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-12 border-t border-gray-200/60 pt-8 w-full max-w-xl">
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-bold text-[#b8860b]">50K<span className="text-[#dfad2d] text-2xl">+</span></span>
              <span className="text-xs text-gray-500 font-semibold mt-1">Sashes Handcrafted</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-bold text-[#b8860b]">99.8<span className="text-[#dfad2d] text-2xl">%</span></span>
              <span className="text-xs text-gray-500 font-semibold mt-1">Satisfaction Rate</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-bold text-[#b8860b]">120<span className="text-[#dfad2d] text-2xl">+</span></span>
              <span className="text-xs text-gray-500 font-semibold mt-1">University Partners</span>
            </div>
          </div>
        </div>

        {/* Right Side: Image Card */}
        <div className="flex-1 relative w-full max-w-lg z-10 flex justify-end">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] p-4 w-full h-[550px] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative flex flex-col items-center justify-center overflow-hidden">

            {/* Inner background frame */}
            <div className="absolute inset-4 bg-[#fcfbfa] rounded-[28px] border border-white"></div>

            {/* Generated Sash Image */}
            <div className="relative z-10 w-[90%] h-[90%] flex items-center justify-center">
              <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-700 ease-in-out">
                <Image
                  src="/hero-sash.jpg"
                  alt="Custom Satin Honor Stole"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>

      {/* Categories Section */}
      <section className="w-full max-w-[1400px] mx-auto px-8 md:px-16 pt-12 pb-16 flex flex-col items-center">
        {/* Heading */}
        <div className="text-center mb-14">
          <h3 className="text-[#b8860b] text-[11px] font-bold tracking-widest uppercase mb-4">ARTISANAL OFFERINGS</h3>
          <h2 className="text-4xl md:text-[2.75rem] font-serif font-bold text-gray-900 mb-4 tracking-tight">Explore Our Categories</h2>
          <p className="text-gray-500 text-[1.1rem]">From graduation milestones to promotional merchandise, explore our tailored product lines.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
          {/* Card 1 */}
          <div className="group bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-[#c19b38] hover:shadow-[0_8px_30px_rgba(193,155,56,0.15)]">
            <div className="w-16 h-16 bg-[#fdfaf2] rounded-[20px] flex items-center justify-center text-[#c19b38] mb-5 shadow-sm border border-[#c19b38]/10 transition-colors duration-300 group-hover:bg-[#c19b38] group-hover:text-white">
              <Ribbon size={26} strokeWidth={2.5} />
            </div>
            <h4 className="text-[17px] font-bold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-[#c19b38]">Sashes & Stoles</h4>
            <p className="text-[12px] text-gray-400 font-semibold tracking-wide">Graduation & Pageant</p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-[#c19b38] hover:shadow-[0_8px_30px_rgba(193,155,56,0.15)]">
            <div className="w-16 h-16 bg-[#fdfaf2] rounded-[20px] flex items-center justify-center text-[#c19b38] mb-5 shadow-sm border border-[#c19b38]/10 transition-colors duration-300 group-hover:bg-[#c19b38] group-hover:text-white">
              <GraduationCap size={26} strokeWidth={2.5} />
            </div>
            <h4 className="text-[17px] font-bold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-[#c19b38]">Gowns & Caps</h4>
            <p className="text-[12px] text-gray-400 font-semibold tracking-wide">Academic Regalia</p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-[#c19b38] hover:shadow-[0_8px_30px_rgba(193,155,56,0.15)]">
            <div className="w-16 h-16 bg-[#fdfaf2] rounded-[20px] flex items-center justify-center text-[#c19b38] mb-5 shadow-sm border border-[#c19b38]/10 transition-colors duration-300 group-hover:bg-[#c19b38] group-hover:text-white">
              <Shirt size={26} strokeWidth={2.5} />
            </div>
            <h4 className="text-[17px] font-bold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-[#c19b38]">Custom Wear</h4>
            <p className="text-[12px] text-gray-400 font-semibold tracking-wide">T-Shirts & Aprons</p>
          </div>

          {/* Card 4 */}
          <div className="group bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-[#c19b38] hover:shadow-[0_8px_30px_rgba(193,155,56,0.15)]">
            <div className="w-16 h-16 bg-[#fdfaf2] rounded-[20px] flex items-center justify-center text-[#c19b38] mb-5 shadow-sm border border-[#c19b38]/10 transition-colors duration-300 group-hover:bg-[#c19b38] group-hover:text-white">
              <ShoppingBag size={26} strokeWidth={2.5} />
            </div>
            <h4 className="text-[17px] font-bold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-[#c19b38]">Eco Bags</h4>
            <p className="text-[12px] text-gray-400 font-semibold tracking-wide">Canvas & Jute Totes</p>
          </div>

          {/* Card 5 */}
          <div className="group bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-[#c19b38] hover:shadow-[0_8px_30px_rgba(193,155,56,0.15)]">
            <div className="w-16 h-16 bg-[#fdfaf2] rounded-[20px] flex items-center justify-center text-[#c19b38] mb-5 shadow-sm border border-[#c19b38]/10 transition-colors duration-300 group-hover:bg-[#c19b38] group-hover:text-white">
              <Flag size={26} strokeWidth={2.5} />
            </div>
            <h4 className="text-[17px] font-bold text-gray-900 mb-1 transition-colors duration-300 group-hover:text-[#c19b38]">Flags & Banners</h4>
            <p className="text-[12px] text-gray-400 font-semibold tracking-wide">Fabric & Pennants</p>
          </div>
        </div>
      </section>

      {/* Live Customizer Studio Section */}
      <Customizer />

      {/* Features Section */}
      <section className="w-full bg-[#f9f8f6] px-8 md:px-16 py-16 flex justify-center">
        <div className="max-w-[1400px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 shrink-0 bg-[#fdfaf2] rounded-xl flex items-center justify-center text-[#c19b38]">
              <Gem size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-gray-900 font-bold mb-1 text-[15px]">Premium Fabrics</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">High-grade satin, organic cotton, and heavy-duty jute.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 shrink-0 bg-[#fdfaf2] rounded-xl flex items-center justify-center text-[#c19b38]">
              <PenLine size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-gray-900 font-bold mb-1 text-[15px]">Precision Embroidery</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">State-of-the-art stitching for sharp crests and letters.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 shrink-0 bg-[#fdfaf2] rounded-xl flex items-center justify-center text-[#c19b38]">
              <Plane size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-gray-900 font-bold mb-1 text-[15px]">Express Delivery</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">Fast worldwide shipping options for event deadlines.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 shrink-0 bg-[#fdfaf2] rounded-xl flex items-center justify-center text-[#c19b38]">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-gray-900 font-bold mb-1 text-[15px]">Low MOQ & Bulk Discounts</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">Single custom pieces or scaled orders for institutes.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-[#fdfbfb] px-8 md:px-16 py-20 flex flex-col items-center">
        {/* Heading */}
        <div className="text-center mb-14">
          <h3 className="text-[#b8860b] text-[11px] font-bold tracking-widest uppercase mb-4">CLIENT TESTIMONIALS</h3>
          <h2 className="text-4xl md:text-[2.75rem] font-serif font-bold text-gray-900 tracking-tight">Trusted by Graduates & Organizations</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px]">
          {/* Card 1 */}
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1">
            <div>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#c19b38" stroke="none" />
                ))}
              </div>
              <p className="text-gray-500 italic leading-relaxed text-[15px] mb-8">
                "The graduation sashes for our honor society turned out phenomenal! The gold embroidery on royal navy was vibrant and crisp."
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                ES
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-sm">Dr. Elena Rostova</span>
                <span className="text-xs text-gray-400 font-medium">University Event Director</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1">
            <div>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#c19b38" stroke="none" />
                ))}
              </div>
              <p className="text-gray-500 italic leading-relaxed text-[15px] mb-8">
                "Ordered 200 custom eco jute bags for our eco-summit. Exceptional print quality and delivered well ahead of schedule."
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#14532d] text-white flex items-center justify-center font-bold text-sm">
                MK
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-sm">Marcus Sterling</span>
                <span className="text-xs text-gray-400 font-medium">Corporate Brand Manager</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1">
            <div>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#c19b38" stroke="none" />
                ))}
              </div>
              <p className="text-gray-500 italic leading-relaxed text-[15px] mb-8">
                "The Live Customizer Studio made designing my pageant stole so effortless! The font preview was accurate to the final product."
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold text-sm">
                CL
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-sm">Clara Laurent</span>
                <span className="text-xs text-gray-400 font-medium">Pageant Winner 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
