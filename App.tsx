
import React, { useState, useEffect } from 'react';
import { AppTab, Donor } from './types';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Search from './components/Search';
import MapView from './components/MapView';
import Profile from './components/Profile';
import { MOCK_DONORS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [userProfile, setUserProfile] = useState<Donor | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Attempt to get user location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }

    // Try to load user profile from local storage
    const savedProfile = localStorage.getItem('bbdh_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleUpdateProfile = (profile: Donor) => {
    setUserProfile(profile);
    localStorage.setItem('bbdh_profile', JSON.stringify(profile));
  };

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
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 shadow-md flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">BBDH</h1>
          <p className="text-[10px] opacity-80 uppercase tracking-widest">Bangladesh Blood Donation Hub</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      {/* Sticky Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
