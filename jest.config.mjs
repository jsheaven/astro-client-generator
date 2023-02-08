/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  verbose: true,
  injectGlobals: true,
  collectCoverage: true,
  //preset: 'ts-jest/presets/default',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',

      {
        useESM: true,
      },
    ],
  },
}
