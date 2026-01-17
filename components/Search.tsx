
import React, { useState, useMemo } from 'react';
import { BloodGroup, Donor } from '../types';
import { BLOOD_GROUPS, MOCK_DONORS, DONATION_INTERVAL_DAYS } from '../constants';
import { differenceInDays, addDays } from 'date-fns';
import { Phone, MapPin, User, ChevronRight } from 'lucide-react';

interface SearchProps {
  userLocation: { lat: number; lng: number } | null;
}

const Search: React.FC<SearchProps> = ({ userLocation }) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to calculate distance (Simplified Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredDonors = useMemo(() => {
    let result = MOCK_DONORS.map(donor => {
      let distance = 0;
      if (userLocation) {
        distance = calculateDistance(userLocation.lat, userLocation.lng, donor.location.lat, donor.location.lng);
      }
      return { ...donor, distance };
    });

    if (selectedGroup) {
      result = result.filter(d => d.bloodGroup === selectedGroup);
    }

    if (searchQuery) {
      result = result.filter(d => 
        d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by distance if location is available, otherwise default id
    return result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [selectedGroup, searchQuery, userLocation]);

  const isEligible = (lastDateStr: string | null) => {
    if (!lastDateStr) return true;
    const lastDate = new Date(lastDateStr);
    const nextDate = addDays(lastDate, DONATION_INTERVAL_DAYS);
    return differenceInDays(nextDate, new Date()) <= 0;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Sticky Header with Filters */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20 space-y-4 shadow-sm">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by name or area..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-500 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedGroup(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${!selectedGroup ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
          >
            All
          </button>
          {BLOOD_GROUPS.map(group => (
            <button 
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${selectedGroup === group ? 'bg-red-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600'}`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Donor List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => {
            const available = donor.isAvailable && isEligible(donor.lastDonationDate);
            return (
              <div key={donor.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 font-black text-xl shadow-inner">
                    {donor.bloodGroup}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 truncate">{donor.fullName}</h4>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                      {donor.distance ? `${donor.distance.toFixed(1)} km` : 'Near'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {donor.location.address}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => window.location.href = `tel:${donor.phoneNumber}`}
                      className="p-2 bg-red-50 text-red-600 rounded-lg active:bg-red-100"
                    >
                      <Phone size={16} />
                    </button>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <span className={`text-[10px] font-bold ${available ? 'text-green-600' : 'text-gray-400'}`}>
                      {available ? 'AVAILABLE TO DONATE' : 'CURRENTLY NOT ELIGIBLE'}
                    </span>
                  </div>
                </div>
                
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <User className="text-gray-400" size={32} />
            </div>
            <h3 className="font-bold text-gray-700">No Donors Found</h3>
            <p className="text-xs text-gray-400 px-10">Try changing your filters or searching for a different area.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
