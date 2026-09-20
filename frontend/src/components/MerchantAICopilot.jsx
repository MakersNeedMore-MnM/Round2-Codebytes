// frontend/src/components/MerchantAICopilot.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  TrendingUp, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  RefreshCw 
} from 'lucide-react';

export default function MerchantAICopilot({ merchant }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (!merchant?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/merchants/${merchant.id}/growth-copilot`);
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (err) {
      console.error("Failed to load AI copilot:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [merchant?.id]);

  return (
    <div className="bg-[#FFFFFF] border border-[#D4C4A8] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4C4A8]/40 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E4CB] border border-[#D4C4A8] text-[#0D1B2A] text-[11px] font-bold mb-2 shadow-xs">
            <Sparkles size={13} className="text-[#415A77]" />
            <span>AI Hyperlocal Growth Copilot</span>
          </div>
          <h3 className="text-lg font-bold text-[#0D1B2A]">
            Potential Customers & Strategic Action Plan
          </h3>
          <p className="text-xs text-[#415A77] mt-0.5">
            AI analysis of bulk institutional buyers within your {merchant.service_radius_km || 3.0} km perimeter.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D1B2A] bg-[#F4F1DE] hover:bg-[#E9E4CB] border border-[#D4C4A8] px-3.5 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-[#415A77]" : ""} />
          <span>{loading ? "Analyzing Zone..." : "Refresh Insights"}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#415A77] font-medium">
          <Sparkles size={24} className="mx-auto animate-bounce mb-2 text-[#415A77]" />
          Scanning colleges, co-working hubs, and local event centers around your coordinates...
        </div>
      ) : !insights ? (
        <p className="text-xs text-[#415A77]">No insights available.</p>
      ) : (
        <div className="space-y-8">
          {/* 1. Potential Customer Segments */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0D1B2A] mb-3 flex items-center gap-2">
              <Users size={16} className="text-[#415A77]" />
              Who are your potential bulk customers?
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.potential_customers?.map((cust, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-[#F4F1DE] border border-[#D4C4A8] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-xl bg-[#FFFFFF] text-[#0D1B2A] flex items-center justify-center font-bold text-xs shadow-xs border border-[#D4C4A8]">
                        {idx === 0 ? <GraduationCap size={15} /> : idx === 1 ? <Briefcase size={15} /> : <Building2 size={15} />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#0D1B2A] leading-tight">{cust.segment}</h5>
                        <span className="text-[10px] text-[#415A77] font-medium">{cust.archetype}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#1B263B] mt-2 leading-relaxed">
                      {cust.why_they_need_you}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D4C4A8]/70">
                    <div className="flex justify-between items-center text-[11px] mb-2">
                      <span className="text-[#415A77] font-semibold">Typical Batch:</span>
                      <strong className="text-[#0D1B2A]">{cust.estimated_demand}</strong>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {cust.best_selling_items?.map((item, i) => (
                        <span key={i} className="text-[10px] bg-white border border-[#D4C4A8] text-[#0D1B2A] px-2 py-0.5 rounded-md font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Tactical Growth Action Plan */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0D1B2A] mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#778D7A]" />
              Recommended Next Action Plan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {insights.action_plan?.map((plan, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-white border border-[#D4C4A8] shadow-xs relative overflow-hidden"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#0D1B2A] text-[#F4F1DE] flex items-center justify-center text-xs font-black mb-2.5">
                    {plan.step || idx + 1}
                  </div>
                  <h5 className="text-xs font-bold text-[#0D1B2A] mb-1">
                    {plan.title}
                  </h5>
                  <p className="text-[11px] text-[#415A77] leading-relaxed">
                    {plan.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}