'use client';

import React from 'react';
import { FilterState, Category } from '@/types/product';
import { CATEGORIES } from '@/lib/data/products';
import { SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, onReset }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#D4740A]" />
          <h3 className="font-bold text-sm tracking-wide text-white uppercase">Filtres</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#A3A3A3] hover:text-[#D4740A] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* City Filter (Republic of Congo) */}
      <div>
        <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-2.5">
          Ville de disponibilité
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
          {(['all', 'Brazzaville', 'Pointe-Noire'] as const).map((city) => (
            <button
              key={city}
              onClick={() => onChange({ ...filters, city })}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${
                (filters.city || 'all') === city
                  ? 'bg-[#D4740A] text-black font-bold shadow-md'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {city === 'all' ? 'Toutes' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-2.5">
          Catégorie
        </label>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onChange({ ...filters, categorySlug: undefined })}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              !filters.categorySlug
                ? 'bg-white/10 text-[#D4740A] font-bold'
                : 'text-[#A3A3A3] hover:bg-white/5 hover:text-white'
            }`}
          >
            Toutes les catégories
          </button>
          {CATEGORIES.map((cat: Category) => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, categorySlug: cat.slug })}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                filters.categorySlug === cat.slug
                  ? 'bg-white/10 text-[#D4740A] font-bold'
                  : 'text-[#A3A3A3] hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="truncate">{cat.nameFr}</span>
              <span className="text-[10px] text-[#737373] ml-2 font-mono">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick toggles */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="flex items-center gap-2.5 text-xs text-[#F5F5F5] cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.tryOnOnly}
            onChange={(e) => onChange({ ...filters, tryOnOnly: e.target.checked })}
            className="rounded border-white/20 bg-black text-[#D4740A] focus:ring-[#D4740A] w-4 h-4"
          />
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4740A]" />
            Essayage Virtuel IA uniquement
          </span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-[#F5F5F5] cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.onSaleOnly}
            onChange={(e) => onChange({ ...filters, onSaleOnly: e.target.checked })}
            className="rounded border-white/20 bg-black text-red-500 focus:ring-red-500 w-4 h-4"
          />
          <span>Articles en promotion</span>
        </label>
      </div>

      {/* Sort By Dropdown */}
      <div className="pt-2 border-t border-white/5">
        <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-2">
          Trier par
        </label>
        <select
          value={filters.sortBy || 'popular'}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4740A]"
        >
          <option value="popular">Popularité & Notes</option>
          <option value="newest">Nouveautés d’abord</option>
          <option value="price_asc">Prix : croissant</option>
          <option value="price_desc">Prix : décroissant</option>
        </select>
      </div>
    </div>
  );
};
