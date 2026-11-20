# SPEC.md — MixoMarket

## Phase 0 : Analyse et Architecture

### 1. IDENTITÉ DU PROJET
- **Nom :** MixoMarket
- **Tagline :** « Tout ce dont vous avez besoin, livré chez vous »
- **Pays de lancement :** République du Congo (Brazzaville, Pointe-Noire)
- **Devise :** Franc CFA (XAF) — format : `15 000 FCFA` (entier sans décimale)
- **Langues :** Français (défaut) + Anglais, i18n extensible
- **Cibles :** Jeunes urbains, femmes, familles, producteurs et commerçants locaux
- **Hébergement :** Vercel + Supabase

### 2. DESIGN SYSTEM & TOKENS CINÉMATIQUES
- **Palette :** Fond noir/anthracite (#0A0A0A, #141414, #1E1E1E), Accents Cuivre/Orange (#D4740A, #E8881E, #B87333), Texte clair (#F5F5F5, #A3A3A3)
- **Typographie :** Display 'Plus Jakarta Sans', Body 'Inter', Mono 'JetBrains Mono'
- **Animations :** GSAP 3 (ScrollTrigger) pour les transitions de pages, reveals, hero cinématique et carrousels ; Framer Motion pour les micro-interactions. Respect strict de `prefers-reduced-motion`.

### 3. PRESTATAIRES
- **Paiement :** Paystack (CB Visa/Mastercard) + MTN Mobile Money + Airtel Money
- **Essayage Virtuel IA :** FASHN AI (API REST ~0.05$/essai) avec interface `VirtualTryOnProvider` et fallback explicite "À CONFIGURER" si clés manquantes.
- **Base de données / Auth / Storage :** Supabase (PostgreSQL, RLS, Storage privé pour tryon).
