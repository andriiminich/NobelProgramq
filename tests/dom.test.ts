import { describe, expect, it } from 'vitest';
import { escapeHtml } from '../src/utils/dom';

describe('escapeHtml', () => {
  it('екранує спеціальні символи HTML', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
    );
  });

  it('повертає порожній рядок для null та undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('не змінює звичайний текст', () => {
    expect(escapeHtml('Marie Curie')).toBe('Marie Curie');
  });
});
