// jest.config.cjs

/** @type {import('jest').Config} */
module.exports = {
	projects: [
		{
			displayName: 'backend-logic',
			preset: 'ts-jest',
			testEnvironment: 'node',
			testMatch: [
				'<rootDir>/TESTS/backend-logic/**/*.test.ts',
				'<rootDir>/TESTS/api/**/*.test.ts'
			],
			transform: {
				'^.+\\.tsx?$': ['ts-jest', {
					tsconfig: '<rootDir>/apps/BACKEND/tsconfig.json',
				}],
			},
		},
		{
			displayName: 'frontend-logic',
			preset: 'ts-jest',
			testEnvironment: 'jsdom',
			testMatch: ['<rootDir>/TESTS/frontend-logic/**/*.test.ts'],

			transform: {
				'^.+\\.tsx?$': ['ts-jest', {
					tsconfig: '<rootDir>/apps/FRONTEND/tsconfig.json',
				}],
			},

			moduleFileExtensions: ['ts', 'js', 'json'],

			moduleNameMapper: {
				// Rewrite config-api imports (direct or deep relative)
				'^\\.\\./config-api(?:\\.js)?$':
					'<rootDir>/apps/FRONTEND/ts/config-api.ts',
				'^(?:\\.\\./)+apps/FRONTEND/ts/config-api(?:\\.js)?$':
					'<rootDir>/apps/FRONTEND/ts/config-api.ts',

				// Handle "./State.js", "./formatter.js", etc. inside modules
				'^\\./(formatter|State|Evaluator|DisplayControl|KeyboardHandler|ThemeSwitch|InputHandler|HistoryPanel)(?:\\.js)?$':
					'<rootDir>/apps/FRONTEND/ts/modules/$1.ts',

				// Handle "../../../ts/modules/State.js" from TESTS
				'^(?:\\.\\./)+ts/modules/(formatter|State|Evaluator|DisplayControl|KeyboardHandler|ThemeSwitch|InputHandler|HistoryPanel)(?:\\.js)?$':
					'<rootDir>/apps/FRONTEND/ts/modules/$1.ts',

				// Handle "../../../apps/FRONTEND/ts/modules/State.js" from TESTS
				'^(?:\\.\\./)+apps/FRONTEND/ts/modules/(formatter|State|Evaluator|DisplayControl|KeyboardHandler|ThemeSwitch|InputHandler|HistoryPanel)(?:\\.js)?$':
					'<rootDir>/apps/FRONTEND/ts/modules/$1.ts'
			}
		}
	]
};

