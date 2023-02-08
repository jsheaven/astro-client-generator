#!/usr/bin/env node
'use strict'

import * as colors from 'kleur/colors'
import yargs from 'yargs-parser'
import { generateClientApis } from './index'
import { getOwnVersion } from './version'

export type Arguments = yargs.Arguments

export enum Commands {
  HELP = 'help',
  VERSION = 'version',
  GENERATE = 'generate',
}

export type Command = 'help' | 'version' | 'generate'

export interface CLIState {
  cmd: Command
  options: {
    apiDir?: string
    baseUrl?: string
    outDir?: string
  }
}

/** Determine which action the user requested */
export const resolveArgs = (flags: Arguments): CLIState => {
  const options: CLIState['options'] = {
    apiDir: typeof flags.apiDir === 'string' ? flags.apiDir : undefined,
    baseUrl: typeof flags.baseUrl === 'string' ? flags.baseUrl : undefined,
    outDir: typeof flags.outDir === 'string' ? flags.outDir : undefined,
  }

  if (flags.version) {
    return { cmd: 'version', options }
  } else if (flags.help) {
    return { cmd: 'help', options }
  }

  const cmd: Command = flags._[2] as Command
  switch (cmd) {
    case 'help':
      return { cmd: 'help', options }
    case 'generate':
      return { cmd: 'generate', options }
    default:
      return { cmd: 'version', options }
  }
}

/** Display --help flag */
const printHelp = () => {
  console.error(`
  ${colors.bold('astro-client-generator')} - generates TypeScript clients for Astro endpoints

  ${colors.bold('Commands:')}
    astroClientGenerator  Generates the TypeScript clients for the endpoints.
    version               Show the program version.
    help                  Show this help message.

  ${colors.bold('Flags:')}
    --apiDir <string>     Folder to the API directory on disk (source code), default: './src/pages/api'
    --baseUrl <string>    API base URL for calling the API (only relevant if you host in a subdir, it's very unlikely), default: ''
    --outDir <string>     Folder on disk to write the client code to, default: './src/pages/api-client'
    --version             Show the version number and exit.
    --help                Show this help message.

  ${colors.bold('Example(s):')}
    npx astro-client-generator --foo X
`)
}

/** display --version flag */
const printVersion = async () => {
  console.log((await getOwnVersion()).version)
}

/** The primary CLI action */
export const cli = async (args: string[]) => {
  const flags = yargs(args)
  const state = resolveArgs(flags)
  const options = { ...state.options }

  console.log(
    colors.dim('>'),
    `${colors.bold(colors.yellow('astro-client-generator'))} @ ${colors.dim(
      (await getOwnVersion()).version,
    )}: ${colors.magenta(colors.bold(state.cmd))}`,
    colors.gray('...'),
  )

  switch (state.cmd) {
    case 'help': {
      printHelp()
      process.exit(0)
    }
    case 'version': {
      await printVersion()
      process.exit(0)
    }
    case 'generate': {
      try {
        await generateClientApis(options)
      } catch (e) {
        throwAndExit(e)
      }
      process.exit(0)
    }
    default: {
      throw new Error(`Error running ${state.cmd}`)
    }
  }
}

const printError = (err: any) => console.error(colors.red(err.toString() || err))

/** Display error and exit */
const throwAndExit = (err: any) => {
  printError(err)
  process.exit(1)
}

try {
  cli(process.argv)
} catch (error) {
  console.error(error)
  process.exit(1)
}
