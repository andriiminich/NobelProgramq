import './styles/main.css';

import {
  CATEGORIES,
  fetchLaureates,
  type CategoryCode,
  type Gender,
  type LaureateQuery,
} from './api/nobel';
import type { Laureate } from './api/types';
import { fetchPortraits, titleFromSlug } from './api/wikipedia';
import { laureateCardHtml } from './components/laureateCard';
import { renderPagination } from './components/pagination';
import { skeletonCardHtml } from './components/skeleton';
import { renderStatus } from './components/status';
import { qs } from './utils/dom';
import { sortLaureates, type SortOrder } from './utils/sort';
import { initTheme } from './utils/theme';

const LIMIT = 12;

const state = {
  search: '',
  category: '' as CategoryCode | '',
  gender: '' as Gender | '',
  sort: 'desc' as SortOrder,
  offset: 0,
  limit: LIMIT,
  total: 0,
};

let controller: AbortController | null = null;
// Чи треба повернути фокус на поточну сторінку пагінації після перезавантаження списку.
let focusPaginationAfterLoad = false;

const searchInput = qs<HTMLInputElement>('#search-input');
const categorySelect = qs<HTMLSelectElement>('#category-select');
const genderSelect = qs<HTMLSelectElement>('#gender-select');
const sortSelect = qs<HTMLSelectElement>('#sort-select');
const listEl = qs<HTMLUListElement>('#laureate-list');
const statusEl = qs<HTMLDivElement>('#status');
const paginationEl = qs<HTMLElement>('#pagination');
const resultCountEl = qs<HTMLElement>('#result-count');
const formEl = qs<HTMLFormElement>('#filters');

function populateCategorySelect(): void {
  const options = CATEGORIES.map(
    (category) => `<option value="${category.code}">${category.label}</option>`,
  ).join('');
  categorySelect.insertAdjacentHTML('beforeend', options);
}

function currentQuery(): LaureateQuery {
  return {
    search: state.search,
    category: state.category,
    gender: state.gender,
    offset: state.offset,
    limit: state.limit,
  };
}

function renderLoading(): void {
  listEl.innerHTML = Array.from({ length: 6 }, () => skeletonCardHtml()).join('');
  // Візуально приховано, але оголошується скрин-рідером через aria-live на #status.
  statusEl.innerHTML = '<span class="visually-hidden">Завантаження даних…</span>';
  paginationEl.innerHTML = '';
  resultCountEl.textContent = '';
}

function renderError(message: string): void {
  focusPaginationAfterLoad = false;
  listEl.innerHTML = '';
  statusEl.innerHTML = renderStatus('error', message);
  paginationEl.innerHTML = '';
  resultCountEl.textContent = '';
}

function renderEmpty(): void {
  focusPaginationAfterLoad = false;
  listEl.innerHTML = '';
  statusEl.innerHTML = renderStatus('empty');
  paginationEl.innerHTML = '';
  resultCountEl.textContent = 'Знайдено: 0';
}

function renderList(laureates: Laureate[], portraits: Map<string, string>): void {
  listEl.innerHTML = laureates
    .map((laureate) => {
      const slug = laureate.wikipedia?.slug;
      const photoUrl = slug ? portraits.get(titleFromSlug(slug)) : undefined;
      return laureateCardHtml(laureate, photoUrl);
    })
    .join('');
}

function renderResults(laureates: Laureate[], total: number): void {
  statusEl.innerHTML = '';
  renderList(laureates, new Map());
  resultCountEl.textContent = `Знайдено: ${total}`;
  paginationEl.innerHTML = renderPagination({
    offset: state.offset,
    limit: state.limit,
    total,
  });

  // Повертаємо фокус на поточну сторінку, щоб клавіатурний користувач не «губився».
  if (focusPaginationAfterLoad) {
    focusPaginationAfterLoad = false;
    paginationEl.querySelector<HTMLButtonElement>('.pagination__page.is-current')?.focus();
  }
}

/** Найкращі зусилля: довантажує фото після показу списку (без блокування UI). */
async function applyPortraits(laureates: Laureate[], signal: AbortSignal): Promise<void> {
  const slugs = laureates
    .map((laureate) => laureate.wikipedia?.slug)
    .filter((slug): slug is string => Boolean(slug));
  if (slugs.length === 0) return;

  try {
    const portraits = await fetchPortraits(slugs, signal);
    if (signal.aborted) return;
    if (portraits.size > 0) renderList(laureates, portraits);
  } catch {
    // Фото не є критичними — залишаємо ініціали.
  }
}

async function loadLaureates(): Promise<void> {
  controller?.abort();
  controller = new AbortController();
  const signal = controller.signal;
  renderLoading();
  try {
    const data = await fetchLaureates(currentQuery(), signal);
    state.total = data.meta?.count ?? data.laureates.length;
    if (data.laureates.length === 0) {
      renderEmpty();
      return;
    }
    const sorted = sortLaureates(data.laureates, state.sort);
    renderResults(sorted, state.total);
    await applyPortraits(sorted, signal);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    const message = error instanceof Error ? error.message : 'Невідома помилка.';
    renderError(message);
  }
}

function resetAndLoad(): void {
  state.offset = 0;
  void loadLaureates();
}

let searchTimer: number | undefined;
function onSearchInput(): void {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    state.search = searchInput.value;
    resetAndLoad();
  }, 350);
}

function init(): void {
  initTheme();
  populateCategorySelect();

  searchInput.addEventListener('input', onSearchInput);
  categorySelect.addEventListener('change', () => {
    state.category = categorySelect.value as CategoryCode | '';
    resetAndLoad();
  });
  genderSelect.addEventListener('change', () => {
    state.gender = genderSelect.value as Gender | '';
    resetAndLoad();
  });
  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value as SortOrder;
    resetAndLoad();
  });

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    state.search = searchInput.value;
    resetAndLoad();
  });

  statusEl.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-retry]')) void loadLaureates();
  });

  paginationEl.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>('[data-offset]');
    if (!button || button.disabled) return;
    state.offset = Number(button.dataset.offset);
    focusPaginationAfterLoad = true;
    void loadLaureates();
    paginationEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  void loadLaureates();
}

init();
