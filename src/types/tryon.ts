export interface TryOnJobRequest {
  productId: string;
  garmentImageUrl: string;
  category: 'top' | 'bottom' | 'full';
  userPhotoBase64?: string;
  presetModelId?: string;
  consentGiven: boolean;
}

export type TryOnJobStatus = 'idle' | 'pending_config' | 'uploading' | 'processing' | 'completed' | 'failed';

export interface TryOnJobResponse {
  jobId: string;
  status: TryOnJobStatus;
  provider: 'fashn' | 'replicate';
  resultImageUrl?: string;
  originalImageUrl?: string;
  errorMessage?: string;
  estimatedSeconds?: number;
}

export interface VirtualTryOnProvider {
  name: string;
  isConfigured(): boolean;
  initiateTryOn(request: TryOnJobRequest): Promise<TryOnJobResponse>;
  checkStatus(jobId: string): Promise<TryOnJobResponse>;
}
