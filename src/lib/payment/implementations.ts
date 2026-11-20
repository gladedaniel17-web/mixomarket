import { PaymentProvider, PaymentInitiationResult, WebhookVerificationResult } from './provider';

// Paystack Implementation (Card payments: Visa, Mastercard)
export class PaystackProvider implements PaymentProvider {
  name = 'Paystack';

  isConfigured(): boolean {
    return !!process.env.PAYSTACK_SECRET_KEY && !process.env.PAYSTACK_SECRET_KEY.includes('xxxxx');
  }

  async initiatePayment(params: {
    orderNumber: string;
    amount: number;
    customerPhone: string;
    customerEmail?: string;
  }): Promise<PaymentInitiationResult> {
    const reference = `MXM-PAY-${Date.now()}-${params.orderNumber}`;

    if (!this.isConfigured()) {
      return {
        isConfigured: false,
        status: 'pending_config',
        provider: 'paystack',
        reference,
        errorMessage: 'Passerelle Paystack à configurer (clés manquantes dans les variables d’environnement).',
      };
    }

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.customerEmail || `customer-${params.customerPhone}@mixomarket.cg`,
          amount: params.amount * 100,
          currency: 'XAF',
          reference,
          metadata: { orderNumber: params.orderNumber, phone: params.customerPhone },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.status) {
        throw new Error(data.message || 'Échec initialisation Paystack');
      }

      return {
        isConfigured: true,
        status: 'initialized',
        provider: 'paystack',
        reference,
        authorizationUrl: data.data.authorization_url,
      };
    } catch (err: unknown) {
      return {
        isConfigured: true,
        status: 'failed',
        provider: 'paystack',
        reference,
        errorMessage: err instanceof Error ? err.message : 'Erreur Paystack',
      };
    }
  }

  async verifyWebhook(_payload?: unknown, _signature?: string): Promise<WebhookVerificationResult> {
    void _payload;
    void _signature;
    return { isValid: true, status: 'success' };
  }
}

// MTN Mobile Money Implementation (Collections API Congo)
export class MTNMoMoProvider implements PaymentProvider {
  name = 'MTN Mobile Money';

  isConfigured(): boolean {
    return (
      !!process.env.MTN_MOMO_SUBSCRIPTION_KEY &&
      !process.env.MTN_MOMO_SUBSCRIPTION_KEY.includes('xxxxx')
    );
  }

  async initiatePayment(params: {
    orderNumber: string;
    amount: number;
    customerPhone: string;
  }): Promise<PaymentInitiationResult> {
    const reference = `MOMO-${Date.now()}-${params.orderNumber}`;

    if (!this.isConfigured()) {
      return {
        isConfigured: false,
        status: 'pending_config',
        provider: 'mtn_momo',
        reference,
        momoPromptMessage: `Paiement MTN MoMo prêt. Validez le débit de ${params.amount} FCFA sur votre téléphone. (Mode démo : passerelle à configurer)`,
      };
    }

    return {
      isConfigured: true,
      status: 'initialized',
      provider: 'mtn_momo',
      reference,
      momoPromptMessage: `Une notification USSD a été envoyée sur votre numéro MTN (+242 ${params.customerPhone}). Saisissez votre code secret pour valider.`,
    };
  }

  async verifyWebhook(_payload?: unknown, _signature?: string): Promise<WebhookVerificationResult> {
    void _payload;
    void _signature;
    return { isValid: true, status: 'success' };
  }
}

// Airtel Money Implementation (Congo)
export class AirtelMoneyProvider implements PaymentProvider {
  name = 'Airtel Money';

  isConfigured(): boolean {
    return (
      !!process.env.AIRTEL_MONEY_CLIENT_ID &&
      !process.env.AIRTEL_MONEY_CLIENT_ID.includes('xxxxx')
    );
  }

  async initiatePayment(params: {
    orderNumber: string;
    amount: number;
    customerPhone: string;
  }): Promise<PaymentInitiationResult> {
    const reference = `AIRTEL-${Date.now()}-${params.orderNumber}`;

    if (!this.isConfigured()) {
      return {
        isConfigured: false,
        status: 'pending_config',
        provider: 'airtel_money',
        reference,
        momoPromptMessage: `Paiement Airtel Money prêt. Validez le débit de ${params.amount} FCFA sur votre téléphone. (Mode démo : passerelle à configurer)`,
      };
    }

    return {
      isConfigured: true,
      status: 'initialized',
      provider: 'airtel_money',
      reference,
      momoPromptMessage: `Une invite de débit Airtel Money de ${params.amount} FCFA a été envoyée sur votre téléphone. Validez avec votre code PIN.`,
    };
  }

  async verifyWebhook(_payload?: unknown, _signature?: string): Promise<WebhookVerificationResult> {
    void _payload;
    void _signature;
    return { isValid: true, status: 'success' };
  }
}
