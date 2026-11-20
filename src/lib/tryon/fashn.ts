import { VirtualTryOnProvider, TryOnJobRequest, TryOnJobResponse } from '@/types/tryon';

// FASHN AI Virtual Try-On Implementation
// Documentation: https://docs.fashn.ai
export class FashnAIProvider implements VirtualTryOnProvider {
  name = 'FASHN AI';

  isConfigured(): boolean {
    const key = process.env.FASHN_API_KEY;
    return !!key && !key.includes('your-') && !key.includes('xxxxx') && key.length > 10;
  }

  async initiateTryOn(request: TryOnJobRequest): Promise<TryOnJobResponse> {
    const jobId = `tryon-fashn-${Date.now()}`;

    // Compliance Rule 2: If external integration is unconfigured, mark 'pending_config' without deceptive simulation
    if (!this.isConfigured()) {
      return {
        jobId,
        status: 'pending_config',
        provider: 'fashn',
        originalImageUrl: request.garmentImageUrl,
        errorMessage:
          'Service d’essayage virtuel IA à configurer. Veuillez renseigner votre clé FASHN_API_KEY dans votre fichier .env.local (obtenue sur https://fashn.ai). Aucune simulation trompeuse n’est effectuée.',
      };
    }

    try {
      const response = await fetch(`${process.env.FASHN_API_URL || 'https://api.fashn.ai/v1'}/run`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_image: request.userPhotoBase64 || request.presetModelId,
          garment_image: request.garmentImageUrl,
          category: request.category,
          mode: 'balanced',
          nsfw_filter: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de l’appel à l’API FASHN AI');
      }

      return {
        jobId: data.id || jobId,
        status: 'processing',
        provider: 'fashn',
        estimatedSeconds: 15,
        originalImageUrl: request.garmentImageUrl,
      };
    } catch (err: unknown) {
      return {
        jobId,
        status: 'failed',
        provider: 'fashn',
        originalImageUrl: request.garmentImageUrl,
        errorMessage: err instanceof Error ? err.message : 'Erreur réseau avec l’API FASHN AI',
      };
    }
  }

  async checkStatus(jobId: string): Promise<TryOnJobResponse> {
    if (!this.isConfigured()) {
      return {
        jobId,
        status: 'pending_config',
        provider: 'fashn',
        errorMessage: 'Clé API FASHN manquante.',
      };
    }

    try {
      const response = await fetch(
        `${process.env.FASHN_API_URL || 'https://api.fashn.ai/v1'}/status/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur de récupération du statut');
      }

      if (data.status === 'completed') {
        return {
          jobId,
          status: 'completed',
          provider: 'fashn',
          resultImageUrl: data.output?.[0],
        };
      } else if (data.status === 'failed') {
        return {
          jobId,
          status: 'failed',
          provider: 'fashn',
          errorMessage: data.error?.message || 'Échec de la génération par l’IA',
        };
      }

      return {
        jobId,
        status: 'processing',
        provider: 'fashn',
      };
    } catch (err: unknown) {
      return {
        jobId,
        status: 'failed',
        provider: 'fashn',
        errorMessage: err instanceof Error ? err.message : 'Erreur de connexion',
      };
    }
  }
}
