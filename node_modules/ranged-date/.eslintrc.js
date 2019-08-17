module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 8,
    'sourceType': 'module'
  },
  'plugins': [
    'node',
    'jsdoc'
  ],
  'rules': {
    'node/no-unsupported-features': 0,
    'require-jsdoc': [
      'error', {
        'require': {
          'FunctionDeclaration': true,
          'MethodDefinition': true,
          'ClassDeclaration': true,
          'ArrowFunctionExpression': true,
          'FunctionExpression': true
        }
      }
    ],
    'no-console': 0,
    'comma-dangle': [2, 'never'],
    'semi': [1, 'never'],
    "indent": ["error", 2],
    'jsdoc/check-param-names': 1,
    'jsdoc/check-tag-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/require-description-complete-sentence': 1,
    'jsdoc/require-example': 1,
    'jsdoc/require-hyphen-before-param-description': 1,
    'jsdoc/require-param': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1
  }
}
