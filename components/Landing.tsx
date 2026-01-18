import React from 'react';
import { Droplets, ShieldCheck, Users, ArrowRight } from 'lucide-react';

interface LandingProps {
  onJoin: () => void;
  onSkip: () => void;
}

const Landing: React.FC<LandingProps> = ({ onJoin, onSkip }) => {
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-b from-red-600 via-red-700 to-black text-white flex flex-col p-8 overflow-hidden relative">
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

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 relative z-10">
        <div className="relative">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Droplets size={60} className="text-white fill-white" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full border-4 border-red-700">
            <ShieldCheck size={20} className="text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">BBDH</h1>
          <p className="text-sm font-medium opacity-80 uppercase tracking-[0.3em] mb-4">Bhuddist Blood Donation Hub</p>
          <p className="text-lg font-light text-red-100 max-w-xs mx-auto">
            Connecting donors and patients across Bangladesh, one drop at a time.
          </p>
        </div>

        <div className="w-full space-y-6 pt-8">
           <div className="flex justify-center space-x-12 opacity-80">
              <div className="flex flex-col items-center">
                <Users size={24} />
                <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">5k+ Donors</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck size={24} />
                <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Verified</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplets size={24} />
                <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Free</span>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-4 pb-12 relative z-10">
        <button 
          onClick={onJoin}
          className="w-full bg-white text-red-700 font-black py-5 rounded-2xl flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-all group"
        >
          <span>JOIN AS A DONOR</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button 
          onClick={onSkip}
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 rounded-2xl active:bg-white/20 transition-all text-sm"
        >
          CONTINUE AS GUEST
        </button>
        
        <p className="text-[10px] text-center text-white/40 uppercase tracking-widest pt-4">
          By continuing, you agree to save lives.
        </p>
      </div>
    </div>
  );
};

export default Landing;