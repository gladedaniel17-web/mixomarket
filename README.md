# MixoMarket — Marketplace E-Commerce & Haute Couture (Congo)

MixoMarket est une marketplace moderne, cinématique et haut de gamme conçue pour la République du Congo (**Brazzaville** et **Pointe-Noire**). Elle permet d'acheter des produits de première nécessité (riz, huile, sucre, eau), des produits frais locaux du terroir (Saka-Saka, chikwangue, safous) ainsi que des articles de mode haute couture dotés d'un **essayage virtuel par intelligence artificielle (IA)**.

---

## 🛠️ Stack Technique

- **Frontend :** Next.js 14+ (App Router) + React + TypeScript strict
- **Design & Style :** Tailwind CSS + Tokens Cinématiques sombres et cuivrés (#0A0A0A, #D4740A)
- **Animations :** GSAP 3 (ScrollTrigger) + Framer Motion
- **Base de données & Auth :** Supabase (PostgreSQL, Row Level Security, Storage)
- **Validation :** Zod (côté client et serveur)
- **Paiements :** Paystack (Cartes Visa/Mastercard), MTN Mobile Money (Collections API), Airtel Money
- **Essayage Virtuel IA :** FASHN AI (API REST asynchrone)
- **Tests :** Vitest (unitaires) + Playwright (E2E)

---

## 🚀 Installation & Démarrage Local

### 1. Prérequis
- Node.js v18+ et npm installés.
- Un compte Supabase (gratuit) et un compte Vercel.

### 2. Cloner et installer les dépendances
```bash
git clone https://github.com/votre-compte/mixomarket.git
cd mixomarket
npm install
```

### 3. Configurer les variables d'environnement
Dupliquer le fichier `.env.example` en `.env.local` :
```bash
cp .env.example .env.local
```
Renseigner vos clés Supabase, Paystack, MTN MoMo, Airtel Money et FASHN AI (voir le guide Supabase ci-dessous).

### 4. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🗄️ Configuration de Supabase & Base de Données

1. Créez un nouveau projet sur [Supabase](https://supabase.com).
2. Rendez-vous dans le **SQL Editor** et exécutez les migrations situées dans le dossier `supabase/migrations/` dans l'ordre :
   - `001_initial_schema.sql` (Tables, enums, triggers, index)
   - `002_rls_policies.sql` (Politiques de sécurité RLS par rôle)
3. Créez les buckets Storage suivants (Publics : `product-images`, `vendor-logos`, `avatars` ; Privés : `tryon-uploads`, `tryon-results`).
4. Récupérez vos clés (Project URL, `anon key`, `service_role key`) et renseignez-les dans `.env.local`.

---

## 💳 Activation des Paiements & Paiement Mobile

- **Paystack (Cartes Bancaires) :** Créez un compte sur [Paystack](https://paystack.com) (mode test ou live) et renseignez `PAYSTACK_PUBLIC_KEY` et `PAYSTACK_SECRET_KEY`.
- **MTN MoMo & Airtel Money :** Inscrivez-vous sur les portails développeurs MTN et Airtel Congo. En cabine de test, les requêtes USSD s'affichent sous forme de notifications de simulation. En production, les webhooks signés mettent à jour l'état de la commande (`paid`).

---

## 🤖 Configuration de l'Essayage Virtuel IA (FASHN AI)

1. Créez un compte sur [FASHN AI](https://fashn.ai) et obtenez votre `FASHN_API_KEY`.
2. Ajoutez la clé dans `.env.local` (`FASHN_API_KEY=votre_cle`).
3. Si la clé est absente ou correspond au modèle par défaut, l'interface affiche proprement l'état **« À CONFIGURER »** conformément aux exigences de robustesse du projet (aucune simulation trompeuse).

---

## 🧪 Exécution des Tests

- **Tests unitaires (Vitest) :**
  ```bash
  npx vitest run
  ```
- **Tests End-to-End (Playwright) :**
  ```bash
  npx playwright test
  ```
- **Build de production :**
  ```bash
  npm run build
  ```

---

## 📊 Tableau d'État Final des Fonctionnalités

| Fonctionnalité | État | Fournisseur / Technologie |
|---|---|---|
| Catalogue & Recherche | **OPÉRATIONNELLE** | Données locales & Supabase |
| Filtres, Tri & Villes | **OPÉRATIONNELLE** | Brazzaville & Pointe-Noire |
| Fiche Produit & Galerie | **OPÉRATIONNELLE** | Next.js App Router |
| Panier Persistant | **OPÉRATIONNELLE** | LocalStorage + Zustand / State |
| Tunnel de Commande & Zod | **OPÉRATIONNELLE** | Zod + Zones de livraison |
| Paiement Carte (Visa/MC) | **À CONFIGURER** | Paystack API |
| Paiement MTN Mobile Money | **À CONFIGURER** | MTN MoMo API Congo |
| Paiement Airtel Money | **À CONFIGURER** | Airtel Money API Congo |
| Espace Vendeur & Dashboard | **OPÉRATIONNELLE** | RLS + Gestion produits |
| Centre de Contrôle Admin | **OPÉRATIONNELLE** | Validation manuelle des boutiques |
| Essayage Virtuel IA (Try-On) | **À CONFIGURER** | FASHN AI API (~0.05$/essai) |
| Animations GSAP & Accessibilité | **OPÉRATIONNELLE** | GSAP ScrollTrigger + WCAG AA |
