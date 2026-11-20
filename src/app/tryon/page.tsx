'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types/product';
import { TryOnJobResponse } from '@/types/tryon';
import { BeforeAfterSlider } from '@/components/tryon/BeforeAfterSlider';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import {
  Sparkles,
  Upload,
  Shield,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';

const PRESET_MODELS = [
  {
    id: 'model-male-1',
    label: 'Mannequin Homme (1m82)',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'model-female-1',
    label: 'Mannequin Femme (1m75)',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'model-female-2',
    label: 'Mannequin Femme Curve',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  },
];

function FittingRoomContent() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get('product');
  const tryOnEligibleProducts = PRODUCTS.filter((p) => p.allowsTryOn);

  const [selectedProduct, setSelectedProduct] = useState<Product>(
    tryOnEligibleProducts.find((p) => p.id === initialProductId) || tryOnEligibleProducts[0]
  );

  const [selectedModel, setSelectedModel] = useState(PRESET_MODELS[0].id);
  const [customPhotoBase64, setCustomPhotoBase64] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobResponse, setJobResponse] = useState<TryOnJobResponse | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  // File upload handler with type and size checks
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorNotice(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorNotice('Format invalide. Veuillez sélectionner une photo JPG, PNG ou WebP.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorNotice('Fichier trop lourd (maximum 8 Mo).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCustomPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setCustomPhotoBase64(null);
    setJobResponse(null);
  };

  const handleLaunchTryOn = async () => {
    setErrorNotice(null);

    if (!consentGiven) {
      setErrorNotice('Vous devez cocher la case de consentement au traitement de photo pour continuer.');
      return;
    }

    setIsLoading(true);

    try {
      const primaryImg =
        selectedProduct.images.find((i) => i.isPrimary) || selectedProduct.images[0];

      const res = await fetch('/api/tryon/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          garmentImageUrl: primaryImg.url,
          category: selectedProduct.tryOnCategory || 'top',
          userPhotoBase64: customPhotoBase64 || undefined,
          presetModelId: customPhotoBase64 ? undefined : selectedModel,
          consentGiven: true,
        }),
      });

      const data: TryOnJobResponse = await res.json();
      setJobResponse(data);
    } catch (err: unknown) {
      setErrorNotice(err instanceof Error ? err.message : 'Erreur réseau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem(selectedProduct);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4740A]/15 text-[#D4740A] text-xs font-bold mb-2 border border-[#D4740A]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cabine Virtuelle Haute Couture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Virtual Fitting Room IA
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1 max-w-xl">
            Visualisez le tombé réel de nos vêtements de créateurs sur vous grâce à notre modèle d’intelligence artificielle.
          </p>
        </div>

        <Link href="/products?tryon=true">
          <Button variant="outline" size="sm" className="text-xs">
            Voir les pièces compatibles ({tryOnEligibleProducts.length})
          </Button>
        </Link>
      </div>

      {errorNotice && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Main Grid: Selection Controls + Canvas Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Controls & Upload (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Step 1: Garment to Try */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              1. Vêtement à essayer
            </label>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141414] border border-white/5">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10">
                <Image
                  src={selectedProduct.images[0]?.url || '/images/placeholder.jpg'}
                  alt={selectedProduct.nameFr}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-xs font-bold text-white line-clamp-1">
                  {selectedProduct.nameFr}
                </h4>
                <p className="text-[11px] text-[#A3A3A3] font-mono">
                  {selectedProduct.vendorCity} • {selectedProduct.tryOnCategory}
                </p>
                <PriceDisplay amount={selectedProduct.salePrice || selectedProduct.basePrice} size="sm" />
              </div>
            </div>

            {/* Quick Switch Dropdown */}
            <select
              value={selectedProduct.id}
              onChange={(e) => {
                const found = tryOnEligibleProducts.find((p) => p.id === e.target.value);
                if (found) {
                  setSelectedProduct(found);
                  setJobResponse(null);
                }
              }}
              className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4740A]"
            >
              {tryOnEligibleProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  Changer pour : {p.nameFr}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Model or Custom Photo */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              2. Choisissez votre silhouette
            </label>

            {/* Preset Models */}
            <div className="grid grid-cols-3 gap-2">
              {PRESET_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setCustomPhotoBase64(null);
                    setJobResponse(null);
                  }}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    selectedModel === model.id && !customPhotoBase64
                      ? 'border-[#D4740A] bg-[#D4740A]/15 shadow-md shadow-[#D4740A]/20'
                      : 'border-white/10 bg-[#141414] hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-1.5">
                    <Image
                      src={model.imageUrl}
                      alt={model.label}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-white block truncate">{model.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 my-2 text-[11px] text-[#737373]">
              <span className="flex-1 h-px bg-white/10" />
              <span>OU IMPORTEZ VOTRE PROPRE PHOTO</span>
              <span className="flex-1 h-px bg-white/10" />
            </div>

            {/* Custom Photo Uploader */}
            <div>
              {customPhotoBase64 ? (
                <div className="relative p-3 rounded-2xl bg-[#141414] border border-[#D4740A]/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={customPhotoBase64}
                        alt="Votre photo"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Votre photo est chargée</span>
                      <span className="text-[10px] text-emerald-400">Prête pour l’essayage IA</span>
                    </div>
                  </div>
                  <button
                    onClick={handleClearPhoto}
                    className="p-2 text-[#737373] hover:text-red-400 transition-colors"
                    title="Supprimer ma photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#D4740A]/50 bg-[#141414]/50 cursor-pointer transition-all">
                  <Upload className="w-6 h-6 text-[#D4740A] mb-2" />
                  <span className="text-xs font-bold text-white">Importer ma photo de plein pied</span>
                  <span className="text-[10px] text-[#737373] mt-0.5">JPG, PNG ou WebP (max 8 Mo)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Step 3: Explicit Privacy Consent */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-[#D4740A] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white block">Confidentialité & Données Personnelles</span>
                <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
                  Votre photo est chiffrée, traitée temporairement uniquement pour le calcul de l’essayage, et n’est jamais réutilisée ni cédée. Vous pouvez la supprimer à tout instant.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-2 text-[#F5F5F5] cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-black text-[#D4740A] focus:ring-[#D4740A] w-4 h-4"
              />
              <span className="text-[11px] leading-snug">
                Je consens au traitement sécurisé de ma photo par le moteur d’intelligence artificielle pour cette simulation.
              </span>
            </label>
          </div>

          {/* Action CTA */}
          <Button
            variant="primary"
            size="lg"
            isLoading={isLoading}
            onClick={handleLaunchTryOn}
            className="w-full font-bold shadow-xl shadow-[#D4740A]/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Générer mon essayage virtuel
          </Button>
        </div>

        {/* Right Side: Virtual Mirror Canvas (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 min-h-[500px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4740A] animate-pulse" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  Miroir Virtuel Haute Définition
                </h3>
              </div>

              {jobResponse && (
                <button
                  onClick={handleClearPhoto}
                  className="text-xs text-[#A3A3A3] hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Effacer la simulation</span>
                </button>
              )}
            </div>

            {/* Display Area */}
            <div className="my-6 flex-1 flex items-center justify-center">
              {/* Case 1: Unconfigured API State (Rule 2: Never fake a result) */}
              {jobResponse?.status === 'pending_config' && (
                <div className="text-center p-8 rounded-2xl bg-black/50 border border-white/10 max-w-md space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4740A]/20 border border-[#D4740A]/30 flex items-center justify-center mx-auto text-[#D4740A]">
                    <Info className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-[#D4740A]/20 text-[#D4740A]">
                      À CONFIGURER
                    </span>
                    <h4 className="text-base font-bold text-white mt-2">
                      Passerelle Essayage IA prête à l’emploi
                    </h4>
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    {jobResponse.errorMessage}
                  </p>
                  <div className="p-3 rounded-xl bg-white/5 text-[11px] text-[#737373] text-left font-mono">
                    Variable : FASHN_API_KEY=...<br />
                    Fournisseur recommandé : FASHN AI (~0,05 $/essai)
                  </div>
                </div>
              )}

              {/* Case 2: Success with interactive comparison slider */}
              {jobResponse?.status === 'completed' && jobResponse.resultImageUrl && (
                <div className="w-full max-w-md mx-auto space-y-4">
                  <BeforeAfterSlider
                    originalImage={selectedProduct.images[0].url}
                    resultImage={jobResponse.resultImageUrl}
                  />
                  <p className="text-[11px] text-[#A3A3A3] text-center">
                    Glissez le curseur horizontal pour comparer le vêtement original et le rendu sur vous.
                  </p>
                </div>
              )}

              {/* Case 3: Initial idle preview */}
              {!jobResponse && (
                <div className="relative aspect-[3/4] w-full max-w-sm rounded-3xl overflow-hidden bg-[#141414] border border-white/5 flex items-center justify-center text-center p-6">
                  <div className="space-y-3">
                    <Sparkles className="w-10 h-10 text-[#D4740A] mx-auto opacity-60" />
                    <p className="text-xs text-[#A3A3A3] max-w-xs leading-relaxed">
                      Sélectionnez un mannequin ou importez votre photo, cochez le consentement et cliquez sur « Générer » pour visualiser l’essayage.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Add to Cart */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#A3A3A3] block">Produit sélectionné</span>
                <span className="text-sm font-bold text-white">{selectedProduct.nameFr}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto font-bold shadow-lg shadow-[#D4740A]/20"
                >
                  {addedToCart ? '✓ Ajouté au Panier !' : 'Ajouter au Panier'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VirtualTryOnPage() {
  return (
    <Suspense fallback={<div className="text-[#A3A3A3] text-sm py-20 text-center">Chargement de la Fitting Room IA...</div>}>
      <FittingRoomContent />
    </Suspense>
  );
}
