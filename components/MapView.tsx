
import React from 'react';
import { Donor } from '../types';
import { Navigation, Info, Locate } from 'lucide-react';

interface MapViewProps {
  donors: Donor[];
  userLocation: { lat: number; lng: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ donors, userLocation }) => {
  // Note: For a real app, you'd use @googlemaps/react-wrapper or google-map-react.
  // Here we'll simulate a professional map UI with custom styling.
  
  return (
    <div className="relative h-full w-full bg-gray-100">
      {/* Mock Map Background - in real usage, replace with actual Google Map */}
      <div className="absolute inset-0 bg-[#e5e3df] overflow-hidden">
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
           <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
             <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.1"/>
           </pattern>
           <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Mock Grid Lines & Features */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
           <div className="w-[800px] h-px bg-gray-400 rotate-12"></div>
           <div className="w-[800px] h-px bg-gray-400 -rotate-45"></div>
           <div className="w-[800px] h-[400px] rounded-full border border-gray-400 border-dashed"></div>
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div 
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-ping absolute -inset-0"></div>
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10 border-2 border-blue-600">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Donor Markers */}
        {donors.map((donor, idx) => (
          <div 
            key={donor.id}
            className="absolute group"
            style={{ 
              left: `${30 + (idx * 20)}%`, 
              top: `${40 + (idx * 15)}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="flex flex-col items-center cursor-pointer">
              <div className="bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold mb-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {donor.fullName} ({donor.bloodGroup})
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-t-full rounded-br-full rotate-45 flex items-center justify-center shadow-lg border-2 border-white overflow-hidden">
                <span className="text-white text-[10px] font-black -rotate-45">{donor.bloodGroup}</span>
              </div>
              <div className="w-1 h-3 bg-red-600/40 mt-[-2px]"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Info & Actions */}
      <div className="absolute top-4 left-4 right-4 space-y-2">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 flex items-center space-x-3">
          <div className="bg-red-100 p-2 rounded-xl">
             <Locate size={18} className="text-red-600" />
          </div>
          <div className="flex-1">
             <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Current Location</p>
             <p className="text-xs font-semibold truncate">Dhanmondi, Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>

      {/* Bottom Floating Stats */}
      <div className="absolute bottom-24 left-4 right-4">
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between">
           <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Navigation size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">12 Nearby Donors</p>
                <p className="text-[10px] text-gray-500">Ready to donate now</p>
              </div>
           </div>
           <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-red-200">
              Refresh
           </button>
        </div>
      </div>

      <div className="absolute bottom-44 right-4 flex flex-col space-y-2">
         <button className="bg-white p-3 rounded-full shadow-lg text-gray-700 active:bg-gray-100">
            <Locate size={20} />
         </button>
         <button className="bg-white p-3 rounded-full shadow-lg text-gray-700 active:bg-gray-100">
            <Info size={20} />
         </button>
      </div>
    </div>
  );
};

export default MapView;
