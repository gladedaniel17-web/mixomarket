'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FavoritesPage() {
  const { favoriteIds, isLoaded } = useFavorites();

  const favoriteProducts = PRODUCTS.filter((p) => favoriteIds.includes(p.id));

  if (!isLoaded) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto text-center text-[#A3A3A3]">
        Chargement de vos favoris...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Heart className="w-8 h-8 text-[#D4740A] fill-current" />
          <span>Mes Favoris ({favoriteProducts.length})</span>
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          Retrouvez les articles que vous avez sauvegardés pour vos prochains achats.
        </p>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-panel rounded-2xl max-w-md mx-auto p-8">
          <Heart className="w-16 h-16 text-[#737373] mx-auto mb-4 stroke-1" />
          <h2 className="text-xl font-bold text-white mb-2">Aucun favori pour le moment</h2>
          <p className="text-xs text-[#A3A3A3] mb-6">
            Parcourez notre catalogue et cliquez sur le cœur pour enregistrer vos produits préférés.
          </p>
          <Link href="/products">
            <Button variant="primary" size="md">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Explorer la boutique
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
