import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Sparkles, Heart, User } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  favCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0, favCount = 0 }) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl copper-gradient flex items-center justify-center shadow-lg shadow-[#D4740A]/25 group-hover:scale-105 transition-transform duration-300">
              <span className="font-extrabold text-black text-xl tracking-tighter">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#F5F5F5] group-hover:text-[#D4740A] transition-colors">
                Mixo<span className="text-[#D4740A]">Market</span>
              </span>
              <span className="text-[10px] text-[#A3A3A3] tracking-widest uppercase -mt-1 font-mono">Congo</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/" className="text-[#F5F5F5] hover:text-[#D4740A] transition-colors">
              Accueil
            </Link>
            <Link href="/products" className="text-[#A3A3A3] hover:text-[#D4740A] transition-colors">
              Boutique
            </Link>
            <Link href="/new-arrivals" className="text-[#A3A3A3] hover:text-[#D4740A] transition-colors flex items-center gap-1.5">
              <span>Nouveautés</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-[#D4740A]/20 text-[#D4740A] rounded-full font-bold">NEW</span>
            </Link>
            <Link href="/sale" className="text-red-400 hover:text-red-300 transition-colors">
              Promotions
            </Link>
            <Link href="/tryon" className="text-[#D4740A] hover:text-[#E8881E] font-semibold transition-colors flex items-center gap-1.5 bg-[#D4740A]/10 px-3 py-1 rounded-full border border-[#D4740A]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fitting Room IA</span>
            </Link>
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-3">
            <Link href="/search" className="p-2.5 rounded-lg text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors" title="Recherche">
              <Search className="w-5 h-5" />
            </Link>

            <Link href="/favorites" className="p-2.5 rounded-lg text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors relative" title="Favoris">
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#D4740A] text-white text-[10px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="p-2.5 rounded-lg text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors relative" title="Panier">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full copper-gradient text-black text-[10px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/account" className="p-2.5 rounded-lg text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors" title="Mon Compte">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
