import { NextResponse } from 'next/server';
import { checkoutCustomerSchema } from '@/lib/validators/order';
import { PaystackProvider, MTNMoMoProvider, AirtelMoneyProvider } from '@/lib/payment/implementations';
import { DELIVERY_ZONES } from '@/lib/data/deliveryZones';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Le panier est vide' }, { status: 400 });
    }

    // Validate form schema
    const validatedCustomer = checkoutCustomerSchema.parse(customer);

    // Verify delivery zone
    const zone = DELIVERY_ZONES.find((z) => z.id === validatedCustomer.zoneId);
    if (!zone) {
      return NextResponse.json({ error: 'Zone de livraison invalide' }, { status: 400 });
    }

    // Calculate subtotal from trusted product prices
    let subtotal = 0;
    for (const item of items) {
      const price = item.variant?.priceOverride || item.product?.salePrice || item.product?.basePrice;
      if (!price || price <= 0) {
        return NextResponse.json({ error: 'Prix de produit invalide' }, { status: 400 });
      }
      subtotal += price * item.quantity;
    }

    const deliveryFee = zone.deliveryFee;
    const total = subtotal + deliveryFee;

    // Generate unique order number (e.g., MXM-20261118-XXXX)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `MXM-${dateStr}-${randomSuffix}`;

    // Select Payment Provider
    let paymentResult;
    if (validatedCustomer.paymentMethod === 'card') {
      const provider = new PaystackProvider();
      paymentResult = await provider.initiatePayment({
        orderNumber,
        amount: total,
        customerPhone: validatedCustomer.phone,
        customerEmail: validatedCustomer.email,
      });
    } else if (validatedCustomer.paymentMethod === 'mtn_momo') {
      const provider = new MTNMoMoProvider();
      paymentResult = await provider.initiatePayment({
        orderNumber,
        amount: total,
        customerPhone: validatedCustomer.phone,
      });
    } else {
      const provider = new AirtelMoneyProvider();
      paymentResult = await provider.initiatePayment({
        orderNumber,
        amount: total,
        customerPhone: validatedCustomer.phone,
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber,
        subtotal,
        deliveryFee,
        total,
        zoneName: zone.zoneName,
        city: zone.city,
        customer: validatedCustomer,
        paymentResult,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur inconnue' }, { status: 500 });
  }
}
