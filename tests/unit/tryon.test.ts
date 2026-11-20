import { describe, it, expect } from 'vitest';
import { FashnAIProvider } from '@/lib/tryon/fashn';

describe('Virtual Try-On AI Engine Tests', () => {
  it('correctly reports unconfigured state when API key is missing or dummy', () => {
    const provider = new FashnAIProvider();
    expect(provider.isConfigured()).toBe(false);
  });

  it('safely returns pending_config response without throwing exceptions', async () => {
    const provider = new FashnAIProvider();
    const result = await provider.initiateTryOn({
      productId: 'prod-fash-1',
      garmentImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
      category: 'top',
      presetModelId: 'model-male-1',
      consentGiven: true,
    });

    expect(result.status).toBe('pending_config');
    expect(result.provider).toBe('fashn');
    expect(result.errorMessage).toContain('Service d’essayage virtuel IA à configurer');
  });

  it('handles status check safely on unconfigured state', async () => {
    const provider = new FashnAIProvider();
    const status = await provider.checkStatus('dummy-job-id');

    expect(status.status).toBe('pending_config');
    expect(status.errorMessage).toBeDefined();
  });
});
