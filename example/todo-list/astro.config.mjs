import { defineConfig } from 'astro/config'
import netlify from '@astrojs/netlify'
import { apiClientGenerator } from '@jsheaven/astro-client-generator'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  // enable ./src/pages/api-client generation
  integrations: [
    apiClientGenerator({
      site: 'http://localhost:3002',
    }),
  ],
})
