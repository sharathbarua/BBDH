import React, { useState, useMemo } from 'react';
import { BloodGroup, Donor } from '../types';
import { BLOOD_GROUPS, DONATION_INTERVAL_DAYS } from '../constants';
import { differenceInDays, addDays, format } from 'date-fns';
import { Phone, MapPin, ChevronRight, X, Calendar, ShieldCheck, FilterX, Zap } from 'lucide-react';

interface SearchProps {
  donors: Donor[];
  userLocation: { lat: number; lng: number } | null;
  currentUser: Donor | null;
}

const Search: React.FC<SearchProps> = ({ donors, userLocation, currentUser }) => {
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
    let result = donors.map(donor => {
      let distance: number | null = null;
      if (userLocation) {
        distance = calculateDistance(userLocation.lat, userLocation.lng, donor.location.lat, donor.location.lng);
      }
      return { ...donor, distance };
    });

    if (selectedGroup) {
      result = result.filter(d => d.bloodGroup === selectedGroup);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.fullName.toLowerCase().includes(q) || 
        d.location.address.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
        if (a.distance !== null && b.distance !== null) {
            return a.distance - b.distance;
        }
        return a.fullName.localeCompare(b.fullName);
    });
  }, [donors, selectedGroup, searchQuery, userLocation]);

  const isEligible = (lastDateStr: string | null) => {
    if (!lastDateStr) return true;
    const lastDate = new Date(lastDateStr);
    const nextDate = addDays(lastDate, DONATION_INTERVAL_DAYS);
    return differenceInDays(nextDate, new Date()) <= 0;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-40 space-y-4 shadow-sm">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search donor name or area..." 
            className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
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
            className={`px-5 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all ${!selectedGroup ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
          >
            ALL
          </button>
          {BLOOD_GROUPS.map(group => (
            <button 
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all ${selectedGroup === group ? 'bg-red-600 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600'}`}
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
            const isMe = currentUser?.id === donor.id;
            
            return (
              <div 
                key={donor.id} 
                onClick={() => setActiveDonor(donor)}
                className={`bg-white rounded-3xl p-4 shadow-sm border flex items-center space-x-4 active:scale-[0.98] transition-all cursor-pointer ${isMe ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}
              >
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${isMe ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>
                    {donor.bloodGroup}
                  </div>
                  {available && (
                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                        <div className="w-4 h-4 rounded-full bg-green-500 absolute animate-ping opacity-40"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex justify-between items-center gap-2 mb-0.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <h4 className="font-bold text-gray-800 text-[15px] truncate max-w-[140px] sm:max-w-none">
                          {donor.fullName || 'Anonymous Donor'}
                        </h4>
                        {isMe && <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded-md font-black shrink-0">YOU</span>}
                    </div>
                    <span className="text-[9px] text-red-600 font-black shrink-0 bg-red-50 px-2 py-0.5 rounded-full border border-red-100/50">
                      {donor.distance !== null ? `${donor.distance.toFixed(1)} KM` : 'LOC OFF'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <MapPin size={10} className="text-red-300 shrink-0" /> 
                    <span className="truncate">{donor.location.address || 'Unknown Area'}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md tracking-tighter ${available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {available ? 'AVAILABLE NOW' : 'NOT ELIGIBLE'}
                    </span>
                    {available && <Zap size={10} className="text-yellow-500 fill-yellow-500" />}
                  </div>
                </div>
                
                <ChevronRight size={18} className="text-gray-300 shrink-0" />
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mb-4">
               <FilterX className="text-gray-300" size={40} />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">No Donors Found</h3>
            <p className="text-sm text-gray-400 max-w-[200px] mt-1">Try changing your blood group filter or search query.</p>
            <button 
              onClick={() => {setSelectedGroup(null); setSearchQuery('');}}
              className="mt-6 text-red-600 font-black text-xs uppercase tracking-widest bg-red-50 px-6 py-3 rounded-full active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {activeDonor && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-0 pb-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div onClick={() => setActiveDonor(null)} className="absolute inset-0"></div>
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 shadow-2xl relative animate-in slide-in-from-bottom-full duration-500">
             <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>
             
             <button 
              onClick={() => setActiveDonor(null)}
              className="absolute top-8 right-8 p-2 bg-gray-100 rounded-full text-gray-400 active:text-red-600 active:bg-red-50"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
               <div className={`w-24 h-24 rounded-[35px] flex items-center justify-center font-black text-4xl shadow-inner mb-6 ring-4 ring-white ${currentUser?.id === activeDonor.id ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>
                 {activeDonor.bloodGroup}
               </div>
               <div className="flex items-center gap-2 mb-1">
                 <h2 className="text-2xl font-black text-gray-800">{activeDonor.fullName || 'Anonymous Donor'}</h2>
                 {currentUser?.id === activeDonor.id && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">YOU</span>}
               </div>
               <p className="text-sm font-medium text-gray-400 flex items-center gap-1">
                 <MapPin size={14} className="text-red-400" /> {activeDonor.location.address || 'Unknown'}
               </p>

               <div className="grid grid-cols-2 gap-4 w-full mt-8">
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age</p>
                    <p className="text-lg font-black text-gray-800">{activeDonor.age || '--'} Years</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Eligible</p>
                    <p className={`text-lg font-black ${isEligible(activeDonor.lastDonationDate) ? 'text-green-600' : 'text-red-400'}`}>
                      {isEligible(activeDonor.lastDonationDate) ? 'YES' : 'RECOVERY'}
                    </p>
                  </div>
               </div>

               <div className="w-full mt-4 bg-red-50 p-5 rounded-3xl border border-red-100 text-left">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-2xl text-red-600 shadow-sm">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-wider">Last Donation</p>
                      <p className="text-sm font-bold text-red-900 mt-0.5">
                        {activeDonor.lastDonationDate ? format(new Date(activeDonor.lastDonationDate), 'MMMM do, yyyy') : 'First Time Donor'}
                      </p>
                    </div>
                  </div>
               </div>

               <button 
                onClick={() => {
                  if (currentUser?.id === activeDonor.id) {
                    alert("This is your profile.");
                    return;
                  }
                  if(!activeDonor.hidePhone) window.location.href = `tel:${activeDonor.phoneNumber}`;
                  else alert("This donor has hidden their contact info.");
                }}
                className="w-full bg-red-600 text-white py-5 rounded-[28px] font-black flex items-center justify-center gap-3 text-lg mt-8 shadow-2xl shadow-red-200 active:scale-95 transition-all"
               >
                 <Phone size={22} fill="white" /> 
                 {activeDonor.hidePhone ? 'Contact Hidden' : currentUser?.id === activeDonor.id ? 'Self Profile' : 'Call Donor'}
               </button>

               <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                 <ShieldCheck size={14} className="text-green-500" /> BBDH Verified Network
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;