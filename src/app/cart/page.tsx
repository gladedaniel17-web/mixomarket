'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const { items, isLoaded, updateQuantity, removeItem, clearCart, subtotal, totalCount } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-screen py-20 px-4 text-center text-[#A3A3A3] max-w-7xl mx-auto">
        Chargement de votre panier...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-lg mx-auto text-center">
        <div className="glass-panel p-10 rounded-3xl border border-white/5 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-[#737373]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Votre panier est vide</h1>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            Parcourez nos rayons alimentation, produits locaux du Congo et mode haute couture pour ajouter vos premiers articles.
          </p>
          <div className="pt-4">
            <Link href="/products">
              <Button variant="primary" size="lg" className="w-full font-bold">
                Découvrir la Boutique
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Mon Panier</h1>
          <p className="text-xs text-[#A3A3A3] mt-1">
            {totalCount} article{totalCount > 1 ? 's' : ''} dans votre commande
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#A3A3A3] hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vider le panier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const unitPrice =
              item.variant.priceOverride || item.product.salePrice || item.product.basePrice;
            const lineTotal = unitPrice * item.quantity;
            const primaryImg =
              item.product.images.find((img) => img.isPrimary) || item.product.images[0];

            return (
              <div
                key={item.id}
                className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Item Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#1A1A1A] flex-shrink-0 border border-white/10">
                    <Image
                      src={primaryImg?.url || '/images/placeholder.jpg'}
                      alt={item.product.nameFr}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-bold text-white hover:text-[#D4740A] transition-colors line-clamp-1"
                    >
                      {item.product.nameFr}
                    </Link>
                    <div className="text-xs text-[#A3A3A3]">
                      <span>{item.variant.size || item.variant.color || 'Format Standard'}</span>
                      <span className="mx-2">•</span>
                      <span className="text-[#737373]">{item.product.vendorName}</span>
                    </div>
                    <div className="pt-1">
                      <PriceDisplay amount={unitPrice} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="flex items-center border border-white/10 rounded-lg bg-black/40 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded text-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <PriceDisplay amount={lineTotal} size="md" />
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-[#737373] hover:text-red-400 transition-colors ml-2"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-white/10 space-y-6 sticky top-28">
          <h2 className="text-lg font-black text-white uppercase tracking-wider pb-3 border-b border-white/5">
            Récapitulatif
          </h2>

          <div className="space-y-3 text-xs text-[#A3A3A3]">
            <div className="flex justify-between items-center">
              <span>Sous-total articles</span>
              <PriceDisplay amount={subtotal} size="sm" />
            </div>
            <div className="flex justify-between items-center">
              <span>Frais de livraison</span>
              <span className="text-[#D4740A] font-semibold">Calculés à l’étape suivante</span>
            </div>
            <div className="flex justify-between items-center text-[#737373]">
              <span>Devise</span>
              <span className="font-mono">FCFA (XAF)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Total estimé</span>
            <PriceDisplay amount={subtotal} size="xl" />
          </div>

          <Link href="/checkout" className="block">
            <Button variant="primary" size="lg" className="w-full font-bold shadow-xl shadow-[#D4740A]/20">
              Passer la Commande
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <div className="space-y-2 pt-2 text-[11px] text-[#737373]">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#D4740A]" />
              <span>Livraison à Brazzaville & Pointe-Noire</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4740A]" />
              <span>Paiement sécurisé MTN MoMo, Airtel & Carte</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
