import React, { useState, useMemo } from 'react';
import { Donor } from '../types';
import { Navigation, Phone, MapPin, Locate, X, Droplets } from 'lucide-react';

interface MapViewProps {
  donors: Donor[];
  userLocation: { lat: number; lng: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ donors, userLocation }) => {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // Simplified projection logic for mock map
  const projection = useMemo(() => {
    const latMin = 23.7;
    const latMax = 23.9;
    const lngMin = 90.35;
    const lngMax = 90.45;

    return (lat: number, lng: number) => {
      const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
      const y = (1 - (lat - latMin) / (latMax - latMin)) * 100;
      return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-[#f1f3f4] overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(#9ca3af 0.5px, transparent 0.5px)', 
        backgroundSize: '24px 24px' 
      }}></div>

      {/* Mock Map Features */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,20 Q50,25 100,20" fill="none" stroke="gray" strokeWidth="0.5" />
          <path d="M20,0 Q25,50 20,100" fill="none" stroke="gray" strokeWidth="0.5" />
          <path d="M80,0 Q75,50 80,100" fill="none" stroke="gray" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="gray" strokeWidth="0.2" strokeDasharray="2,2" />
        </svg>
      </div>

      {/* Markers Container */}
      <div className="absolute inset-0">
        {/* User Location */}
        {userLocation && (() => {
          const pos = projection(userLocation.lat, userLocation.lng);
          return (
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
              <div className="w-10 h-10 bg-blue-500/20 rounded-full animate-ping absolute -inset-0"></div>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-600 relative z-10">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          );
        })()}

        {/* Donor Markers */}
        {donors.map((donor) => {
          const pos = projection(donor.location.lat, donor.location.lng);
          const isSelected = selectedDonor?.id === donor.id;
          return (
            <div 
              key={donor.id}
              onClick={() => setSelectedDonor(donor)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className={`flex flex-col items-center transition-all duration-300 ${isSelected ? 'scale-125' : 'scale-100 hover:scale-110'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-2xl rounded-bl-none rotate-45 shadow-xl border-2 border-white transition-colors ${isSelected ? 'bg-red-700' : 'bg-red-600 group-hover:bg-red-700'}`}>
                  <span className="text-white text-[11px] font-black -rotate-45 leading-none">{donor.bloodGroup}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Header Actions */}
      <div className="absolute top-4 left-4 right-4 flex gap-2">
        <div className="flex-1 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
          <MapPin size={18} className="text-red-600" />
          <div className="flex-1">
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Viewing Area</p>
             <p className="text-xs font-bold text-gray-800">Dhaka North Metropolitan</p>
          </div>
        </div>
        <button className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 text-gray-700 active:scale-90 transition-transform">
           <Locate size={20} />
        </button>
      </div>

      {/* Donor Detail Popup (Bottom Sheet) */}
      {selectedDonor && (
        <div className="absolute bottom-6 left-4 right-4 animate-in slide-in-from-bottom-20 duration-300 z-50">
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 relative">
            <button 
              onClick={() => setSelectedDonor(null)}
              className="absolute top-4 right-4 p-1.5 bg-gray-50 rounded-full text-gray-400 active:bg-gray-100"
            >
              <X size={18} />
            </button>
            
            <div className="flex gap-4 items-start mb-6">
              <div className="bg-red-100 w-14 h-14 rounded-2xl flex items-center justify-center text-red-600 font-black text-xl shadow-inner shrink-0">
                {selectedDonor.bloodGroup}
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h3 className="font-black text-gray-800 truncate text-lg">{selectedDonor.fullName}</h3>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <MapPin size={12} className="text-red-400" /> {selectedDonor.location.address}
                </p>
                <div className="mt-2 flex gap-2">
                   <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">READY TO DONATE</span>
                   <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">{selectedDonor.age} Years Old</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => window.location.href = `tel:${selectedDonor.phoneNumber}`}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 text-sm shadow-xl shadow-red-100 active:scale-95 transition-all"
              >
                <Phone size={18} /> Call Now
              </button>
              <button className="bg-gray-100 p-4 rounded-2xl text-gray-600 active:scale-95 transition-all">
                 <Navigation size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Left) */}
      {!selectedDonor && (
        <div className="absolute bottom-6 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-white/50 text-[10px] font-bold text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div> Available Donor
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Your Location
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;