import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

// Multi-page application (MPA): дві HTML-точки входу — каталог і детальна сторінка.
export default defineConfig({
  // Відносні шляхи, щоб збірку можна було розгортати і в корені, і в підкаталозі (GitHub Pages).
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        details: fileURLToPath(new URL('./details.html', import.meta.url)),
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
});
