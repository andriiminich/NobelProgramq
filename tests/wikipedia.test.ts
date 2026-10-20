import { describe, expect, it } from 'vitest';
import { buildPageImagesUrl, parsePortraits, titleFromSlug } from '../src/api/wikipedia';

describe('titleFromSlug', () => {
  it('замінює підкреслення на пробіли', () => {
    expect(titleFromSlug('Marie_Curie')).toBe('Marie Curie');
    expect(titleFromSlug('Marie Curie')).toBe('Marie Curie');
  });
});

describe('buildPageImagesUrl', () => {
  it('будує URL запиту зображень сторінок', () => {
    const url = buildPageImagesUrl(['Marie_Curie', 'Albert_Einstein']);
    expect(url).toContain('action=query');
    expect(url).toContain('prop=pageimages');
    expect(url).toContain('pithumbsize=320');
    expect(url).toContain('titles=Marie_Curie');
    expect(url).toContain('Albert_Einstein');
  });
});

describe('parsePortraits', () => {
  it('повертає мапу назва статті -> URL мініатюри', () => {
    const portraits = parsePortraits({
      query: {
        pages: {
          '1': { title: 'Marie Curie', thumbnail: { source: 'https://example.com/img.jpg' } },
          '2': { title: 'No Image', missing: '' },
        },
      },
    });
    expect(portraits.get('Marie Curie')).toBe('https://example.com/img.jpg');
    expect(portraits.has('No Image')).toBe(false);
  });

  it('повертає порожню мапу для порожньої відповіді', () => {
    expect(parsePortraits({}).size).toBe(0);
  });
});
