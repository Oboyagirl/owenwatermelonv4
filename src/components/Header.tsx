import React from 'react';
import { ShieldAlert, Plus } from 'lucide-react';
import { triggerPanic } from '../data/cloakPresets';
import wmLogo from '../assets/images/owen_watermelon_logo_1790304644388.jpg';

interface HeaderProps {
  currentTab: 'games' | 'sandbox' | 'cloaker' | 'playground' | 'catalog';
  onSelectTab: (tab: 'games' | 'sandbox' | 'cloaker' | 'playground' | 'catalog') => void;
  onOpenAddGame: () => void;
  activeCloakTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddGame,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#08160f]/90 backdrop-blur-md border-b border-[#16402a] px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element brand wordmark */}
        <div 
          onClick={() => onSelectTab('games')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <img 
            src={wmLogo} 
            alt="Owen Watermelon V3" 
            className="w-8 h-8 rounded-lg object-cover border border-[#10b981]/30 group-hover:border-[#10b981] transition-colors"
            referrerPolicy="no-referrer"
          />
          <span className="text-lg lg:text-xl font-extrabold tracking-tight text-white group-hover:text-[#10b981] transition-colors whitespace-nowrap">
            Owen Watermelon <span className="text-[#ff2d55]">V3</span>
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('games')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'games' ? 'text-[#10b981] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Arcade Hub
          </button>
          <button
            onClick={() => onSelectTab('sandbox')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'sandbox' ? 'text-[#10b981] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Web Sandbox
          </button>
          <button
            onClick={() => onSelectTab('cloaker')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'cloaker' ? 'text-[#10b981] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Tab Cloaker
          </button>
          <button
            onClick={() => onSelectTab('playground')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'playground' ? 'text-[#10b981] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Code Sandbox
          </button>
          <button
            onClick={() => onSelectTab('catalog')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'catalog' ? 'text-[#10b981] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            JSON Catalog
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onOpenAddGame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981]/40 rounded-lg transition-all whitespace-nowrap cursor-pointer"
            title="Add game via iframe or JSON"
          >
            <Plus className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="hidden sm:inline">Add Game</span>
          </button>

          <button
            onClick={triggerPanic}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#ff2d55] hover:bg-[#e11d48] rounded-lg shadow-sm shadow-[#ff2d55]/30 transition-all whitespace-nowrap cursor-pointer"
            title="Emergency Panic: Immediately disguises tab to Google Classroom"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>Panic (Esc)</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-nav bar */}
      <div className="md:hidden flex items-center justify-around pt-3 border-t border-[#16402a] mt-2.5 text-xs">
        <button
          onClick={() => onSelectTab('games')}
          className={`${currentTab === 'games' ? 'text-[#10b981] font-bold' : 'text-slate-400'}`}
        >
          Arcade
        </button>
        <button
          onClick={() => onSelectTab('sandbox')}
          className={`${currentTab === 'sandbox' ? 'text-[#10b981] font-bold' : 'text-slate-400'}`}
        >
          Sandbox
        </button>
        <button
          onClick={() => onSelectTab('cloaker')}
          className={`${currentTab === 'cloaker' ? 'text-[#10b981] font-bold' : 'text-slate-400'}`}
        >
          Cloak
        </button>
        <button
          onClick={() => onSelectTab('playground')}
          className={`${currentTab === 'playground' ? 'text-[#10b981] font-bold' : 'text-slate-400'}`}
        >
          Editor
        </button>
        <button
          onClick={() => onSelectTab('catalog')}
          className={`${currentTab === 'catalog' ? 'text-[#10b981] font-bold' : 'text-slate-400'}`}
        >
          JSON
        </button>
      </div>
    </header>
  );
};
