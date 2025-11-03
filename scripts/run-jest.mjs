import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jestCli = require('jest');

const args = process.argv.slice(2).filter((arg) => arg !== '--');

jestCli.run(args);
