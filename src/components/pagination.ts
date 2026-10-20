export interface PaginationOptions {
  offset: number;
  limit: number;
  total: number;
}

type PageItem = number | 'ellipsis';

/** Повертає перелік номерів сторінок з багатокрапкою для великих списків. */
function pageNumbers(pageCount: number, current: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const items: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(pageCount - 1, current + 1);
  if (start > 2) items.push('ellipsis');
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < pageCount - 1) items.push('ellipsis');
  items.push(pageCount);
  return items;
}

/** Повертає HTML-розмітку пагінації (кнопки з data-offset). */
export function renderPagination(options: PaginationOptions): string {
  const { offset, limit, total } = options;
  if (total <= limit) return '';

  const pageCount = Math.ceil(total / limit);
  const current = Math.floor(offset / limit) + 1;

  const pages = pageNumbers(pageCount, current)
    .map((item) => {
      if (item === 'ellipsis') {
        return '<span class="pagination__ellipsis" aria-hidden="true">…</span>';
      }
      const pageOffset = (item - 1) * limit;
      const isCurrent = item === current;
      const currentAttr = isCurrent ? ' aria-current="page"' : '';
      return `<button type="button" class="pagination__page${isCurrent ? ' is-current' : ''}" data-offset="${pageOffset}" aria-label="Сторінка ${item}"${currentAttr}>${item}</button>`;
    })
    .join('');

  const prevDisabled = offset <= 0;
  const nextDisabled = offset + limit >= total;

  return `
    <button type="button" class="pagination__nav" data-offset="${Math.max(0, offset - limit)}"${prevDisabled ? ' disabled aria-disabled="true"' : ''} aria-label="Попередня сторінка">←</button>
    <div class="pagination__pages">${pages}</div>
    <button type="button" class="pagination__nav" data-offset="${offset + limit}"${nextDisabled ? ' disabled aria-disabled="true"' : ''} aria-label="Наступна сторінка">→</button>
  `;
}
