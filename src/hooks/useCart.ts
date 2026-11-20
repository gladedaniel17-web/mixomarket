'use client';

import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/order';
import { Product, ProductVariant } from '@/types/product';

const CART_STORAGE_KEY = 'mixomarket_cart_v1';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore storage error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addItem = useCallback((product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const activeVariant = variant || product.variants[0];
    const itemId = `${product.id}-${activeVariant.id}`;

    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === itemId);
      let updated: CartItem[];

      if (existing) {
        updated = prevItems.map((i) =>
          i.id === itemId
            ? { ...i, quantity: Math.min(activeVariant.stock, i.quantity + quantity) }
            : i
        );
      } else {
        updated = [
          ...prevItems,
          {
            id: itemId,
            productId: product.id,
            variantId: activeVariant.id,
            product,
            variant: activeVariant,
            quantity: Math.min(activeVariant.stock, quantity),
          },
        ];
      }

      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    setItems((prev) => {
      let updated: CartItem[];
      if (newQuantity <= 0) {
        updated = prev.filter((i) => i.id !== itemId);
      } else {
        updated = prev.map((i) => {
          if (i.id === itemId) {
            return { ...i, quantity: Math.min(i.variant.stock, newQuantity) };
          }
          return i;
        });
      }
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignored
    }
  }, []);

  // Financial Subtotals (in FCFA)
  const subtotal = items.reduce((acc, item) => {
    const price = item.variant.priceOverride || item.product.salePrice || item.product.basePrice;
    return acc + price * item.quantity;
  }, 0);

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    items,
    isLoaded,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalCount,
  };
}
