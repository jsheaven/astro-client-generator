import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import { hostname } from 'os'
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
      // example for CodeSandbox
      site: process.env.IS_SANDBOX
        ? `https://${hostname()}--3000.local-credentialless.webcontainer.io`
        : 'http://localhost:3000',
    }),
  ],
})
