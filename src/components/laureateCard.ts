import type { Laureate } from '../api/types';
import { en, initials } from '../utils/format';
import { escapeHtml } from '../utils/dom';

function categories(laureate: Laureate): string[] {
  return [...new Set((laureate.nobelPrizes ?? []).map((prize) => en(prize.category)).filter(Boolean))];
}

function years(laureate: Laureate): string[] {
  return [...new Set((laureate.nobelPrizes ?? []).map((prize) => prize.awardYear).filter(Boolean))];
}

/** Повертає HTML-розмітку картки лауреата для списку. */
export function laureateCardHtml(laureate: Laureate, photoUrl?: string): string {
  const name = en(laureate.knownName) || en(laureate.fullName) || 'Без імені';
  const birthYear = laureate.birth?.year ?? '';
  const deathYear = laureate.death?.year ?? '';
  const lifespan = birthYear || deathYear ? `${birthYear}–${deathYear}` : '';

  const categoryChips = categories(laureate)
    .map((category) => `<span class="chip">${escapeHtml(category)}</span>`)
    .join('');
  const yearsText = years(laureate).join(', ');

  const avatarImage = photoUrl
    ? `<img class="card__avatar-img" src="${escapeHtml(photoUrl)}" alt="" loading="lazy" onerror="this.remove()" />`
    : '';

  return `
    <li class="card">
      <a class="card__link" href="details.html?id=${encodeURIComponent(laureate.id)}">
        <span class="card__avatar" aria-hidden="true">${escapeHtml(initials(name))}${avatarImage}</span>
        <span class="card__body">
          <span class="card__name">${escapeHtml(name)}</span>
          <span class="card__meta">${escapeHtml(yearsText)}${lifespan ? ` · ${escapeHtml(lifespan)}` : ''}</span>
          <span class="card__chips">${categoryChips}</span>
        </span>
        <span class="card__cta">Детальніше<span class="visually-hidden"> про ${escapeHtml(name)}</span> →</span>
      </a>
    </li>
  `;
}
