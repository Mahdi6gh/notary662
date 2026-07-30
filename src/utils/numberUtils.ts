import { CurrencyUnit } from '../types';

/**
 * Converts English digits to Persian digits for display
 */
export function toPersianDigits(num: number | string): string {
  if (num === null || num === undefined) return '';
  const str = String(num);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Converts Persian/Arabic digits to English digits for string parsing
 */
export function toEnglishDigits(str: string): string {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

/**
 * Formats a raw number with 3-digit comma separators
 */
export function formatNumber(val: number | string): string {
  if (val === undefined || val === null || isNaN(Number(val))) return '0';
  const num = Math.round(Number(val));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '٫');
}

/**
 * Parses user numeric input string into a pure number (handling commas and Persian digits)
 */
export function parseInputNumber(raw: string): number {
  if (!raw) return 0;
  const cleaned = toEnglishDigits(raw).replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/**
 * Format currency amount based on Rial / Toman unit preference
 */
export function formatCurrency(
  amountRial: number,
  unit: CurrencyUnit,
  includeSymbol: boolean = true
): string {
  const roundedRial = Math.round(amountRial);
  const displayAmount = unit === 'TOMAN' ? Math.floor(roundedRial / 10) : roundedRial;
  const formattedStr = formatNumber(displayAmount);
  const persianStr = toPersianDigits(formattedStr);

  if (!includeSymbol) return persianStr;
  const symbol = unit === 'TOMAN' ? 'تومان' : 'ریال';
  return `${persianStr} ${symbol}`;
}

/**
 * Returns formatted text label for currency unit
 */
export function getCurrencyLabel(unit: CurrencyUnit): string {
  return unit === 'TOMAN' ? 'تومان' : 'ریال';
}

/**
 * Converts value from current unit into standard Rials for internal calculation
 */
export function toRials(amountInCurrentUnit: number, unit: CurrencyUnit): number {
  return unit === 'TOMAN' ? amountInCurrentUnit * 10 : amountInCurrentUnit;
}

/**
 * Converts value from standard Rials to current selected unit for UI input values
 */
export function fromRials(amountRial: number, unit: CurrencyUnit): number {
  return unit === 'TOMAN' ? Math.floor(amountRial / 10) : amountRial;
}

/**
 * Helper to convert number to Persian word spellout (thousands, millions, billions) for financial clarity
 */
export function spelloutCurrency(amountRial: number, unit: CurrencyUnit): string {
  const amount = unit === 'TOMAN' ? Math.floor(amountRial / 10) : Math.round(amountRial);
  if (amount <= 0) return 'صفر';

  const symbol = unit === 'TOMAN' ? 'تومان' : 'ریال';

  if (amount >= 1_000_000_000_000) {
    const totalTrillion = (amount / 1_000_000_000_000).toFixed(2);
    return `${toPersianDigits(totalTrillion)} هزار میلیارد ${symbol}`;
  }
  if (amount >= 1_000_000_000) {
    const totalBillion = (amount / 1_000_000_000).toFixed(2);
    return `${toPersianDigits(totalBillion)} میلیارد ${symbol}`;
  }
  if (amount >= 1_000_000) {
    const totalMillion = (amount / 1_000_000).toFixed(1);
    return `${toPersianDigits(totalMillion)} میلیون ${symbol}`;
  }
  if (amount >= 1_000) {
    const totalThousand = (amount / 1_000).toFixed(0);
    return `${toPersianDigits(totalThousand)} هزار ${symbol}`;
  }
  return `${toPersianDigits(amount)} ${symbol}`;
}
