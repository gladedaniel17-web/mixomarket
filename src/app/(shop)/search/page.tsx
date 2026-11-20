'use client';

import React, { useState } from 'react';
import { PRODUCTS } from '@/lib/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Search, Flame } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const filtered = PRODUCTS.filter((p) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      p.nameFr.toLowerCase().includes(q) ||
      p.descriptionFr.toLowerCase().includes(q) ||
      p.categoryNameFr.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const popularSearches = ['Riz 25kg', 'Huile', 'Veste Cuivre', 'Saka-Saka', 'Powerbank', 'Robe Soie'];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-black text-white mb-3">Recherche Rapide</h1>
        <p className="text-[#A3A3A3] text-sm mb-6">
          Trouvez instantanément vos denrées, articles de mode et produits tech au Congo.
        </p>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Que recherchez-vous aujourd’hui ?"
            autoFocus
            className="w-full bg-[#141414] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-base text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A] shadow-xl"
          />
          <Search className="w-6 h-6 text-[#737373] absolute left-4 top-4" />
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs text-[#737373] flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-[#D4740A]" /> Recherches fréquentes :
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#A3A3A3] hover:text-white transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {query.trim() && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
            <h2 className="text-sm font-semibold text-white">
              Résultats pour &ldquo;{query}&rdquo;
            </h2>
            <span className="text-xs font-mono text-[#A3A3A3]">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#A3A3A3] text-sm">
              Aucun résultat pour cette recherche. Essayez avec un mot-clé plus générique.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
