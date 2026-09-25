import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ExternalLink, 
  Heart, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles,
  Info,
  Tv
} from 'lucide-react';
import { Game } from '../types/game';
import { openAboutBlankGame } from '../services/gamesStore';

interface GamePlayerProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onSelectGame: (game: Game) => void;
  allGames: Game[];
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onBack,
  onSelectGame,
  allGames
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen request failed', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error('Exit fullscreen failed', err);
      });
    }
  };

  const handleReload = () => {
    setKeyCounter(prev => prev + 1);
  };

  const handleCopyEmbed = () => {
    const code = game.iframeCode || `<iframe src="${window.location.origin}${game.iframeSrc}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedGames = allGames.filter(g => g.id !== game.id).slice(0, 4);

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6 ${isTheater ? 'max-w-none px-2 lg:px-4' : ''}`}>
      {/* Top action navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Games</span>
        </button>

        {/* Clean breadcrumb metadata */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span>{game.category}</span>
          <span aria-hidden="true">/</span>
          <span className="text-white font-medium">{game.title}</span>
        </div>

        <button
          onClick={() => openAboutBlankGame(game)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#10b981] bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/30 rounded-lg transition-colors cursor-pointer"
          title="Open in stealth about:blank window"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Stealth Window (about:blank)</span>
        </button>
      </div>

      {/* Main Game Player Frame Container */}
      <div 
        ref={containerRef}
        className={`relative w-full bg-[#050d09] border border-[#16402a] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
          isTheater ? 'h-[85vh]' : 'h-[620px] lg:h-[700px]'
        }`}
      >
        {/* In-player top toolbar */}
        <div className="h-12 bg-[#08160f] border-b border-[#16402a] px-4 flex items-center justify-between select-none shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <h2 className="text-sm font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-md">
              {game.title}
            </h2>
            <span className="hidden md:inline text-xs text-slate-500">·</span>
            <span className="hidden md:inline text-xs text-slate-400">{game.author}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isFavorite ? 'text-[#ff2d55] bg-[#ff2d55]/15' : 'text-slate-400 hover:text-white hover:bg-[#16402a]'
              }`}
              title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleReload}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#16402a] transition-colors cursor-pointer"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsTheater(!isTheater)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isTheater ? 'text-[#10b981] bg-[#10b981]/20' : 'text-slate-400 hover:text-white hover:bg-[#16402a]'
              }`}
              title="Theater Mode"
            >
              <Tv className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#16402a] transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* The Game Iframe */}
        <div className="relative flex-1 w-full h-full bg-[#08160f] overflow-hidden">
          <iframe
            key={`${game.id}-${keyCounter}`}
            ref={iframeRef}
            src={game.customHtml ? undefined : game.iframeSrc}
            srcDoc={game.customHtml || undefined}
            title={game.title}
            className="w-full h-full border-0 block"
            allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
          />
        </div>
      </div>

      {/* Game Information & Controls Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns: Description & Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#0c2016] border border-[#16402a] rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#16402a]">
              <div>
                <h3 className="text-xl font-bold text-white">{game.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="text-[#10b981] font-semibold">{game.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{game.plays.toLocaleString()} plays</span>
                  <span aria-hidden="true">·</span>
                  <span>Rating: ★ {game.rating.toFixed(1)}</span>
                </div>
              </div>

              <button
                onClick={handleCopyEmbed}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#16402a]/60 hover:bg-[#16402a] rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Iframe!' : 'Copy Iframe Code'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              {game.description}
            </p>

            {/* Controls table */}
            {game.controls && game.controls.length > 0 && (
              <div className="mt-6 pt-5 border-t border-[#16402a]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6ee7b7] mb-3 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  How to Play & Controls
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {game.controls.map((ctrl, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#08160f] border border-[#16402a]"
                    >
                      <span className="text-xs text-slate-300">{ctrl.action}</span>
                      <kbd className="px-2 py-0.5 text-xs font-mono text-[#a7f3d0] bg-[#16402a] rounded border border-[#2d6a4f]">
                        {ctrl.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags (Anti-slop: clean unboxed text) */}
            {game.tags && game.tags.length > 0 && (
              <div className="mt-5 pt-4 border-t border-[#16402a] flex items-center gap-2 text-xs text-slate-400">
                <span className="text-slate-500">Tags:</span>
                {game.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span className="text-slate-300">{tag}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Related Games */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10b981]" />
            More Games from JSON
          </h4>
          <div className="flex flex-col gap-3">
            {relatedGames.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectGame(rel)}
                className="flex items-center gap-3 p-2.5 bg-[#0c2016] border border-[#16402a] hover:border-[#10b981]/50 rounded-xl cursor-pointer transition-colors group"
              >
                <img
                  src={rel.thumbnail}
                  alt={rel.title}
                  className="w-14 h-14 rounded-lg object-cover bg-[#08160f] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-white group-hover:text-[#10b981] transition-colors truncate">
                    {rel.title}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <span>{rel.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>★ {rel.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
