import { NextResponse } from 'next/server';
import { PaystackProvider, MTNMoMoProvider } from '@/lib/payment/implementations';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-paystack-signature') || request.headers.get('x-signature') || '';
    const body = await request.json();

    // Determine provider from body or header
    let verification;
    if (signature) {
      const paystack = new PaystackProvider();
      verification = await paystack.verifyWebhook(body, signature);
    } else {
      const momo = new MTNMoMoProvider();
      verification = await momo.verifyWebhook(body, '');
    }

    if (!verification.isValid) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 400 });
  }
}
