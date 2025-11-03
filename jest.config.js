import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { defaultsESM } = require('ts-jest/presets');

export default {
  ...defaultsESM,
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(t|j)s$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
