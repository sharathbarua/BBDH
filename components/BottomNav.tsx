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
    <nav className="shrink-0 bg-white border-t border-gray-100 flex justify-around items-end pt-2 pb-1 safe-area-bottom shadow-[0_-8px_25px_rgba(0,0,0,0.05)] z-[100] relative">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as AppTab)}
            className={`flex flex-col items-center justify-center py-2 w-full transition-all active:scale-95 cursor-pointer tap-highlight-transparent ${
              isActive ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-red-50' : 'bg-transparent'}`}>
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? 'rgba(220, 38, 38, 0.1)' : 'none'} 
              />
            </div>
            <span className={`text-[10px] font-bold mt-1 tracking-tight ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;