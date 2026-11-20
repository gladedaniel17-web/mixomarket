import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D0D0E] border-t border-white/5 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg copper-gradient flex items-center justify-center font-bold text-black">
                M
              </div>
              <span className="text-xl font-black text-white">Mixo<span className="text-[#D4740A]">Market</span></span>
            </div>
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              La marketplace congolaise nouvelle génération. Produits frais, première nécessité, mode avec essayage virtuel IA et livraison rapide à Brazzaville & Pointe-Noire.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 text-xs rounded bg-white/5 border border-white/10 text-[#A3A3A3]">
                MTN MoMo
              </span>
              <span className="px-2.5 py-1 text-xs rounded bg-white/5 border border-white/10 text-[#A3A3A3]">
                Airtel Money
              </span>
              <span className="px-2.5 py-1 text-xs rounded bg-white/5 border border-white/10 text-[#A3A3A3]">
                Visa / Mastercard
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-[#A3A3A3]">
              <li><Link href="/products" className="hover:text-[#D4740A] transition-colors">Tous les produits</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-[#D4740A] transition-colors">Nouveautés</Link></li>
              <li><Link href="/sale" className="hover:text-[#D4740A] transition-colors">Promotions</Link></li>
              <li><Link href="/tryon" className="hover:text-[#D4740A] transition-colors">Fitting Room IA</Link></li>
              <li><Link href="/vendor/register" className="hover:text-[#D4740A] transition-colors">Devenir vendeur local</Link></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Villes & Livraison</h4>
            <ul className="space-y-2.5 text-sm text-[#A3A3A3]">
              <li>Brazzaville : Plateau, Poto-Poto, Bacongo, Ouenzé...</li>
              <li>Pointe-Noire : Centre-ville, Lumumba, Tié-Tié...</li>
              <li>Livraison express en 2h à 6h</li>
              <li>Paiement sécurisé ou à la livraison</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Légal & Contact</h4>
            <ul className="space-y-2.5 text-sm text-[#A3A3A3]">
              <li><Link href="/legal" className="hover:text-[#D4740A] transition-colors">Mentions légales</Link></li>
              <li><Link href="/terms" className="hover:text-[#D4740A] transition-colors">Conditions Générales de Vente</Link></li>
              <li><Link href="/privacy" className="hover:text-[#D4740A] transition-colors">Politique de confidentialité</Link></li>
              <li>Support : contact@mixomarket.cg</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#737373]">
          <p>© {new Date().getFullYear()} MixoMarket Congo. Tous droits réservés.</p>
          <p className="mt-2 md:mt-0 font-mono">Conçu pour Brazzaville & Pointe-Noire</p>
        </div>
      </div>
    </footer>
  );
};
