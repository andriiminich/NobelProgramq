import type { Localized } from '../api/types';

const MONTHS_UK = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
] as const;

/** Повертає англійське значення локалізованого рядка (фолбек — інші мови). */
export function en(value: Localized | undefined | null): string {
  if (!value) return '';
  return value.en ?? value.se ?? value.no ?? '';
}

/** Форматує ISO-дату (рррр-мм-дд) українською, наприклад «7 листопада 1943». */
export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const year = match[1];
  const month = Number(match[2]);
  const day = Number(match[3]);
  const monthName = MONTHS_UK[month - 1] ?? match[2];
  return `${day} ${monthName} ${year}`;
}

/** Повертає українську мітку статі. */
export function genderLabel(gender?: string | null): string {
  switch (gender) {
    case 'female':
      return 'Жінка';
    case 'male':
      return 'Чоловік';
    case 'other':
      return 'Інше';
    default:
      return 'Не вказано';
  }
}

/** Форматує суму премії у шведських кронах. */
export function formatPrizeAmount(amount?: number | null): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Повертає ініціали (до двох слів) для аватара. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
