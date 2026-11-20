import { describe, it, expect } from 'vitest';
import { PRODUCTS, CATEGORIES } from '@/lib/data/products';

describe('Products Dataset & Catalog Integrity', () => {
  it('contains products with valid positive prices in FCFA', () => {
    expect(PRODUCTS.length).toBeGreaterThan(0);
    PRODUCTS.forEach((product) => {
      expect(product.basePrice).toBeGreaterThan(0);
      expect(Number.isInteger(product.basePrice)).toBe(true);
      if (product.salePrice) {
        expect(product.salePrice).toBeLessThan(product.basePrice);
        expect(Number.isInteger(product.salePrice)).toBe(true);
      }
    });
  });

  it('verifies all fashion items marked for tryon have tryOnCategory defined', () => {
    const tryOnProducts = PRODUCTS.filter((p) => p.allowsTryOn);
    expect(tryOnProducts.length).toBeGreaterThan(0);
    tryOnProducts.forEach((p) => {
      expect(['top', 'bottom', 'full']).toContain(p.tryOnCategory);
    });
  });

  it('verifies all products belong to existing valid categories', () => {
    const categorySlugs = CATEGORIES.map((c) => c.slug);
    PRODUCTS.forEach((p) => {
      expect(categorySlugs).toContain(p.categorySlug);
    });
  });

  it('ensures each product has at least one variant and one image', () => {
    PRODUCTS.forEach((p) => {
      expect(p.images.length).toBeGreaterThan(0);
      expect(p.variants.length).toBeGreaterThan(0);
    });
  });
});
