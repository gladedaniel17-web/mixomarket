'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '@/lib/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { CinematicHero } from '@/components/home/CinematicHero';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomePage() {
  const pageRef = React.useRef<HTMLDivElement>(null);
  const featuredFashion = PRODUCTS.filter((p) => p.categorySlug === 'mode');
  const essentialFood = PRODUCTS.filter((p) => p.categorySlug === 'alimentaire' || p.categorySlug === 'produits-locaux');
  const promoProducts = PRODUCTS.filter((p) => p.isOnSale);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.utils.toArray<HTMLElement>('[data-home-reveal]').forEach((section) => {
      gsap.fromTo(
        section,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 88%', once: true },
        },
      );
    });
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="flex flex-col min-h-screen">
      <CinematicHero product={featuredFashion[0]} />

      {/* Categories Horizontal Carousel */}
      <section id="rayons" data-home-reveal className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Rayons & Catégories</h2>
            <p className="text-xs text-[#A3A3A3] mt-1">Accédez directement aux univers essentiels</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-[#D4740A] hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group p-4 rounded-2xl bg-[#141414] border border-white/5 hover:border-[#D4740A]/40 transition-all text-center flex flex-col items-center justify-center hover:-translate-y-1 duration-300"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 border border-white/10 group-hover:border-[#D4740A] transition-colors">
                <Image
                  src={cat.featuredImageUrl || '/images/placeholder.jpg'}
                  alt={cat.nameFr}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="font-bold text-xs text-white group-hover:text-[#D4740A] transition-colors line-clamp-1">
                {cat.nameFr}
              </h3>
              <span className="text-[10px] text-[#737373] mt-0.5">{cat.productCount} articles</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flagship Fashion Try-On Spotlight */}
      <section data-home-reveal className="py-16 bg-[#0E0E10] border-y border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4740A]/15 text-[#D4740A] text-xs font-bold mb-3 border border-[#D4740A]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Expérience Exclusive MixoMarket</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Mode & Haute Couture avec Essayage Virtuel
              </h2>
              <p className="text-sm text-[#A3A3A3] mt-2 max-w-xl">
                Testez nos vestes cuivrées, robes de soirée et créations en lin directement sur votre photo avant de commander.
              </p>
            </div>
            <Link href="/products?tryon=true">
              <Button variant="outline" size="sm" className="font-semibold">
                Voir toutes les pièces compatibles IA
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFashion.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Essential Groceries & Food (Riz, Huile, Terroir) */}
      <section data-home-reveal className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Alimentation & Première Nécessité</h2>
            <p className="text-xs text-[#A3A3A3] mt-1">Riz, huiles, sucre, Saka-Saka et produits frais de nos marchés locaux</p>
          </div>
          <Link href="/products?category=alimentaire" className="text-xs font-semibold text-[#D4740A] hover:underline flex items-center gap-1">
            Voir le rayon <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {essentialFood.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promos of the Moment */}
      {promoProducts.length > 0 && (
        <section data-home-reveal className="py-16 bg-[#121214] border-t border-white/5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span>Promotions du Moment</span>
                </h2>
                <p className="text-xs text-[#A3A3A3] mt-1">Des réductions exclusives sur les stocks disponibles</p>
              </div>
              <Link href="/products?onSale=true" className="text-xs font-semibold text-red-400 hover:underline">
                Toutes les promotions →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Local Vendors Spotlight (Brazzaville & Pointe-Noire) */}
      <section data-home-reveal className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#D4740A] uppercase tracking-wider">
              Producteurs & Artisans Locaux
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Vous êtes commerçant ou créateur au Congo ?
            </h2>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              Ouvrez votre boutique sur MixoMarket, touchez des milliers de clients à Brazzaville et Pointe-Noire et bénéficiez de notre logistique de livraison et paiement mobile.
            </p>
          </div>
          <Link href="/vendor/register">
            <Button variant="primary" size="lg" className="whitespace-nowrap font-bold">
              Devenir Vendeur MixoMarket
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
