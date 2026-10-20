const DEFAULT_TIMEOUT_MS = 15_000;

/** Помилка HTTP-запиту зі статусом відповіді (якщо відома). */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Універсальна обгортка над fetch:
 * - обмежує час очікування відповіді (щоб не було «вічного» завантаження);
 * - підтримує скасування через зовнішній AbortSignal;
 * - перетворює мережеві та HTTP-помилки на типізовану ApiError.
 */
export async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
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
      throw new ApiError(`Сервер повернув помилку (${response.status}).`, response.status);
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
