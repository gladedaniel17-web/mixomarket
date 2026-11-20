'use client';

import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '@/lib/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterPanel } from '@/components/product/FilterPanel';
import { FilterState, Product } from '@/types/product';
import { Search, SlidersHorizontal, PackageX } from 'lucide-react';

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'popular',
    city: 'all',
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((prod) => {
      // Category filter
      if (filters.categorySlug && prod.categorySlug !== filters.categorySlug) {
        return false;
      }
      // City filter
      if (filters.city && filters.city !== 'all' && prod.vendorCity !== filters.city) {
        return false;
      }
      // On sale toggle
      if (filters.onSaleOnly && !prod.isOnSale) {
        return false;
      }
      // Try on toggle
      if (filters.tryOnOnly && !prod.allowsTryOn) {
        return false;
      }
      // Search keyword
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = prod.nameFr.toLowerCase().includes(query);
        const matchesDesc = prod.descriptionFr.toLowerCase().includes(query);
        const matchesBrand = prod.brand?.toLowerCase().includes(query);
        const matchesTags = prod.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.basePrice;
      const priceB = b.salePrice ?? b.basePrice;

      if (filters.sortBy === 'price_asc') return priceA - priceB;
      if (filters.sortBy === 'price_desc') return priceB - priceA;
      if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      // Popular (rating & review count)
      return b.rating * b.reviewCount - a.rating * a.reviewCount;
    });
  }, [filters]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
          Le Catalogue <span className="text-[#D4740A]">MixoMarket</span>
        </h1>
        <p className="text-[#A3A3A3] text-sm max-w-2xl">
          Découvrez notre sélection de produits de première nécessité, délices locaux du Congo et mode haute couture disponible avec essayage virtuel IA.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-xl relative">
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Rechercher riz, huile, robe wax, chemise lin..."
            className="w-full bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A] transition-colors"
          />
          <Search className="w-5 h-5 text-[#737373] absolute left-3.5 top-3.5" />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-3 text-xs text-[#A3A3A3] hover:text-white"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ sortBy: 'popular', city: 'all' })}
          />
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden flex items-center justify-between pb-4 border-b border-white/5">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1C1E] border border-white/10 text-sm font-medium text-white"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D4740A]" />
            <span>Filtres & Tri</span>
          </button>
          <span className="text-xs text-[#A3A3A3] font-mono">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm lg:hidden">
            <div className="ml-auto w-full max-w-xs h-full bg-[#141414] p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-white text-lg">Filtres</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 text-[#A3A3A3] hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters({ sortBy: 'popular', city: 'all' })}
                />
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full mt-6 py-3 rounded-xl bg-[#D4740A] text-black font-bold text-sm"
              >
                Afficher ({filteredProducts.length}) résultats
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="hidden lg:flex items-center justify-between mb-6">
            <span className="text-xs font-mono text-[#A3A3A3]">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 rounded-2xl glass-panel border border-white/5">
              <PackageX className="w-12 h-12 text-[#737373] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Aucun produit ne correspond à vos critères</h3>
              <p className="text-xs text-[#A3A3A3] max-w-sm mx-auto mb-6">
                Essayez d’élargir vos filtres ou de modifier votre terme de recherche.
              </p>
              <button
                onClick={() => setFilters({ sortBy: 'popular', city: 'all' })}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
