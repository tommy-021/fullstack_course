import { createDefaultPreset } from 'ts-jest';
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
    testEnvironment: 'jsdom',
    transform: {
        ...tsJestTransformCfg,
    },
    setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
    moduleNameMapper: {
        '\\.(css|scss|sass|less)$': '<rootDir>/src/test/styleMock.js',
    },

};
