import { useState, useEffect } from 'react';
import { Game } from '../types/game';
import { DEFAULT_GAMES } from '../data/defaultGames';

const STORAGE_KEY = 'owen_watermelon_v3_games';
const FAVORITES_KEY = 'owen_watermelon_v3_favorites';

export function useGamesStore() {
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse cached games', e);
    }
    return DEFAULT_GAMES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem(FAVORITES_KEY);
      return cached ? JSON.parse(cached) : ['watermelon-merge'];
    } catch {
      return ['watermelon-merge'];
    }
  });

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save games to localStorage', e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev =>
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const addGame = (newGame: Omit<Game, 'id' | 'plays' | 'rating'>) => {
    const id = 'custom-' + Date.now();
    const game: Game = {
      ...newGame,
      id,
      plays: 1,
      rating: 5.0,
      isCustom: true
    };
    setGames(prev => [game, ...prev]);
    return game;
  };

  const removeGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    if (selectedGame?.id === gameId) {
      setSelectedGame(null);
    }
  };

  const resetToDefault = () => {
    setGames(DEFAULT_GAMES);
    localStorage.removeItem(STORAGE_KEY);
  };

  const importJsonCatalog = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setGames(parsed);
        return true;
      }
    } catch (err) {
      console.error('Invalid JSON file', err);
    }
    return false;
  };

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'games.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const recordPlay = (gameId: string) => {
    setGames(prev =>
      prev.map(g => (g.id === gameId ? { ...g, plays: g.plays + 1 } : g))
    );
  };

  return {
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
  };
}

export function openAboutBlankGame(game: Game) {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Popup was blocked. Please allow popups for about:blank cloaking.');
    return;
  }

  win.document.title = game.title;
  const doc = win.document;
  doc.body.style.margin = '0';
  doc.body.style.height = '100vh';
  doc.body.style.overflow = 'hidden';
  doc.body.style.backgroundColor = '#08140e';

  const iframe = doc.createElement('iframe');
  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.margin = '0';
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.setAttribute('allow', 'autoplay; fullscreen; keyboard');

  if (game.iframeSrc.startsWith('http') || game.iframeSrc.startsWith('/')) {
    // If relative path, use current origin
    iframe.src = game.iframeSrc.startsWith('/') ? window.location.origin + game.iframeSrc : game.iframeSrc;
  } else if (game.iframeSrc.startsWith('data:')) {
    iframe.src = game.iframeSrc;
  } else if (game.customHtml) {
    iframe.srcdoc = game.customHtml;
  } else {
    iframe.src = window.location.origin + '/games/watermelon-merge.html';
  }

  doc.body.appendChild(iframe);
}
