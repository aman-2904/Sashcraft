'use client';

import React, { useState } from 'react';
import { X, Send, MessageCircle, CheckCircle2, ShieldCheck, Calendar, Building, Phone, Mail, User, Sparkles } from 'lucide-react';
import { SatinSashProductConfig, VariantDetails, ProductColor } from '@/data/satinSashData';
import { supabase } from '@/utils/supabase/client';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: SatinSashProductConfig;
  variant: VariantDetails;
  selectedColor: ProductColor;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountSaved: number;
  initialNotes?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  product,
  variant,
  selectedColor,
  quantity,
  unitPrice,
  totalPrice,
  discountSaved,
  initialNotes = '',
}: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    organization: '',
    eventDate: '',
    customNotes: initialNotes || '',
  });

  React.useEffect(() => {
    if (initialNotes) {
      setFormData((prev) => ({ ...prev, customNotes: initialNotes }));
    }
  }, [initialNotes]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateRef = () => `SC-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const refCode = generateRef();
    setEnquiryRef(refCode);

    const nowIso = new Date().toISOString();
    const payload = {
      reference_id: refCode,
      product_name: product.title,
      variant: variant.name,
      color: selectedColor.name,
      quantity: Number(quantity) || 1,
      unit_price: Number(unitPrice) || 0,
      total_price: Number(totalPrice) || 0,
      customer_name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      organization: formData.organization.trim() || null,
      event_date: formData.eventDate || null,
      notes: formData.customNotes.trim() || null,
      status: 'pending',
      created_at: nowIso,
    };

    let insertedId: string | null = null;

    try {
      // 1. Store directly in Supabase table 'enquiries'
      const { data, error } = await supabase
        .from('enquiries')
        .insert([payload])
        .select();

      if (error) {
        console.warn('Supabase enquiry insert warning:', error.message);
      } else if (data && data[0]) {
        insertedId = data[0].id?.toString() || null;
      }
    } catch (err) {
      console.warn('Supabase connection warning, recorded locally:', err);
    } finally {
      // 2. Always store full detailed record locally for zero-latency admin dashboard visibility
      const detailedRecord = {
        ...payload,
        id: insertedId || `local-${Date.now()}`,
        ref: refCode,
        date: nowIso,
        product: product.title,
        unitPrice: Number(unitPrice) || 0,
        totalPrice: Number(totalPrice) || 0,
        fullName: formData.fullName.trim(),
        customNotes: formData.customNotes.trim(),
        eventDate: formData.eventDate,
      };

      try {
        const stored = JSON.parse(localStorage.getItem('sashcraft_enquiries') || '[]');
        // Prepend to top of list
        stored.unshift(detailedRecord);
        localStorage.setItem('sashcraft_enquiries', JSON.stringify(stored));

        // 3. Emit real-time intra-window & cross-tab events
        window.dispatchEvent(
          new CustomEvent('sashcraft_new_enquiry', { detail: detailedRecord })
        );

        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('sashcraft_enquiries_channel');
          bc.postMessage(detailedRecord);
          bc.close();
        }
      } catch (e) {
        console.error('LocalStorage write error:', e);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleWhatsAppEnquiry = () => {
    const text = `*New Order Enquiry - SashCraft*%0A%0A` +
      `*Product:* ${product.title}%0A` +
      `*Variant:* ${variant.name}%0A` +
      `*Color:* ${selectedColor.name}%0A` +
      `*Quantity:* ${quantity} units%0A` +
      `*Unit Price:* ${product.currency.symbol}${unitPrice}%0A` +
      `*Total Estimate:* ${product.currency.symbol}${totalPrice}%0A` +
      (formData.fullName ? `*Name:* ${formData.fullName}%0A` : '') +
      (formData.organization ? `*Org / College:* ${formData.organization}%0A` : '') +
      (formData.eventDate ? `*Event Date:* ${formData.eventDate}%0A` : '') +
      (formData.customNotes ? `*Custom Notes:* ${formData.customNotes}%0A` : '') +
      `%0APlease share availability, mockups and dispatch schedule.`;

    const whatsappUrl = `https://wa.me/919876543210?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#2a2418] to-[#1a1a1a] px-6 py-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#b8860b]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#dfad2d]/20 border border-[#dfad2d]/40 flex items-center justify-center text-[#dfad2d]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Request Custom Quote & Samples
              </h3>
              <p className="text-xs text-[#dfad2d] font-medium tracking-wide">
                Direct Artisanal Pricing • Dedicated Concierge Support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors relative z-10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Order Summary Strip */}
          <div className="bg-[#fdfaf2] border border-[#dfad2d]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">{product.title}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#dfad2d]/20 text-[#a87e14] border border-[#dfad2d]/30">
                  {variant.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block border border-gray-400" style={{ backgroundColor: selectedColor.hex }} />
                  {selectedColor.name}
                </span>
                <span>•</span>
                <span>Qty: <strong className="text-gray-900">{quantity} units</strong></span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-lg font-serif font-bold text-gray-900">
                {product.currency.symbol}{totalPrice.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-500">
                ({product.currency.symbol}{unitPrice} / unit)
                {discountSaved > 0 && (
                  <span className="text-emerald-700 font-semibold ml-1">
                    • Saved {product.currency.symbol}{discountSaved}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isSubmitted ? (
            /* Success State */
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  Enquiry Successfully Received!
                </h4>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-gray-900">{formData.fullName || 'Valued Customer'}</span>. Your enquiry reference number is:
                </p>
                <div className="inline-block mt-3 px-4 py-2 bg-gray-100 rounded-xl font-mono font-bold text-gray-900 tracking-wider text-base border border-gray-200">
                  {enquiryRef}
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs text-amber-900 space-y-2">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#b8860b]" /> What happens next?
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Our sash production specialist will review your specifications.</li>
                  <li>We will share digital embroidery mockups & custom fabric swatches.</li>
                  <li>You will receive an official invoice quote via WhatsApp & Email within 2 business hours.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppEnquiry}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle size={18} /> Chat Directly on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Dr. Aryan Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    WhatsApp / Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@university.edu / gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Organization / University Name
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="organization"
                      placeholder="e.g. Delhi University / Rotary Club"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Target Event / Convocation Date (Optional)
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Embroidery Text, Logo Requests or Special Requirements
                </label>
                <textarea
                  name="customNotes"
                  rows={3}
                  placeholder="e.g. Gold thread lettering 'CLASS OF 2026' on left side, university crest embroidered on right side. Need delivery before Nov 15th."
                  value={formData.customNotes}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#dfad2d] focus:bg-white transition-all text-gray-900 resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 bg-gradient-to-r from-[#b8860b] to-[#dfad2d] hover:from-[#a07409] hover:to-[#c19b38] text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#dfad2d]/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Submitting Enquiry...' : 'Submit Official Enquiry'}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppEnquiry}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
                >
                  <MessageCircle size={18} />
                  WhatsApp Us
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck size={14} className="text-gray-400" />
                No obligation quote • Fast responses within 2 business hours • Privacy protected
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
