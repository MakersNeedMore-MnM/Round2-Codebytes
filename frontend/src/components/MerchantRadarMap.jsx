// frontend/src/components/MerchantRadarMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Navy/Sage Pulsing Pin for Customer Needs
const customerDemandIcon = L.divIcon({
  className: 'custom-radar-pin',
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #778D7A; opacity: 0.75; animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <span style="position: relative; display: block; width: 12px; height: 12px; margin: 6px auto; border-radius: 50%; background: #0D1B2A; border: 2px solid #F4F1DE;"></span>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export default function MerchantRadarMap({ merchant, opportunities = [], onClaim }) {
  const lat = merchant?.location?.lat ?? merchant?.lat ?? 12.9345;
  const lng = merchant?.location?.lng ?? merchant?.lng ?? 77.6205;
  const centerPos = [Number(lat), Number(lng)];

  const radiusKm = merchant?.service_radius_km || 3.0;
  const radiusMeters = radiusKm * 1000;

  return (
    <div className="h-[360px] w-full rounded-3xl overflow-hidden border border-[#D4C4A8] shadow-sm relative z-0 mb-6 bg-[#F4F1DE]">
      <MapContainer
        center={centerPos}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', minHeight: '360px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Steel-Blue & Sage Perimeter Ring */}
        <Circle
          center={centerPos}
          radius={radiusMeters}
          pathOptions={{
            color: '#1B263B',
            fillColor: '#415A77',
            fillOpacity: 0.14,
            dashArray: '5, 5'
          }}
        />

        {/* Customer Demand Pins */}
        {opportunities.map((opp) => {
          const oppLat = opp.location?.lat ?? opp.lat;
          const oppLng = opp.location?.lng ?? opp.lng;
          if (!oppLat || !oppLng) return null;

          return (
            <Marker
              key={opp.id || opp.request_id}
              position={[Number(oppLat), Number(oppLng)]}
              icon={customerDemandIcon}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs font-sans text-[#0D1B2A]">
                  <p className="font-bold">{opp.title || opp.event_title}</p>
                  <p className="text-[#415A77] font-semibold">{opp.distance_km} km away</p>
                  <p className="text-[#1B263B]">Target: ₹{opp.budget_per_unit}/unit</p>
                  <button
                    onClick={() => onClaim(opp.id || opp.request_id)}
                    className="mt-2 w-full bg-[#0D1B2A] text-[#F4F1DE] font-bold py-1 px-2 rounded-lg cursor-pointer hover:bg-[#1B263B]"
                  >
                    Claim Ticket
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}