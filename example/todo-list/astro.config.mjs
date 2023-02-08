import { defineConfig } from 'astro/config'
import { apiClientGenerator } from '@jsheaven/astro-client-generator'

// https://astro.build/config
export default defineConfig({
  // enable ./src/pages/api-client generation
  integrations: [apiClientGenerator()],
})
