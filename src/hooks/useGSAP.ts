import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useGSAPContext(
  scopeRef: React.RefObject<HTMLElement | null>,
  animationFn: (ctx: gsap.Context) => void
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!scopeRef.current) return;

    if (reducedMotion) {
      gsap.set(scopeRef.current.querySelectorAll('[data-reveal]'), {
        opacity: 1,
        clearProps: 'transform,visibility',
      });
      return;
    }

    const ctx = gsap.context(() => {
      animationFn(ctx);
    }, scopeRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion, animationFn, scopeRef]);
}
