import React, { useState, useMemo } from 'react';
import { BloodGroup, Donor } from '../types';
import { BLOOD_GROUPS, MOCK_DONORS, DONATION_INTERVAL_DAYS } from '../constants';
import { differenceInDays, addDays, format } from 'date-fns';
import { Phone, MapPin, User, ChevronRight, X, Droplets, Calendar, ShieldCheck } from 'lucide-react';

interface SearchProps {
  userLocation: { lat: number; lng: number } | null;
}

const Search: React.FC<SearchProps> = ({ userLocation }) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDonor, setActiveDonor] = useState<Donor | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
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
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-20 space-y-4 shadow-sm">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search name or location..." 
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button 
            onClick={() => setSelectedGroup(null)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all ${!selectedGroup ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-100 text-gray-500'}`}
          >
            ALL GROUPS
          </button>
          {BLOOD_GROUPS.map(group => (
            <button 
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all ${selectedGroup === group ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-white border border-gray-200 text-gray-600'}`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 pb-12">
        {filteredDonors.length > 0 ? (
          filteredDonors.map((donor) => {
            const available = donor.isAvailable && isEligible(donor.lastDonationDate);
            return (
              <div 
                key={donor.id} 
                onClick={() => setActiveDonor(donor)}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center space-x-4 active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 font-black text-xl shadow-inner">
                    {donor.bloodGroup}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${available ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 truncate">{donor.fullName}</h4>
                    <span className="text-[10px] text-red-600 font-black">
                      {donor.distance ? `${donor.distance.toFixed(1)} KM` : 'NEARBY'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-red-300" /> {donor.location.address}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className={`text-[10px] font-bold ${available ? 'text-green-600' : 'text-gray-400'}`}>
                      {available ? 'ELIBLE TO DONATE' : 'RECOVERY PERIOD'}
                    </span>
                  </div>
                </div>
                
                <ChevronRight size={18} className="text-gray-300 shrink-0" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <User className="text-gray-300" size={32} />
            </div>
            <h3 className="font-bold text-gray-800">No match found</h3>
            <p className="text-xs text-gray-400">Try broading your search or selecting 'All Groups'</p>
          </div>
        )}
      </div>

      {/* Donor Details Modal */}
      {activeDonor && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative animate-in slide-in-from-bottom-20">
             <button 
              onClick={() => setActiveDonor(null)}
              className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-600"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-red-100 rounded-[35px] flex items-center justify-center text-red-600 font-black text-4xl shadow-inner mb-6">
                 {activeDonor.bloodGroup}
               </div>
               <h2 className="text-2xl font-black text-gray-800 mb-1">{activeDonor.fullName}</h2>
               <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
                 <MapPin size={14} /> {activeDonor.location.address}
               </p>

               <div className="grid grid-cols-2 gap-3 w-full mt-8">
                  <div className="bg-gray-50 p-4 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age</p>
                    <p className="text-lg font-black text-gray-700">{activeDonor.age} Yrs</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Eligible</p>
                    <p className={`text-lg font-black ${isEligible(activeDonor.lastDonationDate) ? 'text-green-600' : 'text-red-400'}`}>
                      {isEligible(activeDonor.lastDonationDate) ? 'YES' : 'NO'}
                    </p>
                  </div>
               </div>

               <div className="w-full mt-4 bg-red-50 p-4 rounded-3xl border border-red-100 text-left">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-red-600" />
                    <div>
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-wider">Last Donation</p>
                      <p className="text-xs font-bold text-red-900">
                        {activeDonor.lastDonationDate ? format(new Date(activeDonor.lastDonationDate), 'PPP') : 'Never Donated'}
                      </p>
                    </div>
                  </div>
               </div>

               <button 
                onClick={() => window.location.href = `tel:${activeDonor.phoneNumber}`}
                className="w-full bg-red-600 text-white py-5 rounded-[28px] font-black flex items-center justify-center gap-3 text-lg mt-8 shadow-2xl shadow-red-200 active:scale-95 transition-all"
               >
                 <Phone size={22} fill="white" /> Contact Donor
               </button>

               <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                 <ShieldCheck size={14} className="text-green-500" /> VERIFIED BBDH DONOR
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;