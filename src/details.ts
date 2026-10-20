import './styles/main.css';

import { fetchLaureate } from './api/nobel';
import type { Laureate, NobelPrize } from './api/types';
import { fetchPortraits, titleFromSlug } from './api/wikipedia';
import { en, formatDate, formatPrizeAmount, genderLabel, initials } from './utils/format';
import { escapeHtml, qs } from './utils/dom';
import { initTheme } from './utils/theme';

const container = qs<HTMLElement>('#laureate-detail');

function prizeHtml(prize: NobelPrize): string {
  const motivation = en(prize.motivation);
  const affiliations = (prize.affiliations ?? [])
    .map((affiliation) => en(affiliation.name) || en(affiliation.nameNow))
    .filter(Boolean)
    .join(', ');
  const amount = formatPrizeAmount(prize.prizeAmount);

  return `
    <article class="prize">
      <header class="prize__header">
        <span class="prize__year">${escapeHtml(prize.awardYear)}</span>
        <div>
          <h3 class="prize__category">${escapeHtml(en(prize.categoryFullName) || en(prize.category))}</h3>
          ${prize.portion ? `<p class="prize__portion">Частка премії: ${escapeHtml(prize.portion)}</p>` : ''}
        </div>
      </header>
      ${motivation ? `<blockquote class="prize__motivation">«${escapeHtml(motivation)}»</blockquote>` : ''}
      ${affiliations ? `<p class="prize__affiliations"><strong>Організація:</strong> ${escapeHtml(affiliations)}</p>` : ''}
      ${prize.prizeAmount != null ? `<p class="prize__amount"><strong>Сума премії:</strong> ${escapeHtml(amount)}</p>` : ''}
    </article>
  `;
}

function renderLaureate(laureate: Laureate, photoUrl?: string): void {
  const name = en(laureate.knownName) || en(laureate.fullName) || 'Без імені';
  const birthDate = formatDate(laureate.birth?.date);
  const deathDate = formatDate(laureate.death?.date);
  const birthPlace = en(laureate.birth?.place?.locationString);
  const deathPlace = en(laureate.death?.place?.locationString);
  const wikipedia = laureate.wikipedia?.english;
  const nobelFacts = laureate.links?.find(
    (link) => link.rel === 'external' && link.class?.includes('laureate facts'),
  )?.href;

  const prizes = (laureate.nobelPrizes ?? []).map(prizeHtml).join('');
  const avatarImage = photoUrl
    ? `<img class="laureate__avatar-img" src="${escapeHtml(photoUrl)}" alt="" onerror="this.remove()" />`
    : '';

  document.title = `${name} — Нобелівські лауреати`;

  container.innerHTML = `
    <article class="laureate">
      <div class="laureate__hero">
        <span class="laureate__avatar" aria-hidden="true">${escapeHtml(initials(name))}${avatarImage}</span>
        <div class="laureate__heading">
          <h1 class="laureate__name">${escapeHtml(name)}</h1>
          <dl class="laureate__facts">
            <div class="fact">
              <dt>Стать</dt>
              <dd>${escapeHtml(genderLabel(laureate.gender))}</dd>
            </div>
            <div class="fact">
              <dt>Народження</dt>
              <dd>${escapeHtml(birthDate)}${birthPlace ? `, ${escapeHtml(birthPlace)}` : ''}</dd>
            </div>
            ${laureate.death ? `<div class="fact">
              <dt>Смерть</dt>
              <dd>${escapeHtml(deathDate)}${deathPlace ? `, ${escapeHtml(deathPlace)}` : ''}</dd>
            </div>` : ''}
          </dl>
        </div>
      </div>

      <section class="laureate__section" aria-labelledby="prizes-title">
        <h2 id="prizes-title">Нобелівські премії</h2>
        <div class="prize-list">${prizes || '<p>Інформація про премії відсутня.</p>'}</div>
      </section>

      ${wikipedia || nobelFacts ? `<section class="laureate__section" aria-labelledby="links-title">
        <h2 id="links-title">Додаткові джерела</h2>
        <ul class="link-list">
          ${wikipedia ? `<li><a href="${escapeHtml(wikipedia)}" target="_blank" rel="noopener noreferrer">Wikipedia (англ.)</a></li>` : ''}
          ${nobelFacts ? `<li><a href="${escapeHtml(nobelFacts)}" target="_blank" rel="noopener noreferrer">Сторінка на nobelprize.org</a></li>` : ''}
        </ul>
      </section>` : ''}
    </article>
  `;
}

function renderLoading(): void {
  container.innerHTML = `<div class="status status--loading" role="status">
    <span class="spinner" aria-hidden="true"></span>
    <span>Завантаження даних…</span>
  </div>`;
}

function renderError(message: string): void {
  container.innerHTML = `<div class="status status--error" role="alert">
    <strong>Не вдалося завантажити інформацію.</strong>
    <p>${escapeHtml(message)}</p>
    <a class="button" href="index.html">Повернутися до каталогу</a>
  </div>`;
}

/** Найкращі зусилля: довантажує фото після показу даних. */
async function applyPortrait(laureate: Laureate, signal: AbortSignal): Promise<void> {
  const slug = laureate.wikipedia?.slug;
  if (!slug) return;

  try {
    const portraits = await fetchPortraits([slug], signal);
    if (signal.aborted) return;
    const photoUrl = portraits.get(titleFromSlug(slug));
    if (photoUrl) renderLaureate(laureate, photoUrl);
  } catch {
    // Фото не є критичним — залишаємо ініціали.
  }
}

async function init(): Promise<void> {
  initTheme();
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    renderError('Не вказано ідентифікатор лауреата.');
    return;
  }

  renderLoading();
  const controller = new AbortController();
  try {
    const data = await fetchLaureate(id, controller.signal);
    const laureate = data[0];
    if (!laureate) {
      renderError(`Лауреата з ідентифікатором «${id}» не знайдено.`);
      return;
    }
    renderLaureate(laureate);
    await applyPortrait(laureate, controller.signal);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return;
    renderError(error instanceof Error ? error.message : 'Невідома помилка.');
  }
}

void init();
