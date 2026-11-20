'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES } from '@/lib/data/products';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { Store, Package, DollarSign, PlusCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { vendorProductSchema, VendorProductFormData } from '@/lib/validators/vendor';

export default function VendorDashboardPage() {
  const [vendorProducts, setVendorProducts] = useState(
    PRODUCTS.filter((p) => p.vendorCity === 'Brazzaville').slice(0, 4)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<VendorProductFormData>>({
    allowsTryOn: false,
    stock: 10,
    categorySlug: 'mode',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = vendorProductSchema.safeParse(newProduct);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    const created = {
      id: `prod-vendor-${Date.now()}`,
      slug: (newProduct.nameFr || 'produit').toLowerCase().replace(/\s+/g, '-'),
      nameFr: newProduct.nameFr || '',
      categorySlug: newProduct.categorySlug || 'mode',
      categoryNameFr: CATEGORIES.find((c) => c.slug === newProduct.categorySlug)?.nameFr || 'Mode',
      descriptionFr: newProduct.descriptionFr || '',
      basePrice: newProduct.basePrice || 0,
      isOnSale: false,
      isNewArrival: true,
      isFeatured: false,
      allowsTryOn: !!newProduct.allowsTryOn,
      tryOnCategory: newProduct.tryOnCategory,
      vendorName: 'Mon Atelier Vendeur',
      vendorCity: 'Brazzaville' as const,
      rating: 5.0,
      reviewCount: 0,
      tags: ['vendeur-local'],
      images: [
        {
          id: `img-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
          isPrimary: true,
        },
      ],
      variants: [
        {
          id: `var-${Date.now()}`,
          sku: `SKU-${Date.now()}`,
          size: 'Standard',
          stock: newProduct.stock || 10,
        },
      ],
    };

    setVendorProducts([created, ...vendorProducts]);
    setIsModalOpen(false);
    setSuccessMessage('Nouveau produit ajouté avec succès au catalogue vendeur !');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Boutique Approuvée & Active
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Atelier Malonga Créations</h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">Vendeur vérifié • Brazzaville (Bacongo)</p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="font-bold shadow-lg shadow-[#D4740A]/20"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Ajouter un Produit
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
          {successMessage}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
            <span>Chiffre d’affaires total</span>
            <DollarSign className="w-4 h-4 text-[#D4740A]" />
          </div>
          <PriceDisplay amount={485000} size="xl" />
          <p className="text-[11px] text-emerald-400 font-mono">+18% ce mois-ci</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
            <span>Commandes traitées</span>
            <Package className="w-4 h-4 text-[#D4740A]" />
          </div>
          <p className="text-3xl font-black text-white font-mono">14</p>
          <p className="text-[11px] text-[#A3A3A3]">Taux de satisfaction : 4.9/5</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
            <span>Articles en stock</span>
            <Store className="w-4 h-4 text-[#D4740A]" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{vendorProducts.length}</p>
          <p className="text-[11px] text-[#D4740A]">3 produits compatibles Try-On IA</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Mes Articles en Vente ({vendorProducts.length})
          </h2>
          <span className="text-xs text-[#A3A3A3]">Visibles sur le catalogue MixoMarket</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#737373] uppercase tracking-wider">
                <th className="py-3 px-3">Produit</th>
                <th className="py-3 px-3">Catégorie</th>
                <th className="py-3 px-3">Prix Unitaire</th>
                <th className="py-3 px-3">Stock Dispo</th>
                <th className="py-3 px-3">Try-On IA</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vendorProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white truncate max-w-[200px]">
                    <Link href={`/products/${p.slug}`} className="hover:text-[#D4740A]">
                      {p.nameFr}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-[#A3A3A3]">{p.categoryNameFr}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    <PriceDisplay amount={p.basePrice} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-white font-mono">{p.variants[0]?.stock || 0}</td>
                  <td className="py-3 px-3">
                    {p.allowsTryOn ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#D4740A]/20 text-[#D4740A] font-bold inline-flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> ACTIF
                      </span>
                    ) : (
                      <span className="text-[#737373] text-[10px]">Non</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="text-xs text-[#D4740A] hover:underline font-semibold">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-white/15 rounded-3xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Nouveau Produit Vendeur</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#A3A3A3] hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] block mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Veste Croisée en Lin"
                  value={newProduct.nameFr || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, nameFr: e.target.value })}
                  className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4740A]"
                />
                {formErrors.nameFr && <p className="text-red-400 text-[10px] mt-1">{formErrors.nameFr}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A3A3A3] block mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={newProduct.categorySlug}
                    onChange={(e) => setNewProduct({ ...newProduct, categorySlug: e.target.value })}
                    className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4740A]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.nameFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#A3A3A3] block mb-1">
                    Prix de base (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={newProduct.basePrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, basePrice: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4740A]"
                  />
                  {formErrors.basePrice && <p className="text-red-400 text-[10px] mt-1">{formErrors.basePrice}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] block mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Matière, finitions, origine..."
                  value={newProduct.descriptionFr || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, descriptionFr: e.target.value })}
                  className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4740A]"
                />
                {formErrors.descriptionFr && <p className="text-red-400 text-[10px] mt-1">{formErrors.descriptionFr}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A3A3A3] block mb-1">
                    Stock initial *
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock || 10}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4740A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#A3A3A3] block mb-1">
                    Type de vêtement IA
                  </label>
                  <select
                    value={newProduct.tryOnCategory || 'top'}
                    onChange={(e) => setNewProduct({ ...newProduct, tryOnCategory: e.target.value as 'top' | 'bottom' | 'full' })}
                    disabled={!newProduct.allowsTryOn}
                    className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4740A] disabled:opacity-40"
                  >
                    <option value="top">Haut (Chemise, Veste)</option>
                    <option value="bottom">Bas (Pantalon, Jupe)</option>
                    <option value="full">Complet (Robe, Costume)</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!newProduct.allowsTryOn}
                  onChange={(e) => setNewProduct({ ...newProduct, allowsTryOn: e.target.checked })}
                  className="rounded border-white/20 bg-black text-[#D4740A] focus:ring-[#D4740A]"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4740A]" />
                  Activer la compatibilité Essayage Virtuel IA
                </span>
              </label>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publier le Produit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
