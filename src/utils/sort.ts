import type { Laureate } from '../api/types';

export type SortOrder = 'asc' | 'desc';

/** Рік першої Нобелівської премії лауреата (або Infinity, якщо невідомо). */
function firstAwardYear(laureate: Laureate): number {
  const years = (laureate.nobelPrizes ?? [])
    .map((prize) => Number(prize.awardYear))
    .filter((year) => Number.isFinite(year));
  if (years.length === 0) return Number.POSITIVE_INFINITY;
  return Math.min(...years);
}

/**
 * Сортує лауреатів за роком першої премії на клієнті.
 *
 * Серверний параметр `sort` у Nobel Prize API зависає на великій колекції
 * (сервер сортує всі записи ще до пагінації), тому сортування виконується
 * локально після отримання сторінки даних.
 */
export function sortLaureates(laureates: Laureate[], order: SortOrder): Laureate[] {
  return [...laureates].sort((a, b) => {
    const yearA = firstAwardYear(a);
    const yearB = firstAwardYear(b);
    const aUnknown = yearA === Number.POSITIVE_INFINITY;
    const bUnknown = yearB === Number.POSITIVE_INFINITY;

    if (aUnknown && bUnknown) return 0;
    if (aUnknown) return 1; // лауреати без року — у кінець
    if (bUnknown) return -1;

    return order === 'desc' ? yearB - yearA : yearA - yearB;
  });
}
