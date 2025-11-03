export default {
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { useESM: true }],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(t|j)s$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
