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
  analyzeHttpMethodsImplemented,
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
    const result = apiClientGenerator({
      outDir: './dist/api-client',
      apiDir: './test/fixtures/pages/api',
      baseUrl: '',
    })

    result.hooks['astro:build:done']({ config: { site: 'http://localhost:3000' } } as any)

    expect(generateClientApis).toBeDefined()
  })

  it('can call astroClientGenerator - naive', () => {
    const result = apiClientGenerator({
      outDir: './dist/api-client',
      apiDir: './test/fixtures/pages/api',
      baseUrl: '',
      parser: 'naive',
    })

    result.hooks['astro:build:done']({ config: { site: 'http://localhost:3000' } } as any)

    expect(generateClientApis).toBeDefined()
  })

  it('can call astroClientGenerator - baseline', () => {
    const result = apiClientGenerator({
      outDir: './dist/api-client',
      apiDir: './test/fixtures/pages/api',
      baseUrl: '',
      parser: 'baseline',
      site: 'https://localhost:3001',
    })

    result.hooks['astro:build:done']({ config: { site: 'http://localhost:3000' } } as any)

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
      let code = 'function GET(req, res) {}'
      let methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['GET'])

      code = 'function POST(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['POST'])

      code = 'function DELETE(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['DELETE'])

      code = 'function PATCH(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['PATCH'])

      code = 'function HEAD(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['HEAD'])

      code = 'function PUT(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['PUT'])

      code = `function PUT(req, res) {}\nfunction DELETE(req, res) {}`
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['DELETE', 'PUT'])

      code = 'function OPTIONS(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['OPTIONS'])

      code = 'function ALL(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['POST', 'DELETE', 'GET', 'PATCH', 'HEAD', 'PUT', 'OPTIONS'])
    })

    it('correctly analyzes the HTTP method implemented - ', () => {
      let code = 'function GET(req, res) {}'
      let methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['GET'])

      code = 'function POST(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['POST'])

      code = 'function DELETE(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['DELETE'])

      code = 'function PATCH(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['PATCH'])

      code = 'function HEAD(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['HEAD'])

      code = 'function PUT(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['PUT'])

      code = `function PUT(req, res) {}\nfunction DELETE(req, res) {}`
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['DELETE', 'PUT'])

      code = 'function OPTIONS(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['OPTIONS'])

      code = 'function ALL(req, res) {}'
      methods = analyzeHttpMethodsImplemented(code)
      expect(methods).toEqual(['POST', 'DELETE', 'GET', 'PATCH', 'HEAD', 'PUT', 'OPTIONS'])
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

    it('parses the API routes correctly - many', () => {
      const apiRoutes = ['./test/fixtures/pages/api/twoInOneRequest.ts']
      const apiRouteParseResults = parseApiRoutesNaive(apiRoutes)

      expect(apiRouteParseResults.length).toBe(2)

      expect(apiRouteParseResults[0]).toEqual({
        apiRoute: './test/fixtures/pages/api/twoInOneRequest.ts',
        imports: ["import { APIContext, APIRoute } from 'astro'"],
        method: 'POST',
        requestInterface: 'export interface ApiRequest {\n  pageId: string\n  pages: Array<Page>\n}',
        responseInterface: "export interface ApiResponse {\n  status: 'SUCCESS' | 'FORBIDDEN'\n  pages: Array<Page>\n}",
        genericInterfaces: ['interface Page {\n  title: string\n  keywords: Array<Keyword>\n}'],
        genericTypes: ['type Keyword = string | symbol'],
      })

      expect(apiRouteParseResults[1]).toEqual({
        apiRoute: './test/fixtures/pages/api/twoInOneRequest.ts',
        imports: ["import { APIContext, APIRoute } from 'astro'"],
        method: 'DELETE',
        requestInterface: 'export interface ApiRequest {\n  pageId: string\n  pages: Array<Page>\n}',
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
        'astro:config:setup': expect.any(Function),
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
        'astro:config:setup': expect.any(Function),
        'astro:build:done': expect.any(Function),
      },
    })
  })

  it('returns the expected AstroIntegration object - with site set', async () => {
    jest.clearAllMocks()
    const apiGeneratorOptions = {
      root: './src/pages/api',
      baseUrl: '',
      outDir: './src/pages/api-client',
      tsConfigPath: './tsconfig.json',
      parser: 'naive',
      site: 'foobar2',
    } as any
    const result = apiClientGenerator(apiGeneratorOptions)
    expect(result).toEqual({
      name: 'astro-client-generator',
      hooks: {
        'astro:config:setup': expect.any(Function),
        'astro:build:done': expect.any(Function),
      },
    })
    expect(apiGeneratorOptions.site).toEqual('foobar2')
  })
})
