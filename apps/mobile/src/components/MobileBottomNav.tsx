import React from 'react';
import { Home, Folder, Clock, Edit3, Settings } from 'lucide-react';

export type MobileTab = 'home' | 'files' | 'recent' | 'editor' | 'settings';

export interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const items: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'files', label: 'Files', icon: <Folder className="w-5 h-5" /> },
    { id: 'editor', label: 'Editor', icon: <Edit3 className="w-5 h-5" /> },
    { id: 'recent', label: 'Recent', icon: <Clock className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav
      className="bg-slate-950/95 backdrop-blur-2xl border-t border-cyan-500/20 px-2 pt-1 safe-bottom flex items-center justify-around select-none z-30 shrink-0"
      aria-label="Mobile Navigation"
    >
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-colors cursor-pointer ${
              isActive
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 active:text-cyan-300'
            }`}
          >
            <div className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
