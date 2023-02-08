<h1 align="center">@jsheaven/astro-client-generator</h1>

> Generates TypeScript API client code for your Astro endpoints. No manual `fetch()` code writing anymore.

<h2 align="center">User Stories</h2>

1. As an Astro developer, I don't want to write the `fetch()` code for my Astro endpoints manually

2. As an Astro developer, I want type-safety and auto-complete in my IDE when calling my Astro endpoints.

<h2 align="center">Features</h2>

- ✅ Generates TypeScript/JavaScript API clients for Astro endpoints (`get`, `post`, `del`, `all`, etc.)
- ✅ Available as a simple Astro integration, API and simple to use CLI (for testing and npm scripts)
- ✅ Uses `fetch` under the hood, therefore works isomorphic in browser and in SSR/SSG
- ✅ Comes with two parsers: `naive` (highly optimized) and `baseline` (deoptimization, safer)
- ✅ Just `2.64 kb` nano sized library
- ✅ `0 byte` runtime overhead/dependencies as it just generates vanilla TS/JS code
- ✅ Tree-shakable and side-effect free
- ✅ Runs on Windows, Mac, Linux, CI tested
- ✅ First class TypeScript support
- ✅ 100% Unit Test coverage

<h2 align="center">Example usage / test it (CLI)</h2>

If you want to test it, simply run this command in your Astro project root folder:
`npx @jsheaven/astro-client-generator generate`

> You need at least version 18 of [Node.js](https://www.nodejs.org) installed.

<h2 align="center">Use the Astro intergration</h2>

<h3 align="center">Setup</h2>

- yarn: `yarn add @jsheaven/astro-client-generator`
- npm: `npm install @jsheaven/astro-client-generator`

<h3 align="center">Integrate into Astro</h3>

Add the following code to your `astro.config.(js|ts)`:

```ts
import { apiClientGenerator } from '@jsheaven/astro-client-generator'

// https://astro.build/config
export default defineConfig({
  ...
  integrations: [
    // generate client API code for the endpoints
    apiClientGenerator(),
  ]
})
```

You can enhance and customize this configuration:

```ts
import { apiClientGenerator } from '@jsheaven/astro-client-generator'

// https://astro.build/config
export default defineConfig({
  ...
  integrations: [
    apiClientGenerator({

      // == all settings displayed here are optional. What you see here, are default values ==

      /** folder to the API directory on disk (source code) */
      root: './src/pages/api',
      /** API base URL for calling the API (only relevant if you host in a subdir, it's unlikely) */
      baseUrl: '',
      /** folder on disk to write the client code to */
      outDir: './src/pages/api-client',
       /** parser to use. 'naive' comes with constraints (non-standard-compliant), 'baseline' is 900x slower */
      parser: 'naive',
      /** path to your tsconfig.json, from the root folder of your project */
      tsConfigPath: './tsconfig.json',
    }),
  ]
})
```

<h2 align="center">Example usage (API, as a library)</h2>

<h3 align="center">ESM</h2>

```ts
import { generateClientApis } from '@jsheaven/astro-client-generator'

const result = await generateClientApis({
  // all optional, these are just the default values
  root: './src/pages/api',
  baseUrl: '',
  outDir: './src/pages/api-client',
  parser: 'naive',
  tsConfigPath: './tsconfig.json',
})
```

<h3 align="center">CommonJS</h2>

```ts
const { generateClientApis } = require('@jsheaven/astro-client-generator')

// same API like ESM variant
```

<h2 align="center">Naive parser pros & cons</h2>

The `naive` parser in this package is a hand-written, highly optimized parser that is
capable of handling a subset of the official TypeScript / JavaScript syntax.

In `naive` parsing mode, code generation will happen in `2 to 5ms` per endpoint,
file in `baseline` mode, you can espect at least `1 sec` per endpoint. This is,
why `naive` parsing is the default configuration.

If you follow the following rules, the `naive` parser should be just working fine:

- write `import` statements in a single line
- write `type` definitions in a single line
- don't use `{` and `}` inside of _comments_ in `interface` definitions
- endpoints must either be declared as async function expressions like `export const get = ( ... ) => { ... }`
- or as an async function `async function get ( ... ) { ... }`
- any endpoint method (`get`, `post`, `del`, etc. that Astro supports, is supported), but keep the method name lowercase

However, if you're running into errors, please use the `baseline` parser:

```ts
import { apiClientGenerator } from '@jsheaven/astro-client-generator'

// https://astro.build/config
export default defineConfig({
  ...
  integrations: [
    apiClientGenerator({
      ...
      parser: 'baseline',
      ...
    }),
  ]
})
```

Please take a look at the [test fixtures](test/fixtures/pages/api/) to get an idea about what syntax is definitely supported. It should cover most of the simple and advanced use-cases.
