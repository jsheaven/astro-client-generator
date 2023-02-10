import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import { apiClientGenerator } from '@jsheaven/astro-client-generator'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  // enable ./src/pages/api-client generation
  integrations: [
    apiClientGenerator({
      site: 'http://localhost:3002',
    }),
  ],
})
