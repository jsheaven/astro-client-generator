import { buildForNode } from '@jsheaven/easybuild'

await buildForNode({
  entryPoint: './src/index.ts',
  outfile: './dist/index.js',
  debug: true,
  esBuildOptions: {
    logLevel: 'error',
  },
})

await buildForNode({
  entryPoint: './src/cli.ts',
  outfile: './dist/cli.js',
  debug: true,
  esBuildOptions: {
    bundle: true,
    logLevel: 'error',
  },
})
