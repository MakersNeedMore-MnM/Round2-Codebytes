// frontend/src/components/CustomerView.jsx
import React, { useState, useEffect } from 'react';
import { Send, Plus, Trash2, ShoppingBag, MapPin, Phone, MessageCircle, CheckCircle, Clock, FileText, Check } from 'lucide-react';
import PurchaseOrderModal from './PurchaseOrderModal';
import { API_BASE } from '../apiConfig';

export default function CustomerView({ postedByName = 'Local Customer' }) {
  const [eventTitle, setEventTitle] = useState('');
  const [category, setCategory] = useState('Food & Beverage');
  const [items, setItems] = useState([
    { name: 'Samosa & Chai Packs', quantity: 40, unit: 'packs' }
  ]);
  const [budgetPerUnit, setBudgetPerUnit] = useState(85);
  const [deliveryHours, setDeliveryHours] = useState(24);
  const [locationName, setLocationName] = useState('Koramangala 5th Block');
  const [coords, setCoords] = useState({ lat: 12.9345, lng: 77.6205 });
  const [submitting, setSubmitting] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedPoRequest, setSelectedPoRequest] = useState(null);

  const fetchMyRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/customer/requests?posted_by=${encodeURIComponent(postedByName)}`);
      if (res.ok) {
        const data = await res.json();
        setMyRequests(data);
      }
    } catch (err) {
      console.error('Error fetching tracker requests:', err);
    }
  };

  useEffect(() => {
    fetchMyRequests();
    const interval = setInterval(fetchMyRequests, 3500);
    return () => clearInterval(interval);
  }, [postedByName]);

  const fetchDeviceGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationName('Current GPS Coordinates');
      },
      (err) => alert(`Unable to fetch location: ${err.message}`)
    );
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'quantity' ? Number(value) : value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { name: '', quantity: 10, unit: 'packs' }]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_title: eventTitle,
          category,
          items: items.filter((i) => i.name.trim() !== ''),
          budget_per_unit: Number(budgetPerUnit),
          delivery_hours_from_now: Number(deliveryHours),
          location_name: locationName,
          lat: coords.lat,
          lng: coords.lng,
          posted_by: postedByName
        })
      });

      if (res.ok) {
        setEventTitle('');
        setItems([{ name: '', quantity: 10, unit: 'packs' }]);
        fetchMyRequests();
      } else {
        alert('Failed to broadcast request.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async (requestId, bidId) => {
    try {
      const res = await fetch(`${API_BASE}/api/requests/${requestId}/accept-bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bid_id: bidId })
      });
      if (res.ok) {
        alert('Bid accepted! The deal is now committed.');
        fetchMyRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      {/* Printable PO Voucher Modal */}
      {selectedPoRequest && (
        <PurchaseOrderModal
          request={selectedPoRequest}
          onClose={() => setSelectedPoRequest(null)}
        />
      )}

      {/* Broadcast Form */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#D4C4A8] p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0D1B2A] flex items-center gap-2">
            <ShoppingBag className="text-[#415A77]" size={22} />
            Broadcast Bulk Requirement
          </h2>
          <p className="text-xs text-[#415A77] mt-1">
            Specify itemized counts. Verified neighborhood vendors within 4 km receive your ticket.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div>
            <label className="block text-xs font-bold text-[#1B263B] mb-1.5">Demand / Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Student Hackathon Volunteer Refreshments"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
            />
          </div>

          <div className="bg-[#F4F1DE]/70 border border-[#D4C4A8] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1B263B]">Itemized Breakdown</span>
              <span className="text-xs font-bold text-[#0D1B2A] bg-[#E9E4CB] border border-[#D4C4A8] px-2.5 py-0.5 rounded-full">
                Total Units: {totalQuantity}
              </span>
            </div>

            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Item Name (e.g. Samosa Box)"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#D4C4A8] rounded-xl text-xs text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
                  />
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                    className="w-20 px-3 py-2 bg-white border border-[#D4C4A8] rounded-xl text-xs text-[#0D1B2A] outline-none text-center focus:border-[#0D1B2A]"
                  />
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                    className="w-20 px-3 py-2 bg-white border border-[#D4C4A8] rounded-xl text-xs text-[#0D1B2A] outline-none text-center focus:border-[#0D1B2A]"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    disabled={items.length === 1}
                    className={`p-2 text-[#415A77] hover:text-rose-600 transition ${items.length === 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItemRow}
              className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#0D1B2A] hover:text-[#415A77] cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Another Item</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1B263B] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
              >
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Printing & Banners">Printing & Banners</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1B263B] mb-1">Target Price / Unit (₹)</label>
              <input
                type="number"
                required
                value={budgetPerUnit}
                onChange={(e) => setBudgetPerUnit(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#1B263B]">Delivery Location</label>
              <button
                type="button"
                onClick={fetchDeviceGPS}
                className="text-[11px] font-bold text-[#415A77] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <MapPin size={12} /> Use GPS
              </button>
            </div>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-4 py-2 bg-[#F4F1DE]/60 border border-[#D4C4A8] rounded-xl text-[#0D1B2A] outline-none focus:border-[#0D1B2A]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] text-[#F4F1DE] font-bold py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-[#0D1B2A]/20 cursor-pointer"
          >
            <Send size={16} />
            <span>{submitting ? 'Broadcasting Need...' : 'Broadcast to Local Radar'}</span>
          </button>
        </form>
      </div>

      {/* Real-Time Demand Tracker & Bid Comparison Board */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#D4C4A8] p-8 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D1B2A] mb-4">
          Live Demand Tracker & Incoming Counter-Offers
        </h3>

        {myRequests.length === 0 ? (
          <p className="text-xs text-[#415A77]">No active tickets submitted under {postedByName}.</p>
        ) : (
          <div className="space-y-5">
            {myRequests.map((req) => (
              <div
                key={req.request_id || req.id}
                className={`p-5 rounded-2xl border transition ${
                  req.status === 'CLAIMED' ? 'bg-[#F4F1DE] border-[#778D7A]' : 'bg-[#F4F1DE]/40 border-[#D4C4A8]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#0D1B2A]">{req.event_title || req.title}</h4>
                    <span className="text-xs text-[#415A77]">
                      {req.quantity_needed} items • Target: ₹{req.budget_per_unit}/unit • {req.location_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'CLAIMED' ? (
                      <span className="text-xs font-bold text-[#778D7A] bg-[#FFFFFF] border border-[#778D7A] px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs">
                        <CheckCircle size={13} /> Committed
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#415A77] bg-[#E9E4CB] border border-[#D4C4A8] px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Clock size={13} /> {req.bids?.length || 0} Bid(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Soft Bids / Counter-Offers from Merchants */}
                {req.status !== 'CLAIMED' && req.bids && req.bids.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-[#D4C4A8]/60 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B263B] block">
                      Incoming Neighborhood Quotes:
                    </span>
                    {req.bids.map((b) => (
                      <div key={b.bid_id} className="p-3 bg-white border border-[#D4C4A8] rounded-xl flex items-center justify-between gap-2 shadow-xs">
                        <div>
                          <p className="text-xs font-bold text-[#0D1B2A]">{b.merchant_name}</p>
                          <p className="text-[11px] text-[#415A77] italic">"{b.note}"</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-[#778D7A]">
                            ₹{b.price_per_unit}/unit
                          </span>
                          <button
                            onClick={() => handleAcceptBid(req.request_id || req.id, b.bid_id)}
                            className="px-3 py-1 bg-[#0D1B2A] hover:bg-[#1B263B] text-[#F4F1DE] rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Check size={12} /> Accept
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Claimed Handshake Card */}
                {req.status === 'CLAIMED' && req.claimed_by && (
                  <div className="mt-4 p-4 bg-white border border-[#D4C4A8] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#0D1B2A]">
                        🎉 Locked with <span className="text-[#415A77] font-black">{req.claimed_by.name}</span>
                      </p>
                      <p className="text-[11px] text-[#415A77] mt-0.5">
                        Agreed Rate: <strong>₹{req.agreed_price_per_unit || req.budget_per_unit}/unit</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPoRequest(req)}
                        className="px-3 py-1.5 bg-[#E9E4CB] hover:bg-[#D4C4A8] text-[#0D1B2A] rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <FileText size={13} /> PO Voucher
                      </button>
                      <a
                        href={`tel:${req.claimed_by.phone}`}
                        className="px-3 py-1.5 bg-[#0D1B2A] hover:bg-[#1B263B] text-[#F4F1DE] rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Phone size={13} /> Call
                      </a>
                      <a
                        href={`https://wa.me/${req.claimed_by.phone?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-[#778D7A] hover:bg-[#607363] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}