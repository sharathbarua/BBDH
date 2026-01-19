import React, { useState, useEffect } from 'react';
import { AppTab, Donor } from './types';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Search from './components/Search';
import MapView from './components/MapView';
import Profile from './components/Profile';
import Landing from './components/Landing';
import { MOCK_DONORS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [userProfile, setUserProfile] = useState<Donor | null>(null);
  const [donors, setDonors] = useState<Donor[]>(MOCK_DONORS);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showLanding, setShowLanding] = useState<boolean>(true);

  useEffect(() => {
    // Get initial geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          // If we have a profile but it has default location, update it
          setUserProfile(prev => {
            if (prev && prev.location.lat === 23.8103) {
                return { ...prev, location: { ...prev.location, ...loc } };
            }
            return prev;
          });
        },
        (error) => console.error("Location error:", error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    // Load saved session
    const savedProfile = localStorage.getItem('bbdh_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setUserProfile(parsed);
      setShowLanding(false);
      
      // Upsert the user to the donors list
      setDonors(prev => {
        const others = prev.filter(d => d.id !== parsed.id);
        return [parsed, ...others];
      });
    }
  }, []);

  const handleLogin = (profile: Donor) => {
    setUserProfile(profile);
    setDonors(prev => {
      const others = prev.filter(d => d.id !== profile.id);
      return [profile, ...others];
    });
    localStorage.setItem('bbdh_profile', JSON.stringify(profile));
    setShowLanding(false);
    setActiveTab('home');
  };

  const handleSkipLanding = () => {
    setShowLanding(false);
    setActiveTab('home');
  };

  const handleUpdateProfile = (profile: Donor) => {
    setUserProfile(profile);
    setDonors(prev => {
      const others = prev.filter(d => d.id !== profile.id);
      return [profile, ...others];
    });
    localStorage.setItem('bbdh_profile', JSON.stringify(profile));
  };

  if (showLanding && !userProfile) {
    return <Landing onLogin={handleLogin} onSkip={handleSkipLanding} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home userProfile={userProfile} onTabChange={setActiveTab} donorsCount={donors.length} />;
      case 'search':
        return <Search donors={donors} userLocation={userLocation} currentUser={userProfile} />;
      case 'map':
        return <MapView donors={donors} userLocation={userLocation} currentUser={userProfile} />;
      case 'profile':
        return <Profile userProfile={userProfile} onUpdate={handleUpdateProfile} />;
      default:
        return <Home userProfile={userProfile} onTabChange={setActiveTab} donorsCount={donors.length} />;
    }
  };

  return (
    <div className="app-container flex flex-col bg-white max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Header with notch padding */}
      <header className="bg-red-600 text-white px-5 pt-12 pb-5 shadow-lg flex justify-between items-end shrink-0 z-[60]">
        <div>
          <h1 className="text-2xl font-black tracking-tighter leading-none">BBDH</h1>
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Bangladesh Blood Donation Hub</p>
        </div>
        <button className="bg-white/20 p-2.5 rounded-2xl active:scale-90 transition-transform">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar bg-gray-50 relative">
        {renderContent()}
      </main>

      {/* Navigation - Guaranteed visible at bottom */}
      <div className="shrink-0 bg-white border-t border-gray-100 z-[60]">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default App;