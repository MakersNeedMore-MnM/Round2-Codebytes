// frontend/src/components/MerchantRegistrationModal.jsx
import React, { useState } from 'react';
import { Store, MapPin, X, ArrowRight, CheckCircle2, Sliders } from 'lucide-react';

export default function MerchantRegistrationModal({ onClose, onRegistered }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food & Beverage');
  const [tagsInput, setTagsInput] = useState('samosa, chai, snack packs');
  const [capacity, setCapacity] = useState(100);
  const [radiusKm, setRadiusKm] = useState(3.5);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [coords, setCoords] = useState({ lat: 12.9345, lng: 77.6205 });
  const [locationLabel, setLocationLabel] = useState('Koramangala 5th Block');
  const [loading, setLoading] = useState(false);

  const fetchShopGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLabel('Current Shop GPS Location');
      },
      (err) => alert(`Could not fetch location: ${err.message}`)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category,
          tags,
          max_capacity_per_order: Number(capacity),
          lat: coords.lat,
          lng: coords.lng,
          service_radius_km: Number(radiusKm),
          phone: phone.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        onRegistered(data.merchant);
      } else {
        alert('Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/60 backdrop-blur-sm font-sans">
      <div className="bg-[#FFFFFF] border border-[#D4C4A8] rounded-3xl max-w-lg w-full p-7 sm:p-9 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#415A77] hover:text-[#0D1B2A] p-1.5 rounded-full hover:bg-[#F4F1DE] transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#F4F1DE] border border-[#D4C4A8] text-[#0D1B2A] flex items-center justify-center mb-3">
            <Store size={20} />
          </div>
          <h3 className="text-xl font-black text-[#0D1B2A]">
            Register Your Business Shop
          </h3>
          <p className="text-xs text-[#415A77] mt-1">
            Join the LocalOps perimeter to receive live bulk-demand radar alerts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#1B263B] font-bold mb-1.5">Shop / Business Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Bakes & Savouries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#1B263B] font-bold mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
              >
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Printing & Banners">Printing & Banners</option>
              </select>
            </div>
            <div>
              <label className="block text-[#1B263B] font-bold mb-1.5">Max Batch Capacity</label>
              <input
                type="number"
                min="10"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1B263B] font-bold mb-1.5">
              Offerings / Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. samosa, chai, sandwiches, cakes"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[#1B263B] font-bold">Service Perimeter Radius</label>
              <span className="text-[#0D1B2A] font-black bg-[#E9E4CB] px-2 py-0.5 rounded-md text-[11px]">
                {radiusKm} km
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#D4C4A8] rounded-lg appearance-none cursor-pointer accent-[#0D1B2A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#1B263B] font-bold">Location</label>
                <button
                  type="button"
                  onClick={fetchShopGPS}
                  className="text-[10px] font-bold text-[#415A77] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <MapPin size={10} /> Use GPS
                </button>
              </div>
              <input
                type="text"
                value={locationLabel}
                onChange={(e) => setLocationLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
              />
            </div>
            <div>
              <label className="block text-[#1B263B] font-bold mb-1.5">Contact Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs text-[#F4F1DE] bg-[#0D1B2A] hover:bg-[#1B263B] shadow-md shadow-[#0D1B2A]/20 cursor-pointer"
          >
            <span>{loading ? 'Activating Shop...' : 'Register & Enter Radar'}</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}