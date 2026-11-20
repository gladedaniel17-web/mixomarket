import { describe, it, expect } from 'vitest';
import { checkoutCustomerSchema } from '@/lib/validators/order';
import { DELIVERY_ZONES } from '@/lib/data/deliveryZones';
import { PaystackProvider, MTNMoMoProvider, AirtelMoneyProvider } from '@/lib/payment/implementations';

describe('Order & Checkout Validation Tests', () => {
  it('validates a correct Congolese customer order form', () => {
    const validData = {
      fullName: 'Christian Makosso',
      phone: '066543210',
      email: 'christian@example.com',
      city: 'Brazzaville' as const,
      zoneId: 'bz-centre',
      neighborhood: 'Plateau',
      landmark: 'Face Tour Nabemba',
      paymentMethod: 'mtn_momo' as const,
    };

    const parsed = checkoutCustomerSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid phone numbers outside Congolese format', () => {
    const invalidPhone = {
      fullName: 'Christian Makosso',
      phone: '12345',
      city: 'Brazzaville' as const,
      zoneId: 'bz-centre',
      neighborhood: 'Plateau',
      landmark: 'Face Tour Nabemba',
      paymentMethod: 'mtn_momo' as const,
    };

    const parsed = checkoutCustomerSchema.safeParse(invalidPhone);
    expect(parsed.success).toBe(false);
  });

  it('verifies all delivery zones have valid fees in FCFA', () => {
    expect(DELIVERY_ZONES.length).toBeGreaterThan(0);
    DELIVERY_ZONES.forEach((zone) => {
      expect(zone.deliveryFee).toBeGreaterThanOrEqual(1000);
      expect(Number.isInteger(zone.deliveryFee)).toBe(true);
      expect(['Brazzaville', 'Pointe-Noire']).toContain(zone.city);
    });
  });

  it('handles unconfigured payment providers safely without crashing', async () => {
    const paystack = new PaystackProvider();
    const momo = new MTNMoMoProvider();
    const airtel = new AirtelMoneyProvider();

    // Since API keys in testing environment are placeholders, expect isConfigured to be false
    expect(paystack.isConfigured()).toBe(false);
    expect(momo.isConfigured()).toBe(false);
    expect(airtel.isConfigured()).toBe(false);

    // Call initiatePayment and verify it returns clear 'pending_config' status
    const result = await paystack.initiatePayment({
      orderNumber: 'TEST-123',
      amount: 15000,
      customerPhone: '061234567',
    });

    expect(result.status).toBe('pending_config');
    expect(result.errorMessage).toBeDefined();
  });
});
