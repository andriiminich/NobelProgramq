import { request } from './client';
import type { Laureate, LaureatesResponse } from './types';

const BASE_URL = 'https://api.nobelprize.org/2.1';

/** Категорії Нобелівської премії та їхні коди в API. */
export const CATEGORIES = [
  { code: 'phy', label: 'Фізика' },
  { code: 'che', label: 'Хімія' },
  { code: 'med', label: 'Фізіологія або медицина' },
  { code: 'lit', label: 'Література' },
  { code: 'pea', label: 'Премія миру' },
  { code: 'eco', label: 'Економічні науки' },
] as const;

export type CategoryCode = (typeof CATEGORIES)[number]['code'];
export type Gender = 'female' | 'male' | 'other';

/** Параметри запиту списку лауреатів. */
export interface LaureateQuery {
  search?: string;
  category?: CategoryCode | '';
  gender?: Gender | '';
  offset?: number;
  limit?: number;
}

/** Будує URL для отримання списку лауреатів з урахуванням фільтрів. */
export function buildLaureatesUrl(query: LaureateQuery): string {
  const params = new URLSearchParams();
  const search = query.search?.trim();
  if (search) params.set('name', search);
  if (query.category) params.set('nobelPrizeCategory', query.category);
  if (query.gender) params.set('gender', query.gender);
  params.set('limit', String(query.limit ?? 25));
  if (query.offset && query.offset > 0) params.set('offset', String(query.offset));
  return `${BASE_URL}/laureates?${params.toString()}`;
}

/** Будує URL для отримання одного лауреата за ідентифікатором. */
export function buildLaureateUrl(id: string): string {
  return `${BASE_URL}/laureate/${encodeURIComponent(id)}`;
}

/** Отримує сторінку лауреатів. */
export async function fetchLaureates(
  query: LaureateQuery,
  signal?: AbortSignal,
): Promise<LaureatesResponse> {
  return request<LaureatesResponse>(buildLaureatesUrl(query), signal);
}

/**
 * Отримує одного лауреата.
 * Ендпоінт /2.1/laureate/{id} повертає масив із одним елементом.
 */
export async function fetchLaureate(id: string, signal?: AbortSignal): Promise<Laureate[]> {
  return request<Laureate[]>(buildLaureateUrl(id), signal);
}
