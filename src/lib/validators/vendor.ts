import { z } from 'zod';

export const vendorRegistrationSchema = z.object({
  businessName: z.string().min(3, 'Le nom commercial doit comporter au moins 3 caractères'),
  businessDescription: z.string().min(10, 'Décrivez vos activités et produits en au moins 10 caractères'),
  phone: z
    .string()
    .min(9, 'Numéro de contact requis')
    .regex(/^(?:\+242|00242|0)?[456][0-9]{7}$/, 'Numéro congolais invalide (ex: 06 123 4567 ou 05 123 4567)'),
  city: z.enum(['Brazzaville', 'Pointe-Noire'], {
    message: 'Sélectionnez votre ville d’activité principale',
  }),
  address: z.string().min(3, 'Adresse ou quartier d’activité requis'),
});

export type VendorRegistrationData = z.infer<typeof vendorRegistrationSchema>;

export const vendorProductSchema = z.object({
  nameFr: z.string().min(3, 'Le nom du produit est requis'),
  categorySlug: z.string().min(1, 'La catégorie est requise'),
  descriptionFr: z.string().min(10, 'Une description détaillée est requise'),
  basePrice: z.number().int().positive('Le prix doit être un entier positif en FCFA'),
  allowsTryOn: z.boolean().default(false),
  tryOnCategory: z.enum(['top', 'bottom', 'full']).optional(),
  stock: z.number().int().nonnegative('Le stock initial ne peut être négatif'),
});

export type VendorProductFormData = z.infer<typeof vendorProductSchema>;
