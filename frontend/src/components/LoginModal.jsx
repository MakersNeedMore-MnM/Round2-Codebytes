// frontend/src/components/LoginModal.jsx
import React, { useState } from 'react';
import { User, Store, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginModal({ merchants, onLogin }) {
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' | 'merchant'
  const [customerName, setCustomerName] = useState('');
  const [selectedMerchantId, setSelectedMerchantId] = useState(merchants[0]?.id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'customer') {
      if (!customerName.trim()) return;
      onLogin({
        role: 'customer',
        name: customerName.trim(),
      });
    } else {
      const merchant = merchants.find((m) => m.id === selectedMerchantId) || merchants[0];
      onLogin({
        role: 'merchant',
        merchantId: merchant?.id,
        merchantData: merchant,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl mb-3">
            <ShieldCheck size={26} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Welcome to LocalOps</h2>
          <p className="text-xs text-slate-500 mt-1">
            Hyperlocal reverse-marketplace connecting bulk demand to local providers.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition ${
              selectedRole === 'customer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User size={16} />
            <span>Buyer / Organizer</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('merchant')}
            className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition ${
              selectedRole === 'merchant'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store size={16} />
            <span>Merchant Business</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedRole === 'customer' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name / Organization
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma (Dev Summit Team)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Your Registered Business
              </label>
              <select
                value={selectedMerchantId}
                onChange={(e) => setSelectedMerchantId(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category?.toUpperCase()})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Logging in simulates your shop's geofence and radar dispatch center.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer mt-4"
          >
            <span>Enter Portal</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}