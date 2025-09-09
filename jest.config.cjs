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
				// Rewrite the config-api helper import
				'^\\.\\./config-api(?:\\.js)?$':
					'<rootDir>/apps/FRONTEND/ts/config-api.ts',

				// Rewrite app-local imports like "./State.js" → apps/FRONTEND/ts/modules/State.ts
				'^\\./(formatter|State|Evaluator|DisplayControl|KeyboardHandler|ThemeSwitch|InputHandler|HistoryPanel)(?:\\.js)?$':
					'<rootDir>/apps/FRONTEND/ts/modules/$1.ts',

				// Rewrite deep-relative TESTS imports like "../../../ts/modules/State"
				'^(?:\\.\\./)+ts/modules/(formatter|State|Evaluator|DisplayControl|KeyboardHandler|ThemeSwitch|InputHandler|HistoryPanel)(?:\\.js)?$':
					'<rootDir>/apps/FRONTEND/ts/modules/$1.ts'
			}
		}
	]
};

