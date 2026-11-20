import { z } from 'zod';

export const checkoutCustomerSchema = z.object({
  fullName: z.string().min(3, 'Le nom complet doit contenir au moins 3 caractères'),
  phone: z
    .string()
    .min(9, 'Numéro de téléphone requis')
    .regex(/^(?:\+242|00242|0)?[456][0-9]{7}$/, 'Numéro congolais invalide (ex: 06 123 4567 ou 05 123 4567)'),
  email: z.string().email('Adresse email invalide').optional().or(z.literal('')),
  city: z.enum(['Brazzaville', 'Pointe-Noire'], {
    message: 'Veuillez sélectionner Brazzaville ou Pointe-Noire',
  }),
  zoneId: z.string().min(1, 'Veuillez sélectionner un quartier ou zone de livraison'),
  neighborhood: z.string().min(2, 'Le quartier est requis'),
  street: z.string().optional(),
  landmark: z.string().min(3, 'Un point de repère est essentiel pour la livraison au Congo (ex: face pharmacie, grand manguier)'),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['card', 'mtn_momo', 'airtel_money'], {
    message: 'Veuillez choisir un moyen de paiement',
  }),
});

export type CheckoutCustomerFormData = z.infer<typeof checkoutCustomerSchema>;
