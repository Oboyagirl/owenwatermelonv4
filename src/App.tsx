/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { WebSandboxViewer } from './components/WebSandboxViewer';
import { TabCloaker } from './components/TabCloaker';
import { CodePlayground } from './components/CodePlayground';
import { JsonManagerModal } from './components/JsonManagerModal';
import { useGamesStore } from './services/gamesStore';
import { Game } from './types/game';
import { triggerPanic } from './data/cloakPresets';
import { Flame, Heart, Sparkles, FolderDown, Terminal } from 'lucide-react';

export default function App() {
  const {
    games,
    favorites,
    selectedGame,
    setSelectedGame,
    toggleFavorite,
    addGame,
    removeGame,
    resetToDefault,
    importJsonCatalog,
    downloadJson,
    recordPlay
  } = useGamesStore();

  const [currentTab, setCurrentTab] = useState<'games' | 'sandbox' | 'cloaker' | 'playground' | 'catalog'>('games');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Global Panic Key Listener (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is inside code editor textarea or input, allow normal escape unless Escape with Shift
      if (e.key === 'Escape' && !isJsonModalOpen && !selectedGame) {
        triggerPanic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJsonModalOpen, selectedGame]);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    recordPlay(game.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setSelectedGame(null);
  };

  const categories = ['All', 'Favorites', 'Puzzle', 'Arcade', 'Action', 'Casual', 'Sports', 'Custom'];

  const filteredGames = games.filter(g => {
    const matchesSearch = 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.tags && g.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Favorites') return favorites.includes(g.id);
    if (selectedCategory === 'Custom') return !!g.isCustom;
    return g.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const featuredGame = games.find(g => g.featured) || games[0];
  const favoriteGamesList = games.filter(g => favorites.includes(g.id));

  return (
    <div className="min-h-screen bg-[#07130c] text-slate-100 flex flex-col selection:bg-[#ff2d55]/30 selection:text-white">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab === 'catalog') {
            setIsJsonModalOpen(true);
          } else {
            setCurrentTab(tab);
            setSelectedGame(null);
          }
        }}
        onOpenAddGame={() => setIsJsonModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {/* GAME PLAYER VIEW */}
        {selectedGame ? (
          <GamePlayer
            game={selectedGame}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={toggleFavorite}
            onBack={handleBackToHub}
            onSelectGame={handleSelectGame}
            allGames={games}
          />
        ) : (
          <>
            {/* ARCADE GAMES HUB */}
            {currentTab === 'games' && (
              <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col gap-10">
                {/* Hero Spotlight & Filters */}
                <HeroBanner
                  featuredGame={featuredGame}
                  onPlay={handleSelectGame}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  activeCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  categories={categories}
                  totalGames={games.length}
                />

                {/* Quick Favorites Section if any */}
                {selectedCategory === 'All' && !searchTerm && favoriteGamesList.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#ff2d55] fill-current" />
                        <h2 className="text-lg font-bold text-white tracking-tight">
                          Your Starred Favorites
                        </h2>
                      </div>
                      <span className="text-xs text-slate-400 font-mono tabular-nums">
                        {favoriteGamesList.length} {favoriteGamesList.length === 1 ? 'game' : 'games'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {favoriteGamesList.slice(0, 4).map(game => (
                        <GameCard
                          key={game.id}
                          game={game}
                          isFavorite={true}
                          onToggleFavorite={toggleFavorite}
                          onPlay={handleSelectGame}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Filtered Games Grid */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#10b981]" />
                      <span>{selectedCategory === 'All' ? 'Complete Games Catalog' : `${selectedCategory} Games`}</span>
                    </h2>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      Showing {filteredGames.length} of {games.length}
                    </span>
                  </div>

                  {filteredGames.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filteredGames.map(game => (
                        <GameCard
                          key={game.id}
                          game={game}
                          isFavorite={favorites.includes(game.id)}
                          onToggleFavorite={toggleFavorite}
                          onPlay={handleSelectGame}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-[#0c2016] border border-[#16402a] rounded-2xl flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">🍉</span>
                      <h3 className="text-base font-bold text-white">No matching games found</h3>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Try adjusting your search query or select another category from the filters above.
                      </p>
                      <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                        className="mt-2 px-4 py-2 bg-[#10b981] hover:bg-[#34d399] text-[#064e3b] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WEB SANDBOX VIEWER TAB */}
            {currentTab === 'sandbox' && <WebSandboxViewer />}

            {/* TAB CLOAKER & CAMOUFLAGE TAB */}
            {currentTab === 'cloaker' && <TabCloaker />}

            {/* CODE PLAYGROUND & GAME EMBEDDER TAB */}
            {currentTab === 'playground' && (
              <CodePlayground onAddGameToStore={addGame} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#050d09] border-t border-[#16402a] px-4 lg:px-8 py-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Owen Watermelon V3</span>
            <span>·</span>
            <span>Unblocked Games & Web Utilities Template</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>Download games.json</span>
            </button>
            <span>·</span>
            <span className="text-slate-500 font-mono">Press Esc to Panic</span>
          </div>
        </div>
      </footer>

      {/* JSON Catalog Manager Modal */}
      <JsonManagerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportJson={importJsonCatalog}
        onDownloadJson={downloadJson}
        onResetToDefault={resetToDefault}
        onAddGame={addGame}
      />
    </div>
  );
}
