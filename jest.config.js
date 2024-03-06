/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  verbose: true,
  preset: 'ts-jest/presets/js-with-babel',
  transformIgnorePatterns: ['/node_modules/(?!(@bundled-es-modules)/)'],
  setupFiles: ['./jest.polyfills.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg)$': '<rootDir>/src/test-utils/fileTransformer.js',
  },
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
};
