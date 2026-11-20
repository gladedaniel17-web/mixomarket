'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, MapPin, Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const primaryImg = product.images.find((img) => img.isPrimary) || product.images[0];
  const fav = isFavorite(product.id);

  return (
    <div className="group relative rounded-2xl bg-[#141414] border border-white/5 hover:border-[#D4740A]/40 transition-all duration-300 flex flex-col overflow-hidden copper-border-glow">
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1A1A1A]">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImg?.url || '/images/placeholder.jpg'}
            alt={primaryImg?.altText || product.nameFr}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isOnSale && (
            <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-red-600 text-white rounded-md shadow-md">
              PROMO
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider copper-gradient text-black rounded-md shadow-md">
              NOUVEAU
            </span>
          )}
          {product.allowsTryOn && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-tight bg-black/80 backdrop-blur-md text-[#F6A23D] border border-[#D4740A]/40 rounded-md shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4740A]" />
              TRY ON IA
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            fav
              ? 'bg-[#D4740A] text-white shadow-lg shadow-[#D4740A]/30'
              : 'bg-black/60 text-[#A3A3A3] hover:text-white hover:bg-black/80'
          }`}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
        </button>

        {/* Location tag (Brazzaville / Pointe-Noire) */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[11px] text-[#A3A3A3] flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#D4740A]" />
          <span>{product.vendorCity}</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#A3A3A3] mb-1.5">
            <span className="truncate max-w-[65%]">{product.categoryNameFr}</span>
            <div className="flex items-center gap-1 text-[#F6A23D] font-mono">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-sm text-[#F5F5F5] group-hover:text-[#D4740A] transition-colors line-clamp-2 leading-snug">
              {product.nameFr}
            </h3>
          </Link>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-3">
          <div className="flex flex-col">
            {product.salePrice ? (
              <>
                <PriceDisplay amount={product.salePrice} size="md" />
                <span className="text-xs text-[#737373] line-through font-mono">
                  {product.basePrice.toLocaleString('fr-FR')} FCFA
                </span>
              </>
            ) : (
              <PriceDisplay amount={product.basePrice} size="md" />
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {product.allowsTryOn && (
              <Link
                href={`/products/${product.slug}#tryon`}
                className="p-2 text-xs font-semibold rounded-lg bg-[#D4740A]/15 text-[#D4740A] hover:bg-[#D4740A] hover:text-black transition-colors"
                title="Essayer virtuellement"
              >
                <Sparkles className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => onAddToCart && onAddToCart(product)}
              className="p-2 rounded-lg bg-[#1C1C1E] hover:bg-[#D4740A] text-[#F5F5F5] hover:text-black border border-white/10 hover:border-transparent transition-all"
              title="Ajouter au panier"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
