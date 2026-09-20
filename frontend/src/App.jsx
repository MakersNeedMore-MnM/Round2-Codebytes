// frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import HomePage from './components/HomePage';
import AuthScreen from './components/AuthScreen';
import CustomerView from './components/CustomerView';
import OpportunityCard from './components/OpportunityCard';
import MerchantRadarMap from './components/MerchantRadarMap';
import MerchantAICopilot from './components/MerchantAICopilot';
import { Store, LogOut, Radio, RefreshCw, Bell, ArrowLeft, BatteryCharging } from 'lucide-react';
import { API_BASE } from './apiConfig';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('localops_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeAuthRole, setActiveAuthRole] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [capacityStats, setCapacityStats] = useState(null);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [alertBanner, setAlertBanner] = useState(null);

  const prevOppsCount = useRef(0);

  // Fetch merchants directory
  useEffect(() => {
    fetch(`${API_BASE}/api/merchants`)
      .then((res) => res.json())
      .then((data) => setMerchants(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch opportunities and capacity stats
  const fetchMerchantData = async (merchantId, isSilent = false) => {
    if (!merchantId) return;
    if (!isSilent) setLoadingOpps(true);

    try {
      // 1. Opportunities
      const res = await fetch(`${API_BASE}/api/merchants/${merchantId}/opportunities`);
      if (!res.ok) throw new Error('Failed to load opportunities');
      const data = await res.json();

      if (data.length > prevOppsCount.current && prevOppsCount.current !== 0) {
        const latest = data[0];
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});

        setAlertBanner(`New demand pin detected: ${latest.event_title || latest.title} (${latest.distance_km} km away)`);
        setTimeout(() => setAlertBanner(null), 6000);
      }

      prevOppsCount.current = data.length;
      setOpportunities(data);

      // 2. Capacity meter
      const capRes = await fetch(`${API_BASE}/api/merchants/${merchantId}/capacity-stats`);
      if (capRes.ok) {
        const capData = await capRes.json();
        setCapacityStats(capData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isSilent) setLoadingOpps(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'merchant' && currentUser?.merchantId) {
      fetchMerchantData(currentUser.merchantId, false);
      const interval = setInterval(() => {
        fetchMerchantData(currentUser.merchantId, true);
      }, 4000);
      return () => clearInterval(interval);
    } else {
      prevOppsCount.current = 0;
    }
  }, [currentUser]);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('localops_user', JSON.stringify(userData));
    setActiveAuthRole(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('localops_user');
    setOpportunities([]);
    prevOppsCount.current = 0;
  };

  const handleClaim = async (requestId) => {
    if (!currentUser?.merchantId) return;

    try {
      const res = await fetch(`${API_BASE}/api/requests/${requestId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: currentUser.merchantId })
      });
      if (res.ok) {
        alert('Ticket accepted at buyer target! Contact card and PO ready.');
        fetchMerchantData(currentUser.merchantId, false);
      } else {
        alert('Could not claim opportunity.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting claim.');
    }
  };

  const handleBid = async (requestId, pricePerUnit, note) => {
    if (!currentUser?.merchantId) return;

    try {
      const res = await fetch(`${API_BASE}/api/requests/${requestId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: currentUser.merchantId,
          price_per_unit: Number(pricePerUnit),
          note
        })
      });
      if (res.ok) {
        alert('Counter-offer dispatched to the buyer dashboard!');
        fetchMerchantData(currentUser.merchantId, false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // State 1: Showcase Landing Page
  if (!currentUser && !activeAuthRole) {
    return (
      <HomePage 
        merchants={merchants} 
        onSelectRole={(role) => setActiveAuthRole(role)} 
      />
    );
  }

  // State 2: Dedicated Auth Screen
  if (!currentUser && activeAuthRole) {
    return (
      <div className="relative">
        <button
          onClick={() => setActiveAuthRole(null)}
          className="absolute top-6 left-6 z-50 flex items-center gap-1.5 text-xs font-bold text-[#0D1B2A] hover:text-[#415A77] bg-white border border-[#D4C4A8] px-3.5 py-2 rounded-xl shadow-xs cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        <AuthScreen 
          merchants={merchants} 
          initialRole={activeAuthRole} 
          onLogin={handleLogin} 
          onMerchantCreated={(newMerchant) => setMerchants((prev) => [...prev, newMerchant])}
        />
      </div>
    );
  }

  // State 3: Customer or Merchant Portal
  return (
    <div className="min-h-screen bg-[#F4F1DE] text-[#0D1B2A] flex flex-col font-sans antialiased">
      {/* Alert Banner */}
      {alertBanner && (
        <div className="bg-[#0D1B2A] text-[#F4F1DE] px-6 py-2.5 text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[#778D7A]" />
            <span>{alertBanner}</span>
          </div>
          <button onClick={() => setAlertBanner(null)} className="text-[#D4C4A8] hover:text-white cursor-pointer font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header className="bg-white border-b border-[#D4C4A8] sticky top-0 z-40 px-3 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="w-9 h-9 rounded-2xl bg-[#0D1B2A] text-[#F4F1DE] flex items-center justify-center shadow-md shadow-[#0D1B2A]/15">
            <Radio size={19} className="text-[#778D7A]" />
          </div>
          <div>
            <h1 className="text-base font-black leading-tight text-[#0D1B2A]">
              Local<span className="text-[#415A77]">Ops</span>
            </h1>
            <span className="text-[10px] text-[#415A77] font-bold uppercase tracking-wider">
              {currentUser.role === 'customer' ? 'Buyer Portal' : 'Merchant Dispatch'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-xs font-bold text-[#0D1B2A]">
              {currentUser.role === 'customer'
                ? currentUser.name
                : currentUser.merchantData?.name || 'Merchant Shop'}
            </span>
            <span className="inline-block text-[10px] uppercase font-bold text-[#0D1B2A] bg-[#E9E4CB] border border-[#D4C4A8] px-2.5 py-0.5 rounded-full">
              {currentUser.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-[#415A77] hover:text-rose-600 hover:bg-[#F4F1DE] transition rounded-xl cursor-pointer"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 py-4 sm:p-6 overflow-x-hidden">
        {currentUser.role === 'customer' ? (
          <CustomerView postedByName={currentUser.name} />
        ) : (
          <div>
            {/* Merchant Header with Capacity Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-[#0D1B2A]">
                  <Store className="text-[#415A77]" size={22} />
                  Live Perimeter Radar
                </h2>
                <p className="text-xs text-[#415A77] mt-1">
                  Filtering for <strong className="text-[#0D1B2A]">{currentUser.merchantData?.category}</strong> within{' '}
                  <strong className="text-[#0D1B2A]">{currentUser.merchantData?.service_radius_km || 3.0} km</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Real-time Capacity Meter */}
                {capacityStats && (
                  <div className="bg-white border border-[#D4C4A8] px-3.5 py-1.5 rounded-2xl flex items-center gap-3 shadow-xs">
                    <BatteryCharging size={18} className="text-[#778D7A]" />
                    <div className="text-left">
                      <div className="flex justify-between text-[10px] font-bold text-[#0D1B2A] gap-2">
                        <span>Load:</span>
                        <span>{capacityStats.committed_units}/{capacityStats.max_capacity} Units</span>
                      </div>
                      <div className="w-24 h-1.5 bg-[#F4F1DE] rounded-full overflow-hidden mt-0.5">
                        <div
                          className="h-full bg-[#778D7A] transition-all"
                          style={{ width: `${capacityStats.utilization_percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => fetchMerchantData(currentUser.merchantId, false)}
                  disabled={loadingOpps}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D1B2A] bg-[#E9E4CB] hover:bg-[#D4C4A8] px-3.5 py-2.5 rounded-xl transition cursor-pointer"
                >
                  <RefreshCw size={14} className={loadingOpps ? 'animate-spin' : ''} />
                  <span>{loadingOpps ? 'Scanning...' : 'Rescan'}</span>
                </button>
              </div>
            </div>

            {/* AI Copilot */}
            {currentUser.merchantData && (
              <MerchantAICopilot merchant={currentUser.merchantData} />
            )}

            {/* Perimeter Radar Map */}
            {currentUser.merchantData && (
              <MerchantRadarMap
                merchant={currentUser.merchantData}
                opportunities={opportunities}
                onClaim={handleClaim}
              />
            )}

            {/* Opportunities Feed */}
            {loadingOpps ? (
              <div className="text-center py-16 bg-white border border-[#D4C4A8] rounded-3xl p-8">
                <p className="text-sm text-[#415A77]">Scanning local radius pins...</p>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#D4C4A8] rounded-3xl p-8">
                <p className="text-base font-bold text-[#0D1B2A]">No active demand pins in range</p>
                <p className="text-xs text-[#415A77] mt-1 max-w-sm mx-auto">
                  Switch to Buyer mode, broadcast a demand within your perimeter, and submit bids or acceptances.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.request_id || opp.id}
                    opportunity={opp}
                    onClaim={handleClaim}
                    onBid={handleBid}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}