import { describe, expect, it } from 'vitest';
import { sortLaureates } from '../src/utils/sort';
import type { Laureate } from '../src/api/types';

function laureate(id: string, ...years: number[]): Laureate {
  return {
    id,
    knownName: { en: `Laureate ${id}` },
    nobelPrizes: years.map((awardYear) => ({
      awardYear: String(awardYear),
      category: { en: 'Physics' },
      categoryFullName: { en: 'The Nobel Prize in Physics' },
    })),
  };
}

describe('sortLaureates', () => {
  const items = [laureate('a', 1911), laureate('b', 1903), laureate('c', 2020)];

  it('сортує за спаданням (спочатку новіші)', () => {
    const sorted = sortLaureates(items, 'desc');
    expect(sorted.map((l) => l.id)).toEqual(['c', 'a', 'b']);
  });

  it('сортує за зростанням (спочатку старіші)', () => {
    const sorted = sortLaureates(items, 'asc');
    expect(sorted.map((l) => l.id)).toEqual(['b', 'a', 'c']);
  });

  it('не змінює вхідний масив', () => {
    const copy = [...items];
    sortLaureates(items, 'asc');
    expect(items.map((l) => l.id)).toEqual(copy.map((l) => l.id));
  });

  it('використовує рік першої премії для багаторазових лауреатів', () => {
    const multi = [laureate('x', 1954, 1962), laureate('y', 1960)];
    const sorted = sortLaureates(multi, 'asc');
    expect(sorted.map((l) => l.id)).toEqual(['x', 'y']);
  });

  it('ставить лауреатів без року в кінець списку', () => {
    const withUnknown = [laureate('a', 1903), laureate('u')];
    expect(sortLaureates(withUnknown, 'asc').map((l) => l.id)).toEqual(['a', 'u']);
    expect(sortLaureates(withUnknown, 'desc').map((l) => l.id)).toEqual(['a', 'u']);
  });
});
