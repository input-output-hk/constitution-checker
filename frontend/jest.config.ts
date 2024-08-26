import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./setup-jest.ts'],
  moduleNameMapper: {
    axios: 'axios/dist/node/axios.cjs',
},
};

export default config;