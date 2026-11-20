import { NextResponse } from 'next/server';
import { FashnAIProvider } from '@/lib/tryon/fashn';
import { TryOnJobRequest } from '@/types/tryon';

export async function POST(request: Request) {
  try {
    const body: TryOnJobRequest = await request.json();

    if (!body.garmentImageUrl) {
      return NextResponse.json({ error: 'Image du vêtement requise' }, { status: 400 });
    }

    if (!body.consentGiven) {
      return NextResponse.json(
        { error: 'Le consentement explicite est obligatoire pour le traitement de photo.' },
        { status: 400 }
      );
    }

    if (!body.userPhotoBase64 && !body.presetModelId) {
      return NextResponse.json(
        { error: 'Veuillez téléverser une photo ou choisir un mannequin prédéfini.' },
        { status: 400 }
      );
    }

    const provider = new FashnAIProvider();
    const result = await provider.initiateTryOn(body);

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur interne' },
      { status: 500 }
    );
  }
}
