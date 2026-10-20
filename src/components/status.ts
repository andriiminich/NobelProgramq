import { escapeHtml } from '../utils/dom';

export type StatusType = 'loading' | 'error' | 'empty';

/** Повертає HTML-розмітку стану завантаження, помилки або порожнього результату. */
export function renderStatus(type: StatusType, message?: string): string {
  switch (type) {
    case 'loading':
      return `<div class="status status--loading" role="status">
        <span class="spinner" aria-hidden="true"></span>
        <span>Завантаження даних…</span>
      </div>`;
    case 'error':
      return `<div class="status status--error" role="alert">
        <strong>Сталася помилка.</strong>
        <p>${escapeHtml(message ?? 'Не вдалося завантажити дані.')}</p>
        <button type="button" class="button" data-retry>Спробувати ще раз</button>
      </div>`;
    case 'empty':
      return `<div class="status status--empty" role="status">
        <p>За вашим запитом нічого не знайдено. Спробуйте змінити умови пошуку або фільтри.</p>
      </div>`;
  }
}
