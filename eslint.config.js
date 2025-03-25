import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";

export default tseslint.config(
    {
        ignores: ['dist']
    },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended
        ],
        files: [
            '**/*.{ts,tsx}'
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...vitest.environments.env.globals
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            "jest-dom": jestDom,
            "testing-library": testingLibrary,
            vitest,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true
                },
            ],
            ...jestDom.configs.recommended.rules,
            ...testingLibrary.configs.react.rules,
            ...vitest.configs.recommended.rules,
        },
    },
)
