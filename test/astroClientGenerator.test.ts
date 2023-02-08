import { jest } from '@jest/globals'

// import under a different name
const originalModule = await import('../dist/index.esm.js')

// mock but provide the same implementation
jest.unstable_mockModule('../dist/index.esm.js', async () => {
  return {
    __esModule: true,
    ...originalModule,
    apiClientGenerator: jest.fn(originalModule.apiClientGenerator),
    validateConfig: jest.fn(originalModule.validateConfig),
    generateClientApis: jest.fn(originalModule.generateClientApis),
  }
})

// actually import (partly mocked)
const {
  analyzeHttpMethodImplemented,
  cleanupInterfce,
  generateClientApis,
  lowerCaseFirst,
  parseApiRoutesNaive,
  parseApiRoutesBaseline,
  apiGeneratorOptionsDefaults,
  upperCaseFirst,
  apiClientGenerator,
  validateConfig,
} = await import('../dist/index.esm.js')

describe('astroClientGenerator', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('can call astroClientGenerator - default', () => {
    generateClientApis({
      outDir: './dist/api-client',
      root: './test/fixtures/pages/api',
      baseUrl: '',
    })

    expect(generateClientApis).toBeDefined()
  })

  it('can call astroClientGenerator - naive', () => {
    generateClientApis({
      outDir: './dist/api-client',
      root: './test/fixtures/pages/api',
      baseUrl: '',
      parser: 'naive',
    })

    expect(generateClientApis).toBeDefined()
  })

  it('can call astroClientGenerator - baseline', () => {
    generateClientApis({
      outDir: './dist/api-client',
      root: './test/fixtures/pages/api',
      baseUrl: '',
      parser: 'baseline',
    })

    expect(generateClientApis).toBeDefined()
  })

  describe('upperCaseFirst', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('should convert the first letter of a string to uppercase', () => {
      const input = 'hello'
      const expected = 'Hello'
      const result = upperCaseFirst(input)
      expect(result).toEqual(expected)
    })
  })

  describe('lowerCaseFirst', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('should convert the first letter of a string to lowercase', () => {
      const input = 'HELLO'
      const expected = 'hELLO'
      const result = lowerCaseFirst(input)
      expect(result).toEqual(expected)
    })
  })

  describe('cleanupInterfce', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('should remove "export" keyword from the beginning of a code string', () => {
      const input = ['export interface Hello {', '  name: string', '}']
      const expected = 'export interface Hello {\n  name: string\n}'
      const result = cleanupInterfce(input)
      expect(result).toEqual(expected)
    })
  })

  describe('analyzeHttpMethodImplemented', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('correctly analyzes the HTTP method implemented', () => {
      let code = 'function get(req, res) {}'
      let method = analyzeHttpMethodImplemented(code)
      expect(method).toBe('GET')

      code = 'function post(req, res) {}'
      method = analyzeHttpMethodImplemented(code)
      expect(method).toBe('POST')

      code = 'function del(req, res) {}'
      method = analyzeHttpMethodImplemented(code)
      expect(method).toBe('DELETE')

      code = 'function patch(req, res) {}'
      method = analyzeHttpMethodImplemented(code)
      expect(method).toBe('PATCH')

      code = 'function head(req, res) {}'
      method = analyzeHttpMethodImplemented(code)
      expect(method).toBe('HEAD')

      code = 'function put(req, res) {}'
      method = analyzeHttpMethodImplemented(code)
      expect(method).toBe('PUT')

      code = 'function options(req, res) {}'
      method = analyzeHttpMethodImplemented(code)
      expect(method).toBe('OPTIONS')

      code = 'function all(req, res) {}'
      method = analyzeHttpMethodImplemented(code)
      expect(method).toEqual(['POST', 'DELETE', 'GET', 'PATCH', 'HEAD', 'PUT', 'OPTIONS'])
    })
  })

  describe('parseApiRoutesNaive', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('parses the API routes correctly - all', () => {
      const apiRoutes = ['./test/fixtures/pages/api/allRequest.ts']
      const apiRouteParseResults = parseApiRoutesNaive(apiRoutes)

      expect(apiRouteParseResults.length).toBe(7)
      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/allRequest.ts',
        imports: ["import { APIContext, APIRoute } from 'astro'"],
        method: 'POST',
        requestInterface: 'export interface ApiRequest {\n  pageId: string\n}',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })
    })

    it('parses the API routes correctly - get', () => {
      const apiRoutes = ['./test/fixtures/pages/api/onlyResponse.ts']
      const apiRouteParseResults = parseApiRoutesNaive(apiRoutes)

      expect(apiRouteParseResults.length).toBe(1)
      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/onlyResponse.ts',
        imports: ["import { APIRoute } from 'astro'"],
        method: 'GET',
        requestInterface: '',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })
    })

    it('parses the API routes correctly - post', () => {
      const apiRoutes = ['./test/fixtures/pages/api/alsoRequest.ts']
      const apiRouteParseResults = parseApiRoutesNaive(apiRoutes)

      expect(apiRouteParseResults.length).toBe(1)
      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/alsoRequest.ts',
        imports: ["import { APIContext, APIRoute } from 'astro'"],
        method: 'POST',
        requestInterface: 'export interface ApiRequest {\n  pages: Array<Page>\n}',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })
    })

    it('parses the API routes correctly - del', () => {
      const apiRoutes = ['./test/fixtures/pages/api/delRequest.ts']
      const apiRouteParseResults = parseApiRoutesNaive(apiRoutes)

      expect(apiRouteParseResults.length).toBe(1)
      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/delRequest.ts',
        imports: ["import { APIContext, APIRoute } from 'astro'"],
        method: 'DELETE',
        requestInterface: 'export interface ApiRequest {\n  pageId: string\n}',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })
    })
  })

  describe('parseApiRoutesBaseline', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('parses the API routes correctly - all', () => {
      const apiRoutes = ['./test/fixtures/pages/api/allRequest.ts']
      const apiRouteParseResults = parseApiRoutesBaseline(apiRoutes, apiGeneratorOptionsDefaults.tsConfigPath)

      expect(apiRouteParseResults.length).toBe(7)
      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/allRequest.ts',
        imports: ["import { APIContext, APIRoute } from 'astro'"],
        method: 'POST',
        requestInterface: 'export interface ApiRequest {\n  pageId: string\n}',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })
    })

    it('parses the API routes correctly - get', () => {
      const apiRoutes = ['./test/fixtures/pages/api/onlyResponse.ts']

      const apiRouteParseResults = parseApiRoutesBaseline(apiRoutes, apiGeneratorOptionsDefaults.tsConfigPath)

      expect(apiRouteParseResults.length).toBe(1)
      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/onlyResponse.ts',
        imports: ["import { APIRoute } from 'astro'"],
        method: 'GET',
        requestInterface: '',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })
    })

    it('parses the API routes correctly - post', () => {
      const apiRoutes = ['./test/fixtures/pages/api/alsoRequest.ts']

      const apiRouteParseResults = parseApiRoutesBaseline(apiRoutes, apiGeneratorOptionsDefaults.tsConfigPath)

      expect(apiRouteParseResults.length).toBe(1)
      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/alsoRequest.ts',
        imports: ["import { APIContext, APIRoute } from 'astro'"],
        method: 'POST',
        requestInterface: 'export interface ApiRequest {\n  pages: Array<Page>\n}',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })
    })

    it('parses the API routes correctly - del', () => {
      const apiRoutes = ['./test/fixtures/pages/api/delRequest.ts']

      const apiRouteParseResults = parseApiRoutesBaseline(apiRoutes, apiGeneratorOptionsDefaults.tsConfigPath)

      expect(apiRouteParseResults.length).toBe(1)
      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/delRequest.ts',
        imports: ["import { APIContext, APIRoute } from 'astro'"],
        method: 'DELETE',
        requestInterface: 'export interface ApiRequest {\n  pageId: string\n}',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })
    })
  })
})

describe('validateConfig', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('should return the default values if no user-provided options are present', () => {
    const apiGeneratorOptions = {}
    const expected = apiGeneratorOptionsDefaults
    const result = validateConfig(apiGeneratorOptions)
    expect(result).toEqual(expected)
  })

  it('should return the merged values if user-provided options are present', () => {
    const apiGeneratorOptions = {
      baseUrl: 'https://api.example.org',
    }
    const expected = {
      ...apiGeneratorOptionsDefaults,
      ...apiGeneratorOptions,
    }
    const result = validateConfig(apiGeneratorOptions)
    expect(result).toEqual(expected)
  })
})

describe('apiClientGenerator', () => {
  it('should return an AstroIntegration object', async () => {
    const result = apiClientGenerator()
    expect(result).toEqual({
      name: 'astro-client-generator',
      hooks: {
        'astro:build:done': expect.any(Function),
      },
    })
  })

  it('returns the expected AstroIntegration object', async () => {
    jest.clearAllMocks()
    const apiGeneratorOptions = {
      root: './src/pages/api',
      baseUrl: '',
      outDir: './src/pages/api-client',
      tsConfigPath: './tsconfig.json',
      parser: 'naive',
    } as any
    const result = apiClientGenerator(apiGeneratorOptions)
    expect(result).toEqual({
      name: 'astro-client-generator',
      hooks: {
        'astro:build:done': expect.any(Function),
      },
    })
    result.hooks['astro:build:done'](null)
  })
})
