'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  originalImage: string;
  resultImage: string;
  originalLabel?: string;
  resultLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalImage,
  resultImage,
  originalLabel = 'Vêtement Original',
  resultLabel = 'Rendu Try-On IA',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative w-full aspect-[3/4] overflow-hidden rounded-3xl select-none cursor-ew-resize bg-[#141414] border border-white/10 ${className}`}
    >
      {/* Result Image (Background - right side) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={resultImage}
          alt={resultLabel}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <span className="absolute bottom-4 right-4 text-[10px] font-bold font-mono tracking-wider bg-black/70 backdrop-blur-md text-[#D4740A] px-2.5 py-1 rounded-md border border-[#D4740A]/30">
          {resultLabel}
        </span>
      </div>

      {/* Original Image (Clipped - left side) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={originalImage}
          alt={originalLabel}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <span className="absolute bottom-4 left-4 text-[10px] font-bold font-mono tracking-wider bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-md border border-white/20">
          {originalLabel}
        </span>
      </div>

      {/* Dividing Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-[#D4740A] shadow-xl z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full copper-gradient text-black flex items-center justify-center font-bold text-xs shadow-lg shadow-black/80">
          ↔
        </div>
      </div>
    </div>
  );
};
