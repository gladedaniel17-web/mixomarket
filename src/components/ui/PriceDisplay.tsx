import React from 'react';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCurrency?: boolean;
}

export function formatFCFA(amount: number): string {
  // French format with space grouping: 15 000 FCFA
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(amount);
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  className = '',
  size = 'md',
  showCurrency = true,
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold tracking-tight',
    xl: 'text-2xl md:text-3xl font-black tracking-tight text-[#D4740A]',
  };

  return (
    <span className={`font-mono text-[#F5F5F5] ${sizeClasses[size]} ${className}`}>
      {formatFCFA(amount)}
      {showCurrency && <span className="ml-1 text-xs md:text-sm font-sans font-medium text-[#D4740A]">FCFA</span>}
    </span>
  );
};
