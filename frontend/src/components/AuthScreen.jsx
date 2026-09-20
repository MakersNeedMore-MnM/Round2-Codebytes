// frontend/src/components/AuthScreen.jsx
import React, { useState } from 'react';
import { Radio, Store, User, ArrowRight, Plus } from 'lucide-react';
import MerchantRegistrationModal from './MerchantRegistrationModal';

const PRESET_BUYERS = [
  { id: 'buyer_01', name: 'Student Council, Jyoti Nivas College', org: 'College Fest Organizer', area: 'Koramangala' },
  { id: 'buyer_02', name: 'Tech Community Organizer', org: 'Weekend Hackathons', area: 'HSR Layout' },
  { id: 'buyer_03', name: 'Koramangala Startup Hub', org: 'Corporate Office Lead', area: '5th Block' }
];

export default function AuthScreen({ merchants = [], initialRole = 'customer', onLogin, onMerchantCreated }) {
  const [role, setRole] = useState(initialRole);
  
  // Buyer selector
  const [selectedBuyerId, setSelectedBuyerId] = useState(PRESET_BUYERS[0].id);
  const [customBuyerName, setCustomBuyerName] = useState('');
  const [isCustomBuyer, setIsCustomBuyer] = useState(false);

  // Merchant selector & Registration Modal state
  const [selectedMerchantId, setSelectedMerchantId] = useState(merchants[0]?.id || 'shop_01');
  const [showRegModal, setShowRegModal] = useState(false);
  
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'customer') {
      let finalName = customBuyerName.trim();
      let orgDetail = 'Custom Buyer';
      if (!isCustomBuyer) {
        const preset = PRESET_BUYERS.find(b => b.id === selectedBuyerId) || PRESET_BUYERS[0];
        finalName = preset.name;
        orgDetail = preset.org;
      }
      if (!finalName) return;

      onLogin({
        role: 'customer',
        name: finalName,
        org: orgDetail,
        identifier: finalName
      });
    } else {
      const merchant = merchants.find((m) => m.id === selectedMerchantId) || merchants[0];
      onLogin({
        role: 'merchant',
        merchantId: merchant?.id,
        merchantData: merchant,
        identifier: merchant?.name
      });
    }
  };

  const handleRegisteredSuccess = (newMerchant) => {
    setShowRegModal(false);
    if (onMerchantCreated) {
      onMerchantCreated(newMerchant);
    }
    // Auto-login the newly registered shop
    onLogin({
      role: 'merchant',
      merchantId: newMerchant.id,
      merchantData: newMerchant,
      identifier: newMerchant.name
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F1DE] text-[#0D1B2A] flex flex-col justify-center items-center px-4 py-12 relative font-sans antialiased">
      {/* Registration Modal Popup */}
      {showRegModal && (
        <MerchantRegistrationModal
          onClose={() => setShowRegModal(false)}
          onRegistered={handleRegisteredSuccess}
        />
      )}

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9E4CB] border border-[#D4C4A8] text-[#1B263B] text-xs font-bold mb-3 shadow-xs">
          <Radio size={14} className="animate-pulse text-[#415A77]" />
          <span>LOCALOPS GATEWAY</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#0D1B2A]">
          Access Local<span className="text-[#415A77]">Ops</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#415A77] mt-1 font-medium">
          Select an account, or register your shop to enter the local dispatch perimeter.
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-[#FFFFFF] border border-[#D4C4A8] rounded-3xl p-7 sm:p-9 w-full max-w-md shadow-xl shadow-[#0D1B2A]/5 relative z-10">
        {/* Toggle Switch */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F4F1DE] border border-[#D4C4A8] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              role === 'customer'
                ? 'bg-[#0D1B2A] text-[#F4F1DE] shadow-sm'
                : 'text-[#415A77] hover:text-[#0D1B2A]'
            }`}
          >
            <User size={15} />
            <span>Buyer / Organizer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('merchant')}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              role === 'merchant'
                ? 'bg-[#0D1B2A] text-[#F4F1DE] shadow-sm'
                : 'text-[#415A77] hover:text-[#0D1B2A]'
            }`}
          >
            <Store size={15} />
            <span>Merchant Business</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {role === 'customer' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[#1B263B] font-bold">
                  Select Organizer Profile
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomBuyer(!isCustomBuyer)}
                  className="text-[11px] font-bold text-[#415A77] hover:underline cursor-pointer"
                >
                  {isCustomBuyer ? 'Pick Registered Buyer' : '+ New Custom Name'}
                </button>
              </div>

              {!isCustomBuyer ? (
                <select
                  value={selectedBuyerId}
                  onChange={(e) => setSelectedBuyerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/70 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A] text-xs font-medium"
                >
                  {PRESET_BUYERS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.area})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore Tech Meetup Host"
                  value={customBuyerName}
                  onChange={(e) => setCustomBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/70 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A] text-xs font-medium"
                />
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[#1B263B] font-bold">
                  Select Registered Shop
                </label>
                <button
                  type="button"
                  onClick={() => setShowRegModal(true)}
                  className="text-[11px] font-bold text-[#778D7A] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus size={12} /> Register New Shop
                </button>
              </div>

              <select
                value={selectedMerchantId}
                onChange={(e) => setSelectedMerchantId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/70 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A] text-xs font-medium"
              >
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[#1B263B] font-bold mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/70 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A] text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs text-[#F4F1DE] bg-[#0D1B2A] hover:bg-[#1B263B] shadow-md shadow-[#0D1B2A]/20 cursor-pointer"
          >
            <span>Enter {role === 'customer' ? 'Buyer Terminal' : 'Merchant Radar'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#D4C4A8]/60 text-center">
          <p className="text-[11px] text-[#415A77] font-medium">
            Demo Ready: Choose a profile or register a new shop to launch instantly.
          </p>
        </div>
      </div>
    </div>
  );
}