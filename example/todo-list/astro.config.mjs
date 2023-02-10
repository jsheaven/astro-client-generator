import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'
import { apiClientGenerator } from '@jsheaven/astro-client-generator'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  // enable ./src/pages/api-client generation
  integrations: [
    apiClientGenerator({
      site: 'http://localhost:3002',
    }),
  ],
})
