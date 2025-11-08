import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores([
        'dist',
        'build',
        'out',
        'node_modules',
        'coverage',
        '*.log',
        '.env',
    ]),

    js.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    reactRefresh.configs.vite,

    {
        files: ['**/*.{js,jsx}'],

        plugins: {
            'react-hooks': reactHooks,
        },

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },

        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                alias: {
                    map: [['~', './src']],
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },

        rules: {
            ...reactHooks.configs.recommended.rules,

            'react/prop-types': 'off',
            'react/display-name': 'off',
            'no-console': 'warn',
            'no-lonely-if': 'warn',
            'no-unused-vars': 'warn',
            'no-unexpected-multiline': 'warn',
            'no-multiple-empty-lines': ['warn', { max: 1 }],
            /*Các rule về format code (như linebreak-style) sẽ do Prettier xử lý
            🧹 Thêm rule mới ở đây */
            'no-warning-comments': 'off',
            'spaced-comment': 'off',
            'no-inline-comments': 'warn',
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'Program > :matches(LineComment, BlockComment)',
                    message: '❌ Không được phép để lại comment trong code.',
                },
            ],
        },
    },

    prettierRecommended,
])
