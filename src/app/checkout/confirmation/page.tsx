'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Clock, Truck, MapPin, Smartphone, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoredOrder {
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  zoneName: string;
  city: string;
  customer: {
    fullName: string;
    phone: string;
    neighborhood: string;
    landmark: string;
    paymentMethod: string;
  };
  paymentResult?: {
    isConfigured: boolean;
    status: string;
    momoPromptMessage?: string;
    errorMessage?: string;
  };
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4740A', '#E8881E', '#B87333', '#FFFFFF'],
      });
    } catch {
      // Ignored
    }

    const stored = sessionStorage.getItem('last_order');
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch {
        // Ignored
      }
    }
  }, []);

  return (
    <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-6">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-[#D4740A]/20 border border-[#D4740A]/40 flex items-center justify-center mx-auto text-[#D4740A] shadow-lg shadow-[#D4740A]/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-mono text-[#D4740A] uppercase tracking-wider">
          Commande Confirmée
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Merci pour votre confiance !
        </h1>
        <p className="text-xs sm:text-sm text-[#A3A3A3] mt-2">
          Numéro de commande :{' '}
          <strong className="text-white font-mono bg-white/5 px-2 py-1 rounded">
            {orderNumber || order?.orderNumber || 'MXM-COMMANDE'}
          </strong>
        </p>
      </div>

      {/* Payment prompt instruction (MTN MoMo or Airtel Money) */}
      {order?.paymentResult?.momoPromptMessage && (
        <div className="p-4 rounded-2xl bg-[#D4740A]/10 border border-[#D4740A]/30 text-left flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-[#D4740A] flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-white block mb-0.5">Instruction Paiement Mobile :</span>
            <p className="text-[#A3A3A3] leading-relaxed">
              {order.paymentResult.momoPromptMessage}
            </p>
          </div>
        </div>
      )}

      {/* Order Details Recap */}
      {order && (
        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-left text-xs space-y-3">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] pb-2 border-b border-white/5">
            Détails de Livraison ({order.city})
          </h3>
          <div className="flex items-center gap-2 text-[#A3A3A3]">
            <MapPin className="w-4 h-4 text-[#D4740A]" />
            <span>
              {order.customer.fullName} • {order.customer.phone}
            </span>
          </div>
          <div className="text-[#A3A3A3] pl-6">
            <p>Quartier : {order.customer.neighborhood} ({order.zoneName})</p>
            <p>Repère : {order.customer.landmark}</p>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-white font-bold">
            <span>Montant Total</span>
            <PriceDisplay amount={order.total} size="md" />
          </div>
        </div>
      )}

      {/* Timeline tracker */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 text-[11px]">
        <div className="flex flex-col items-center text-[#D4740A]">
          <CheckCircle2 className="w-4 h-4 mb-1" />
          <span className="font-bold">1. Reçue</span>
        </div>
        <div className="flex flex-col items-center text-[#A3A3A3]">
          <Clock className="w-4 h-4 mb-1" />
          <span>2. En Préparation</span>
        </div>
        <div className="flex flex-col items-center text-[#A3A3A3]">
          <Truck className="w-4 h-4 mb-1" />
          <span>3. En Livraison (2h-6h)</span>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/products" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full sm:w-auto font-bold">
            Continuer mes achats
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
        <Link href="/" className="w-full sm:w-auto">
          <Button variant="secondary" size="md" className="w-full sm:w-auto">
            Retour à l’accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
      <Suspense fallback={<div className="text-[#A3A3A3] text-sm py-20">Chargement de votre confirmation...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
