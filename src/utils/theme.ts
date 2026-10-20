export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'nobel-theme';

function systemPreference(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Повертає збережену тему або системну настройку. */
export function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return systemPreference();
}

function updateToggleLabel(theme: Theme): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!toggle) return;
  toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  toggle.textContent = theme === 'dark' ? 'Світла тема' : 'Темна тема';
}

/** Застосовує тему (атрибут data-theme на <html>) і зберігає вибір. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  updateToggleLabel(theme);
}

/** Ініціалізує тему та підключає перемикач. */
export function initTheme(): void {
  applyTheme(getPreferredTheme());
  const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  toggle?.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}
