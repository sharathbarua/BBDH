import React, { useState, useMemo } from 'react';
import { Donor } from '../types';
import { Navigation, Phone, MapPin, Locate, X, ShieldCheck, Zap } from 'lucide-react';

interface MapViewProps {
  donors: Donor[];
  userLocation: { lat: number; lng: number } | null;
  currentUser: Donor | null;
}

const MapView: React.FC<MapViewProps> = ({ donors, userLocation, currentUser }) => {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // Dynamic projection logic that adapts to the data bounds
  const projection = useMemo(() => {
    const allCoords = donors.map(d => d.location).filter(l => !!l);
    if (userLocation) allCoords.push(userLocation);

    if (allCoords.length === 0) return (lat: number, lng: number) => ({ x: 50, y: 50 });

    const lats = allCoords.map(c => c.lat);
    const lngs = allCoords.map(c => c.lng);

    // Padding
    const latMin = Math.min(...lats) - 0.005;
    const latMax = Math.max(...lats) + 0.005;
    const lngMin = Math.min(...lngs) - 0.005;
    const lngMax = Math.max(...lngs) + 0.005;

    return (lat: number, lng: number) => {
      const x = ((lng - lngMin) / (Math.max(0.001, lngMax - lngMin))) * 100;
      const y = (1 - (lat - latMin) / (Math.max(0.001, latMax - latMin))) * 100;
      return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
    };
  }, [donors, userLocation]);

  return (
    <div className="relative h-full w-full bg-[#f0f2f5] overflow-hidden">
      {/* Visual Map Decor */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', 
        backgroundSize: '24px 24px' 
      }}></div>

      {/* Pseudo-Map Streets */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,30 Q50,35 100,30 M20,0 Q25,50 20,100 M75,0 Q80,50 75,100" fill="none" stroke="#000" strokeWidth="0.5" />
        <path d="M40,0 L40,100 M0,60 L100,60" fill="none" stroke="#000" strokeWidth="0.3" />
      </svg>

      {/* Content Layer */}
      <div className="absolute inset-0">
        {/* User Location Pulse (Blue) */}
        {userLocation && (() => {
          const pos = projection(userLocation.lat, userLocation.lng);
          return (
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
              <div className="w-10 h-10 bg-blue-500/20 rounded-full animate-ping absolute -inset-0"></div>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-600 relative z-10">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          );
        })()}

        {/* Donor Markers */}
        {donors.map((donor) => {
          const pos = projection(donor.location.lat, donor.location.lng);
          const isSelected = selectedDonor?.id === donor.id;
          const isMe = currentUser?.id === donor.id;
          const isAvailable = donor.isAvailable;
          
          return (
            <div 
              key={donor.id}
              onClick={() => setSelectedDonor(donor)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: isSelected ? 50 : isMe ? 40 : 20 }}
            >
              <div className={`flex flex-col items-center group ${isSelected ? 'scale-125' : 'scale-100'}`}>
                {isAvailable && (
                    <div className="absolute -inset-2 bg-red-500/10 rounded-full animate-pulse"></div>
                )}
                <div className={`flex items-center justify-center w-10 h-10 rounded-2xl rounded-bl-none rotate-45 shadow-lg border-2 border-white transition-all ${isMe ? 'bg-black' : isSelected ? 'bg-red-800' : 'bg-red-600'}`}>
                  <span className="text-white text-[10px] font-black -rotate-45 leading-none">{donor.bloodGroup}</span>
                </div>
                {isMe && (
                    <div className="absolute -top-6 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/20">
                        YOU
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating UI */}
      <div className="absolute top-4 left-4 right-4 flex gap-2 z-40">
        <div className="flex-1 bg-white/95 backdrop-blur-md px-4 py-3.5 rounded-2xl shadow-xl border border-white flex items-center gap-3">
          <MapPin size={20} className="text-red-600" />
          <div className="flex-1">
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Live Directory</p>
             <p className="text-xs font-bold text-gray-800 truncate">{donors.length} Donors on Map</p>
          </div>
        </div>
        <button 
            onClick={() => {
                if (userLocation) {
                    // Force refresh/center could go here
                }
            }}
            className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white text-gray-700 active:scale-90 transition-transform"
        >
           <Locate size={22} />
        </button>
      </div>

      {/* Donor Bottom Card */}
      {selectedDonor && (
        <div className="absolute bottom-6 left-4 right-4 animate-in slide-in-from-bottom-20 duration-500 z-50">
          <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-gray-100 relative">
            <button 
              onClick={() => setSelectedDonor(null)}
              className="absolute top-5 right-5 p-2 bg-gray-50 rounded-full text-gray-400 active:bg-gray-100"
            >
              <X size={18} />
            </button>
            
            <div className="flex gap-4 items-center mb-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl shadow-lg shrink-0 ${currentUser?.id === selectedDonor.id ? 'bg-black text-white' : 'bg-red-600 text-white shadow-red-100'}`}>
                {selectedDonor.bloodGroup}
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-black text-gray-800 truncate text-lg">{selectedDonor.fullName}</h3>
                  {selectedDonor.isAvailable && <Zap size={14} className="text-yellow-500 fill-yellow-500" />}
                </div>
                <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                  <MapPin size={12} className="text-red-400" /> {selectedDonor.location.address || 'Unknown Address'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (currentUser?.id === selectedDonor.id) {
                    alert("This is your profile.");
                  } else if(!selectedDonor.hidePhone) {
                    window.location.href = `tel:${selectedDonor.phoneNumber}`;
                  } else {
                    alert("Private donor.");
                  }
                }}
                className={`flex-1 text-white py-4.5 rounded-[22px] font-black flex items-center justify-center gap-2 text-sm shadow-xl active:scale-95 transition-all ${currentUser?.id === selectedDonor.id ? 'bg-gray-400' : 'bg-red-600 shadow-red-200'}`}
              >
                <Phone size={18} fill="white" /> {currentUser?.id === selectedDonor.id ? 'My Profile' : 'Call Now'}
              </button>
              <button className="bg-gray-100 p-4.5 rounded-[22px] text-gray-600 active:bg-gray-200 active:scale-95 transition-all">
                 <Navigation size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Legend */}
      {!selectedDonor && (
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg border border-white/50 text-[10px] font-black text-gray-500 flex flex-col gap-1.5 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div> Nearby Donor
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-black rounded-full"></div> Your Profile
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full border border-white"></div> Current Location
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;