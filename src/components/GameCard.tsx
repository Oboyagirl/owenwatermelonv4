import React, { useState } from 'react';
import { Play, Heart, ExternalLink } from 'lucide-react';
import { Game } from '../types/game';
import { openAboutBlankGame } from '../services/gamesStore';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPlay: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative flex flex-col bg-[#0c2016] border border-[#16402a] hover:border-[#10b981]/60 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40">
      {/* Thumbnail area */}
      <div 
        onClick={() => onPlay(game)}
        className="relative aspect-[16/10] w-full bg-[#08160f] overflow-hidden cursor-pointer"
      >
        {!imgError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c2016] to-[#08160f] text-emerald-400 p-4">
            <span className="text-3xl mb-1">🍉</span>
            <span className="text-xs font-semibold text-slate-300 text-center">{game.title}</span>
          </div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPlay(game);
            }}
            className="w-11 h-11 rounded-full bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
            title="Play Game"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openAboutBlankGame(game);
            }}
            className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/20 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
            title="Launch in about:blank (Stealth Mode)"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer ${
            isFavorite
              ? 'bg-[#ff2d55]/80 text-white'
              : 'bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 
          onClick={() => onPlay(game)}
          className="text-base font-bold text-white group-hover:text-[#10b981] transition-colors line-clamp-1 cursor-pointer"
        >
          {game.title}
        </h3>

        {/* Anti-slop clean metadata with typographic separators */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
          <span className="text-[#6ee7b7] font-medium">{game.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>★ {game.rating.toFixed(1)}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums">{game.plays.toLocaleString()} plays</span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300/80 mt-2 line-clamp-2 leading-relaxed flex-1">
          {game.description}
        </p>

        {/* Action bar */}
        <div className="mt-3.5 pt-3 border-t border-[#16402a]/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
            {game.author}
          </span>
          <button
            onClick={() => onPlay(game)}
            className="text-xs font-semibold text-[#10b981] hover:text-[#34d399] flex items-center gap-1 transition-colors cursor-pointer"
          >
            Launch <Play className="w-3 h-3 fill-current ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
