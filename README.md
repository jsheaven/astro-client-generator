<h1 align="center">@jsheaven/astro-client-generator</h1>

> Generates TypeScript API client code for your Astro endpoints. No manual `fetch()` code writing anymore.

<h2 align="center">User Stories</h2>

1. As an Astro developer, I don't want to write the `fetch()` code for my Astro endpoints manually

2. As an Astro developer, I want type-safety and auto-complete in my IDE when calling my Astro endpoints.

See: [LIVE DEMO](https://stackblitz.com/github/jsheaven/astro-client-generator?file=example%2Ftodo-list%2Fastro.config.mjs,example%2Ftodo-list%2Fsrc%2Fpages%2Findex.astro)

<h2 align="center">Features</h2>

- ✅ Generates TypeScript/JavaScript API clients for Astro endpoints (`get`, `post`, `del`, `all`, etc.)
- ✅ Available as a simple Astro integration, API and simple to use CLI (for testing and npm scripts)
- ✅ Uses `fetch` under the hood, therefore works isomorphic in browser and in SSR/SSG
- ✅ Supports JWT/token based authentication using Cookies and `Authorization` header
- ✅ Comes with two parsers: `naive` (highly optimized) and `baseline` (deoptimization, safer)
- ✅ Just `2.64 kb` nano sized library
- ✅ `0 byte` runtime overhead/dependencies as it just generates vanilla TS/JS code
- ✅ Tree-shakable and side-effect free
- ✅ Runs on Windows, Mac, Linux, CI tested
- ✅ First class TypeScript support
- ✅ 100% Unit Test coverage

See [the TODO list example](example/todo-list/src/pages/index.astro).
Example of the [generated API client code](example/todo-list/src/pages/api-client/).

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
      /** site URL to request from */
      site: 'http://localhost:3000',
      /** folder to the API directory on disk (source code) */
      apiDir: './src/pages/api',
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

<h2 align="center">Lifecycle</h2>

It's important to note that you should run `astro build` (aka. `npm run build`/`yarn build`)
whenever you change the interface definitions, imported models or the name of your endpoint
implementations. This will make sure, that the client code is re-generated and stays in sync.

<h2 align="center">How to use the generated clients?</h2>

<h3 align="center">Simple example of a `get` endpoint without `ApiRequest`</h3>

`src/pages/api/user.ts`

```ts
import { APIRoute } from 'astro'
import { User } from '../../model/User'
import { readFile } from 'fs/promises'

export interface ApiResponse {
  error?: string
  user: Array<Todo>
}

// impl. of a simple GET endpoint -- that's why the client method will be called: userClientGet
// in a file called user-client.ts
export const get: APIRoute = async ({ params, request, url }) => {
  return new Response(
    JSON.stringify({
      user: {
        id: 1,
        firstName: 'Aron',
        email: 'foo@bar.domain',
      },
    } as ApiResponse),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
```

<h4>Making requests using the generated API client</h4>

It's super trivial - yet very powerful, as you hardly can go wrong because
of the strong typing. Forget about any complexity in using `fetch()`, and
forget about debugging for typos.

You can run requests from the server-side (SSR, SSG):

`src/components/Header.astro`

```ts
import { getUser } from '../pages/client-api/user-client'

// let's say we're using Cookie authentication (@jsheaven/astro-auth),
// or no authentication -- so we don't have to do anything
const user = await getUser()
```

But feel free to use the same generated client code in any frontend framework or even vanilla JS/TS.
To learn something new, let's use some extra parameters here -- in case we use an `Authentication: Bearer $jwt` token authentication maybe:

`src/components/react/Header.tsx`

```ts
import { getUser } from '../pages/client-api/user-client'
import { getToken } from '@jsheaven/astro-oauth'

// because the user GET endpoint has no body, the first argument is the fetch() options
const user = await getUser({
  headers: {
    Authentication: `Bearer ${getToken()}`,
  },
})
```

<h3 align="center">CommonJS</h3>

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

<h2 align="center">Roadmap</h2>

At the moment, generating client APIs for dynamic endpoints (such as `[...dynamic]` and `[foo]`, `[bar]`) isn't supported. However, this is a feature that can be implemented, but I'd only see a good
reason to do that if the community demand is substantial.

<h3 align="center">Why no initial support for dynamic routing client API generation?</h3>

In traditional APIs, it's common sense / easier to transport all parameters for an endpoint
using a single source of truth - meaning: The request body. Because of that, it is wise to simply
define a `ApiRequest` interface for carrying the JSON data from client to the endpoint and a
`ApiResponse` interface for the way back, but to keep the route itself static.

If you're implementing dynamic endpoints, you'd usually use them to render response data in-place
such as user-specific JSON data, user-specific or authentication-/guarded image rendering and such, following semantic routing for SEO purposes. As these routes are usually not used for traditional
API use, and as you can, if you need the same functionality, also simply abstract the business logic
out of the endpoint and expose it in a second, static API endpoint, I see no clear advantage for
implementing the feature and making the implementation unncessarily complex. However, if the community
disagrees at large, I'd definitely love to reiterate on that thought and decision.

<h3 align="center">Support for basic auth / request param based authentication</h3>

Because it is uncommon, insecure and a kinda dated concept to use basic auth, or
request param based authentication methods for APIs, it is not covered by initial supported
through this client generation library.

If you'd like to provide authentication credentials in a modern and secure way,
opt-in for OpenID authentication / OIDC flows (out-of-scope for the generator) and
then carry a JWT token to your endpoints. Naturally, you'd simply use a Cookie which
is automatically carried to the server as a HTTP header through the `fetch` API that
is used in the client implementation.

You can also always use the built-in request customization feature to provide e.g.
the `Authentication` header when using an API client that has been generated by
this library:

```ts
import { myApiClient } from '../pages/api-client/myApiClient'
import { getToken } from '@jsheaven/astro-oauth'

myApiClient(
  /* request props/ POST body */ {
    foo: 'bar',
  },
  /* optional, fetch() API option overrides */ {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  },
)
```
