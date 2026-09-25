import React from 'react';
import { Play, Sparkles, Search, Heart, Flame, Gamepad2, Shield } from 'lucide-react';
import { Game } from '../types/game';
import arcadeBanner from '../assets/images/arcade_hero_banner_1790304665471.jpg';

interface HeroBannerProps {
  featuredGame?: Game;
  onPlay: (game: Game) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  totalGames: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredGame,
  onPlay,
  searchTerm,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  categories,
  totalGames
}) => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Featured Banner Card */}
      {featuredGame && (
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#16402a] bg-[#092015] shadow-2xl">
          {/* Backdrop image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={featuredGame.banner || arcadeBanner}
              alt="Featured Arcade"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-25 scale-105 blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07130c] via-[#07130c]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07130c] via-transparent to-transparent" />
          </div>

          {/* Banner content */}
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-4xl">
            <div className="flex flex-col gap-3">
              {/* Quiet kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#10b981]">
                <Flame className="w-4 h-4 text-[#ff2d55]" />
                <span>Featured Game · Owen Watermelon V3</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance">
                {featuredGame.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {featuredGame.description}
              </p>

              {/* Clean metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="text-[#a7f3d0] font-medium">{featuredGame.category}</span>
                <span aria-hidden="true">·</span>
                <span>★ {featuredGame.rating.toFixed(1)} Rating</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{featuredGame.plays.toLocaleString()} Plays</span>
              </div>

              {/* Play CTA */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => onPlay(featuredGame)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] font-bold text-sm rounded-xl shadow-lg shadow-[#10b981]/20 transition-all hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Play Featured Now</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Preview */}
            <div 
              onClick={() => onPlay(featuredGame)}
              className="hidden lg:block relative w-56 aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#10b981]/40 shadow-2xl shrink-0 cursor-pointer group"
            >
              <img
                src={featuredGame.thumbnail}
                alt={featuredGame.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#10b981] text-[#064e3b] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={`Search ${totalGames} unblocked games...`}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0c2016] border border-[#16402a] focus:border-[#10b981] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0c2016] border border-[#16402a] rounded-xl overflow-x-auto">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#10b981] text-[#064e3b] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#16402a]/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
