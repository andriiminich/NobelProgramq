import { describe, expect, it } from 'vitest';
import { buildLaureatesUrl, buildLaureateUrl } from '../src/api/nobel';

describe('buildLaureatesUrl', () => {
  it('будує базовий URL зі стандартним limit', () => {
    expect(buildLaureatesUrl({})).toBe('https://api.nobelprize.org/2.1/laureates?limit=25');
  });

  it('додає параметри пошуку, фільтрів та пагінації', () => {
    const url = buildLaureatesUrl({
      search: 'curie',
      category: 'phy',
      gender: 'female',
      offset: 12,
      limit: 10,
    });
    expect(url).toContain('name=curie');
    expect(url).toContain('nobelPrizeCategory=phy');
    expect(url).toContain('gender=female');
    expect(url).toContain('offset=12');
    expect(url).toContain('limit=10');
  });

  it('ігнорує порожній пошук і нульовий offset', () => {
    const url = buildLaureatesUrl({ search: '   ', offset: 0 });
    expect(url).not.toContain('name=');
    expect(url).not.toContain('offset=');
  });
});

describe('buildLaureateUrl', () => {
  it('будує URL для конкретного лауреата', () => {
    expect(buildLaureateUrl('745')).toBe('https://api.nobelprize.org/2.1/laureate/745');
  });
});
