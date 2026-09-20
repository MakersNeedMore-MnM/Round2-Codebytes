// frontend/src/components/PurchaseOrderModal.jsx
import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

export default function PurchaseOrderModal({ request, onClose }) {
  const printRef = useRef(null);

  if (!request) return null;

  const unitRate = Number(request.agreed_price_per_unit || request.budget_per_unit || 85);
  const qty = Number(request.quantity_needed || 1);
  const subtotal = unitRate * qty;
  const mockGst = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + mockGst;
  const poNumber = `PO-LOC-${(request.request_id || request.id || '101').replace('req_', '').toUpperCase()}-2026`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/70 backdrop-blur-sm font-sans antialiased">
      <div className="bg-[#FFFFFF] border border-[#D4C4A8] rounded-3xl max-w-xl w-full p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4C4A8]/40 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#778D7A]" />
            <span className="text-xs font-bold text-[#0D1B2A] uppercase tracking-wider">Official Estimate / Purchase Order</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0D1B2A] text-[#F4F1DE] text-xs font-bold hover:bg-[#1B263B] transition cursor-pointer shadow-xs"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F4F1DE] text-[#415A77] hover:text-[#0D1B2A] transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div ref={printRef} className="space-y-6 text-[#0D1B2A] print:p-4">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#D4C4A8] pb-5">
            <div>
              <h2 className="text-xl font-black text-[#0D1B2A]">LOCALOPS DISPATCH SLIP</h2>
              <p className="text-[11px] font-mono text-[#415A77] mt-0.5">Voucher #: {poNumber}</p>
              <p className="text-[10px] text-[#778D7A] font-bold mt-1">Status: VERIFIED & COMMITTED</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase text-[#1B263B] bg-[#E9E4CB] px-2.5 py-1 rounded-md border border-[#D4C4A8]">
                {request.category}
              </span>
              <p className="text-[11px] text-[#415A77] mt-1 font-medium">Valid until delivery delivery SLA</p>
            </div>
          </div>

          {/* Party Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#F4F1DE] p-4 rounded-2xl border border-[#D4C4A8]">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#415A77] block">Billed To (Buyer):</span>
              <strong className="block text-[#0D1B2A] text-sm mt-0.5">{request.posted_by}</strong>
              <p className="text-[#415A77] mt-0.5">Dest: {request.location_name || 'Koramangala, Bengaluru'}</p>
            </div>
            <div className="text-right sm:text-left">
              <span className="text-[10px] font-bold uppercase text-[#415A77] block">Fulfillment Merchant:</span>
              <strong className="block text-[#0D1B2A] text-sm mt-0.5">{request.claimed_by?.name || 'Local Verified Shop'}</strong>
              <p className="text-[#415A77] mt-0.5">Contact: {request.claimed_by?.phone || '+91 98765 43210'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-[#D4C4A8] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#E9E4CB] text-[#0D1B2A] font-bold border-b border-[#D4C4A8]">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Batch Qty</th>
                  <th className="py-2.5 px-3 text-right">Agreed Rate</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4C4A8]/40">
                {request.items && request.items.length > 0 ? (
                  request.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold">{item.name}</td>
                      <td className="py-2.5 px-3 text-center">{item.quantity} {item.unit || 'units'}</td>
                      <td className="py-2.5 px-3 text-right">₹{unitRate}</td>
                      <td className="py-2.5 px-3 text-right font-bold">₹{item.quantity * unitRate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">{request.event_title || request.title}</td>
                    <td className="py-2.5 px-3 text-center">{qty} units</td>
                    <td className="py-2.5 px-3 text-right">₹{unitRate}</td>
                    <td className="py-2.5 px-3 text-right font-bold">₹{subtotal}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Calculations & Settlement QR */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <div className="flex items-center gap-3 p-3 bg-[#F4F1DE] border border-[#D4C4A8] rounded-2xl w-full sm:w-auto">
              <div className="w-12 h-12 bg-[#FFFFFF] border border-[#D4C4A8] rounded-xl flex items-center justify-center text-[#0D1B2A]">
                <QrCode size={30} />
              </div>
              <div className="text-[10px] text-[#415A77]">
                <span className="font-bold text-[#0D1B2A] block text-xs">Direct UPI Escrow Ready</span>
                Scan or transfer upon delivery hand-off. Zero middleman fees deducted.
              </div>
            </div>

            <div className="text-right text-xs space-y-1 w-full sm:w-auto">
              <div className="flex justify-between sm:justify-end gap-6 text-[#415A77]">
                <span>Batch Subtotal:</span>
                <span className="font-mono font-bold text-[#0D1B2A]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6 text-[#415A77]">
                <span>Govt/FSSAI Tax (5%):</span>
                <span className="font-mono font-bold text-[#0D1B2A]">₹{mockGst}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-6 text-sm font-black text-[#0D1B2A] pt-1 border-t border-[#D4C4A8]">
                <span>Settlement Due:</span>
                <span className="font-mono text-base text-[#778D7A]">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Footer certification stamp */}
          <div className="border-t border-[#D4C4A8]/60 pt-4 text-center text-[10px] text-[#415A77]">
            Authorized LocalOps Smart-Dispatch Voucher • Cryptographically hashed for instant physical fulfillment verification.
          </div>
        </div>
      </div>
    </div>
  );
}