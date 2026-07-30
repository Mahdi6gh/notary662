import { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/numberUtils';
import { CurrencyUnit } from '../types';

interface AnimatedCounterProps {
  valueRial: number;
  unit: CurrencyUnit;
  className?: string;
  duration?: number; // in ms
}

export function AnimatedCounter({
  valueRial,
  unit,
  className = '',
  duration = 400,
}: AnimatedCounterProps) {
  const [displayVal, setDisplayVal] = useState<number>(valueRial);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayVal;
    const endValue = valueRial;

    if (startValue === endValue) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startValue + (endValue - startValue) * easeProgress);

      setDisplayVal(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [valueRial, duration]);

  return <span className={className}>{formatCurrency(displayVal, unit)}</span>;
}
