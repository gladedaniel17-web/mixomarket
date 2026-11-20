import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'MixoMarket | La Marketplace Congolaise Moderne',
  description: 'Achetez vos produits locaux et essentiels livrés à domicile à Brazzaville et Pointe-Noire. Produits alimentaires, mode avec essayage virtuel IA, high-tech et beauté.',
  keywords: ['marketplace congo', 'brazzaville', 'pointe-noire', 'livraison congo', 'mtn momo', 'airtel money', 'virtual try on'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-[#0A0A0A] text-[#F5F5F5] antialiased flex flex-col min-h-screen selection:bg-[#D4740A]/30 selection:text-[#E8881E]">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
