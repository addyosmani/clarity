// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build
export default defineConfig({
  site: 'https://clarity.addy.ie',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      filter: (page) => page !== 'https://clarity.addy.ie/example/',
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
