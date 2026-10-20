import { describe, expect, it } from 'vitest';
import { en, formatDate, formatPrizeAmount, genderLabel, initials } from '../src/utils/format';

describe('en', () => {
  it('повертає англійське значення локалізованого рядка', () => {
    expect(en({ en: 'Physics', se: 'Fysik' })).toBe('Physics');
  });

  it('використовує фолбек на інші мови', () => {
    expect(en({ se: 'Fysik' })).toBe('Fysik');
  });

  it('повертає порожній рядок для порожнього значення', () => {
    expect(en(undefined)).toBe('');
    expect(en(null)).toBe('');
    expect(en({})).toBe('');
  });
});

describe('formatDate', () => {
  it('форматує ISO-дату українською', () => {
    expect(formatDate('1943-11-07')).toBe('7 листопада 1943');
  });

  it('повертає тире для відсутньої дати', () => {
    expect(formatDate(undefined)).toBe('—');
    expect(formatDate(null)).toBe('—');
  });

  it('повертає вхідний рядок для некоректного формату', () => {
    expect(formatDate('невідомо')).toBe('невідомо');
  });
});

describe('genderLabel', () => {
  it('повертає українські мітки статі', () => {
    expect(genderLabel('female')).toBe('Жінка');
    expect(genderLabel('male')).toBe('Чоловік');
    expect(genderLabel('other')).toBe('Інше');
  });

  it('повертає «Не вказано» для відсутнього значення', () => {
    expect(genderLabel(undefined)).toBe('Не вказано');
    expect(genderLabel('unknown')).toBe('Не вказано');
  });
});

describe('initials', () => {
  it('повертає ініціали з перших двох слів', () => {
    expect(initials('Marie Curie')).toBe('MC');
    expect(initials('Albert Einstein')).toBe('AE');
    expect(initials('A. Michael Spence')).toBe('AM');
  });

  it('повертає порожній рядок для порожнього імені', () => {
    expect(initials('')).toBe('');
  });
});

describe('formatPrizeAmount', () => {
  it('форматує суму у шведських кронах', () => {
    const result = formatPrizeAmount(10_000_000);
    expect(result).toContain('10');
    expect(result).toContain('kr');
  });

  it('повертає тире для відсутньої суми', () => {
    expect(formatPrizeAmount(undefined)).toBe('—');
    expect(formatPrizeAmount(null)).toBe('—');
  });
});
