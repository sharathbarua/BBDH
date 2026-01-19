import React, { useState, useEffect, useCallback } from 'react';
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

  // Unified donor list update logic
  const syncDonors = useCallback((profile: Donor | null) => {
    setDonors(prev => {
      // Start with the base mock donors
      let baseList = [...MOCK_DONORS];
      if (!profile) return baseList;
      
      // Filter out mock entry if it has the same ID (unlikely) or replace current user
      const filtered = baseList.filter(d => d.id !== profile.id);
      return [profile, ...filtered];
    });
  }, []);

  const handleUpdateProfile = useCallback((profile: Donor) => {
    setUserProfile(profile);
    localStorage.setItem('bbdh_profile', JSON.stringify(profile));
    syncDonors(profile);
  }, [syncDonors]);

  useEffect(() => {
    // 1. Load saved session first
    const savedProfileStr = localStorage.getItem('bbdh_profile');
    let currentProfile: Donor | null = null;
    
    if (savedProfileStr) {
      try {
        currentProfile = JSON.parse(savedProfileStr);
        setUserProfile(currentProfile);
        setShowLanding(false);
        syncDonors(currentProfile);
      } catch (e) {
        console.error("Failed to parse saved profile");
      }
    }

    // 2. Get geolocation and sync
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          
          // Update profile with location if it's the default one
          if (currentProfile && currentProfile.location.lat === 23.8103) {
            const updated = { ...currentProfile, location: { ...currentProfile.location, ...loc } };
            handleUpdateProfile(updated);
          }
        },
        (error) => console.error("Location error:", error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [handleUpdateProfile, syncDonors]);

  const handleLogin = (profile: Donor) => {
    handleUpdateProfile(profile);
    setShowLanding(false);
    setActiveTab('home');
  };

  const handleSkipLanding = () => {
    setShowLanding(false);
    setActiveTab('home');
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
      <header className="bg-red-600 text-white px-5 pt-12 pb-5 shadow-lg flex justify-between items-end shrink-0 z-[60]">
        <div>
          <h1 className="text-2xl font-black tracking-tighter leading-none">BBDH</h1>
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Bangladesh Blood Donation Hub</p>
        </div>
        <button className="bg-white/20 p-2.5 rounded-2xl active:scale-90 transition-transform">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar bg-gray-50 relative">
        {renderContent()}
      </main>

      <div className="shrink-0 bg-white border-t border-gray-100 z-[60]">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default App;