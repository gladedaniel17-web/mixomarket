'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { useFavorites } from '@/hooks/useFavorites';
import {
  Sparkles,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(
    product.images.find((img) => img.isPrimary) || product.images[0]
  );
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const fav = isFavorite(product.id);

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#A3A3A3] mb-8 font-medium">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <ChevronRight className="w-3 h-3 text-[#737373]" />
        <Link href="/products" className="hover:text-white transition-colors">
          Boutique
        </Link>
        <ChevronRight className="w-3 h-3 text-[#737373]" />
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="hover:text-white transition-colors truncate max-w-[150px]"
        >
          {product.categoryNameFr}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#737373]" />
        <span className="text-[#D4740A] truncate max-w-[200px]">{product.nameFr}</span>
      </nav>

      {/* Main Product Showcase: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 sticky top-28">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px]">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage.id === img.id
                      ? 'border-[#D4740A] shadow-md shadow-[#D4740A]/20 scale-105'
                      : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || product.nameFr}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Primary View */}
          <div className="relative aspect-[4/5] flex-1 rounded-3xl overflow-hidden bg-[#141414] border border-white/5 shadow-2xl">
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || product.nameFr}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isOnSale && (
                <span className="px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-red-600 text-white rounded-lg shadow-lg">
                  PROMO
                </span>
              )}
              {product.allowsTryOn && (
                <span className="px-3 py-1.5 text-xs font-bold tracking-tight bg-black/80 backdrop-blur-md text-[#F6A23D] border border-[#D4740A]/40 rounded-lg shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4740A]" />
                  Compatible Essayage Virtuel IA
                </span>
              )}
            </div>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                fav
                  ? 'bg-[#D4740A] text-white shadow-lg'
                  : 'bg-black/60 text-[#A3A3A3] hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Product Info & Commerce Actions */}
        <div className="flex flex-col space-y-6">
          {/* Vendor & Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
              <span className="text-white font-medium">{product.vendorName}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4740A]" />
                {product.vendorCity}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#F6A23D]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-[#A3A3A3]">({product.reviewCount} avis)</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {product.nameFr}
          </h1>

          {/* Price Block */}
          <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-baseline gap-4">
            {product.salePrice ? (
              <>
                <PriceDisplay amount={product.salePrice} size="xl" />
                <span className="text-base text-[#737373] line-through font-mono">
                  {product.basePrice.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold">
                  Économisez {(product.basePrice - product.salePrice).toLocaleString('fr-FR')} FCFA
                </span>
              </>
            ) : (
              <PriceDisplay amount={product.basePrice} size="xl" />
            )}
          </div>

          {/* Virtual Try-On Banner (if product allows) */}
          {product.allowsTryOn && (
            <div
              id="tryon"
              className="p-5 rounded-2xl bg-gradient-to-r from-[#D4740A]/20 via-[#B87333]/15 to-transparent border border-[#D4740A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-[#D4740A]" />
                  <span>Essayez cette pièce avec votre photo</span>
                </div>
                <p className="text-xs text-[#A3A3A3]">
                  Visualisez le rendu haute couture sur vous grâce à notre intelligence artificielle.
                </p>
              </div>
              <Link href={`/tryon?product=${product.id}`}>
                <Button variant="primary" size="sm" className="whitespace-nowrap font-bold">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Lancer l’essayage
                </Button>
              </Link>
            </div>
          )}

          {/* Variant Selector (Sizes & Colors) */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white uppercase tracking-wider">
                  Taille / Format
                </span>
                {product.categorySlug === 'mode' && (
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-[#D4740A] hover:underline flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Guide des tailles
                  </button>
                )}
              </div>

              {/* Size Buttons */}
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant.id === v.id
                        ? 'border-[#D4740A] bg-[#D4740A]/20 text-[#D4740A] shadow-md shadow-[#D4740A]/20'
                        : 'border-white/10 bg-[#141414] text-[#A3A3A3] hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {v.size || v.color}
                  </button>
                ))}
              </div>

              {/* Size Guide Drawer/Modal preview */}
              {showSizeGuide && (
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs space-y-2 animate-in fade-in">
                  <p className="font-bold text-white">Guide des Tailles Congo Couture :</p>
                  <p className="text-[#A3A3A3]">
                    • <strong>S (36-38) :</strong> Poitrine 86-90 cm, Taille 68-72 cm
                  </p>
                  <p className="text-[#A3A3A3]">
                    • <strong>M (40-42) :</strong> Poitrine 92-96 cm, Taille 74-78 cm
                  </p>
                  <p className="text-[#A3A3A3]">
                    • <strong>L (44-46) :</strong> Poitrine 98-104 cm, Taille 80-86 cm
                  </p>
                  <p className="text-[#A3A3A3]">
                    • <strong>XL (48-50) :</strong> Poitrine 106-112 cm, Taille 88-94 cm
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quantity and CTA */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4">
            {/* Quantity Counter */}
            <div className="flex items-center border border-white/10 rounded-xl bg-[#141414] p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg text-lg transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-bold font-mono text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-lg text-lg transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="primary"
              size="lg"
              className="flex-1 w-full"
              onClick={handleAddToCart}
            >
              {isAddedToCart ? '✓ Ajouté au panier !' : 'Ajouter au Panier'}
            </Button>
          </div>

          {/* Delivery & Reassurance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5 text-xs text-[#A3A3A3]">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#D4740A] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Livraison Express</span>
                <span>2h à 6h à Brazzaville et Pointe-Noire</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4740A] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Paiement Mobile</span>
                <span>MTN MoMo, Airtel Money ou Carte</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#D4740A] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Vendeurs Vérifiés</span>
                <span>Produits authentiques garantis</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-white/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Description du Produit
            </h3>
            <p className="text-sm text-[#A3A3A3] leading-relaxed whitespace-pre-line">
              {product.descriptionFr}
            </p>
          </div>

          {/* Customer Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Avis Clients ({product.reviews.length})
                </h3>
                <span className="text-xs text-[#A3A3A3]">Acheteurs vérifiés</span>
              </div>

              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{rev.authorName}</span>
                      <span className="text-[10px] text-[#737373] font-mono">{rev.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#F6A23D]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-white pt-1">{rev.title}</p>
                    <p className="text-xs text-[#A3A3A3] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
