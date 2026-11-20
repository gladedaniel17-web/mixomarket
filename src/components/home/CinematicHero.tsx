'use client';

import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowDown, ArrowRight, ScanFace, Sparkles, Truck } from 'lucide-react';
import type { Product } from '@/types/product';

gsap.registerPlugin(useGSAP);

interface CinematicHeroProps {
  product?: Product;
}

export function CinematicHero({ product }: CinematicHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const mainImage = product?.images.find((image) => image.isPrimary) || product?.images[0];
  const detailImage = product?.images.find((image) => image.id !== mainImage?.id);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline.fromTo(
      '[data-hero-reveal]',
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12 },
      0.12,
    );
    timeline.fromTo(
      '[data-hero-scene]',
      { autoAlpha: 0, y: 28, scale: 0.94, rotateY: 8 },
      { autoAlpha: 1, y: 0, scale: 1, rotateY: 0, duration: 1.15 },
      0.2,
    );

    gsap.to('[data-hero-float]', {
      y: -9,
      duration: 3.2,
      stagger: 0.35,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, { scope: rootRef });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scene = sceneRef.current;
    if (!scene) return;

    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    gsap.to(scene, {
      rotateY: x * 8,
      rotateX: y * -6,
      duration: 0.55,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to(scene.querySelectorAll('[data-depth]'), {
      x: x * 13,
      y: y * 10,
      duration: 0.65,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const resetPointerTilt = () => {
    if (!sceneRef.current) return;
    gsap.to(sceneRef.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' });
    gsap.to(sceneRef.current.querySelectorAll('[data-depth]'), {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  return (
    <section ref={rootRef} className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__grid" aria-hidden="true" />
      <div className="home-hero__glow home-hero__glow--left" aria-hidden="true" />
      <div className="home-hero__glow home-hero__glow--right" aria-hidden="true" />

      <div className="home-hero__layout">
        <div className="home-hero__content">
          <div className="home-hero__eyebrow" data-hero-reveal>
            <span className="home-hero__live-dot" />
            <span>Le meilleur de Brazzaville à Pointe-Noire</span>
          </div>

          <h1 id="home-hero-title" className="home-hero__title" data-hero-reveal>
            Le Congo,
            <span className="hero-gradient-text">à portée de</span>
            main.
          </h1>

          <p className="home-hero__description" data-hero-reveal>
            Les essentiels du quotidien, les saveurs locales et les créations de nos stylistes —
            réunis dans une expérience d’achat pensée pour vous.
          </p>

          <div className="home-hero__actions" data-hero-reveal>
            <Link href="/products" className="home-hero__button home-hero__button--primary">
              Explorer la marketplace <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/tryon" className="home-hero__button home-hero__button--secondary">
              <Sparkles size={16} aria-hidden="true" /> Essayage virtuel
            </Link>
          </div>

          <div className="home-hero__trust" data-hero-reveal>
            <span><Truck size={15} aria-hidden="true" /> Livraison à domicile</span>
            <span><Sparkles size={15} aria-hidden="true" /> Créateurs locaux</span>
            <span><ScanFace size={15} aria-hidden="true" /> Essayage virtuel IA</span>
          </div>
        </div>

        <div
          ref={sceneRef}
          className="home-hero__visual"
          data-hero-scene
          role="group"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointerTilt}
          aria-label={product ? `À la une : ${product.nameFr}` : 'Sélection mode MixoMarket'}
        >
          <div className="home-hero__orbit home-hero__orbit--outer" data-depth aria-hidden="true" />
          <div className="home-hero__orbit home-hero__orbit--inner" data-depth aria-hidden="true" />
          <div className="home-hero__backplate" data-depth aria-hidden="true" />

          <div className="home-hero__photo-frame" data-depth>
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.altText || product?.nameFr || 'Création de mode locale'}
                fill
                priority
                sizes="(max-width: 700px) 82vw, (max-width: 1100px) 45vw, 540px"
                className="home-hero__photo"
              />
            ) : (
              <div className="home-hero__photo-fallback" />
            )}
            <div className="home-hero__photo-shade" />
            <div className="home-hero__photo-caption">
              <span>ÉDITION CONGO</span>
              <strong>{product?.brand || 'La création locale, autrement'}</strong>
            </div>
          </div>

          {detailImage && (
            <div className="home-hero__detail-card" data-depth data-hero-float>
              <div className="home-hero__detail-image">
                <Image
                  src={detailImage.url}
                  alt={detailImage.altText || 'Détail de la pièce mise en avant'}
                  fill
                  sizes="128px"
                  className="home-hero__photo"
                />
              </div>
              <span>DÉTAILS COUTURE</span>
            </div>
          )}

          <div className="home-hero__floating-card home-hero__floating-card--tryon" data-depth data-hero-float>
            <span className="home-hero__floating-icon"><ScanFace size={16} aria-hidden="true" /></span>
            <span><strong>Essayage virtuel</strong><small>Votre style, en un instant</small></span>
          </div>

          <div className="home-hero__floating-card home-hero__floating-card--delivery" data-depth data-hero-float>
            <span className="home-hero__delivery-dot" />
            <span><strong>Fait près de chez vous</strong><small>Brazzaville · Pointe-Noire</small></span>
          </div>

          <div className="home-hero__vertical-label" aria-hidden="true">MIXOMARKET · 2026</div>
        </div>
      </div>

      <a className="home-hero__scroll-cue" href="#rayons" data-hero-reveal>
        <span>Défiler pour découvrir</span><ArrowDown size={14} aria-hidden="true" />
      </a>
    </section>
  );
}
