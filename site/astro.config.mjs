// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build
export default defineConfig({
  site: 'https://clarity.addy.ie',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://clarity.addy.ie/example/',
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
