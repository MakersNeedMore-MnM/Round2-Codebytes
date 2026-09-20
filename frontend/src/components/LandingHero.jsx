// frontend/src/components/LandingHero.jsx
import React, { useState } from 'react';
import { 
  Radio, 
  MapPin, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  Store, 
  Users, 
  CheckCircle2 
} from 'lucide-react';

export default function LandingHero({ onOpenAuth }) {
  // Interactive Simulation State
  const [simRadius, setSimRadius] = useState(3.5);
  const [simItem, setSimItem] = useState('catering');

  const simulatedMatches = {
    catering: [
      { name: 'Asha Tiffin & Snacks', dist: '1.2 km', time: '18 min response', capacity: '80 packs' },
      { name: 'Green Leaf Juice & Bakery', dist: '2.4 km', time: '35 min response', capacity: '40 packs' }
    ],
    printing: [
      { name: 'Bangalore Quick Print & Banners', dist: '1.8 km', time: '12 min response', capacity: '300 standees' }
    ]
  };

  return (
    <div className="w-full bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* 1. Hero Section with Glows */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Radio size={14} className="animate-pulse text-indigo-400" />
            <span>The Hyperlocal Reverse Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-50 leading-[1.1]">
            Stop hunting vendors. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">
              Let your perimeter compete for you.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Drop an itemized demand pin for bulk catering, batch printing, or quick freight. Verified neighborhood merchants within 4 km receive your ticket and claim it instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenAuth('customer')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Broadcast a Requirement</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onOpenAuth('merchant')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-200 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Store size={16} className="text-slate-400" />
              <span>Merchant Dispatch Login</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Simulator Showcase */}
        <div className="mt-20 max-w-4xl mx-auto relative z-10">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Interactive Preview</span>
                <h3 className="text-lg font-bold text-slate-100 mt-0.5">Real-World Perimeter Matching Engine</h3>
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSimItem('catering')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    simItem === 'catering' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Catering & Tiffin
                </button>
                <button
                  onClick={() => setSimItem('printing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    simItem === 'printing' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Quick Print & Signage
                </button>
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Merchant Dispatch Perimeter:</span>
                <span className="text-indigo-400 font-bold">{simRadius} km radius</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={simRadius}
                onChange={(e) => setSimRadius(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Live Detected Match Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(simulatedMatches[simItem] || []).map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Store size={14} className="text-indigo-400" />
                      {m.name}
                    </p>
                    <p className="text-[11px] text-slate-500">Max Capacity: {m.capacity}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                      {m.dist}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Feature Pillars */}
      <section className="py-20 border-t border-slate-900 bg-slate-950 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/60 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <ShoppingBag size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-100">Itemized Reverse Bidding</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't browse menus one by one. Post exact unit counts (e.g. 50 samosas, 30 teas), set your target unit budget, and broadcast to all capable providers at once.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/60 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <MapPin size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-100">Haversine Spatial Bounds</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demands are only routed to merchants whose actual physical service radius encompasses the delivery coordinates, guaranteeing hot meals and prompt timelines.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/60 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              <Zap size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-100">Direct Merchant Handshake</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero intermediary commission cuts. Once a nearby shop claims your requirement, you receive their verified phone number and direct WhatsApp contact link immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}