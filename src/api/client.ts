const DEFAULT_TIMEOUT_MS = 15_000;
// Кількість повторів після першої невдалої спроби (загалом MAX_RETRIES + 1 спроб).
// Nobel Prize API буває нестабільним і іноді «зависає», тому повтор допомагає
// пережити короткі збої без показу помилки користувачу.
const MAX_RETRIES = 1;

/** Помилка HTTP-запиту зі статусом відповіді (якщо відома). */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Одна спроба запиту з таймаутом і підтримкою скасування. */
async function fetchOnce<T>(url: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener('abort', onExternalAbort, { once: true });

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const message =
        response.status >= 500
          ? `Сервіс даних (Nobel Prize API) тимчасово недоступний — помилка ${response.status}. Спробуйте ще раз за хвилину.`
          : `Сервер повернув помилку (${response.status}).`;
      throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    // Скасування з боку користувача — передаємо AbortError, щоб викликач міг його проігнорувати.
    if (signal?.aborted) {
      throw new DOMException('Запит скасовано', 'AbortError');
    }
    // Тайм-аут: fetch відхиляє проміс з AbortError від нашого контролера.
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Сервер довго не відповідає. Спробуйте ще раз.');
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError('Не вдалося зʼєднатися із сервером. Перевірте підключення до інтернету.');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onExternalAbort);
  }
}

/**
 * Універсальна обгортка над fetch із повторними спробами:
 * - обмежує час очікування відповіді (таймаут);
 * - повторює запит при таймауті / мережевій помилці / HTTP 5xx;
 * - не повторює HTTP 4xx (клієнтські помилки) і не повторює скасовані запити;
 * - перетворює помилки на типізовану ApiError.
 */
export async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  let lastError: Error = new ApiError(
    'Не вдалося зʼєднатися із сервером. Перевірте підключення до інтернету.',
  );

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    if (signal?.aborted) {
      throw new DOMException('Запит скасовано', 'AbortError');
    }

    try {
      return await fetchOnce<T>(url, signal);
    } catch (error) {
      if (signal?.aborted) throw error;
      // Клієнтська помилка (4xx) — повторювати безглуздо.
      if (error instanceof ApiError && error.status != null && error.status < 500) {
        throw error;
      }
      lastError = error instanceof Error ? error : new ApiError('Невідома помилка.');

      if (attempt < MAX_RETRIES) {
        await delay(600 * (attempt + 1));
      }
    }
  }

  throw lastError;
}
