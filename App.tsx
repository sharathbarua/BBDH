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
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showLanding, setShowLanding] = useState<boolean>(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location error:", error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    const savedProfile = localStorage.getItem('bbdh_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setShowLanding(false);
    }
  }, []);

  const handleLogin = (profile: Donor) => {
    setUserProfile(profile);
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
    localStorage.setItem('bbdh_profile', JSON.stringify(profile));
  };

  if (showLanding && !userProfile) {
    return <Landing onLogin={handleLogin} onSkip={handleSkipLanding} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home userProfile={userProfile} onTabChange={setActiveTab} />;
      case 'search':
        return <Search userLocation={userLocation} />;
      case 'map':
        return <MapView donors={MOCK_DONORS} userLocation={userLocation} />;
      case 'profile':
        return <Profile userProfile={userProfile} onUpdate={handleUpdateProfile} />;
      default:
        return <Home userProfile={userProfile} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white max-w-md mx-auto shadow-2xl overflow-hidden h-screen-dynamic">
      {/* Header - Fixed Height */}
      <header className="bg-red-600 text-white px-4 py-3 shadow-md flex justify-between items-center shrink-0 z-50">
        <div>
          <h1 className="text-xl font-bold tracking-tight leading-tight">BBDH</h1>
          <p className="text-[9px] opacity-80 uppercase tracking-widest leading-none">Bhuddist Blood Donation Hub</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full active:scale-90 transition-transform cursor-pointer">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
      </header>

      {/* Main Content Area - Scrollable with momentum scroll */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar bg-gray-50" style={{ WebkitOverflowScrolling: 'touch' }}>
        {renderContent()}
      </main>

      {/* Bottom Navigation - Locked to bottom */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;