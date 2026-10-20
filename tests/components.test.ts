import { describe, expect, it } from 'vitest';
import { laureateCardHtml } from '../src/components/laureateCard';
import { renderPagination } from '../src/components/pagination';
import type { Laureate } from '../src/api/types';

const sample: Laureate = {
  id: '6',
  knownName: { en: 'Marie Curie' },
  fullName: { en: 'Marie Skłodowska Curie' },
  gender: 'female',
  birth: { year: '1867' },
  death: { year: '1934' },
  nobelPrizes: [
    { awardYear: '1903', category: { en: 'Physics' }, categoryFullName: { en: 'The Nobel Prize in Physics' } },
    { awardYear: '1911', category: { en: 'Chemistry' }, categoryFullName: { en: 'The Nobel Prize in Chemistry' } },
  ],
};

describe('laureateCardHtml', () => {
  it('містить імʼя, роки та категорії', () => {
    const html = laureateCardHtml(sample);
    expect(html).toContain('Marie Curie');
    expect(html).toContain('Physics');
    expect(html).toContain('Chemistry');
    expect(html).toContain('1903');
    expect(html).toContain('1911');
  });

  it('містить посилання на детальну сторінку', () => {
    expect(laureateCardHtml(sample)).toContain('details.html?id=6');
  });

  it('екранує HTML в імені', () => {
    const html = laureateCardHtml({ ...sample, knownName: { en: '<b>X</b>' } });
    expect(html).toContain('&lt;b&gt;X&lt;/b&gt;');
    expect(html).not.toContain('<b>X</b>');
  });

  it('вставляє фото, якщо передано URL', () => {
    const html = laureateCardHtml(sample, 'https://example.com/curie.jpg');
    expect(html).toContain('card__avatar-img');
    expect(html).toContain('https://example.com/curie.jpg');
  });
});

describe('renderPagination', () => {
  it('повертає порожній рядок, якщо всі результати на одній сторінці', () => {
    expect(renderPagination({ offset: 0, limit: 25, total: 20 })).toBe('');
  });

  it('позначає поточну сторінку', () => {
    const html = renderPagination({ offset: 12, limit: 12, total: 60 });
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('Сторінка 2');
  });

  it('блокує кнопку «Назад» на першій сторінці', () => {
    const html = renderPagination({ offset: 0, limit: 12, total: 60 });
    const prevButton = html.match(/<button[^>]*aria-label="Попередня сторінка"[^>]*>/)?.[0] ?? '';
    expect(prevButton).toContain('disabled');
  });
});
