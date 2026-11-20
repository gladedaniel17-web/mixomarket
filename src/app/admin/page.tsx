'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

interface PendingVendor {
  id: string;
  businessName: string;
  phone: string;
  city: 'Brazzaville' | 'Pointe-Noire';
  address: string;
  description: string;
  submittedAt: string;
}

export default function AdminDashboardPage() {
  // Simulated initial pending vendors
  const [pendingVendors, setPendingVendors] = useState<PendingVendor[]>([
    {
      id: 'v-101',
      businessName: 'Saveurs du Pool Maraîchage',
      phone: '06 654 3210',
      city: 'Brazzaville',
      address: 'Route du Nord, Kintélé',
      description: 'Production locale de fruits frais, légumes bios et herbes aromatiques sans pesticide.',
      submittedAt: 'Aujourd’hui à 09:42',
    },
    {
      id: 'v-102',
      businessName: 'Ponton Chic Streetwear',
      phone: '05 522 1100',
      city: 'Pointe-Noire',
      address: 'Avenue Moe Pratt, Centre-ville',
      description: 'Marque indépendante de prêt-à-porter urbain en coton peigné et broderies congolaises.',
      submittedAt: 'Hier à 17:15',
    },
  ]);

  const [approvedCount, setApprovedCount] = useState(8);
  const [notification, setNotification] = useState<string | null>(null);

  const handleApprove = (id: string, name: string) => {
    setPendingVendors(pendingVendors.filter((v) => v.id !== id));
    setApprovedCount((c) => c + 1);
    setNotification(`La boutique « ${name} » a été approuvée avec succès.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleReject = (id: string, name: string) => {
    setPendingVendors(pendingVendors.filter((v) => v.id !== id));
    setNotification(`La candidature de « ${name} » a été refusée.`);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-mono font-bold mb-2 border border-red-500/30">
            <ShieldAlert className="w-3.5 h-3.5" /> Espace Administrateur Sécurisé
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Panneau de Contrôle Central</h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Supervision des ventes, gestion des vendeurs locaux et validation des flux
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/products">
            <Button variant="secondary" size="sm">
              Voir le Site Public
            </Button>
          </Link>
          <Link href="/vendor">
            <Button variant="outline" size="sm">
              Vue Vendeur
            </Button>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Global Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total GMV */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
            <span>Volume d’Affaires Total</span>
            <TrendingUp className="w-4 h-4 text-[#D4740A]" />
          </div>
          <PriceDisplay amount={4895000} size="xl" />
          <p className="text-[11px] text-emerald-400 font-mono">+24.5% vs mois dernier</p>
        </div>

        {/* Orders */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
            <span>Commandes Validées</span>
            <ShoppingBag className="w-4 h-4 text-[#D4740A]" />
          </div>
          <p className="text-3xl font-black text-white font-mono">182</p>
          <p className="text-[11px] text-[#A3A3A3]">Brazza: 114 • Pointe-Noire: 68</p>
        </div>

        {/* Active Vendors */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
            <span>Vendeurs Actifs</span>
            <Store className="w-4 h-4 text-[#D4740A]" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{approvedCount}</p>
          <p className="text-[11px] text-[#D4740A]">Commission plateforme : 10%</p>
        </div>

        {/* Pending approvals */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
            <span>Candidatures en Attente</span>
            <AlertCircle className="w-4 h-4 text-[#F6A23D]" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{pendingVendors.length}</p>
          <p className="text-[11px] text-[#F6A23D]">À vérifier manuellement</p>
        </div>
      </div>

      {/* Pending Vendor Approvals Workflow */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4740A] animate-pulse" />
              <span>Demandes d’Adhésion Vendeurs ({pendingVendors.length})</span>
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-1">
              Conformément à la politique RLS et au cahier des charges, chaque vendeur doit être approuvé avant publication de son catalogue.
            </p>
          </div>
        </div>

        {pendingVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="p-5 rounded-2xl bg-[#141414] border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">{vendor.businessName}</h3>
                      <p className="text-xs text-[#D4740A] font-mono">
                        {vendor.city} • {vendor.address}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#737373] bg-white/5 px-2 py-0.5 rounded font-mono">
                      {vendor.submittedAt}
                    </span>
                  </div>

                  <p className="text-xs text-[#A3A3A3] leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                    &ldquo;{vendor.description}&rdquo;
                  </p>

                  <div className="text-xs text-white">
                    Contact : <strong className="font-mono">{vendor.phone}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReject(vendor.id, vendor.businessName)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20 text-xs"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Refuser
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(vendor.id, vendor.businessName)}
                    className="font-bold text-xs shadow-md shadow-[#D4740A]/20"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Approuver la boutique
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[#737373] text-xs">
            Aucune candidature vendeur en attente d’approbation.
          </div>
        )}
      </div>

      {/* Recent Orders Overview */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Dernières Commandes Clients
          </h2>
          <span className="text-xs text-[#A3A3A3] font-mono">Alimenté en temps réel</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#737373] uppercase tracking-wider">
                <th className="py-3 px-3">Numéro</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Ville / Zone</th>
                <th className="py-3 px-3">Montant</th>
                <th className="py-3 px-3">Paiement</th>
                <th className="py-3 px-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                {
                  id: 'MXM-20261118-8A1C',
                  customer: 'Jean-Paul Ondongo',
                  city: 'Brazzaville (Bacongo)',
                  total: 84000,
                  method: 'MTN MoMo',
                  status: 'Payée & Préparée',
                  badge: 'bg-emerald-500/20 text-emerald-400',
                },
                {
                  id: 'MXM-20261118-4F92',
                  customer: 'Mireille Koumba',
                  city: 'Pointe-Noire (Lumumba)',
                  total: 29500,
                  method: 'Airtel Money',
                  status: 'En Livraison',
                  badge: 'bg-blue-500/20 text-blue-400',
                },
                {
                  id: 'MXM-20261118-7B33',
                  customer: 'Serge Loubaki',
                  city: 'Brazzaville (Plateau)',
                  total: 20000,
                  method: 'Carte (Paystack)',
                  status: 'Livrée',
                  badge: 'bg-white/10 text-white',
                },
              ].map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-mono text-[#D4740A] font-bold">{order.id}</td>
                  <td className="py-3 px-3 text-white font-medium">{order.customer}</td>
                  <td className="py-3 px-3 text-[#A3A3A3]">{order.city}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    <PriceDisplay amount={order.total} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-xs text-[#A3A3A3]">{order.method}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${order.badge}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
