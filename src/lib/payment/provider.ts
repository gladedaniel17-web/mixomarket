export type PaymentProviderType = 'paystack' | 'mtn_momo' | 'airtel_money';

export interface PaymentInitiationResult {
  isConfigured: boolean;
  status: 'initialized' | 'pending_config' | 'failed';
  provider: PaymentProviderType;
  reference: string;
  authorizationUrl?: string; // Redirect URL for 3D Secure / card
  momoPromptMessage?: string; // USSD push message for MTN / Airtel
  errorMessage?: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  orderNumber?: string;
  amount?: number;
  status?: 'success' | 'failed';
}

export interface PaymentProvider {
  name: string;
  isConfigured(): boolean;
  initiatePayment(params: {
    orderNumber: string;
    amount: number; // in FCFA
    customerPhone: string;
    customerEmail?: string;
  }): Promise<PaymentInitiationResult>;
  verifyWebhook(payload: unknown, signature: string): Promise<WebhookVerificationResult>;
}
