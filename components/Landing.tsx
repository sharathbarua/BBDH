import React, { useState } from 'react';
import { Droplets, ShieldCheck, Users, ArrowRight, User, Phone, ChevronDown } from 'lucide-react';
import { BloodGroup, Donor } from '../types';
import { BLOOD_GROUPS } from '../constants';

interface LandingProps {
  onLogin: (profile: Donor) => void;
  onSkip: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin, onSkip }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [showForm, setShowForm] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newProfile: Donor = {
      id: Date.now().toString(),
      fullName: name,
      phoneNumber: phone,
      bloodGroup: bloodGroup,
      age: 25,
      location: { lat: 23.8103, lng: 90.4125, address: 'Dhaka, Bangladesh' },
      lastDonationDate: null,
      isAvailable: true,
      hidePhone: false,
    };
    onLogin(newProfile);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-b from-red-600 via-red-700 to-black text-white flex flex-col overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center text-center px-8 transition-all duration-500 ${showForm ? 'mt-[-10%]' : 'mt-0'}`}>
        {!showForm ? (
          <>
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Droplets size={60} className="text-white fill-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full border-4 border-red-700 shadow-xl">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-6xl font-black tracking-tighter mb-1">BBDH</h1>
              <p className="text-[10px] font-medium opacity-80 uppercase tracking-[0.4em] mb-6">Blood Donation Hub</p>
              <p className="text-lg font-light text-red-100 max-w-xs mx-auto leading-relaxed">
                Empowering the community through life-saving donations.
              </p>
            </div>

            <div className="w-full mt-12">
              <button 
                onClick={() => setShowForm(true)}
                className="w-full bg-white text-red-700 font-black py-5 rounded-2xl flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-all group mb-4"
              >
                <span>GET STARTED NOW</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onSkip}
                className="text-white/60 text-sm font-bold hover:text-white transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="text-left mb-8">
              <h2 className="text-3xl font-black mb-2">Create Profile</h2>
              <p className="text-red-200 text-sm">Join the network of heroes.</p>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-white/30"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                  <Phone size={20} />
                </div>
                <input 
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-white/30"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors pointer-events-none">
                  <Droplets size={20} />
                </div>
                <select 
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-10 outline-none focus:ring-2 focus:ring-white/50 transition-all appearance-none"
                >
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg} className="text-gray-900">{bg}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                  <ChevronDown size={20} />
                </div>
              </div>

              <button 
                type="submit"
                disabled={!name || !phone}
                className="w-full bg-white text-red-700 font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all mt-4 disabled:opacity-50"
              >
                JOIN HUB
              </button>

              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full text-white/40 text-xs font-bold uppercase tracking-widest mt-4"
              >
                Go Back
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer stats on landing only */}
      {!showForm && (
        <div className="flex justify-center space-x-12 pb-12 opacity-60">
          <div className="flex flex-col items-center">
            <Users size={20} />
            <span className="text-[9px] mt-1 font-bold uppercase tracking-wider">5k Donors</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck size={20} />
            <span className="text-[9px] mt-1 font-bold uppercase tracking-wider">Verified</span>
          </div>
          <div className="flex flex-col items-center">
            <Droplets size={20} />
            <span className="text-[9px] mt-1 font-bold uppercase tracking-wider">Free</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;