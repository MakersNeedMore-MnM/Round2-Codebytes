// frontend/src/components/OpportunityCard.jsx
import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, CheckCircle2, Send, Tag } from 'lucide-react';

export default function OpportunityCard({ opportunity, onClaim, onBid }) {
  const opp = opportunity;
  const [showBidForm, setShowBidForm] = useState(false);
  const [customPrice, setCustomPrice] = useState(opp.budget_per_unit || 85);
  const [note, setNote] = useState('Can deliver hot batches packed in thermal boxes.');

  const handleBidSubmit = (e) => {
    e.preventDefault();
    onBid(opp.id || opp.request_id, customPrice, note);
    setShowBidForm(false);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#D4C4A8] rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D1B2A] bg-[#E9E4CB] border border-[#D4C4A8] px-2.5 py-0.5 rounded-full">
              {opp.category || 'General'}
            </span>
            <h3 className="text-base font-bold text-[#0D1B2A] mt-1.5">
              {opp.event_title || opp.title}
            </h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-[#F4F1DE] text-[#778D7A] border border-[#778D7A]/50 rounded-xl">
            {opp.bids?.length ? `${opp.bids.length} Bid(s) Active` : 'Open Ticket'}
          </span>
        </div>

        {/* Dynamic Items */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {opp.items && opp.items.length > 0 ? (
            opp.items.map((item, idx) => (
              <span
                key={idx}
                className="bg-[#F4F1DE] text-[#1B263B] text-xs px-2.5 py-1 rounded-lg font-semibold border border-[#D4C4A8]"
              >
                {item.quantity}× {item.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#415A77]">
              {Array.isArray(opp.needed_items) ? opp.needed_items.join(', ') : opp.needed_items}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-1.5 text-xs text-[#415A77] mt-2 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[#0D1B2A]" />
            <span>
              {opp.location_name || 'Nearby'}
              {opp.distance_km !== undefined && (
                <strong className="text-[#0D1B2A] ml-1">({opp.distance_km} km away)</strong>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#0D1B2A]" />
            <span>Need within {opp.delivery_hours_from_now || opp.deadline || '24'} hours</span>
          </div>

          <div className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-[#0D1B2A]" />
            <span>
              Buyer Target: <strong className="text-[#0D1B2A]">₹{opp.budget_per_unit || 85}/unit</strong>
            </span>
          </div>
        </div>

        {/* Counter Offer Form */}
        {showBidForm && (
          <form onSubmit={handleBidSubmit} className="mt-4 p-3.5 bg-[#F4F1DE] rounded-xl border border-[#D4C4A8] space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <label className="font-bold text-[#0D1B2A]">Your Counter Offer Rate (₹/unit)</label>
              <button
                type="button"
                onClick={() => setShowBidForm(false)}
                className="text-[10px] text-[#415A77] hover:text-[#0D1B2A]"
              >
                Cancel
              </button>
            </div>
            <input
              type="number"
              required
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#D4C4A8] rounded-lg text-xs outline-none focus:border-[#0D1B2A]"
            />
            <input
              type="text"
              placeholder="Add perk/note (e.g. Free tea thermos included)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#D4C4A8] rounded-lg text-xs outline-none focus:border-[#0D1B2A]"
            />
            <button
              type="submit"
              className="w-full bg-[#778D7A] hover:bg-[#607363] text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Send size={12} /> Submit Counter-Offer
            </button>
          </form>
        )}
      </div>

      {/* Action Buttons */}
      {!showBidForm && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => setShowBidForm(true)}
            className="w-full bg-[#E9E4CB] hover:bg-[#D4C4A8] text-[#0D1B2A] text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <Tag size={13} />
            <span>Counter Offer</span>
          </button>
          <button
            onClick={() => onClaim(opp.id || opp.request_id)}
            className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] text-[#F4F1DE] text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
          >
            <CheckCircle2 size={14} className="text-[#778D7A]" />
            <span>Accept Target</span>
          </button>
        </div>
      )}
    </div>
  );
}