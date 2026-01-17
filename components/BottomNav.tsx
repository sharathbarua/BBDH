
import React from 'react';
import { AppTab } from '../types';
import { Home, Search, Map, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AppTab)}
            className={`flex flex-col items-center justify-center space-y-1 w-1/4 transition-colors ${
              isActive ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            <Icon size={22} fill={isActive ? 'currentColor' : 'none'} className={isActive ? 'opacity-100' : 'opacity-70'} />
            <span className={`text-[10px] font-medium ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
              {tab.label}
            </span>
            {isActive && <div className="w-1 h-1 bg-red-600 rounded-full mt-1"></div>}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
