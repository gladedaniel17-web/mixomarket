'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { vendorRegistrationSchema, VendorRegistrationData } from '@/lib/validators/vendor';
import { Store, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState<Partial<VendorRegistrationData>>({
    city: 'Brazzaville',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = vendorRegistrationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-lg mx-auto text-center">
        <div className="glass-panel p-10 rounded-3xl border border-white/10 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#D4740A]/20 border border-[#D4740A]/40 flex items-center justify-center mx-auto text-[#D4740A]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Candidature Vendeur Reçue !</h1>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            Votre demande d’adhésion pour <strong>{formData.businessName}</strong> à {formData.city} a bien été enregistrée. Notre équipe admin va vérifier vos informations et activer votre boutique sous 24h.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/vendor">
              <Button variant="primary" size="md" className="w-full font-bold">
                Accéder à l’Espace Vendeur (Aperçu)
              </Button>
            </Link>
            <Link href="/" className="text-xs text-[#A3A3A3] hover:text-white">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-[#D4740A]/20 border border-[#D4740A]/30 text-[#D4740A] mb-3">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Devenir Vendeur MixoMarket</h1>
        <p className="text-xs text-[#A3A3A3] mt-2 max-w-md mx-auto">
          Rejoignez la première marketplace congolaise. Vendez vos produits locaux, alimentaires ou vos collections de mode auprès de milliers de foyers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div>
          <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
            Nom Commercial / Nom de la Boutique *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Épicerie Moderne du Plateau, Atelier Océan Couture..."
            value={formData.businessName || ''}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
          />
          {errors.businessName && <p className="text-red-400 text-[11px] mt-1">{errors.businessName}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
            Description des Produits et Activités *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Quels types de produits vendez-vous ? (Alimentation, mode, produits frais locaux, cosmétiques...)"
            value={formData.businessDescription || ''}
            onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
            className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
          />
          {errors.businessDescription && <p className="text-red-400 text-[11px] mt-1">{errors.businessDescription}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
              Ville Principale d’Activité *
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value as 'Brazzaville' | 'Pointe-Noire' })}
              className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4740A]"
            >
              <option value="Brazzaville">Brazzaville</option>
              <option value="Pointe-Noire">Pointe-Noire</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
              Numéro Téléphone / WhatsApp Pro *
            </label>
            <input
              type="tel"
              required
              placeholder="Ex: 06 123 4567"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
            />
            {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
            Adresse / Quartier / Point de Vente *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Marché Total, Avenue des Martyrs, Bacongo"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
          />
          {errors.address && <p className="text-red-400 text-[11px] mt-1">{errors.address}</p>}
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#A3A3A3] space-y-1.5">
          <div className="flex items-center gap-2 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-[#D4740A]" />
            <span>Processus d’approbation sécurisé</span>
          </div>
          <p>
            Toute nouvelle inscription est vérifiée manuellement par notre administration afin de préserver la qualité des produits vendus sur MixoMarket. Commission standard de 10% sur les ventes effectives.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full font-bold shadow-xl shadow-[#D4740A]/20"
        >
          Envoyer ma candidature vendeur
        </Button>
      </form>
    </div>
  );
}
