module.exports = {
    projects: [
        {
            displayName: 'backend',
            preset: 'ts-jest',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/TESTS/jest-tests/backend/**/*.test.ts'],
            globals: {
                'ts-jest': {
                tsconfig: '<rootDir>/BACKEND/tsconfig.json'
                }
            }
        },
        {
            displayName: 'frontend',
            preset: 'ts-jest',
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/TESTS/jest-tests/frontend/**/*.test.ts'],
            globals: {
                'ts-jest': { tsconfig: '<rootDir>/tsconfig.json' },
            },
            moduleFileExtensions: ['ts', 'js', 'json'],
            moduleNameMapper: {
                // We deliberately import "./*.js" in our TS source so that after `tsc` compiles TS files to `dist/`,
                // the browser can load the compiled `.js` files directly.
                // For Jest, this mapping rewrites those "./file.js" imports back to the original
                // "ts/modules/file.ts" files so tests run against the TS source.
                //
                // Example:
                //   import State from './State.js'
                // during tests becomes
                //   import State from 'ts/modules/State.ts'
                '^\\./(formatter|State|Evaluator|DisplayControl|KeyboardHandler|ThemeSwitch|InputHandler|config)\\.js$':
                '<rootDir>/ts/modules/$1.ts',
            },
        },
    ],
};