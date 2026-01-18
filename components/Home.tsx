import React from 'react';
import { Donor, AppTab } from '../types';
import { differenceInDays, addDays, format } from 'date-fns';
import { DONATION_INTERVAL_DAYS, MOCK_URGENT_REQUESTS } from '../constants';
import { 
  AlertCircle, 
  Phone, 
  Calendar, 
  Droplets, 
  Search as SearchIcon, 
  Map as MapIcon 
} from 'lucide-react';

interface HomeProps {
  userProfile: Donor | null;
  onTabChange: (tab: AppTab) => void;
}

const Home: React.FC<HomeProps> = ({ userProfile, onTabChange }) => {
  const calculateEligibility = () => {
    if (!userProfile?.lastDonationDate) return { eligible: true, daysLeft: 0 };
    
    const lastDate = new Date(userProfile.lastDonationDate);
    const nextDate = addDays(lastDate, DONATION_INTERVAL_DAYS);
    const daysLeft = differenceInDays(nextDate, new Date());
    
    return {
      eligible: daysLeft <= 0,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      nextDate: format(nextDate, 'PPP')
    };
  };

  const status = calculateEligibility();

  return (
    <div className="p-4 space-y-6 pb-12">
      {/* Welcome & Eligibility Card */}
      <section>
        <div className="bg-gradient-to-br from-red-600 to-red-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Hello, {userProfile?.fullName || 'Donor'}!</h2>
            <p className="text-red-100 text-sm mb-6">Your blood type: <span className="font-bold text-white">{userProfile?.bloodGroup || 'Not Set'}</span></p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              {status.eligible ? (
                <div className="flex items-center space-x-3">
                  <div className="bg-green-400 p-2 rounded-full shadow-inner">
                    <Droplets className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">You are eligible to donate!</p>
                    <p className="text-[10px] text-red-600 font-bold bg-white px-2 py-0.5 rounded-full inline-block mt-1 uppercase">Ready to Save Lives</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-white opacity-80" size={20} />
                    <div>
                      <p className="text-xs opacity-80">Next donation eligible in:</p>
                      <p className="text-2xl font-black">{status.daysLeft} Days</p>
                    </div>
                  </div>
                  <p className="text-[9px] opacity-70 italic mt-1 text-center border-t border-white/10 pt-2">
                    Standard {DONATION_INTERVAL_DAYS}-day interval for safety
                  </p>
                </div>
              )}
            </div>
          </div>
          <Droplets size={120} className="absolute -bottom-10 -right-5 opacity-10 text-white rotate-12" />
        </div>
      </section>

      {/* Urgent Requests Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
            <AlertCircle className="text-red-600" size={20} />
            Urgent Requests
          </h3>
          <button type="button" className="text-red-600 text-xs font-bold active:opacity-60 cursor-pointer uppercase tracking-wider">View All</button>
        </div>

        <div className="space-y-4">
          {MOCK_URGENT_REQUESTS.map((request) => (
            <div key={request.id} className="bg-white border border-red-100 rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="max-w-[70%]">
                  <h4 className="font-bold text-gray-800 truncate">{request.patientName}</h4>
                  <p className="text-[11px] text-gray-500 font-medium">{request.hospital}</p>
                </div>
                <div className="bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-2xl text-xs font-black shadow-lg shadow-red-100">
                  {request.bloodGroup}
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-4 line-clamp-2 italic leading-relaxed">"{request.message}"</p>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => window.location.href = `tel:${request.contactNumber}`}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-all active:scale-95 shadow-lg shadow-red-100 cursor-pointer"
                >
                  <Phone size={16} /> Contact Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={() => onTabChange('search')}
          className="bg-white border border-gray-100 p-5 rounded-3xl flex flex-col items-center justify-center space-y-2 shadow-sm active:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <div className="bg-red-50 p-3 rounded-2xl text-red-600">
            <SearchIcon size={24} />
          </div>
          <span className="text-sm font-bold text-gray-700">Find Donor</span>
        </button>
        <button 
          type="button"
          onClick={() => onTabChange('map')}
          className="bg-white border border-gray-100 p-5 rounded-3xl flex flex-col items-center justify-center space-y-2 shadow-sm active:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
            <MapIcon size={24} />
          </div>
          <span className="text-sm font-bold text-gray-700">Live Map</span>
        </button>
      </section>

      {/* Footer Branding */}
      <footer className="pt-8 pb-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2 opacity-30">
          <div className="h-px w-8 bg-gray-400"></div>
          <Droplets size={14} className="text-red-600" />
          <div className="h-px w-8 bg-gray-400"></div>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">BBDH Network</p>
        <p className="text-[9px] text-gray-400 mt-1">Safe • Reliable • Direct</p>
      </footer>
    </div>
  );
};

export default Home;