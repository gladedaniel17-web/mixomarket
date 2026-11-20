import { describe, it, expect } from 'vitest';
import { vendorRegistrationSchema, vendorProductSchema } from '@/lib/validators/vendor';

describe('Vendor & Admin Workflow Validation Tests', () => {
  it('validates a correct vendor registration for Brazzaville or Pointe-Noire', () => {
    const validVendor = {
      businessName: 'Atelier Océan Couture',
      businessDescription: 'Création artisanale de vestes, chemises et accessoires en lin et pagne wax.',
      phone: '065551234',
      city: 'Pointe-Noire' as const,
      address: 'Grand Marché, Allée des tailleurs',
    };

    const parsed = vendorRegistrationSchema.safeParse(validVendor);
    expect(parsed.success).toBe(true);
  });

  it('rejects vendor registration with short business name or invalid phone', () => {
    const invalidVendor = {
      businessName: 'A',
      businessDescription: 'Court',
      phone: '123',
      city: 'Brazzaville' as const,
      address: 'Rue',
    };

    const parsed = vendorRegistrationSchema.safeParse(invalidVendor);
    expect(parsed.success).toBe(false);
  });

  it('validates product creation by vendor with try-on category specification', () => {
    const validProduct = {
      nameFr: 'Veste Cuivre Velours',
      categorySlug: 'mode',
      descriptionFr: 'Veste sur mesure de soirée avec revers en satin de soie.',
      basePrice: 75000,
      allowsTryOn: true,
      tryOnCategory: 'top' as const,
      stock: 12,
    };

    const parsed = vendorProductSchema.safeParse(validProduct);
    expect(parsed.success).toBe(true);
  });

  it('rejects product with negative price or negative stock', () => {
    const invalidProduct = {
      nameFr: 'Produit Invalide',
      categorySlug: 'mode',
      descriptionFr: 'Description détaillée du produit.',
      basePrice: -5000,
      allowsTryOn: false,
      stock: -2,
    };

    const parsed = vendorProductSchema.safeParse(invalidProduct);
    expect(parsed.success).toBe(false);
  });
});
