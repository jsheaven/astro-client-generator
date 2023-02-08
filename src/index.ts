import type { AstroIntegration } from 'astro'
import fastGlob from 'fast-glob'
import { resolve, parse, sep } from 'path'
import { readFileSync, mkdirSync, writeFileSync } from 'fs'
import { Project } from 'ts-morph'

export interface ApiClientGeneratorOptions {
  /** folder to the API directory on disk (source code), default: './src/pages/api' */
  root?: string
  /** API base URL for calling the API (only relevant if you host in a subdir, it's very unlikely), default: ''  */
  baseUrl?: string
  /** folder on disk to write the client code to, default: './src/pages/api-client'  */
  outDir?: string
  /** path to tsconfig.json, default: './tsconfig.json' as it is expected to run in project root */
  tsConfigPath?: string
  /** parser to use. 'naive' comes with constraints (non-standard-compliant), 'baseline' is 900x slower, default: 'naive' */
  parser?: 'naive' | 'baseline'
}

export const apiGeneratorOptionsDefaults: ApiClientGeneratorOptions = {
  root: './src/pages/api',
  baseUrl: '',
  outDir: './src/pages/api-client',
  tsConfigPath: './tsconfig.json',
}

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'HEAD' | 'PUT' | 'OPTIONS'

export const AstroHttpEndpointMethodNames = ['GET', 'POST', 'DEL', 'PATCH', 'HEAD', 'PUT', 'OPTIONS', 'ALL']
export const HttpMethods: Array<HttpMethod> = ['POST', 'DELETE', 'GET', 'PATCH', 'HEAD', 'PUT', 'OPTIONS']

export type InterfacePosition = [number, number]

export const upperCaseFirst = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`
export const lowerCaseFirst = (text: string) => `${text.charAt(0).toLowerCase()}${text.slice(1)}`

export const cleanupInterfce = (codeLines: Array<string>) => codeLines.join('\n').trim()

export const analyzeHttpMethodImplemented = (code: string): HttpMethod | Array<HttpMethod> => {
  if (code.indexOf('function get') > -1 || code.indexOf('export const get') > -1) {
    return 'GET'
  }
  if (code.indexOf('function post') > -1 || code.indexOf('export const post') > -1) {
    return 'POST'
  }
  if (code.indexOf('function del') > -1 || code.indexOf('export const del') > -1) {
    return 'DELETE'
  }
  if (code.indexOf('function patch') > -1 || code.indexOf('export const patch') > -1) {
    return 'PATCH'
  }
  if (code.indexOf('function head') > -1 || code.indexOf('export const head') > -1) {
    return 'HEAD'
  }
  if (code.indexOf('function put') > -1 || code.indexOf('export const put') > -1) {
    return 'PUT'
  }
  if (code.indexOf('function options') > -1 || code.indexOf('export const options') > -1) {
    return 'OPTIONS'
  }
  if (code.indexOf('function all') > -1 || code.indexOf('export const all') > -1) {
    return HttpMethods
  }
}
/** merges the default values granularly with the user-provided config overrides */
export const validateConfig = (apiGeneratorOptions: ApiClientGeneratorOptions) => ({
  ...apiGeneratorOptionsDefaults,
  ...apiGeneratorOptions,
})

export interface ApiClientGeneratorOptions {
  /** folder to the API directory on disk (source code), default: './src/pages/api' */
  root?: string
  /** API base URL for calling the API (only relevant if you host in a subdir, it's very unlikely), default: ''  */
  baseUrl?: string
  /** folder on disk to write the client code to, default: './src/pages/api-client'  */
  outDir?: string
  /** path to tsconfig.json, default: './tsconfig.json' as it is expected to run in project root */
  tsConfigPath?: string
  /** parser to use. 'naive' comes with constraints (non-standard-compliant), 'baseline' is 900x slower, default: 'naive' */
  parser?: 'naive' | 'baseline'
}

/** Astro integration function to add to integrations [apiClientGenerator()] array in astro.config.js */
export const apiClientGenerator = (
  apiGeneratorOptions: ApiClientGeneratorOptions = apiGeneratorOptionsDefaults,
): AstroIntegration => {
  apiGeneratorOptions = validateConfig(apiGeneratorOptions)
  return {
    name: 'astro-client-generator',
    hooks: {
      'astro:build:done': async () => {
        generateClientApis(apiGeneratorOptions)
      },
    },
  }
}

export interface ApiRouteParseResult {
  apiRoute: string
  path: string
  imports: Array<string>
  relativePath: string
  method: HttpMethod
  camelCaseName: string
  requestInterface: string
  responseInterface: string
  genericInterfaces: Array<string>
  genericTypes: Array<string>
}

/** baseline TypeScript syntax parser; has no limitations, but takes around 1000ms per endpoint */
export const parseApiRoutesBaseline = (
  apiRoutes: Array<string>,
  tsConfigPath: string,
): Array<Partial<ApiRouteParseResult>> => {
  const project = new Project({
    tsConfigFilePath: tsConfigPath,
  })
  const apiRouteParseResults: Array<Partial<ApiRouteParseResult>> = []
  apiRoutes.forEach((apiRoute) => {
    const sourceFile = project.getSourceFile(apiRoute)
    const imports = sourceFile.getImportDeclarations().map((d) => d.getFullText())

    const genericInterfaces: Array<string> = []
    let requestInterface = ''
    let responseInterface = ''
    sourceFile.getInterfaces().map((d) => {
      switch (d.getName()) {
        case 'ApiRequest':
          requestInterface = d.getText()
          break
        case 'ApiResponse':
          responseInterface = d.getText()
          break
        default:
          genericInterfaces.push(d.getText())
      }
    })

    const genericTypes = sourceFile.getTypeAliases().map((d) => d.getText())
    let method: HttpMethod | Array<HttpMethod>
    sourceFile.getExportSymbols().forEach((d) => {
      const methodIndex = AstroHttpEndpointMethodNames.indexOf(d.getName().toUpperCase())
      if (methodIndex > -1) {
        const astroMethod = AstroHttpEndpointMethodNames[methodIndex]
        if (astroMethod === 'DEL') {
          method = 'DELETE'
        } else if (astroMethod === 'ALL') {
          method = HttpMethods
        } else {
          method = astroMethod as HttpMethod
        }
      }
    })

    const addResult = (method: HttpMethod) => {
      apiRouteParseResults.push({
        apiRoute,
        imports,
        method,
        requestInterface,
        responseInterface,
        genericInterfaces,
        genericTypes,
      })
    }

    if (Array.isArray(method)) {
      method.forEach((method) => addResult(method))
    } else {
      addResult(method)
    }
  })
  return apiRouteParseResults
}

/** naive TypeScript syntax parser, comes with a few lexical limitations, but takes just 2ms per endpoint (see README) */
export const parseApiRoutesNaive = (apiRoutes: Array<string>): Array<Partial<ApiRouteParseResult>> => {
  const apiRouteParseResults: Array<Partial<ApiRouteParseResult>> = []
  apiRoutes.forEach((apiRoute) => {
    const impl = readFileSync(apiRoute, { encoding: 'utf-8' })
    const codeLines = impl.split('\n')
    const imports: Array<string> = []
    const genericInterfaces: Array<string> = []
    const genericTypes: Array<string> = []

    let genericInterfaceDeclBlockStartLine: number
    let apiRequestDeclBlockStartLine: number
    let apiResponseDeclBlockStartLine: number
    let interfaceDeclBlockIndent = 0

    let requestInterfaceCode: InterfacePosition = [-1, -1]
    let responseInterfaceCode: InterfacePosition = [-1, -1]

    codeLines.forEach((line, i) => {
      const isImport = /^import (.*) from (.*)/.test(line.trim())
      const isInterfaceDeclLine = line.indexOf('interface ') > -1
      const isTypeDeclLine = /^\s*(?:export\s+)?type\s+\w+\s*=\s*[\w<>,\s|]+\s*;?\s*$/.test(line.trim())
      const isApiRequestDeclLine = line.indexOf(' ApiRequest ') > -1
      const isApiResponseDeclLine = line.indexOf(' ApiResponse ') > -1
      const isOpeningBracketLine = line.indexOf('{') > -1
      const isClosingBracketLine = line.indexOf('}') > -1

      if (isImport) {
        imports.push(line)
        return
      }

      if (isTypeDeclLine) {
        genericTypes.push(line)
        return
      }

      // this line has "interface ApiRequest"
      if (isInterfaceDeclLine && isApiRequestDeclLine) {
        apiRequestDeclBlockStartLine = i
      }

      // this line has "interface ApiResponse"
      if (isInterfaceDeclLine && isApiResponseDeclLine) {
        apiResponseDeclBlockStartLine = i
      }

      // this line has an "interface" but it's not an ApiRequest nor ApiResponse, must be generic
      if (isInterfaceDeclLine && apiRequestDeclBlockStartLine !== i && apiResponseDeclBlockStartLine !== i) {
        genericInterfaceDeclBlockStartLine = i
      }

      // if the line has an opening bracket { and we're in an interface block decl, it must be interface, count indention up
      if (
        (apiRequestDeclBlockStartLine || apiResponseDeclBlockStartLine || genericInterfaceDeclBlockStartLine) &&
        isOpeningBracketLine
      ) {
        interfaceDeclBlockIndent++
        //console.log('opening bracket in line', line, interfaceDeclBlockIndent)
      }

      // as there can be multiple indentions, we need to count up and down till the last closing bracket } appears
      if (
        (apiRequestDeclBlockStartLine || apiResponseDeclBlockStartLine || genericInterfaceDeclBlockStartLine) &&
        isClosingBracketLine
      ) {
        interfaceDeclBlockIndent--

        // now the last closing bracket has been found, all lexical scoped processd. Must be end of interface decl.
        if (interfaceDeclBlockIndent === 0) {
          // it has been an ApiRequest interface
          if (apiRequestDeclBlockStartLine) {
            requestInterfaceCode = [apiRequestDeclBlockStartLine, i]
            apiRequestDeclBlockStartLine = undefined
          }

          // it has been an ApiResponse interface
          if (apiResponseDeclBlockStartLine) {
            responseInterfaceCode = [apiResponseDeclBlockStartLine, i]
            apiResponseDeclBlockStartLine = undefined
          }

          // it has been a generic interface
          if (genericInterfaceDeclBlockStartLine) {
            genericInterfaces.push(cleanupInterfce(codeLines.slice(genericInterfaceDeclBlockStartLine, i + 1)))
            genericInterfaceDeclBlockStartLine = undefined
          }
        }
      }
    })

    const addResult = (method: HttpMethod) => {
      apiRouteParseResults.push({
        apiRoute,
        imports,
        method,
        requestInterface: cleanupInterfce(codeLines.slice(requestInterfaceCode[0], requestInterfaceCode[1] + 1)),
        responseInterface: cleanupInterfce(codeLines.slice(responseInterfaceCode[0], responseInterfaceCode[1] + 1)),
        genericInterfaces,
        genericTypes,
      })
    }

    const method = analyzeHttpMethodImplemented(impl)

    if (Array.isArray(method)) {
      method.forEach((method) => addResult(method))
    } else {
      addResult(method)
    }
  })
  return apiRouteParseResults
}

/** discovers the API endpoints, parses and statically analyzes their code: finally calls the codegen */
export const generateClientApis = (apiGeneratorOptions: ApiClientGeneratorOptions) => {
  apiGeneratorOptions = validateConfig(apiGeneratorOptions)

  const apiFolder = resolve(process.cwd(), apiGeneratorOptions.root)
  const apiRoutes = fastGlob.sync(`${apiFolder}/**/*.ts`)

  let apiRouteParseResults: Array<Partial<ApiRouteParseResult>>

  // switch over selected parser
  switch (apiGeneratorOptions.parser) {
    case 'baseline':
      apiRouteParseResults = parseApiRoutesBaseline(apiRoutes, apiGeneratorOptions.tsConfigPath)
      break
    case 'naive':
    default:
      apiRouteParseResults = parseApiRoutesNaive(apiRoutes)
      break
  }

  // impl. must have at least a response interface
  apiRouteParseResults = apiRouteParseResults.filter((apiRoute) => apiRoute.responseInterface !== '')

  // apply paths and naming conventions
  apiRouteParseResults.map((result) => {
    result.relativePath = `api${result.apiRoute.replace(apiFolder, '')}`.trim()
    result.path = `${parse(result.relativePath).dir}/${parse(result.relativePath).name}`
    result.camelCaseName = result.path
      .replace('/api/', '')
      .split('/')
      .map((part) => `${part[0].toUpperCase()}${part.substring(1)}`)
      .join('')
      .replaceAll(/[-_\ \.]/g, '')

    return result
  })

  // invoke codegen per route
  apiRouteParseResults.forEach((parseResult: ApiRouteParseResult) => {
    const clientCode = produceClientApiCode(parseResult, apiGeneratorOptions)

    const clientFilePath = resolve(
      process.cwd(),
      apiGeneratorOptions.outDir,
      parseResult.relativePath.replace(/^api\//, ''),
    )
    const parsed = parse(clientFilePath)
    const clientFileDir = parsed.dir

    const finalFilePath = `${clientFileDir}${sep}${parsed.name}${upperCaseFirst(parseResult.method.toLowerCase())}.ts`
    mkdirSync(clientFileDir, { recursive: true })
    writeFileSync(finalFilePath, clientCode, { encoding: 'utf-8' })
  })
}

export const produceClientApiCode = (
  parseResult: ApiRouteParseResult,
  apiGeneratorOptions: ApiClientGeneratorOptions,
) => {
  const requestInterfaceDecl = parseResult.requestInterface ? `${parseResult.requestInterface}` : ''
  const requestParamDecl = parseResult.requestInterface ? `payload: ApiRequest, ` : ''
  const bodyInst =
    parseResult.method !== 'HEAD' && parseResult.method !== 'GET' && parseResult.requestInterface
      ? 'options.body = JSON.stringify(payload)'
      : ''

  return `${parseResult.imports.join('\n')}

${parseResult.genericTypes.join('\n')}

${parseResult.genericInterfaces.join('\n')}

export interface QueryMap {
  [key: string]: string
}

export interface RequestOptions extends RequestInit {
  query?: QueryMap
}

${requestInterfaceDecl}

${parseResult.responseInterface}

/** return (await fetch('${apiGeneratorOptions.baseUrl}/${parseResult.path}', { method: '${
    parseResult.method
  }', ... })).json() */
export const ${lowerCaseFirst(parseResult.camelCaseName)}${upperCaseFirst(
    parseResult.method.toLowerCase(),
  )} = async(${requestParamDecl}options: RequestOptions = {}): Promise<ApiResponse> => {
  let requestUrl = '${apiGeneratorOptions.baseUrl}/${parseResult.path}'
  if (options && options.query) {
    requestUrl += '?' + Object.keys(options.query)
        .map((key) => key + '=' + options.query![key])
        .join('&');
  }
  delete options.query
  options.method = '${parseResult.method}'
  ${bodyInst}
  return (await fetch(requestUrl, options)).json()
}`
}
