'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { DELIVERY_ZONES } from '@/lib/data/deliveryZones';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { Truck, ShieldCheck, MapPin, CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import { CheckoutCustomerFormData } from '@/lib/validators/order';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, isLoaded } = useCart();

  const [formData, setFormData] = useState<Partial<CheckoutCustomerFormData>>({
    city: 'Brazzaville',
    zoneId: 'bz-centre',
    paymentMethod: 'mtn_momo',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Available zones based on selected city
  const availableZones = DELIVERY_ZONES.filter((z) => z.city === formData.city);
  const selectedZone = DELIVERY_ZONES.find((z) => z.id === formData.zoneId) || availableZones[0];
  const deliveryFee = selectedZone ? selectedZone.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const handleCityChange = (city: 'Brazzaville' | 'Pointe-Noire') => {
    const firstZoneForCity = DELIVERY_ZONES.find((z) => z.city === city);
    setFormData((prev) => ({
      ...prev,
      city,
      zoneId: firstZoneForCity ? firstZoneForCity.id : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Client-side quick validation
    const newErrors: Record<string, string> = {};
    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Veuillez saisir votre nom complet';
    }
    if (!formData.phone || formData.phone.length < 9) {
      newErrors.phone = 'Numéro de téléphone requis (ex: 06 123 4567)';
    }
    if (!formData.neighborhood) {
      newErrors.neighborhood = 'Veuillez préciser votre quartier';
    }
    if (!formData.landmark) {
      newErrors.landmark = 'Point de repère obligatoire (ex: face pharmacie, grand manguier)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: formData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la validation de la commande');
      }

      // Save order info to session storage for confirmation page
      sessionStorage.setItem('last_order', JSON.stringify(data.order));

      // Clear cart
      clearCart();

      // If redirect URL exists (Paystack card 3D Secure), navigate there; otherwise confirmation
      if (data.order?.paymentResult?.authorizationUrl) {
        window.location.href = data.order.paymentResult.authorizationUrl;
      } else {
        router.push(`/checkout/confirmation?order=${data.order.orderNumber}`);
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen py-20 text-center text-[#A3A3A3]">Chargement...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Votre panier est vide</h1>
        <p className="text-xs text-[#A3A3A3] mb-6">Ajoutez des articles avant de valider votre commande.</p>
        <Button variant="primary" onClick={() => router.push('/products')}>
          Voir la boutique
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Finaliser ma Commande</h1>
        <p className="text-xs text-[#A3A3A3] mt-1">
          Livraison à domicile express à Brazzaville & Pointe-Noire
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Form fields */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Destination City & Zone */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5">
            <div className="flex items-center gap-2 text-white font-bold text-base border-b border-white/5 pb-3">
              <MapPin className="w-5 h-5 text-[#D4740A]" />
              <span>1. Ville & Zone de Livraison</span>
            </div>

            {/* City Selector */}
            <div>
              <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-2">
                Ville au Congo
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Brazzaville', 'Pointe-Noire'] as const).map((city) => (
                  <button
                    type="button"
                    key={city}
                    onClick={() => handleCityChange(city)}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all text-center ${
                      formData.city === city
                        ? 'border-[#D4740A] bg-[#D4740A]/15 text-[#D4740A]'
                        : 'border-white/10 bg-[#141414] text-[#A3A3A3] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone Selector */}
            <div>
              <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-2">
                Quartier / Zone ({formData.city})
              </label>
              <select
                value={formData.zoneId}
                onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4740A]"
              >
                {availableZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.zoneName} — {zone.deliveryFee.toLocaleString('fr-FR')} FCFA (livré en {zone.estimatedHoursMin}h à {zone.estimatedHoursMax}h)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Contact & Detailed Address */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-5">
            <div className="flex items-center gap-2 text-white font-bold text-base border-b border-white/5 pb-3">
              <Truck className="w-5 h-5 text-[#D4740A]" />
              <span>2. Coordonnées & Adresse Exacte</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
                  Nom Complet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean-Paul Ondongo"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
                />
                {errors.fullName && <p className="text-red-400 text-[11px] mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
                  Téléphone Mobile (Congo) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 06 654 3210 ou 05 555 1234"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
                />
                {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
                  Quartier Précis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bacongo, arrêt Total"
                  value={formData.neighborhood || ''}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
                />
                {errors.neighborhood && <p className="text-red-400 text-[11px] mt-1">{errors.neighborhood}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
                  Point de Repère Remarquable *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Face église Sainte-Anne, portail noir"
                  value={formData.landmark || ''}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
                />
                {errors.landmark && <p className="text-red-400 text-[11px] mt-1">{errors.landmark}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider block mb-1.5">
                Instructions au livreur (facultatif)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Appeler en arrivant, sonner à la barrière"
                value={formData.deliveryInstructions || ''}
                onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#D4740A]"
              />
            </div>
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base border-b border-white/5 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#D4740A]" />
              <span>3. Moyen de Paiement</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* MTN MoMo */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'mtn_momo' })}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'mtn_momo'
                    ? 'border-[#D4740A] bg-[#D4740A]/15 shadow-md shadow-[#D4740A]/20'
                    : 'border-white/10 bg-[#141414] hover:border-white/20'
                }`}
              >
                <Smartphone className="w-6 h-6 text-[#F6A23D] mb-2" />
                <span className="font-bold text-white text-sm block">MTN MoMo</span>
                <span className="text-[11px] text-[#A3A3A3]">Push USSD instantané</span>
              </button>

              {/* Airtel Money */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'airtel_money' })}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'airtel_money'
                    ? 'border-[#D4740A] bg-[#D4740A]/15 shadow-md shadow-[#D4740A]/20'
                    : 'border-white/10 bg-[#141414] hover:border-white/20'
                }`}
              >
                <Smartphone className="w-6 h-6 text-red-400 mb-2" />
                <span className="font-bold text-white text-sm block">Airtel Money</span>
                <span className="text-[11px] text-[#A3A3A3]">Débit sécurisé par PIN</span>
              </button>

              {/* Card (Paystack) */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  formData.paymentMethod === 'card'
                    ? 'border-[#D4740A] bg-[#D4740A]/15 shadow-md shadow-[#D4740A]/20'
                    : 'border-white/10 bg-[#141414] hover:border-white/20'
                }`}
              >
                <CreditCard className="w-6 h-6 text-blue-400 mb-2" />
                <span className="font-bold text-white text-sm block">Carte Bancaire</span>
                <span className="text-[11px] text-[#A3A3A3]">Visa / Mastercard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Confirmation CTA */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-white/10 space-y-6 sticky top-28">
          <h2 className="text-lg font-black text-white uppercase tracking-wider pb-3 border-b border-white/5">
            Détail Commande
          </h2>

          <div className="space-y-3 text-xs text-[#A3A3A3]">
            <div className="flex justify-between items-center">
              <span>Articles ({items.length})</span>
              <PriceDisplay amount={subtotal} size="sm" />
            </div>
            <div className="flex justify-between items-center">
              <span>Zone ({selectedZone?.zoneName})</span>
              <PriceDisplay amount={deliveryFee} size="sm" />
            </div>
            <div className="flex justify-between items-center text-[#737373]">
              <span>Délai estimé</span>
              <span className="text-white font-mono">
                {selectedZone?.estimatedHoursMin}h à {selectedZone?.estimatedHoursMax}h
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Total à Régler</span>
            <PriceDisplay amount={total} size="xl" />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-bold shadow-xl shadow-[#D4740A]/20"
          >
            Valider et Payer ({selectedZone?.deliveryFee ? total.toLocaleString('fr-FR') : subtotal.toLocaleString('fr-FR')} FCFA)
          </Button>

          <p className="text-[11px] text-[#737373] text-center leading-relaxed">
            Paiement 100% sécurisé. Aucun numéro de compte ni mot de passe bancaire n’est stocké sur nos serveurs.
          </p>
        </div>
      </form>
    </div>
  );
}
