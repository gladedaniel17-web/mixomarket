'use client';

import { useState, useEffect } from 'react';

const FAVORITES_STORAGE_KEY = 'mixomarket_favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch {
      // Local storage disabled or error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prev) => {
      const isFav = prev.includes(productId);
      const updated = isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  return {
    favoriteIds,
    isLoaded,
    toggleFavorite,
    isFavorite,
    count: favoriteIds.length,
  };
}
