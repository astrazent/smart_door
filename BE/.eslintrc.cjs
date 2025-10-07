module.exports = {
    
    env: {
        browser: true, 
        es2020: true, 
        node: true, 
    },

    
    extends: [
        'eslint:recommended', 
        'plugin:prettier/recommended', 
    ],

    
    parser: '@babel/eslint-parser',

    
    parserOptions: {
        ecmaVersion: 'latest', 
        sourceType: 'module', 
        allowImportExportEverywhere: true, 
    },

    
    settings: {
        react: {
            version: '18.2', 
        },
    },

    
    plugins: [],

    
    rules: {
        'no-console': 1, 
        'no-lonely-if': 1, 
        'no-unused-vars': 1, 
        "no-multiple-empty-lines": ["warn", { "max": 1 }] 
    },
}
