import { request } from './client';

interface WikipediaThumbnail {
  source?: string;
  width?: number;
  height?: number;
}

interface WikipediaPage {
  pageid?: number;
  ns?: number;
  title?: string;
  thumbnail?: WikipediaThumbnail;
  missing?: string;
}

interface PageImagesResponse {
  query?: {
    pages?: Record<string, WikipediaPage>;
  };
}

const API_URL = 'https://en.wikipedia.org/w/api.php';

/** Перетворює slug статті (з підкресленнями) на назву з пробілами. */
export function titleFromSlug(slug: string): string {
  return slug.replaceAll('_', ' ').trim();
}

/** Будує URL пакетного запиту зображень сторінок Wikipedia. */
export function buildPageImagesUrl(slugs: string[]): string {
  const params = new URLSearchParams({
    action: 'query',
    titles: slugs.join('|'),
    prop: 'pageimages',
    format: 'json',
    pithumbsize: '320',
    origin: '*',
    redirects: '1',
  });
  return `${API_URL}?${params.toString()}`;
}

/** Перетворює відповідь Wikipedia на мапу «назва статті → URL мініатюри». */
export function parsePortraits(response: PageImagesResponse): Map<string, string> {
  const portraits = new Map<string, string>();
  for (const page of Object.values(response.query?.pages ?? {})) {
    const title = page.title ? titleFromSlug(page.title) : '';
    const source = page.thumbnail?.source;
    if (title && source) portraits.set(title, source);
  }
  return portraits;
}

/** Отримує мініатюри фото для списку статей одним пакетним запитом. */
export async function fetchPortraits(
  slugs: string[],
  signal?: AbortSignal,
): Promise<Map<string, string>> {
  const unique = [...new Set(slugs.map(titleFromSlug).filter(Boolean))];
  if (unique.length === 0) return new Map();
  const response = await request<PageImagesResponse>(buildPageImagesUrl(unique), signal);
  return parsePortraits(response);
}
