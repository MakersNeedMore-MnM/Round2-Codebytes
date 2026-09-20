// frontend/src/components/HomePage.jsx
import React, { useState } from 'react';
import { 
  Radio, 
  Store, 
  ShoppingBag, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function HomePage({ onSelectRole, merchants = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('Food & Beverage');
  const activeMerchantsCount = merchants.length || 3;

  return (
    <div className="w-full bg-[#F4F1DE] text-[#0D1B2A] min-h-screen selection:bg-[#D4C4A8] selection:text-[#0D1B2A] pb-24 font-sans antialiased">
      {/* 1. Header Navigation */}
      <nav className="border-b border-[#D4C4A8] bg-[#F4F1DE]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#0D1B2A] text-[#F4F1DE] flex items-center justify-center shadow-md shadow-[#0D1B2A]/15">
            <Radio size={19} className="animate-pulse text-[#778D7A]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#0D1B2A]">
              Local<span className="text-[#415A77]">Ops</span>
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider text-[#1B263B] bg-[#E9E4CB] border border-[#D4C4A8] px-2.5 py-0.5 rounded-full ml-2">
            Perimeter Radar v1.0
          </span>
        </div>

        {/* Symmetric Buyer & Merchant Buttons */}
        <div className="flex items-center gap-3">
          {/* Buyer Portal Button - Styled to match Merchant */}
          <button
            onClick={() => onSelectRole('customer')}
            className="text-xs font-bold bg-[#FFFFFF] hover:bg-[#E9E4CB] text-[#0D1B2A] border border-[#0D1B2A]/20 px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingBag size={14} className="text-[#415A77]" />
            <span>Buyer Portal</span>
          </button>

          {/* Merchant Portal Button */}
          <button
            onClick={() => onSelectRole('merchant')}
            className="text-xs font-bold bg-[#0D1B2A] hover:bg-[#1B263B] text-[#F4F1DE] px-4 py-2.5 rounded-xl shadow-md shadow-[#0D1B2A]/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Store size={14} className="text-[#778D7A]" />
            <span>Merchant Portal</span>
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4C4A8] bg-[#E9E4CB] text-[#1B263B] text-xs font-bold mb-6 shadow-xs">
          <Sparkles size={13} className="text-[#415A77]" />
          <span>Hyperlocal Reverse Marketplace</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0D1B2A] leading-[1.2]">
          Stop calling vendors. <br />
          <span className="text-[#415A77]">
            Let your 4 km perimeter fulfill your demand.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#415A77] max-w-xl mx-auto mt-4 leading-relaxed font-normal">
          Post bulk requirements for tiffin, catering, or print batches. Nearby verified neighborhood businesses in your radius receive your ping and claim your order directly.
        </p>

        {/* Symmetrical Dual Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mt-10 text-left">
          {/* Buyer Gateway Card */}
          <div 
            onClick={() => onSelectRole('customer')}
            className="p-7 rounded-3xl bg-[#FFFFFF] border-2 border-[#D4C4A8] hover:border-[#415A77] hover:shadow-xl hover:shadow-[#0D1B2A]/5 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#F4F1DE] text-[#0D1B2A] flex items-center justify-center border border-[#D4C4A8] group-hover:bg-[#0D1B2A] group-hover:text-[#F4F1DE] transition">
                  <ShoppingBag size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#415A77] bg-[#E9E4CB] px-2.5 py-1 rounded-full border border-[#D4C4A8]">
                  Post Bulk Demands
                </span>
              </div>
              <h3 className="text-lg font-black text-[#0D1B2A]">
                I Need Bulk Supplies
              </h3>
              <p className="text-xs text-[#415A77] mt-2 mb-4 leading-relaxed">
                Order 50 snacks, tea flasks, or 120 hackathon badges. Set your target budget and broadcast to local vendors.
              </p>
            </div>

            <div className="pt-2 border-t border-[#D4C4A8]/40 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D1B2A] flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Broadcast a Requirement</span>
                <ChevronRight size={15} className="text-[#415A77]" />
              </span>
              <span className="text-[11px] font-bold text-[#778D7A] bg-[#778D7A]/10 px-2 py-0.5 rounded-md">
                Fast Response
              </span>
            </div>
          </div>

          {/* Merchant Gateway Card */}
          <div 
            onClick={() => onSelectRole('merchant')}
            className="p-7 rounded-3xl bg-[#FFFFFF] border-2 border-[#D4C4A8] hover:border-[#778D7A] hover:shadow-xl hover:shadow-[#0D1B2A]/5 transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#F4F1DE] text-[#0D1B2A] flex items-center justify-center border border-[#D4C4A8] group-hover:bg-[#0D1B2A] group-hover:text-[#F4F1DE] transition">
                  <Store size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#778D7A] bg-[#778D7A]/10 px-2.5 py-1 rounded-full border border-[#778D7A]/30">
                  Claim Perimeter Orders
                </span>
              </div>
              <h3 className="text-lg font-black text-[#0D1B2A]">
                I am a Local Merchant
              </h3>
              <p className="text-xs text-[#415A77] mt-2 mb-4 leading-relaxed">
                Run a local kitchen, print shop, or store? Open your dispatch radar to receive and claim bulk orders within 3 km.
              </p>
            </div>

            <div className="pt-2 border-t border-[#D4C4A8]/40 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D1B2A] flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Open Merchant Radar</span>
                <ChevronRight size={15} className="text-[#778D7A]" />
              </span>
              <span className="text-[11px] font-bold text-[#0D1B2A] bg-[#E9E4CB] px-2 py-0.5 rounded-md">
                0% Commission
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mechanics Showcase */}
      <section className="max-w-4xl mx-auto px-6 mt-6">
        <div className="bg-[#FFFFFF] border border-[#D4C4A8] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4C4A8]/40 pb-5 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#415A77]">
                Spatial Engine Workflow
              </span>
              <h3 className="text-lg font-bold text-[#0D1B2A] mt-0.5">
                How Reverse Dispatch Works
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCategory('Food & Beverage')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  selectedCategory === 'Food & Beverage'
                    ? 'bg-[#0D1B2A] text-[#F4F1DE]'
                    : 'bg-[#F4F1DE] text-[#415A77] hover:bg-[#E9E4CB]'
                }`}
              >
                Food & Beverage
              </button>
              <button
                onClick={() => setSelectedCategory('Printing & Banners')}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  selectedCategory === 'Printing & Banners'
                    ? 'bg-[#0D1B2A] text-[#F4F1DE]'
                    : 'bg-[#F4F1DE] text-[#415A77] hover:bg-[#E9E4CB]'
                }`}
              >
                Printing
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-[#F4F1DE] border border-[#D4C4A8]">
              <div className="text-[#415A77] font-bold text-xs mb-1">01. Dynamic Need Pin</div>
              <p className="text-xs text-[#0D1B2A] font-bold">50× Snacks & Samosas</p>
              <p className="text-[11px] text-[#415A77] mt-1">₹85/plate target • Needed in 24 hrs</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F1DE] border border-[#D4C4A8]">
              <div className="text-[#415A77] font-bold text-xs mb-1">02. Spatial Calculation</div>
              <p className="text-xs text-[#0D1B2A] font-bold">Merchants within 3.0 km</p>
              <p className="text-[11px] text-[#415A77] mt-1">Haversine formula perimeter filtering</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F1DE] border border-[#D4C4A8]">
              <div className="text-[#778D7A] font-bold text-xs mb-1">03. Direct Handshake</div>
              <p className="text-xs text-[#0D1B2A] font-bold">Asha Tiffin Claims</p>
              <p className="text-[11px] text-[#778D7A] mt-1 font-bold">Direct WhatsApp & Call handshake</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#F4F1DE] rounded-2xl border border-[#D4C4A8] text-center text-xs">
            <div>
              <span className="block text-[#415A77] text-[10px] uppercase font-bold">Live Providers</span>
              <strong className="text-[#0D1B2A] text-sm">{activeMerchantsCount} Verified</strong>
            </div>
            <div>
              <span className="block text-[#415A77] text-[10px] uppercase font-bold">Service Range</span>
              <strong className="text-[#0D1B2A] text-sm">3.0 to 5.0 km</strong>
            </div>
            <div>
              <span className="block text-[#415A77] text-[10px] uppercase font-bold">Commission</span>
              <strong className="text-[#778D7A] text-sm">0% Direct</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}