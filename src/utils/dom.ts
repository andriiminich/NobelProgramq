/** Екранує спеціальні символи HTML, щоб уникнути XSS. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Знаходить елемент за селектором або кидає зрозумілу помилку. */
export function qs<T extends Element>(selector: string, root: ParentNode = document): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Елемент не знайдено: ${selector}`);
  return element;
}
