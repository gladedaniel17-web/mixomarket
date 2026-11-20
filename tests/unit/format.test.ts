import { describe, it, expect } from 'vitest';
import { formatFCFA } from '@/components/ui/PriceDisplay';

describe('PriceDisplay & formatFCFA', () => {
  it('formats whole CFA francs correctly without decimals', () => {
    // Expect 15 000 with non-breaking space or standard space
    const formatted = formatFCFA(15000);
    expect(formatted.replace(/\s/g, ' ')).toBe('15 000');
  });

  it('formats large numbers properly', () => {
    const formatted = formatFCFA(2500000);
    expect(formatted.replace(/\s/g, ' ')).toBe('2 500 000');
  });

  it('handles 0 FCFA properly', () => {
    const formatted = formatFCFA(0);
    expect(formatted).toBe('0');
  });
});
